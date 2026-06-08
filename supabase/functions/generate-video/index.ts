import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Orientation = "portrait" | "landscape" | "square";

interface Scene {
  query: string;
  text: string;
  duration: number; // seconds
  videoUrl: string;
  posterUrl: string;
  credit: string;
}

const SYSTEM = `You are a short-form video director. Given a topic, output a JSON storyboard for a stock-footage video.

Rules:
- Return ONLY valid JSON. No markdown, no prose.
- Schema: { "title": string, "scenes": [ { "query": string, "text": string, "duration": number } ] }
- "query" is 1-3 words used to search a stock footage library (e.g. "city skyline night", "coffee pour", "team meeting"). Be visual and concrete.
- "text" is on-screen caption for that scene. Punchy. Max 10 words. No emojis. Use sentence case.
- "duration" is seconds (integer 2-5).
- Total scenes must hit the requested total duration as closely as possible.
- Open with a hook. End with a payoff or CTA (no generic "subscribe now").
- Do NOT use these words: delve, leverage, unlock, game-changer, dive deep, journey, unleash.`;

async function pickPexelsVideo(
  query: string,
  orientation: Orientation,
  apiKey: string,
): Promise<{ url: string; poster: string; credit: string } | null> {
  const url = new URL("https://api.pexels.com/videos/search");
  url.searchParams.set("query", query);
  url.searchParams.set("orientation", orientation);
  url.searchParams.set("per_page", "10");
  url.searchParams.set("size", "medium");

  const res = await fetch(url.toString(), {
    headers: { Authorization: apiKey },
  });
  if (!res.ok) {
    console.error("Pexels error", res.status, await res.text());
    return null;
  }
  const data = await res.json();
  const videos = data?.videos ?? [];
  if (!videos.length) return null;

  // Pick a random hit so each generation feels fresh
  const v = videos[Math.floor(Math.random() * videos.length)];

  // Choose the smallest HD-or-SD mp4 file we can find (keeps payload light)
  const files = (v?.video_files ?? []).filter(
    (f: any) => f.file_type === "video/mp4",
  );
  files.sort((a: any, b: any) => (a.width ?? 9999) - (b.width ?? 9999));
  const chosen =
    files.find((f: any) => (f.width ?? 0) >= 640) ?? files[files.length - 1];
  if (!chosen) return null;

  return {
    url: chosen.link,
    poster: v?.image ?? "",
    credit: `${v?.user?.name ?? "Pexels"} / Pexels`,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    const {
      topic,
      orientation = "portrait",
      totalDuration = 20,
    } = body as {
      topic: string;
      orientation?: Orientation;
      totalDuration?: number;
    };

    if (!topic || typeof topic !== "string" || topic.trim().length < 2) {
      return new Response(JSON.stringify({ error: "Please enter a topic." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Auth + premium gate
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonClient = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );
    const {
      data: { user },
      error: authError,
    } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: profile, error: profileError } = await supabase
  .from("users")
  .select("plan, daily_usage_count, last_reset_date")
  .eq("id", user.id)
  .single();

console.log("User ID:", user.id);
console.log("Profile:", profile);
console.log("Profile Error:", profileError);

if (profileError) {
  return new Response(
    JSON.stringify({
      error: "Failed to load user profile",
      details: profileError.message,
    }),
    {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    },
  );
}

if (!profile) {
  return new Response(
    JSON.stringify({
      error: "No user profile found",
    }),
    {
      status: 404,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    },
  );
}

if (profile.plan !== "premium") {
  return new Response(
    JSON.stringify({
      error: "Premium subscription required",
      currentPlan: profile.plan,
    }),
    {
      status: 403,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    },
  );
}

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    const PEXELS_API_KEY = Deno.env.get("PEXELS_API_KEY");
    if (!GEMINI_API_KEY || !PEXELS_API_KEY) {
      throw new Error("Server is missing GEMINI_API_KEY or PEXELS_API_KEY");
    }

    // 1) Storyboard via Gemini
    const userPrompt = `Topic: "${topic}"
Total target duration: ${Math.max(8, Math.min(60, totalDuration))} seconds.
Aspect: ${orientation === "portrait" ? "9:16 short-form (TikTok/Reels)" : orientation === "landscape" ? "16:9 (YouTube)" : "1:1 (square)"}.
Produce 4-8 scenes that flow together visually.`;

    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.9,
            responseMimeType: "application/json",
            maxOutputTokens: 2048,
          },
        }),
      },
    );

    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error("Gemini error", aiRes.status, t);
      throw new Error("Failed to generate storyboard");
    }

    const aiJson = await aiRes.json();
    const raw: string =
      aiJson?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text ?? "").join("") ?? "";

    let storyboard: { title: string; scenes: Array<{ query: string; text: string; duration: number }> };
    try {
      storyboard = JSON.parse(raw);
    } catch {
      // try to extract JSON
      const m = raw.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("Storyboard was not valid JSON");
      storyboard = JSON.parse(m[0]);
    }

    if (!storyboard?.scenes?.length) {
      throw new Error("Storyboard had no scenes");
    }

    // 2) Fetch a stock clip per scene (in parallel)
    const scenes: Scene[] = [];
    const results = await Promise.all(
      storyboard.scenes.slice(0, 8).map((s) =>
        pickPexelsVideo(s.query, orientation, PEXELS_API_KEY),
      ),
    );

    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      const s = storyboard.scenes[i];
      if (!r) continue;
      scenes.push({
        query: s.query,
        text: s.text ?? "",
        duration: Math.max(2, Math.min(6, Number(s.duration) || 3)),
        videoUrl: r.url,
        posterUrl: r.poster,
        credit: r.credit,
      });
    }

    if (!scenes.length) {
      throw new Error("Couldn't find stock footage for these scenes. Try a different topic.");
    }

    // Bump usage counter
    await supabase
      .from("users")
      .update({ daily_usage_count: (profile.daily_usage_count ?? 0) + 1 })
      .eq("id", user.id);

    return new Response(
      JSON.stringify({
        title: storyboard.title ?? topic,
        orientation,
        scenes,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("generate-video error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
