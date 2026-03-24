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

    // If not a guest request, require auth
    if (!guest) {
      if (!authHeader) throw new Error("Not authenticated");

      const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
      const { data: { user: authUser }, error: authError } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
      if (authError || !authUser) throw new Error("Not authenticated");
      user = authUser;

      const { data: profileData } = await supabase.from("users").select("*").eq("id", user.id).single();
      if (!profileData) throw new Error("User not found");
      profile = profileData;

      // Check usage limits for authenticated users
      const plan = profile.plan;
      const usage = profile.daily_usage_count;
      const limit = plan === "premium" ? Infinity : plan === "pro" ? 20 : 5;

      if (usage >= limit) {
        return new Response(JSON.stringify({ error: "Daily limit reached. Upgrade your plan." }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Generate content using Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("AI API key not configured");

    const systemPrompt = `You are TrendNova, an expert AI content creator. Generate high-quality, engaging content based on the user's request. Be creative, use proven viral content frameworks, and make the output immediately usable.`;

    const prompts: Record<string, string> = {
      "youtube-script": `Write a complete YouTube video script about: "${topic}". Include a hook, introduction, main points with transitions, and a strong CTA. Format with timestamps.`,
      "tiktok-idea": `Generate 5 viral TikTok/Reels content ideas about: "${topic}". For each, include: concept, hook (first 3 seconds), script outline, trending audio suggestion, and hashtags.`,
      "blog-post": `Write an SEO-optimized blog post about: "${topic}". Include a compelling title, meta description, headers (H2/H3), introduction, body with actionable tips, and conclusion with CTA.`,
      "social-caption": `Write 5 engaging social media captions about: "${topic}". Include versions for Instagram, Twitter, and LinkedIn. Add relevant emojis and hashtags.`,
    };

    const userPrompt = prompts[contentType] || `Generate content about: "${topic}"`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
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

    const aiData = await aiResponse.json();
    const result = aiData.choices?.[0]?.message?.content || "No content generated";

    // Only update usage and history for authenticated users
    if (user && profile) {
      await supabase.from("users").update({ daily_usage_count: profile.daily_usage_count + 1 }).eq("id", user.id);

      if (profile.plan !== "free") {
        await supabase.from("generations").insert({
          user_id: user.id,
          content_type: contentType,
          prompt: topic,
          result,
        });
      }
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
