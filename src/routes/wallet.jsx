import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { Card, Button, Input, Badge } from "@/components/ui-bits";
import { useT, useAuth } from "@/providers/app-providers";
import { supabase } from "@/integrations/supabase/client";
import { Plus, FileBadge, AlertTriangle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/wallet")({
  head: () => ({ meta: [{ title: "Documents Wallet — ExpatCareer AI" }] }),
  component: WalletPage,
});

function WalletPage() {
  const { t } = useT();
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("Passport");
  const [date, setDate] = useState("");

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("documents").select("*").order("expiry_date");
    setDocs(data ?? []);
  };

  useEffect(() => { 
    load(); 
  }, [user]);

  const add = async () => {
    if (!user) { toast.error("Avval kiring"); return; }
    if (!name || !date) return;
    const { error } = await supabase.from("documents").insert({ user_id: user.id, title: name, doc_type: type, expiry_date: date });
    if (error) toast.error(error.message); else { setName(""); setDate(""); toast.success("Qo'shildi"); load(); }
  };

  const remove = async (id) => {
    await supabase.from("documents").delete().eq("id", id); 
    load();
  };

  return (
    <div>
      <PageHeader badge="15 / 20  ·  DIGITAL WALLET" title={t("page.wallet.title")} subtitle={t("page.wallet.subtitle")} />
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <h3 className="font-display font-semibold mb-3 flex items-center gap-2"><Plus className="size-4 text-neon" /> {t("page.wallet.add")}</h3>
          <div className="space-y-3">
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm">
              <option>Passport</option><option>Visa</option><option>Work Permit</option><option>License</option><option>Insurance</option>
            </select>
            <Input placeholder="Hujjat nomi" value={name} onChange={(e) => setName(e.target.value)} />
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Button onClick={add} className="w-full">{t("common.save")}</Button>
          </div>
        </Card>
        <div className="lg:col-span-2 space-y-3">
          {!user && <Card><div className="text-sm text-muted-foreground">Hujjatlarni saqlash uchun avval kiring.</div></Card>}
          {docs.map((d, i) => {
            const exp = d.expiry_date ? new Date(d.expiry_date).getTime() : Date.now();
            const days = Math.floor((exp - Date.now()) / 86400000);
            const tone = days < 0 ? "danger" : days < 30 ? "warn" : "emerald";
            return (
              <motion.div key={d.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="flex items-center gap-4">
                  <div className={`size-12 rounded-lg flex items-center justify-center ${tone === "danger" ? "bg-danger/15" : tone === "warn" ? "bg-warn/15" : "bg-emerald-glow/15"}`}>
                    {tone === "danger" ? <AlertTriangle className="size-5 text-danger" /> : <FileBadge className={`size-5 ${tone === "warn" ? "text-warn" : "text-emerald-glow"}`} />}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{d.title}</div>
                    <div className="text-xs text-muted-foreground">{d.doc_type} · {d.expiry_date ? new Date(d.expiry_date).toLocaleDateString() : "—"}</div>
                  </div>
                  <Badge tone={tone}>{days < 0 ? t("page.wallet.expired") : `${days} ${t("page.wallet.daysLeft")}`}</Badge>
                  <button onClick={() => remove(d.id)} className="p-2 text-muted-foreground hover:text-danger"><Trash2 className="size-4" /></button>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}