import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PenTool, LayoutDashboard, Wand2, History, CreditCard, MessageSquare, LogOut, Shield, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdBanner from "@/components/AdBanner";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/generate", label: "Write", icon: Wand2 },
  { to: "/dashboard/thumbnails", label: "Thumbnails", icon: Image, badge: "PRO" },
  { to: "/dashboard/history", label: "History", icon: History },
  { to: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { to: "/dashboard/feedback", label: "Feedback", icon: MessageSquare },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const planColor = profile?.plan === "premium" ? "text-accent" : profile?.plan === "pro" ? "text-primary" : "text-muted-foreground";

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r border-border/30 bg-card/40 backdrop-blur-xl flex flex-col fixed h-full">
        <div className="p-4 border-b border-border/30">
          <Link to="/" className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-bold text-foreground">TrendNova</span>
          </Link>
        </div>

        <div className="p-3">
          <div className="glass-card p-3 mb-4">
            <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
            <p className={`text-xs font-semibold uppercase mt-1 ${planColor}`}>
              {profile?.plan || "free"} plan
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {"badge" in item && item.badge && (
                  <span className="ml-auto text-[10px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
          {profile?.email === "fotbol668@gmail.com" && (
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === "/admin"
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        <div className="p-3 border-t border-border/30">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-6 sm:p-8">
        {children}
        {profile?.plan !== "premium" && (
          <div className="mt-8">
            <AdBanner slot="4567890123" format="horizontal" />
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;
