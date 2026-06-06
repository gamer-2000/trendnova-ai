import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ---- Prompt building -------------------------------------------------------

const HUMAN_SYSTEM = `You write like an actual person who knows the topic — not like an AI assistant.

Hard rules (these are non-negotiable):
- NEVER use these words or phrases: "delve", "dive deep", "dive in", "unleash", "unlock", "leverage", "game-changer", "game changer", "navigate the", "journey", "embark", "in today's fast-paced world", "in the world of", "in the realm of", "the landscape of", "ever-evolving", "cutting-edge", "revolutionize", "transform your", "elevate your", "supercharge", "harness the power", "tapestry", "testament", "boasts", "robust", "seamless", "seamlessly", "furthermore", "moreover", "additionally", "in conclusion", "it's important to note", "it's worth noting", "as an AI", "I hope this helps", "feel free to".
- Do NOT open with "In today's…" or "Imagine…" or a definition of the topic.
- Do NOT end with a generic wrap-up paragraph that summarizes everything you just said.
- Do NOT bold random words for "emphasis". Bold only when it genuinely helps scanning.
- Do NOT use emojis unless the format specifically calls for it (social posts can; scripts/blogs cannot).

How to actually sound human:
- Use contractions. Vary sentence length aggressively — some sentences should be three words.
- Have an opinion. Take a side. Mild snark or honesty about what doesn't work is good.
- Use concrete examples, real numbers, named products, specific scenarios. No abstract platitudes.
- Cut every sentence that doesn't earn its place. If a paragraph could be deleted with no loss, delete it.
- Write the way smart people talk — slightly informal, direct, sometimes funny.
- Skip headers unless the format demands them. Most writing flows better without H2 every 100 words.
- It's fine to start sentences with And, But, So.`;

type Tone = "casual" | "professional" | "witty" | "bold" | "friendly" | "expert";
type Length = "short" | "medium" | "long";

const toneGuide: Record<Tone, string> = {
  casual: "Conversational and relaxed — like texting a friend who happens to know the topic.",
  professional: "Polished and credible but still human. No corporate jargon.",
  witty: "Sharp, a bit cheeky, with dry humor. Make at least one observation that earns a smile.",
  bold: "Confident, opinionated, willing to push back on conventional wisdom.",
  friendly: "Warm and encouraging, like a helpful older sibling. Never saccharine.",
  expert: "Authoritative and specific. Cite mechanisms, numbers, or trade-offs.",
};

const lengthGuide: Record<string, Record<Length, string>> = {
  "youtube-script": {
    short: "Aim for ~3–5 minutes of talking (about 500–700 words).",
    medium: "Aim for ~7–10 minutes of talking (about 1100–1500 words).",
    long: "Aim for ~12–18 minutes of talking (about 1800–2500 words).",
  },
  "blog-post": {
    short: "600–900 words.",
    medium: "1200–1700 words.",
    long: "2000–2800 words.",
  },
  default: { short: "Keep it tight.", medium: "Standard length.", long: "Go in depth." },
};

function lenFor(type: string, len: Length) {
  return (lengthGuide[type] ?? lengthGuide.default)[len];
}

function buildUserPrompt(opts: {
  contentType: string;
  topic: string;
  tone: Tone;
  length: Length;
  audience?: string;
  keywords?: string;
}) {
  const { contentType, topic, tone, length, audience, keywords } = opts;
  const aud = audience?.trim() ? `Audience: ${audience.trim()}.` : "";
  const kw = keywords?.trim() ? `Naturally work in (don't keyword-stuff): ${keywords.trim()}.` : "";
  const toneLine = `Tone: ${toneGuide[tone]}`;
  const lenLine = `Length: ${lenFor(contentType, length)}`;
  const meta = [toneLine, lenLine, aud, kw].filter(Boolean).join("\n");

  const briefs: Record<string, string> = {
    "youtube-script": `Write a YouTube video script about: "${topic}".

Structure it the way a real creator talks on camera:
- A 5-second hook that isn't clickbait. Open with a specific claim, a question someone is actually asking, or a tiny story.
- A short setup: what they're getting and why it's worth their time.
- 3–5 main points, told naturally with examples, asides, and the occasional "okay so" or "here's the thing".
- A close that earns the subscribe — give them a real reason, ask a real question, or tease a follow-up.

Include [B-ROLL: ...] and [CUT TO: ...] notes where they help.`,

    "tiktok-idea": `Give me 5 distinct TikTok/Reels concepts for: "${topic}".

For each: a stop-the-scroll hook, the full 30–60s script in spoken voice, on-screen text overlays, suggested sound style, and 5–8 hashtags. Be honest about which one you'd bet on going viral and why.`,

    "blog-post": `Write a blog post about: "${topic}".

Include a title (under 60 chars), meta description (under 155 chars), and the post. Open with a specific story, sharp claim, or surprising stat — not a definition. Use H2s where they actually help. Short paragraphs. End with 3 FAQs people genuinely Google.`,

    "social-caption": `Write 5 caption sets for: "${topic}".

For each, provide three versions:
- Instagram: line-broken mini-story, 12–18 relevant hashtags
- X/Twitter: under 280 chars, one sharp idea
- LinkedIn: an insight or lesson, 3–5 hashtags, no humble-bragging

End each with a natural prompt for replies, not "link in bio!!!".`,

    "email": `Write a marketing/newsletter email about: "${topic}".

Provide: subject line (under 50 chars, no clickbait), preview text (under 90 chars), and the body. Open like a human, not a brand. One clear ask. End with a sign-off that fits the tone.`,

    "tweet-thread": `Write a Twitter/X thread about: "${topic}".

8–12 tweets. Tweet 1 must hook hard — a contrarian take, a concrete result, or a question. Each tweet under 280 chars. Number them. Last tweet has a CTA (follow, bookmark, reply) that feels earned.`,

    "ad-copy": `Write ad copy for: "${topic}".

Give 3 variants for each of: Facebook/Instagram, Google Search, and LinkedIn. For each variant include headline(s), primary text, and a CTA. Lead with the outcome, not the feature.`,

    "product-description": `Write a product description for: "${topic}".

Include a punchy one-liner, a 60–100 word story-driven description, 4–6 bullet benefits (benefit first, feature in parens), and a short SEO meta description.`,

    "cold-dm": `Write 3 cold outreach DMs/emails for: "${topic}".

Each one: under 90 words, personalized opener, one specific reason for the message, a low-friction ask. No "I hope this finds you well." No fake compliments.`,

    "linkedin-post": `Write a LinkedIn post about: "${topic}".

Hook in line 1. Use line breaks generously. One insight, told through a small story or a specific number. End with a question that's actually answerable in a comment. 150–300 words.`,

    "video-hooks": `Give 10 stop-the-scroll hooks for short-form video about: "${topic}".

Mix formats: contrarian claim, specific result, before/after, question, mistake reveal. Each hook under 15 words.`,

    "outline": `Outline a piece of content about: "${topic}".

Give a working title, the core argument in one sentence, 5–8 section headers, and 2–3 bullet beats under each header. No fluff.`,
  };

  const brief = briefs[contentType] ?? `Write something genuinely useful about: "${topic}". Be specific and human.`;

  return `${meta}\n\n${brief}`;
}

// ---- Handler ---------------------------------------------------------------

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    const {
      contentType,
      topic,
      guest,
      tone = "casual",
      length = "medium",
      audience,
      keywords,
    } = body as {
      contentType: string;
      topic: string;
      guest?: boolean;
      tone?: Tone;
      length?: Length;
      audience?: string;
      keywords?: string;
    };

    if (!topic || typeof topic !== "string" || topic.trim().length < 2) {
      return new Response(JSON.stringify({ error: "Please enter a topic." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let user = null;
    let profile: any = null;

    if (!guest) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) throw new Error("Not authenticated");

      const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
      const { data: { user: authUser }, error: authError } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
      if (authError || !authUser) throw new Error("Not authenticated");
      user = authUser;

      const { data: profileData } = await supabase.from("users").select("*").eq("id", user.id).single();
      if (!profileData) throw new Error("User profile not found. Please sign out and back in.");
      profile = profileData;

      // Daily reset
      const today = new Date().toISOString().slice(0, 10);
      if (profile.last_reset_date && profile.last_reset_date !== today) {
        await supabase.from("users").update({ daily_usage_count: 0, last_reset_date: today }).eq("id", user.id);
        profile.daily_usage_count = 0;
        profile.last_reset_date = today;
      }

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

    const userPrompt = buildUserPrompt({ contentType, topic, tone, length, audience, keywords });

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: HUMAN_SYSTEM },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.95,
        top_p: 0.92,
        stream: true,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please contact support." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
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

    // Post-process: strip a few common AI tells if they slipped through
    fullResult = fullResult
      .replace(/^\s*(Sure!|Certainly!|Of course!|Absolutely!|Here['']s|Here is)[^\n]*\n+/i, "")
      .replace(/\n\nIn conclusion,?\s*/gi, "\n\n")
      .replace(/\bdelve into\b/gi, "look at")
      .replace(/\bdive deep into\b/gi, "look at")
      .replace(/\bgame[- ]changer\b/gi, "big deal")
      .replace(/\bleverage\b/gi, "use")
      .replace(/\bunlock\b/gi, "get")
      .trim();

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
    console.error("generate-content error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
