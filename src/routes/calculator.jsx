import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui-bits";
import { useT, useAppState, COUNTRY_META } from "@/providers/app-providers";

export const Route = createFileRoute("/calculator")({
  head: () => ({ meta: [{ title: "Tax Calculator — ExpatCareer AI" }] }),
  component: CalcPage,
});

// rough effective tax + social charges (yearly), for demo only
const RATES = {
  usa: { tax: 0.24, social: 0.0765, currency: "$", defaultGross: 120000 },
  germany: { tax: 0.32, social: 0.20, currency: "€", defaultGross: 80000 },
  korea: { tax: 0.18, social: 0.09, currency: "₩", defaultGross: 70000000 },
  uk: { tax: 0.28, social: 0.12, currency: "£", defaultGross: 70000 },
  japan: { tax: 0.20, social: 0.15, currency: "¥", defaultGross: 9000000 },
};

function CalcPage() {
  const { t } = useT();
  const { country } = useAppState();
  const r = RATES[country];
  const [gross, setGross] = useState(r.defaultGross);

  const data = useMemo(() => {
    const tax = Math.round(gross * r.tax);
    const social = Math.round(gross * r.social);
    const net = gross - tax - social;
    return { tax, social, net };
  }, [gross, r]);

  const chartData = [
    { name: t("page.calc.net"), value: data.net, color: "var(--emerald-glow)" },
    { name: t("page.calc.tax"), value: data.tax, color: "var(--danger)" },
    { name: t("page.calc.social"), value: data.social, color: "var(--warn)" },
  ];

  return (
    <div>
      <PageHeader badge="09 / 20  ·  SALARY · TAX" title={t("page.calc.title")} subtitle={t("page.calc.subtitle")} />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="text-sm text-muted-foreground mb-1">{COUNTRY_META[country].flag} {t(`country.${country}`)}</div>
          <label className="text-xs text-muted-foreground">{t("page.calc.gross")}</label>
          <div className="font-display text-4xl font-bold my-2">{r.currency}{gross.toLocaleString()}</div>
          <input type="range" min={r.defaultGross * 0.2} max={r.defaultGross * 3} step={r.defaultGross / 100} value={gross} onChange={(e) => setGross(Number(e.target.value))} className="w-full accent-[color:var(--neon)]" />
          <div className="grid grid-cols-3 gap-3 mt-6">
            <Stat label={t("page.calc.net")} value={`${r.currency}${data.net.toLocaleString()}`} color="text-emerald-glow" />
            <Stat label={t("page.calc.tax")} value={`${r.currency}${data.tax.toLocaleString()}`} color="text-danger" />
            <Stat label={t("page.calc.social")} value={`${r.currency}${data.social.toLocaleString()}`} color="text-warn" />
          </div>
        </Card>
        <Card>
          <h3 className="font-display text-lg font-semibold mb-2">Yillik taqsimot</h3>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chartData} dataKey="value" innerRadius={70} outerRadius={120} paddingAngle={3}>
                  {chartData.map((c) => <Cell key={c.name} fill={c.color} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs">
            {chartData.map((c) => <div key={c.name} className="flex items-center gap-1.5"><div className="size-2 rounded-full" style={{ background: c.color }} /> {c.name}</div>)}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="rounded-lg bg-surface p-3 border border-border">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`font-display text-lg font-semibold ${color}`}>{value}</div>
    </div>
  );
}