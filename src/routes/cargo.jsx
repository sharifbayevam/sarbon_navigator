import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/AppShell";
import { Card, Badge } from "@/components/ui-bits";
import { useT, useAppState, COUNTRY_META } from "@/providers/app-providers";
import { Package, Truck, Plane, Ship } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/cargo")({
  head: () => ({ meta: [{ title: "Cargo — ExpatCareer AI" }] }),
  component: CargoPage,
});

const RATES = {
  usa: { air: 14, sea: 4, express: 22, days: [10, 45, 5] },
  germany: { air: 11, sea: 3, express: 18, days: [7, 30, 3] },
  korea: { air: 13, sea: 3.5, express: 20, days: [8, 35, 4] },
  uk: { air: 12, sea: 3.5, express: 19, days: [7, 32, 3] },
  japan: { air: 14, sea: 4, express: 22, days: [9, 38, 4] },
};

function CargoPage() {
  const { t } = useT();
  const { country } = useAppState();
  const [w, setW] = useState(25);
  const r = RATES[country];

  const options = useMemo(() => [
    { name: "Air Mail", icon: Plane, price: Math.round(w * r.air), days: r.days[0], color: "text-neon" },
    { name: "Sea Freight", icon: Ship, price: Math.round(w * r.sea), days: r.days[1], color: "text-emerald-glow" },
    { name: "Express", icon: Truck, price: Math.round(w * r.express), days: r.days[2], color: "text-warn" },
  ], [w, r]);

  const steps = ["Tashkent qabul qilindi", "Bojxonadan o'tdi", `${COUNTRY_META[country].flag} ga jo'natildi`, "Hubga yetib bordi", "Kuryerda", "Yetkazildi"];

  return (
    <div>
      <PageHeader badge="16 / 20  ·  CARGO" title={t("page.cargo.title")} subtitle={t("page.cargo.subtitle")} />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-display font-semibold mb-3 flex items-center gap-2"><Package className="size-4 text-neon" /> Narx kalkulyatori</h3>
          <label className="text-xs text-muted-foreground">{t("page.cargo.weight")}: <span className="text-foreground font-bold">{w} kg</span></label>
          <input type="range" min={1} max={200} value={w} onChange={(e) => setW(Number(e.target.value))} className="w-full accent-[color:var(--neon)] mt-2" />
          <div className="space-y-2 mt-4">
            {options.map((o) => (
              <div key={o.name} className="rounded-lg border border-border bg-surface p-3 flex items-center gap-3">
                <o.icon className={`size-5 ${o.color}`} />
                <div className="flex-1">
                  <div className="font-semibold text-sm">{o.name}</div>
                  <div className="text-xs text-muted-foreground">{o.days} kun</div>
                </div>
                <Badge tone="emerald">${o.price}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-display font-semibold mb-3">Kuzatuv: UZ-{country.toUpperCase()}-7421</h3>
          <div className="space-y-2">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className={`flex items-center gap-3 p-2 rounded-md ${i <= 3 ? "" : "opacity-40"}`}>
                <div className={`size-3 rounded-full ${i <= 3 ? "bg-neon shadow-[0_0_10px_var(--neon)]" : "bg-border"}`} />
                <div className="text-sm flex-1">{s}</div>
                {i <= 3 && <span className="text-[10px] text-muted-foreground">{["18.01","20.01","22.01","25.01"][i]}</span>}
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}