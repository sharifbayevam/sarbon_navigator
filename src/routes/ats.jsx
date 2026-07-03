import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { PageHeader } from "@/components/AppShell";
import { Card, Button } from "@/components/ui-bits";
import { useT } from "@/providers/app-providers";
import { Gauge, CheckCircle2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/ats")({
  head: () => ({ meta: [{ title: "ATS Score — ExpatCareer AI" }] }),
  component: AtsPage,
});

function AtsPage() {
  const { t } = useT();
  const [score, setScore] = useState(0);
  const [breakdown, setBreakdown] = useState([]);

  const run = () => {
    const target = 40 + Math.floor(Math.random() * 55);
    setScore(target);
    setBreakdown([
      { key: "page.ats.readability", value: 70 + Math.floor(Math.random() * 25) },
      { key: "page.ats.keywords", value: 50 + Math.floor(Math.random() * 45) },
      { key: "page.ats.structure", value: 60 + Math.floor(Math.random() * 35) },
    ]);
  };

  return (
    <div>
      <PageHeader badge="04 / 20  ·  ATS DIAGNOSTICS" title={t("page.ats.title")} subtitle={t("page.ats.subtitle")} />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="text-center">
          <Gauge className="size-6 text-neon mx-auto mb-3" />
          <h3 className="text-sm text-muted-foreground mb-6">Umumiy ATS bali</h3>
          <ScoreRing score={score} />
          <div className="mt-6">
            <Button onClick={run}>{t("page.ats.run")}</Button>
          </div>
        </Card>
        <Card>
          <h3 className="font-display text-lg font-semibold mb-4">Tafsilot</h3>
          {breakdown.length === 0 && <div className="text-sm text-muted-foreground py-8 text-center">Diagnostikani ishga tushiring</div>}
          <div className="space-y-4">
            {breakdown.map((b) => (
              <div key={b.key}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{t(b.key)}</span>
                  <span className={b.value >= 70 ? "text-emerald-glow" : "text-warn"}>{b.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-surface overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${b.value}%` }} transition={{ duration: 1.2 }} className={`h-full ${b.value >= 70 ? "bg-emerald-glow" : "bg-warn"}`} />
                </div>
              </div>
            ))}
          </div>
          {score > 0 && (
            <div className="mt-6 pt-6 border-t border-border space-y-2 text-sm">
              <Tip ok={score >= 70} text="ATS uchun kalit so'zlar yetarli" />
              <Tip ok={score >= 60} text="1 sahifalik standart format" />
              <Tip ok={score >= 50} text="Standart bo'limlar (Experience, Education, Skills)" />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function ScoreRing({ score }) {
  const v = useMotionValue(0);
  const rounded = useTransform(v, (x) => Math.round(x));
  const [val, setVal] = useState(0);
  useEffect(() => {
    const c = animate(v, score, { duration: 1.6, ease: "easeOut" });
    const unsub = rounded.on("change", (x) => setVal(x));
    return () => { c.stop(); unsub(); };
  }, [score, v, rounded]);
  const r = 70;
  const circ = 2 * Math.PI * r;
  const offset = circ - (val / 100) * circ;
  const color = val >= 80 ? "var(--emerald-glow)" : val >= 60 ? "var(--neon)" : val >= 40 ? "var(--warn)" : "var(--danger)";
  return (
    <div className="relative inline-block">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={r} stroke="var(--surface-2)" strokeWidth="12" fill="none" />
        <circle cx="90" cy="90" r={r} stroke={color} strokeWidth="12" fill="none" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 90 90)" style={{ transition: "stroke 0.3s" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-5xl font-bold" style={{ color }}>{val}%</div>
        <div className="text-xs text-muted-foreground">ATS Score</div>
      </div>
    </div>
  );
}

function Tip({ ok, text }) {
  return (
    <div className="flex items-center gap-2">
      {ok ? <CheckCircle2 className="size-4 text-emerald-glow" /> : <AlertCircle className="size-4 text-warn" />}
      <span className={ok ? "" : "text-muted-foreground"}>{text}</span>
    </div>
  );
}