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

    const systemPrompt = `You are TrendNova, an elite AI content strategist and copywriter. You create viral, high-converting content that drives engagement.

RULES:
- Be specific and actionable — never generic filler
- Use proven copywriting frameworks (AIDA, PAS, hook-story-offer)
- Include data points, statistics, or concrete examples when relevant
- Write in a confident, energetic tone
- Format output with clear headers, bullet points, and structure
- Every piece must have a compelling hook and strong CTA
- Optimize for the specific platform's algorithm and audience behavior`;

    const prompts: Record<string, string> = {
      "youtube-script": `Write a complete, ready-to-film YouTube video script about: "${topic}".

Structure:
1. **HOOK** (first 5 seconds) — pattern interrupt that stops scrolling
2. **INTRO** (15-30 sec) — establish credibility + promise value
3. **MAIN CONTENT** — 3-5 key points with examples, transitions, and retention hooks ("but here's where it gets interesting...")
4. **CTA** — subscribe, comment prompt, next video tease

Include [TIMESTAMP] markers, [B-ROLL] suggestions, and [TEXT ON SCREEN] cues.
Aim for 8-12 minute watch time. Write conversationally as if talking to camera.`,

      "tiktok-idea": `Generate 5 viral TikTok/Reels concepts about: "${topic}".

For EACH idea provide:
- **HOOK** (first 1-3 seconds — the make-or-break moment)
- **SCRIPT** (full dialogue/narration, 30-60 seconds)
- **VISUAL DIRECTION** (camera angles, transitions, text overlays)
- **TRENDING AUDIO** (suggest specific sound style or trend format)
- **HASHTAGS** (5-8 relevant + trending)
- **POSTING TIME** suggestion
- **ESTIMATED VIRALITY** (low/medium/high) with reasoning`,

      "blog-post": `Write a comprehensive, SEO-optimized blog post about: "${topic}".

Include:
- **TITLE** (60 chars max, keyword-rich, click-worthy)
- **META DESCRIPTION** (155 chars max)
- **TARGET KEYWORD** + 3-5 LSI keywords
- **INTRO** — hook with a bold statement or surprising stat
- **BODY** — 5-7 sections with H2/H3 headers, actionable tips, examples
- **INTERNAL LINK suggestions** (topic areas to link to)
- **CONCLUSION** with clear CTA
- **FAQ SECTION** (3-4 questions for featured snippets)

Write 1500-2000 words. Use short paragraphs (2-3 sentences max). Include bullet points and numbered lists for scannability.`,

      "social-caption": `Create 5 high-engagement social media captions about: "${topic}".

For EACH caption provide versions for:
📸 **Instagram** — storytelling format, line breaks for readability, 20-30 hashtags grouped by reach tier
🐦 **Twitter/X** — punchy, under 280 chars, controversial or insightful angle
💼 **LinkedIn** — professional authority, personal anecdote + lesson format, 3-5 hashtags

Each caption must include:
- A scroll-stopping first line
- Engagement trigger (question, poll, hot take)
- Clear CTA (save, share, comment, link in bio)`,
    };

    const userPrompt = prompts[contentType] || `Generate expert-level content about: "${topic}". Be specific, actionable, and format clearly.`;

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
      throw new Error("AI generation failed");
    }

    // Parse streaming response and collect full result
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

    // Update usage and history for authenticated users
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
