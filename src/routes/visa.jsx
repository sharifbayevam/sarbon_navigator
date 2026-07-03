import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/AppShell";
import { Card, Button } from "@/components/ui-bits";
import { useT } from "@/providers/app-providers";
import { Check, Clock, FileStack, Stamp, Send, Fingerprint, Search, PartyPopper } from "lucide-react";

export const Route = createFileRoute("/visa")({
  head: () => ({ meta: [{ title: "Visa Tracker — ExpatCareer AI" }] }),
  component: VisaPage,
});

const ICONS = [FileStack, Stamp, Send, Fingerprint, Search, PartyPopper];

function VisaPage() {
  const { t } = useT();
  const [step, setStep] = useState(2);
  const steps = [1, 2, 3, 4, 5, 6].map((n) => ({ n, label: t(`page.visa.step${n}`) }));
  return (
    <div>
      <PageHeader badge="08 / 20  ·  VISA ROADMAP" title={t("page.visa.title")} subtitle={t("page.visa.subtitle")} />
      <Card>
        <div className="space-y-1">
          {steps.map((s, i) => {
            const Icon = ICONS[i];
            const done = i < step;
            const active = i === step;
            return (
              <div key={s.n} className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className={`size-12 rounded-full flex items-center justify-center border-2 ${done ? "bg-emerald-glow/20 border-emerald-glow text-emerald-glow" : active ? "bg-neon/20 border-neon text-neon neon-glow" : "bg-surface border-border text-muted-foreground"}`}>
                    {done ? <Check className="size-5" /> : <Icon className="size-5" />}
                  </motion.div>
                  {i < steps.length - 1 && <div className={`w-0.5 h-12 ${done ? "bg-emerald-glow" : "bg-border"}`} />}
                </div>
                <div className="flex-1 pt-2 pb-8">
                  <div className={`font-display font-semibold ${active ? "text-neon" : done ? "text-emerald-glow" : ""}`}>{s.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{active ? <span className="inline-flex items-center gap-1"><Clock className="size-3" /> Joriy bosqich</span> : done ? "Bajarildi" : "Kutilmoqda"}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={() => setStep(Math.max(0, step - 1))} variant="ghost">Orqaga</Button>
          <Button onClick={() => setStep(Math.min(5, step + 1))}>Keyingi bosqich</Button>
        </div>
      </Card>
    </div>
  );
}