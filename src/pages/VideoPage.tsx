import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Sparkles, Video as VideoIcon, Download, Play, Pause, RefreshCw, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type Orientation = "portrait" | "landscape" | "square";

interface Scene {
  query: string;
  text: string;
  duration: number;
  videoUrl: string;
  posterUrl: string;
  credit: string;
}

interface Storyboard {
  title: string;
  orientation: Orientation;
  scenes: Scene[];
}

const orientationDims: Record<Orientation, { w: number; h: number; label: string }> = {
  portrait: { w: 540, h: 960, label: "9:16 · Reels / Shorts / TikTok" },
  landscape: { w: 960, h: 540, label: "16:9 · YouTube" },
  square: { w: 720, h: 720, label: "1:1 · Feed post" },
};

const VideoPage = () => {
  const { profile } = useAuth();
  const PREMIUM_PLANS = ["premium", "pro", "paid", "active", "subscribed"];
const isPremium =
  profile != null &&
  PREMIUM_PLANS.includes(
    String(profile.plan ?? "").toLowerCase().trim().replace(/[-_\s]+/g, "")
  );

  const [topic, setTopic] = useState("");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [duration, setDuration] = useState(20);
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<Storyboard | null>(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [exporting, setExporting] = useState(false);

  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const dims = orientationDims[orientation];

  const runGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Enter a topic for your video.");
      return;
    }
    setLoading(true);
    setStory(null);
    setSceneIndex(0);
    setPlaying(false);

    try {
      const { data, error } = await supabase.functions.invoke("generate-video", {
        body: { topic, orientation, totalDuration: duration },
      });
      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      setStory(data as Storyboard);
      toast.success("Storyboard ready. Hit play to preview.");
    } catch (err: any) {
      toast.error(err.message || "Couldn't generate video");
    } finally {
      setLoading(false);
    }
  };

  // Sequential scene playback
  useEffect(() => {
    if (!story || !playing) return;
    const el = videoRefs.current[sceneIndex];
    if (!el) return;

    el.currentTime = 0;
    el.play().catch(() => {});

    const scene = story.scenes[sceneIndex];
    const timer = window.setTimeout(() => {
      if (sceneIndex + 1 < story.scenes.length) {
        setSceneIndex(sceneIndex + 1);
      } else {
        setPlaying(false);
        setSceneIndex(0);
      }
    }, scene.duration * 1000);

    return () => {
      clearTimeout(timer);
      el.pause();
    };
  }, [playing, sceneIndex, story]);

  const togglePlay = () => {
    if (!story) return;
    if (playing) {
      setPlaying(false);
    } else {
      setSceneIndex(0);
      setPlaying(true);
    }
  };

  // Render the composed video to MP4/WebM via canvas + MediaRecorder
  const exportVideo = async () => {
    if (!story) return;
    setExporting(true);
    setPlaying(false);

    const canvas = document.createElement("canvas");
    canvas.width = dims.w;
    canvas.height = dims.h;
    const ctx = canvas.getContext("2d")!;

    // Preload all scene videos as fresh, muted, crossOrigin elements
    const videos: HTMLVideoElement[] = await Promise.all(
      story.scenes.map(
        (s) =>
          new Promise<HTMLVideoElement>((resolve, reject) => {
            const v = document.createElement("video");
            v.crossOrigin = "anonymous";
            v.muted = true;
            v.playsInline = true;
            v.preload = "auto";
            v.src = s.videoUrl;
            v.onloadeddata = () => resolve(v);
            v.onerror = () => reject(new Error("Failed to load a clip"));
          }),
      ),
    ).catch((e) => {
      toast.error(e.message);
      setExporting(false);
      return [] as HTMLVideoElement[];
    });

    if (!videos.length) return;

    const stream = canvas.captureStream(30);
    const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";
    const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4_000_000 });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);

    const done = new Promise<Blob>((resolve) => {
      recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
    });

    recorder.start();

    let cancelled = false;
    const drawFrame = (video: HTMLVideoElement, text: string) => {
      // Cover fit
      const vr = video.videoWidth / video.videoHeight;
      const cr = canvas.width / canvas.height;
      let sw = video.videoWidth;
      let sh = video.videoHeight;
      let sx = 0;
      let sy = 0;
      if (vr > cr) {
        sw = video.videoHeight * cr;
        sx = (video.videoWidth - sw) / 2;
      } else {
        sh = video.videoWidth / cr;
        sy = (video.videoHeight - sh) / 2;
      }
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

      // Vignette
      const grad = ctx.createLinearGradient(0, canvas.height * 0.55, 0, canvas.height);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,0.75)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, canvas.height * 0.55, canvas.width, canvas.height * 0.45);

      // Caption
      if (text) {
        const fontSize = Math.round(canvas.width * 0.055);
        ctx.font = `800 ${fontSize}px Inter, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.lineWidth = Math.max(4, fontSize * 0.18);
        ctx.strokeStyle = "rgba(0,0,0,0.85)";
        ctx.fillStyle = "#ffffff";

        // Simple word wrap
        const maxWidth = canvas.width * 0.88;
        const words = text.split(/\s+/);
        const lines: string[] = [];
        let line = "";
        for (const w of words) {
          const test = line ? `${line} ${w}` : w;
          if (ctx.measureText(test).width > maxWidth && line) {
            lines.push(line);
            line = w;
          } else {
            line = test;
          }
        }
        if (line) lines.push(line);

        const lineH = fontSize * 1.15;
        const startY = canvas.height - canvas.height * 0.08 - (lines.length - 1) * lineH;
        lines.forEach((ln, i) => {
          ctx.strokeText(ln, canvas.width / 2, startY + i * lineH);
          ctx.fillText(ln, canvas.width / 2, startY + i * lineH);
        });
      }
    };

    for (let i = 0; i < story.scenes.length; i++) {
      if (cancelled) break;
      const v = videos[i];
      const scene = story.scenes[i];
      v.currentTime = 0;
      await v.play().catch(() => {});

      const start = performance.now();
      await new Promise<void>((resolve) => {
        const loop = () => {
          const elapsed = (performance.now() - start) / 1000;
          drawFrame(v, scene.text);
          if (elapsed >= scene.duration) resolve();
          else requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
      });
      v.pause();
    }

    recorder.stop();
    const blob = await done;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(story.title || "trendnova-video").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
    toast.success("Video downloaded.");
  };

  if (!isPremium) {
    return (
      <div className="max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
            <VideoIcon className="h-6 w-6 text-accent" /> Video Generator
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Turn a topic into a finished short-form video with AI-written captions and stock footage.
          </p>
        </motion.div>

        <div className="glass-card p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent mb-4">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">Premium only</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Video generation is part of the Premium plan. Upgrade to unlock unlimited AI video creation
            with stock footage.
          </p>
          <Link to="/dashboard/billing">
            <Button variant="hero" className="gap-2">
              <Sparkles className="h-4 w-4" /> Upgrade to Premium
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
          <VideoIcon className="h-6 w-6 text-accent" /> Video Generator
          <span className="text-[10px] font-bold bg-accent/15 text-accent px-1.5 py-0.5 rounded ml-1">
            PREMIUM
          </span>
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          AI writes a storyboard, we pull matching stock clips, and stitch them with captions.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr_auto] gap-8">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">What's the video about?</label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 3 morning habits that changed my focus"
              className="bg-secondary border-border"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Format</label>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(orientationDims) as Orientation[]).map((o) => (
                  <button
                    key={o}
                    onClick={() => setOrientation(o)}
                    className={`px-3 py-1.5 rounded-md text-xs capitalize border transition-all ${
                      orientation === o
                        ? "border-primary/60 bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">{dims.label}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Length: {duration}s
              </label>
              <input
                type="range"
                min={10}
                max={45}
                step={5}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="hero" onClick={runGenerate} disabled={loading} className="gap-2">
              <Sparkles className="h-4 w-4" />
              {loading ? "Generating storyboard..." : "Generate Video"}
            </Button>
            {story && (
              <Button variant="outline" onClick={runGenerate} disabled={loading} className="gap-2">
                <RefreshCw className="h-4 w-4" /> New variation
              </Button>
            )}
          </div>

          {story && (
            <div className="glass-card p-4 mt-2">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Storyboard</p>
              <ol className="space-y-1.5 text-sm">
                {story.scenes.map((s, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-2 ${
                      i === sceneIndex && playing ? "text-primary" : "text-foreground"
                    }`}
                  >
                    <span className="text-muted-foreground text-xs mt-0.5 min-w-[40px]">
                      {s.duration}s
                    </span>
                    <span className="flex-1">{s.text || s.query}</span>
                  </li>
                ))}
              </ol>
              <p className="text-[10px] text-muted-foreground mt-3">
                Footage: {story.scenes.map((s) => s.credit).filter((c, i, a) => a.indexOf(c) === i).join(" · ")}
              </p>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-6 self-start">
          <div
            className="relative rounded-2xl overflow-hidden border border-border/40 bg-black mx-auto"
            style={{
              width: Math.min(dims.w / 2, 360),
              height: Math.min(dims.h / 2, (360 * dims.h) / dims.w),
            }}
          >
            {story ? (
              <>
                {story.scenes.map((s, i) => (
                  <video
                    key={`${s.videoUrl}-${i}`}
                    ref={(el) => (videoRefs.current[i] = el)}
                    src={s.videoUrl}
                    poster={s.posterUrl}
                    muted
                    playsInline
                    crossOrigin="anonymous"
                    className={`absolute inset-0 w-full h-full object-cover ${
                      i === sceneIndex ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
                {/* Caption overlay */}
                {playing && story.scenes[sceneIndex]?.text && (
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white font-bold text-center text-sm leading-tight drop-shadow-lg">
                      {story.scenes[sceneIndex].text}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs px-4 text-center">
                Your video preview will appear here
              </div>
            )}
          </div>

          {story && (
            <div className="flex gap-2 mt-3 justify-center">
              <Button variant="outline" size="sm" onClick={togglePlay} className="gap-1">
                {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {playing ? "Pause" : "Play"}
              </Button>
              <Button variant="hero" size="sm" onClick={exportVideo} disabled={exporting} className="gap-1">
                <Download className="h-3 w-3" />
                {exporting ? "Rendering..." : "Download .webm"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
