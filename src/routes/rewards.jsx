import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/AppShell";
import { Card, Badge, Button } from "@/components/ui-bits";
import { useT } from "@/providers/app-providers";
import { Trophy, Gift, Star, Zap } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/rewards")({
  head: () => ({ meta: [{ title: "Rewards — ExpatCareer AI" }] }),
  component: RewardsPage,
});

const MISSIONS = [
  { name: "Rezyumeni AI bilan moslashtirish", points: 200, done: true },
  { name: "Diplom tan olish so'rovi", points: 150, done: true },
  { name: "ATS skor 80% dan oshirish", points: 300, done: true },
  { name: "Birinchi vakansiyaga murojaat", points: 250, done: false },
  { name: "Til imtihoniga ro'yxatdan o'tish", points: 400, done: false },
  { name: "Birinchi intervyu", points: 500, done: false },
];

const PERKS = [
  { name: "20% chegirma — Tarjima", cost: 300, partner: "Notar.uz" },
  { name: "Bepul Coursera oyligi", cost: 800, partner: "Coursera" },
  { name: "$15 Bolt promo", cost: 500, partner: "Bolt" },
  { name: "VPN — 3 oy bepul", cost: 600, partner: "NordVPN" },
];

function RewardsPage() {
  const { t } = useT();
  const [balance, setBalance] = useState(650);

  return (
    <div>
      <PageHeader badge="19 / 20  ·  GAMIFICATION" title={t("page.rewards.title")} subtitle={t("page.rewards.subtitle")} />
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 neon-border relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neon/10 to-emerald-glow/10" />
          <div className="relative">
            <Trophy className="size-8 text-warn mb-3" />
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("page.rewards.balance")}</div>
            <motion.div key={balance} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="font-display text-5xl font-bold gradient-text my-2">
              {balance.toLocaleString()}
            </motion.div>
            <div className="text-sm text-muted-foreground">ExpatPoints</div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="bg-surface rounded p-2"><Star className="size-4 mx-auto text-warn mb-1" /><div className="text-[10px]">Gold</div></div>
              <div className="bg-surface rounded p-2"><Zap className="size-4 mx-auto text-neon mb-1" /><div className="text-[10px]">7-day streak</div></div>
              <div className="bg-surface rounded p-2"><Gift className="size-4 mx-auto text-emerald-glow mb-1" /><div className="text-[10px]">3 perks</div></div>
            </div>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <h3 className="font-display font-semibold mb-3">Topshiriqlar</h3>
          <div className="space-y-2">
            {MISSIONS.map((m) => (
              <div key={m.name} className={`flex items-center gap-3 p-3 rounded-lg border ${m.done ? "bg-emerald-glow/5 border-emerald-glow/20" : "bg-surface border-border"}`}>
                <div className={`size-2 rounded-full ${m.done ? "bg-emerald-glow" : "bg-warn animate-pulse"}`} />
                <div className="flex-1 text-sm">{m.name}</div>
                <Badge tone={m.done ? "emerald" : "warn"}>+{m.points} {t("common.points")}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card className="lg:col-span-3">
          <h3 className="font-display font-semibold mb-3 flex items-center gap-2"><Gift className="size-4 text-neon" /> Hamkor mukofotlari</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PERKS.map((p) => (
              <div key={p.name} className="rounded-lg border border-border bg-surface p-4 flex flex-col">
                <div className="text-xs text-muted-foreground">{p.partner}</div>
                <div className="font-semibold text-sm my-2 flex-1">{p.name}</div>
                <Button disabled={balance < p.cost} onClick={() => { setBalance((b) => b - p.cost); toast.success(`${p.name} olindi!`); }} className="w-full">
                  {p.cost} pt
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}