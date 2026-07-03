import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/AppShell";
import { Card, Button, Input, Badge } from "@/components/ui-bits";
import { useT, useAppState, COUNTRY_META } from "@/providers/app-providers";
import { analyzeDiploma } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CheckCircle2, AlertTriangle, XCircle, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/diploma")({
  head: () => ({ meta: [{ title: "Diploma Recognition — ExpatCareer AI" }] }),
  component: DiplomaPage,
});

function DiplomaPage() {
  const { t, lang } = useT();
  const { country } = useAppState();
  const fn = useServerFn(analyzeDiploma);
  const [uni, setUni] = useState("Toshkent Tibbiyot Akademiyasi");
  const [degree, setDegree] = useState("MD, General Medicine");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const run = async () => {
    setLoading(true);
    try {
      const r = await fn({ data: { university: uni, degree, country: t(`country.${country}`), lang } });
      setResult(r);
    } catch (e) {
      toast.error(e.message || "Xato");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader badge="02 / 20  ·  ANABIN · WES · ECFMG" title={t("page.diploma.title")} subtitle={t("page.diploma.subtitle")} />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="size-5 text-neon" />
            <h2 className="font-display text-lg font-semibold">Diplom ma'lumotlari</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">{t("page.diploma.uni")}</label>
              <Input value={uni} onChange={(e) => setUni(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">{t("page.diploma.degree")}</label>
              <Input value={degree} onChange={(e) => setDegree(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Maqsad:</span>
              <Badge>{COUNTRY_META[country].flag} {t(`country.${country}`)}</Badge>
            </div>
            <Button onClick={run} disabled={loading} className="w-full">
              {loading ? t("common.loading") : t("page.diploma.analyze")}
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-semibold mb-4">Natija</h2>
          {!result && (
            <div className="text-sm text-muted-foreground py-12 text-center">
              Diplomingizni kiriting va AI tahlilini ko'ring
            </div>
          )}
          {result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <StatusBlock status={result.status} t={t} />
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{result.title}</div>
                <p className="text-sm">{result.reason}</p>
              </div>
              {result.exams?.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Talab qilinadigan imtihonlar:</div>
                  <div className="flex flex-wrap gap-2">
                    {result.exams.map((e) => <Badge key={e} tone="warn">{e}</Badge>)}
                  </div>
                </div>
              )}
              <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                Tan oluvchi tashkilot: <span className="text-foreground font-medium">{result.agency}</span>
              </div>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatusBlock({ status, t }) {
  const statusMap = {
    green: { icon: CheckCircle2, color: "text-emerald-glow", bg: "bg-emerald-glow/10 border-emerald-glow/30", label: t("page.diploma.green"), pct: 100 },
    yellow: { icon: AlertTriangle, color: "text-warn", bg: "bg-warn/10 border-warn/30", label: t("page.diploma.yellow"), pct: 60 },
    red: { icon: XCircle, color: "text-danger", bg: "bg-danger/10 border-danger/30", label: t("page.diploma.red"), pct: 20 },
  };

  const map = statusMap[status] ?? { icon: AlertTriangle, color: "text-warn", bg: "bg-warn/10 border-warn/30", label: t("page.diploma.yellow"), pct: 50 };
  const Icon = map.icon;

  return (
    <div className={`rounded-xl border p-4 ${map.bg}`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className={`size-6 ${map.color}`} />
        <div className={`font-display font-semibold ${map.color}`}>{map.label}</div>
      </div>
      <div className="h-2 rounded-full bg-surface overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${map.pct}%` }} transition={{ duration: 1, ease: "easeOut" }} className={`h-full ${status === "green" ? "bg-emerald-glow" : status === "red" ? "bg-danger" : "bg-warn"}`} />
      </div>
    </div>
  );
}