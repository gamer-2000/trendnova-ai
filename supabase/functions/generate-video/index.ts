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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Structured error response that always includes diagnostic context. */
function errorResponse(
  status: number,
  message: string,
  debug: Record<string, unknown> = {},
): Response {
  const body = { error: message, debug };
  console.error(`[generate-video] HTTP ${status} — ${message}`, JSON.stringify(debug));
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/** Returns true when the plan string should be treated as premium. */
function isPremiumPlan(plan: string | null | undefined): boolean {
  if (plan == null) return false;
  // Normalise: lowercase, trim, collapse hyphens/underscores/spaces
  const normalised = String(plan).toLowerCase().trim().replace(/[-_\s]+/g, "");
  return ["premium", "pro", "paid", "active", "subscribed"].includes(normalised);
}

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

  console.log(`[pexels] Fetching query="${query}" orientation="${orientation}"`);

  let res: Response;
  try {
    res = await fetch(url.toString(), { headers: { Authorization: apiKey } });
  } catch (fetchErr) {
    console.error("[pexels] Network error:", fetchErr);
    return null;
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "(unreadable)");
    console.error(`[pexels] HTTP ${res.status} for query="${query}":`, body);
    return null;
  }

  const data = await res.json();
  const videos = data?.videos ?? [];
  console.log(`[pexels] query="${query}" → ${videos.length} result(s)`);
  if (!videos.length) return null;

  const v = videos[Math.floor(Math.random() * videos.length)];

  const files = (v?.video_files ?? []).filter(
    (f: any) => f.file_type === "video/mp4",
  );
  files.sort((a: any, b: any) => (a.width ?? 9999) - (b.width ?? 9999));
  const chosen =
    files.find((f: any) => (f.width ?? 0) >= 640) ?? files[files.length - 1];
  if (!chosen) {
    console.warn(`[pexels] No suitable mp4 file for query="${query}"`);
    return null;
  }

  return {
    url: chosen.link,
    poster: v?.image ?? "",
    credit: `${v?.user?.name ?? "Pexels"} / Pexels`,
  };
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ------------------------------------------------------------------
    // Environment
    // ------------------------------------------------------------------
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const NVIDIA_API_KEY = Deno.env.get("NVIDIA_API_KEY");
    const PEXELS_API_KEY = Deno.env.get("PEXELS_API_KEY");

    const missingEnv: string[] = [];
    if (!supabaseUrl) missingEnv.push("SUPABASE_URL");
    if (!supabaseServiceKey) missingEnv.push("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseAnonKey) missingEnv.push("SUPABASE_ANON_KEY");
    if (!NVIDIA_API_KEY) missingEnv.push("NVIDIA_API_KEY");
    if (!PEXELS_API_KEY) missingEnv.push("PEXELS_API_KEY");

    if (missingEnv.length > 0) {
      return errorResponse(500, "Server configuration error: missing environment variables", {
        missingEnv,
      });
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // ------------------------------------------------------------------
    // Parse body
    // ------------------------------------------------------------------
    let body: { topic?: string; orientation?: Orientation; totalDuration?: number };
    try {
      body = await req.json();
    } catch {
      return errorResponse(400, "Invalid JSON body");
    }

    const { topic, orientation = "portrait", totalDuration = 20 } = body;

    if (!topic || typeof topic !== "string" || topic.trim().length < 2) {
      return errorResponse(400, "Please enter a topic (minimum 2 characters).", { receivedTopic: topic });
    }

    // ------------------------------------------------------------------
    // Authentication
    // ------------------------------------------------------------------
    const authHeader = req.headers.get("Authorization");
    console.log("[auth] Authorization header present:", !!authHeader);

    if (!authHeader) {
      return errorResponse(401, "Not authenticated: missing Authorization header");
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : authHeader.trim();

    if (!token) {
      return errorResponse(401, "Not authenticated: empty bearer token");
    }

    const anonClient = createClient(supabaseUrl!, supabaseAnonKey!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(token);

    console.log("[auth] getUser error:", authError?.message ?? "none");
    console.log("[auth] User ID:", user?.id ?? "null");
    console.log("[auth] User email:", user?.email ?? "null");
    console.log("[auth] User role:", user?.role ?? "null");

    if (authError) {
      return errorResponse(401, "Not authenticated: token verification failed", {
        authError: authError.message,
      });
    }
    if (!user) {
      return errorResponse(401, "Not authenticated: no user returned from token", {
        token: token.slice(0, 12) + "…",
      });
    }

    // ------------------------------------------------------------------
    // Profile / plan lookup
    // ------------------------------------------------------------------
    console.log(`[profile] Querying users table for id=${user.id}`);

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("plan, daily_usage_count, last_reset_date")
      .eq("id", user.id)
      .maybeSingle(); // returns null (not error) when no row found

    console.log("[profile] Raw profile data:", JSON.stringify(profile));
    console.log("[profile] Profile error:", profileError ? JSON.stringify(profileError) : "none");

    if (profileError) {
      return errorResponse(500, "Failed to load user profile from database", {
        userId: user.id,
        dbError: profileError.message,
        dbCode: profileError.code,
        hint: profileError.hint ?? null,
        details: profileError.details ?? null,
      });
    }

    if (!profile) {
      return errorResponse(404, "No user profile row found in the users table", {
        userId: user.id,
        userEmail: user.email,
        suggestion:
          "Ensure a row exists in public.users with id matching auth.users.id and a non-null plan value.",
      });
    }

    const rawPlan: unknown = profile.plan;
    const planStr = rawPlan != null ? String(rawPlan) : null;
    const premium = isPremiumPlan(planStr);

    console.log("[profile] plan (raw):", rawPlan);
    console.log("[profile] plan (string):", planStr);
    console.log("[profile] isPremium:", premium);
    console.log("[profile] daily_usage_count:", profile.daily_usage_count);
    console.log("[profile] last_reset_date:", profile.last_reset_date);

    if (!premium) {
      return errorResponse(403, "Premium subscription required to use video generation", {
        userId: user.id,
        userEmail: user.email,
        planRaw: rawPlan,
        planNormalised: planStr,
        acceptedPlanValues: ["premium", "pro", "paid", "active", "subscribed"],
        hint:
          "The plan field in the users table does not match any recognised premium value. " +
          "Update the row or check for trailing whitespace / unexpected casing.",
      });
    }

    // ------------------------------------------------------------------
    // 1) Storyboard via NVIDIA (OpenAI-compatible)
    // ------------------------------------------------------------------
    const clampedDuration = Math.max(8, Math.min(60, totalDuration));
    const userPrompt = `Topic: "${topic}"
Total target duration: ${clampedDuration} seconds.
Aspect: ${orientation === "portrait" ? "9:16 short-form (TikTok/Reels)" : orientation === "landscape" ? "16:9 (YouTube)" : "1:1 (square)"}.
Produce 4-8 scenes that flow together visually.
Return ONLY the JSON object — no markdown fencing, no commentary.`;

    console.log("[nvidia] Sending storyboard request for topic:", topic);

    const aiRes = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          model: "meta/llama-3.3-70b-instruct",
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.9,
          top_p: 0.95,
          max_tokens: 2048,
          response_format: { type: "json_object" },
          stream: false,
        }),
      },
    );

    console.log("[nvidia] HTTP status:", aiRes.status);

    if (!aiRes.ok) {
      const errText = await aiRes.text().catch(() => "(unreadable)");
      console.error("[nvidia] Error body:", errText);
      return errorResponse(502, "NVIDIA storyboard generation failed", {
        nvidiaStatus: aiRes.status,
        nvidiaBody: errText.slice(0, 500),
      });
    }

    const aiJson = await aiRes.json();
    const raw: string = aiJson?.choices?.[0]?.message?.content ?? "";

    console.log("[nvidia] Raw storyboard length:", raw.length, "chars");
    console.log("[nvidia] Raw storyboard preview:", raw.slice(0, 200));

    let storyboard: {
      title: string;
      scenes: Array<{ query: string; text: string; duration: number }>;
    };

    try {
      storyboard = JSON.parse(raw);
    } catch {
      const m = raw.match(/\{[\s\S]*\}/);
      if (!m) {
        return errorResponse(502, "NVIDIA returned a storyboard that could not be parsed as JSON", {
          rawPreview: raw.slice(0, 300),
        });
      }
      try {
        storyboard = JSON.parse(m[0]);
      } catch (e2) {
        return errorResponse(502, "NVIDIA storyboard JSON extraction failed after fallback", {
          parseError: String(e2),
          rawPreview: raw.slice(0, 300),
        });
      }
    }

    if (!storyboard?.scenes?.length) {
      return errorResponse(502, "NVIDIA storyboard contained no scenes", {
        storyboard,
      });
    }


    console.log(`[gemini] Storyboard title="${storyboard.title}" scenes=${storyboard.scenes.length}`);

    // ------------------------------------------------------------------
    // 2) Pexels video fetch (parallel)
    // ------------------------------------------------------------------
    const sceneSlice = storyboard.scenes.slice(0, 8);
    console.log(`[pexels] Fetching ${sceneSlice.length} clips in parallel`);

    const results = await Promise.all(
      sceneSlice.map((s) => pickPexelsVideo(s.query, orientation, PEXELS_API_KEY!)),
    );

    const scenes: Scene[] = [];
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      const s = sceneSlice[i];
      if (!r) {
        console.warn(`[pexels] No result for scene ${i} query="${s.query}" — skipping`);
        continue;
      }
      scenes.push({
        query: s.query,
        text: s.text ?? "",
        duration: Math.max(2, Math.min(6, Number(s.duration) || 3)),
        videoUrl: r.url,
        posterUrl: r.poster,
        credit: r.credit,
      });
    }

    console.log(`[pexels] Resolved ${scenes.length}/${sceneSlice.length} scenes`);

    if (!scenes.length) {
      return errorResponse(502, "Could not find stock footage for any of the generated scenes. Try a different topic.", {
        queries: sceneSlice.map((s) => s.query),
      });
    }

    // ------------------------------------------------------------------
    // 3) Bump usage counter
    // ------------------------------------------------------------------
    const newCount = (profile.daily_usage_count ?? 0) + 1;
    const { error: updateError } = await supabase
      .from("users")
      .update({ daily_usage_count: newCount })
      .eq("id", user.id);

    if (updateError) {
      // Non-fatal — log but don't fail the request
      console.warn("[profile] Failed to update daily_usage_count:", updateError.message);
    } else {
      console.log(`[profile] daily_usage_count updated to ${newCount}`);
    }

    // ------------------------------------------------------------------
    // Success
    // ------------------------------------------------------------------
    return new Response(
      JSON.stringify({
        title: storyboard.title ?? topic,
        orientation,
        scenes,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("[generate-video] Unhandled exception:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown internal error",
        debug: {
          type: e instanceof Error ? e.constructor.name : typeof e,
          stack: e instanceof Error ? (e.stack ?? "").split("\n").slice(0, 5) : null,
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
