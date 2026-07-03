import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card, Button, Badge } from "@/components/ui-bits";
import { useT } from "@/providers/app-providers";
import { toast } from "sonner";
import { Building } from "lucide-react";

export const Route = createFileRoute("/employer")({
  head: () => ({ meta: [{ title: "Employer Dashboard — ExpatCareer AI" }] }),
  component: EmployerPage,
});

const TALENTS = [
  { name: "Akmal Karimov", role: "Senior Frontend", years: 6, langs: ["EN B2", "DE A2"], match: 92, available: "2 oy" },
  { name: "Dr. Madina Rasulova", role: "Internal Medicine", years: 8, langs: ["EN C1", "DE B1"], match: 88, available: "6 oy" },
  { name: "Bekzod Mirzaev", role: "DevOps Engineer", years: 5, langs: ["EN B2"], match: 85, available: "1 oy" },
  { name: "Nilufar Yusupova", role: "Data Scientist", years: 4, langs: ["EN C1", "JA N3"], match: 81, available: "3 oy" },
  { name: "Sherzod Toshmatov", role: "Backend (Go)", years: 7, langs: ["EN C1"], match: 90, available: "Hozir" },
  { name: "Aziza Karimova", role: "Mathematics Teacher", years: 9, langs: ["EN C1"], match: 78, available: "4 oy" },
];

function EmployerPage() {
  const { t } = useT();
  return (
    <div>
      <PageHeader badge="13 / 20  ·  EMPLOYER MODE" title={t("page.employer.title")} subtitle={t("page.employer.subtitle")} />
      <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground"><Building className="size-4 text-neon" /> Korporativ HR rejimi — xalqaro kadrlar bazasi</div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TALENTS.map((t2, i) => (
          <Card key={i}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-display font-semibold">{t2.name}</div>
                <div className="text-xs text-muted-foreground">{t2.role}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold gradient-text">{t2.match}%</div>
                <div className="text-[10px] text-muted-foreground">match</div>
              </div>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground mb-3">
              <div>{t2.years} yil tajriba</div>
              <div>Mavjudligi: <span className="text-foreground">{t2.available}</span></div>
            </div>
            <div className="flex flex-wrap gap-1 mb-4">{t2.langs.map((l) => <Badge key={l}>{l}</Badge>)}</div>
            <Button className="w-full" onClick={() => toast.success(`${t2.name} ga taklif yuborildi`)}>{t("page.employer.invite")}</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
