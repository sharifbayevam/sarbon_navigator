import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useT, useAuth } from "@/providers/app-providers";
import { Card, Button, Input } from "@/components/ui-bits";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Globe2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — ExpatCareer AI" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useT();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Hisob yaratildi");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e) {
      toast.error(e.message || "Xato");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="neon-border">
        <div className="flex items-center justify-center mb-6">
          <div className="size-14 rounded-2xl bg-neon/10 neon-border flex items-center justify-center">
            <Globe2 className="size-7 text-neon" />
          </div>
        </div>
        <h1 className="font-display text-2xl font-bold text-center mb-1">{t("auth.title")}</h1>
        <p className="text-center text-sm text-muted-foreground mb-6">ExpatCareer AI</p>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <div>
              <label className="text-xs text-muted-foreground">{t("auth.fullName")}</label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
          )}
          <div>
            <label className="text-xs text-muted-foreground">{t("auth.email")}</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">{t("auth.password")}</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t("common.loading") : mode === "signin" ? t("auth.signIn") : t("auth.signUp")}
          </Button>
        </form>

        <div className="text-center mt-5 text-sm text-muted-foreground">
          {mode === "signin" ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-neon hover:underline">
            {mode === "signin" ? t("auth.signUp") : t("auth.signIn")}
          </button>
        </div>
      </Card>
    </div>
  );
}