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
        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
        }`}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="flex-1">{label}</span>
        {badge && (
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              badgeStyle === "premium"
                ? "bg-accent/20 text-accent"
                : "bg-primary/20 text-primary"
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
      <aside className="w-56 border-r border-border/30 bg-card/40 backdrop-blur-xl flex flex-col fixed h-full z-20">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-border/30">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">TrendNova</span>
          </Link>
        </div>

        {/* User block */}
        <div className="px-3 py-3">
          <div className="glass-card px-3 py-2.5">
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
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60 px-3 pt-2 pb-1">
            Workspace
          </p>
          {workspaceNav.map((item) => (
            <NavLink key={item.to} {...item} />
          ))}

          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60 px-3 pt-4 pb-1">
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
        <div className="px-3 py-3 border-t border-border/30">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border/30 px-6 h-14 flex items-center justify-between">
          <h1 className="text-[15px] font-medium text-foreground">{pageTitle}</h1>
          <div className="flex items-center gap-2">
            {profile?.generations_count !== undefined && (
              <div className="flex items-center gap-1.5 bg-secondary/70 border border-border/30 rounded-full px-3 py-1.5 text-xs text-muted-foreground">
                <Wand2 className="h-3.5 w-3.5 text-primary" />
                {profile.generations_count} generations
              </div>
            )}
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 h-8 text-xs font-medium rounded-lg"
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
