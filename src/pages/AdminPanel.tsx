import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Shield, Users, RefreshCw, Database, CreditCard, RotateCcw } from "lucide-react";
import { Navigate } from "react-router-dom";

interface UserRow {
  id: string;
  email: string;
  plan: string;
  daily_usage_count: number;
  created_at: string;
}

const AdminPanel = () => {
  const { profile, loading } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [planEmail, setPlanEmail] = useState("");
  const [planValue, setPlanValue] = useState("pro");
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [dbStatus, setDbStatus] = useState<string | null>(null);

  const isAdmin = profile?.email === "fotbol668@gmail.com";

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
    if (data) setUsers(data as UserRow[]);
    if (error) toast.error("Failed to load users");
    setLoadingUsers(false);
  };

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  if (loading) return null;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const handleUpdatePlan = async () => {
    if (!planEmail) return toast.error("Enter an email");
    const { data, error } = await supabase.functions.invoke("admin-actions", {
      body: { action: "update-plan", email: planEmail, plan: planValue },
    });
    if (error || data?.error) toast.error(data?.error || "Failed");
    else { toast.success("Plan updated!"); fetchUsers(); }
  };


  const handleResetUsage = async () => {
    if (!resetEmail) return toast.error("Enter an email");
    const { data, error } = await supabase.functions.invoke("admin-actions", {
      body: { action: "reset-usage", email: resetEmail },
    });
    if (error || data?.error) toast.error(data?.error || "Failed");
    else { toast.success("Usage reset!"); fetchUsers(); }
  };

  const testConnection = async () => {
    const { data, error } = await supabase.functions.invoke("admin-actions", {
      body: { action: "test-connection" },
    });
    if (error || data?.error) setDbStatus("❌ Disconnected");
    else setDbStatus("✅ Connected");
  };

  return (
    <div className="max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-6 w-6 text-accent" />
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Panel</h1>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <h2 className="font-display font-semibold text-foreground">Users</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchUsers}><RefreshCw className="h-4 w-4" /></Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Email</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Plan</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Usage</th>
              </tr>
            </thead>
            <tbody>
              {loadingUsers ? (
                <tr><td colSpan={4} className="py-4 text-center text-muted-foreground">Loading...</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="border-b border-border/10">
                  <td className="py-2 px-3 text-foreground">{u.email}</td>
                  <td className="py-2 px-3"><span className="uppercase text-xs font-semibold text-primary">{u.plan}</span></td>
                  <td className="py-2 px-3 text-foreground">{u.daily_usage_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-4 w-4 text-primary" />
            <h3 className="font-display font-semibold text-foreground">Update Plan</h3>
          </div>
          <div className="space-y-3">
            <Input value={planEmail} onChange={(e) => setPlanEmail(e.target.value)} placeholder="User email" className="bg-secondary border-border" />
            <select value={planValue} onChange={(e) => setPlanValue(e.target.value)} className="w-full h-10 rounded-lg bg-secondary border border-border px-3 text-sm text-foreground">
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="premium">Premium</option>
            </select>
            <Button variant="hero" size="sm" onClick={handleUpdatePlan} className="w-full">Update</Button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <RotateCcw className="h-4 w-4 text-primary" />
            <h3 className="font-display font-semibold text-foreground">Reset Usage</h3>
          </div>
          <div className="space-y-3">
            <Input value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="User email" className="bg-secondary border-border" />
            <Button variant="hero" size="sm" onClick={handleResetUsage} className="w-full">Reset</Button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-4 w-4 text-primary" />
            <h3 className="font-display font-semibold text-foreground">Database Status</h3>
          </div>
          <div className="space-y-3">
            {dbStatus && <p className="text-sm text-foreground">{dbStatus}</p>}
            <Button variant="hero" size="sm" onClick={testConnection} className="w-full">Test Connection</Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;
