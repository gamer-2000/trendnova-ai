import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sparkles,
  LayoutDashboard,
  Wand2,
  History,
  CreditCard,
  MessageSquare,
  LogOut,
  Shield,
  Image,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdBanner from "@/components/AdBanner";

const workspaceNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/generate", label: "Generate", icon: Wand2 },
  { to: "/dashboard/video", label: "Video", icon: Video, badge: "PREMIUM", badgeStyle: "premium" },
  { to: "/dashboard/thumbnails", label: "Thumbnails", icon: Image, badge: "PRO", badgeStyle: "pro" },
];

const accountNav = [
  { to: "/dashboard/history", label: "History", icon: History },
  { to: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { to: "/dashboard/feedback", label: "Feedback", icon: MessageSquare },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/generate": "Generate",
  "/dashboard/video": "Video",
  "/dashboard/thumbnails": "Thumbnails",
  "/dashboard/history": "History",
  "/dashboard/billing": "Billing",
  "/dashboard/feedback": "Feedback",
  "/admin": "Admin",
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const planColor =
    profile?.plan === "premium"
      ? "text-accent"
      : profile?.plan === "pro"
      ? "text-primary"
      : "text-muted-foreground";

  const planDot =
    profile?.plan === "premium"
      ? "bg-accent"
      : profile?.plan === "pro"
      ? "bg-primary"
      : "bg-muted-foreground";

  const pageTitle = pageTitles[location.pathname] ?? "Dashboard";

  const NavLink = ({
    to,
    label,
    icon: Icon,
    badge,
    badgeStyle,
  }: {
    to: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeStyle?: string;
  }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
          active
            ? "bg-primary/15 text-primary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] backdrop-blur-sm border border-primary/20"
            : "text-muted-foreground hover:text-foreground hover:bg-white/5 hover:backdrop-blur-sm border border-transparent"
        }`}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="flex-1">{label}</span>
        {badge && (
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${
              badgeStyle === "premium"
                ? "bg-accent/10 text-accent border-accent/20"
                : "bg-primary/10 text-primary border-primary/20"
            }`}
          >
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col fixed h-full z-20 p-3">
        <div
          className="flex flex-col h-full rounded-2xl border border-white/10 overflow-hidden"
          style={{
            background: "rgba(var(--card-rgb, 255 255 255) / 0.05)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          {/* Logo */}
          <div className="px-4 py-4 border-b border-white/8">
            <Link to="/" className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-primary/20 border border-primary/30"
                style={{ backdropFilter: "blur(8px)" }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <span className="font-display text-lg font-bold text-foreground">TrendNova</span>
            </Link>
          </div>

          {/* User block */}
          <div className="px-3 py-3">
            <div
              className="px-3 py-2.5 rounded-xl border border-white/10"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(8px)",
              }}
            >
              <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${planDot}`} />
                <span className={`text-[11px] font-semibold uppercase tracking-wide ${planColor}`}>
                  {profile?.plan ?? "free"} plan
                </span>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 overflow-y-auto space-y-0.5">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50 px-3 pt-2 pb-1">
              Workspace
            </p>
            {workspaceNav.map((item) => (
              <NavLink key={item.to} {...item} />
            ))}

            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50 px-3 pt-4 pb-1">
              Account
            </p>
            {accountNav.map((item) => (
              <NavLink key={item.to} {...item} />
            ))}

            {profile?.email === "fotbol668@gmail.com" && (
              <NavLink to="/admin" label="Admin" icon={Shield} />
            )}
          </nav>

          {/* Footer */}
          <div className="px-3 py-3 border-t border-white/8">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-200"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header
          className="sticky top-0 z-10 px-6 h-14 flex items-center justify-between border-b border-white/8"
          style={{
            background: "rgba(var(--background-rgb, 0 0 0) / 0.6)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
          }}
        >
          <h1 className="text-[15px] font-medium text-foreground">{pageTitle}</h1>
          <div className="flex items-center gap-2">
            {profile?.generations_count !== undefined && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-muted-foreground border border-white/10"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Wand2 className="h-3.5 w-3.5 text-primary" />
                {profile.generations_count} generations
              </div>
            )}
            <Button
              size="sm"
              className="bg-primary/90 hover:bg-primary text-primary-foreground gap-1.5 h-8 text-xs font-medium rounded-xl border border-primary/30 shadow-[0_0_12px_rgba(var(--primary-rgb,139,92,246)/0.3)]"
              onClick={() => navigate("/dashboard/generate")}
            >
              <Wand2 className="h-3.5 w-3.5" />
              Generate
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 sm:p-8">
          {children}
          {profile?.plan !== "premium" && (
            <div className="mt-8">
              <AdBanner slot="4567890123" format="horizontal" />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
