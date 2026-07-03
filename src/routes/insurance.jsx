import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card, Button, Badge } from "@/components/ui-bits";
import { useT } from "@/providers/app-providers";
import { Check, X, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/insurance")({
  head: () => ({ meta: [{ title: "Insurance — ExpatCareer AI" }] }),
  component: InsurancePage,
});

const PLANS = [
  { name: "TK Standard (DE)", price: "€450 / oy", medical: true, dental: true, vision: false, emergency: true, family: true, region: "Germany" },
  { name: "AOK Plus", price: "€420 / oy", medical: true, dental: false, vision: false, emergency: true, family: true, region: "Germany" },
  { name: "BUPA International", price: "$280 / oy", medical: true, dental: true, vision: true, emergency: true, family: false, region: "UK/USA" },
  { name: "Cigna Global", price: "$310 / oy", medical: true, dental: true, vision: true, emergency: true, family: true, region: "Global" },
  { name: "Samsung Life Korea", price: "₩180k / oy", medical: true, dental: false, vision: false, emergency: true, family: true, region: "Korea" },
];

function InsurancePage() {
  const { t } = useT();
  return (
    <div>
      <PageHeader badge="14 / 20  ·  INSURANCE" title={t("page.insurance.title")} subtitle={t("page.insurance.subtitle")} />
      <Card className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="text-xs text-muted-foreground uppercase tracking-wider">
            <tr className="border-b border-border">
              <th className="text-left p-3">Reja</th>
              <th className="text-left p-3">Narx</th>
              <th className="text-center p-3">Tibbiy</th>
              <th className="text-center p-3">Tish</th>
              <th className="text-center p-3">Ko'z</th>
              <th className="text-center p-3">Tez yordam</th>
              <th className="text-center p-3">Oila</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {PLANS.map((p) => (
              <tr key={p.name} className="border-b border-border/50 hover:bg-surface-2">
                <td className="p-3 font-medium"><div className="flex items-center gap-2"><ShieldCheck className="size-4 text-neon" />{p.name}</div><div className="text-xs text-muted-foreground">{p.region}</div></td>
                <td className="p-3"><Badge tone="emerald">{p.price}</Badge></td>
                <td className="p-3 text-center"><Tick on={p.medical} /></td>
                <td className="p-3 text-center"><Tick on={p.dental} /></td>
                <td className="p-3 text-center"><Tick on={p.vision} /></td>
                <td className="p-3 text-center"><Tick on={p.emergency} /></td>
                <td className="p-3 text-center"><Tick on={p.family} /></td>
                <td className="p-3"><Button>Tanlash</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Tick({ on }) {
  return on ? <Check className="size-4 text-emerald-glow mx-auto" /> : <X className="size-4 text-muted-foreground mx-auto" />;
}