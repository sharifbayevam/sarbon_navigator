import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/AppShell";
import { Card, Button, Input, Textarea, Badge } from "@/components/ui-bits";
import { useT, useAuth } from "@/providers/app-providers";
import { supabase } from "@/integrations/supabase/client";
import { MessagesSquare, Siren, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/forum")({
  head: () => ({ meta: [{ title: "Forum — ExpatCareer AI" }] }),
  component: ForumPage,
});

function ForumPage() {
  const { t } = useT();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("forum_posts").select("*").order("created_at", { ascending: false }).limit(20);
    setPosts(data ?? []);
  };
  useEffect(() => { void load(); }, []);

  const submit = async (sos = false) => {
    if (!user) { toast.error("Avval kiring"); return; }
    const finalTitle = sos ? "🚨 SOS — shoshilinch yordam kerak" : title;
    const finalBody = sos ? body || "Iltimos, javob bering" : body;
    if (!finalTitle || !finalBody) return;
    const { error } = await supabase.from("forum_posts").insert({ user_id: user.id, title: finalTitle, body: finalBody, is_sos: sos, author_name: user.email ?? "Expat" });
    if (error) toast.error(error.message); else { setTitle(""); setBody(""); setOpen(false); toast.success(sos ? "SOS yuborildi" : "Mavzu joylandi"); load(); }
  };

  return (
    <div>
      <PageHeader badge="20 / 20  ·  COMMUNITY" title={t("page.forum.title")} subtitle={t("page.forum.subtitle")} />
      <Card className="mb-6 neon-border bg-gradient-to-br from-danger/5 to-warn/5">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-full bg-danger/20 flex items-center justify-center"><Siren className="size-7 text-danger" /></div>
          <div className="flex-1">
            <h3 className="font-display font-semibold text-lg">{t("page.forum.sos")}</h3>
            <p className="text-sm text-muted-foreground">{t("page.forum.sosDesc")}</p>
          </div>
          <Button variant="danger" onClick={() => submit(true)}><Siren className="size-4" /> {t("page.forum.callSos")}</Button>
        </div>
      </Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-semibold">Mavzular</h2>
        <Button onClick={() => setOpen((o) => !o)}><Plus className="size-4" /> {t("page.forum.new")}</Button>
      </div>
      {open && (
        <Card className="mb-4">
          <div className="space-y-3">
            <Input placeholder="Mavzu sarlavhasi" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea rows={4} placeholder="Tafsilotlar..." value={body} onChange={(e) => setBody(e.target.value)} />
            <Button onClick={() => submit(false)}>{t("common.submit")}</Button>
          </div>
        </Card>
      )}
      <div className="space-y-3">
        {posts.length === 0 && <Card><div className="text-sm text-muted-foreground">Hozircha mavzular yo'q. Birinchi bo'lib boshlang!</div></Card>}
        {posts.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card className={p.is_sos ? "neon-border bg-danger/5" : ""}>
              <div className="flex items-start gap-3">
                <MessagesSquare className={`size-5 mt-1 ${p.is_sos ? "text-danger" : "text-neon"}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{p.title}</h3>
                    {p.is_sos && <Badge tone="danger">SOS</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{p.body}</p>
                  <div className="text-[10px] text-muted-foreground mt-2">{new Date(p.created_at).toLocaleString()}</div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}