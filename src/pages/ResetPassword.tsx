import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Check, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validSession, setValidSession] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user arrived via a valid recovery link
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setValidSession(true);
    } else {
      // Also check current session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setValidSession(!!session);
      });
    }
  }, []);

  const passwordChecks = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One number", valid: /\d/.test(password) },
    { label: "Passwords match", valid: password === confirmPassword && confirmPassword.length > 0 },
  ];

  const allValid = passwordChecks.every((c) => c.valid);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) return;
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSuccess(true);
      toast.success("Password updated successfully!");
      setTimeout(() => navigate("/login"), 2500);
    }
  };

  if (validSession === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div className="glass-card p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="font-display text-lg font-semibold text-foreground">Invalid or expired link</h2>
            <p className="text-muted-foreground text-sm">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link to="/forgot-password">
              <Button variant="hero" className="mt-2">Request New Link</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">TrendNova</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {success ? "Password updated!" : "Set new password"}
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            {success ? "Redirecting you to login..." : "Choose a strong password for your account"}
          </p>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-muted-foreground text-sm">Your password has been updated successfully.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleReset} className="glass-card p-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">New password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="bg-secondary/50 border-border/50 focus:border-primary/50 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Confirm password</label>
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                className="bg-secondary/50 border-border/50 focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              {passwordChecks.map((check, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${check.valid ? "bg-green-500/20 text-green-500 scale-110" : "bg-muted text-muted-foreground"}`}>
                    <Check className="h-2.5 w-2.5" />
                  </div>
                  <span className={check.valid ? "text-green-500" : "text-muted-foreground"}>{check.label}</span>
                </div>
              ))}
            </div>

            <Button variant="hero" className="w-full gap-2" disabled={loading || !allValid}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
