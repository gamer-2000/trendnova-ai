import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { contentType, topic, guest } = await req.json();

    let user = null;
    let profile = null;

    const authHeader = req.headers.get("Authorization");

    if (!guest) {
      if (!authHeader) throw new Error("Not authenticated");

      const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
      const { data: { user: authUser }, error: authError } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
      if (authError || !authUser) throw new Error("Not authenticated");
      user = authUser;

      const { data: profileData } = await supabase.from("users").select("*").eq("id", user.id).single();
      if (!profileData) throw new Error("User not found");
      profile = profileData;

      const plan = profile.plan;
      const usage = profile.daily_usage_count;
      const limit = plan === "premium" ? Infinity : plan === "pro" ? 20 : 1;

      if (usage >= limit) {
        return new Response(JSON.stringify({ error: "Daily limit reached. Upgrade your plan." }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("AI API key not configured");

    const systemPrompt = `You are a skilled content writer who sounds like a real person — not a marketing bot. Your writing is warm, specific, and conversational.

RULES:
- Write like a human talks. Use contractions, casual phrasing, imperfect sentences when it feels natural.
- NEVER use phrases like "game-changer", "dive deep", "unlock", "leverage", "in today's fast-paced world", "without further ado", or any other overused AI/marketing clichés.
- Be specific and useful — no filler paragraphs that say nothing.
- Use real-world examples, relatable scenarios, personal-feeling anecdotes.
- Vary sentence length. Mix short punchy lines with longer ones.
- Don't over-structure. Not everything needs a numbered list or bold headers.
- Write with personality — a little humor, a little opinion, a little edge.
- Sound like someone who actually knows the topic, not someone summarizing Google results.`;

    const prompts: Record<string, string> = {
      "youtube-script": `Write a YouTube video script about: "${topic}".

Write it the way a real YouTuber would talk on camera — casual, engaging, with personality.

Include:
- An opening hook (first 5 seconds) that's genuinely interesting, not clickbaity nonsense
- A brief intro where you set up what the video's about and why it matters
- The main content — talk through 3-5 points naturally, with real examples, transitions, and moments where you'd pause or react
- A closing that doesn't feel forced — mention subscribing naturally, ask a real question

Add [B-ROLL] and [CUT TO] notes where it makes sense.
Write for about 8-12 minutes of talking. Sound like a person, not a teleprompter.`,

      "tiktok-idea": `Come up with 5 TikTok/Reels ideas about: "${topic}".

For each one give me:
- The hook (what you say/show in the first 2 seconds to stop someone scrolling)
- The full script or narration (30-60 seconds, written how someone would actually talk)
- What's on screen (camera angles, text overlays, cuts)
- What kind of audio/sound would work
- 5-8 hashtags
- Why you think it would do well (be honest — not everything goes viral)

Make these feel like real creator ideas, not a content factory output.`,

      "blog-post": `Write a blog post about: "${topic}".

Write it like a knowledgeable friend explaining something — not like a corporate blog.

Include:
- A title that's interesting and specific (under 60 characters)
- A meta description (under 155 characters)
- An opening that hooks with a real story, surprising fact, or bold opinion
- 5-7 sections that flow naturally — use headers but don't force every paragraph into a rigid template
- Real examples, specific tips, things the reader can actually do
- A conclusion that doesn't just repeat everything you said
- 3-4 FAQ questions people would actually google

Aim for 1500-2000 words. Keep paragraphs short (2-3 sentences). Use lists when they make sense, not just to pad the word count.`,

      "social-caption": `Write 5 social media captions about: "${topic}".

For each, write versions for:
📸 Instagram — tell a mini-story, use line breaks, include 15-20 relevant hashtags
🐦 Twitter/X — punchy, under 280 chars, say something interesting or slightly controversial  
💼 LinkedIn — share an insight or lesson, sound smart but not pretentious, 3-5 hashtags

Each caption needs:
- A first line that makes someone stop scrolling
- Something that makes people want to respond (a question, a hot take, something relatable)
- A natural CTA (not "LINK IN BIO!!!" — more like "what do you think?" or "save this for later")

Sound like a real person posting, not a brand account.`,
    };

    const userPrompt = prompts[contentType] || `Write something useful and interesting about: "${topic}". Be specific, sound human, and make it actually worth reading.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("Content generation failed");
    }

    const reader = aiResponse.body!.getReader();
    const decoder = new TextDecoder();
    let fullResult = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) fullResult += content;
        } catch { /* partial chunk */ }
      }
    }

    if (!fullResult) fullResult = "No content generated. Please try again.";

    if (user && profile) {
      await supabase.from("users").update({ daily_usage_count: profile.daily_usage_count + 1 }).eq("id", user.id);

      if (profile.plan !== "free") {
        await supabase.from("generations").insert({
          user_id: user.id,
          content_type: contentType,
          prompt: topic,
          result: fullResult,
        });
      }
    }

    return new Response(JSON.stringify({ result: fullResult }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
