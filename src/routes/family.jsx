import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { Card, Badge } from "@/components/ui-bits";
import { useT, useAppState, COUNTRY_META } from "@/providers/app-providers";
import { School, MapPin, Syringe, Check } from "lucide-react";

export const Route = createFileRoute("/family")({
  head: () => ({ meta: [{ title: "Family — ExpatCareer AI" }] }),
  component: FamilyPage,
});

const SCHOOLS = {
  germany: [
    { name: "Berlin Bilingual Grundschule", type: "Davlat", dist: "1.2 km", lang: "DE / EN" },
    { name: "Phorms International", type: "Xususiy", dist: "2.5 km", lang: "EN" },
    { name: "Kita Sonnenblume", type: "Bog'cha", dist: "0.6 km", lang: "DE" },
  ],
  usa: [
    { name: "PS 84 Brooklyn", type: "Public", dist: "0.8 km", lang: "EN" },
    { name: "International School NY", type: "Private", dist: "3.1 km", lang: "EN / Spanish" },
  ],
  korea: [{ name: "Seoul Foreign School", type: "International", dist: "4 km", lang: "EN / KO" }],
  uk: [{ name: "Hampstead Primary", type: "State", dist: "1.5 km", lang: "EN" }],
  japan: [{ name: "Tokyo International School", type: "International", dist: "2.2 km", lang: "EN / JA" }],
};

const VAX = ["MMR (qizamiq)", "Polio", "Tetanus", "Hepatitis B", "Tuberkulez (BCG)", "Varicella"];

function FamilyPage() {
  const { t } = useT();
  const { country } = useAppState();
  const [done, setDone] = useState(["MMR (qizamiq)", "Polio"]);
  const toggle = (v) => setDone((d) => d.includes(v) ? d.filter((x) => x !== v) : [...d, v]);
  const schools = SCHOOLS[country] ?? [];

  return (
    <div>
      <PageHeader badge="18 / 20  ·  EXPAT FAMILY" title={t("page.family.title")} subtitle={t("page.family.subtitle")} />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-display font-semibold mb-3 flex items-center gap-2"><School className="size-4 text-neon" /> {COUNTRY_META[country].flag} Atrofdagi maktab/bog'chalar</h3>
          <div className="space-y-2">
            {schools.map((s) => (
              <div key={s.name} className="rounded-lg border border-border bg-surface p-3">
                <div className="font-semibold text-sm">{s.name}</div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="size-3" /> {s.dist}</span>
                  <Badge>{s.type}</Badge>
                  <Badge tone="emerald">{s.lang}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-display font-semibold mb-3 flex items-center gap-2"><Syringe className="size-4 text-neon" /> {t("page.family.vaccines")}</h3>
          <div className="space-y-2">
            {VAX.map((v) => {
              const on = done.includes(v);
              return (
                <button key={v} onClick={() => toggle(v)} className={`w-full flex items-center gap-3 p-2.5 rounded-lg border transition-all ${on ? "bg-emerald-glow/10 border-emerald-glow/30" : "bg-surface border-border hover:border-neon/30"}`}>
                  <div className={`size-5 rounded flex items-center justify-center ${on ? "bg-emerald-glow text-primary-foreground" : "border border-border"}`}>{on && <Check className="size-3" />}</div>
                  <span className={`text-sm ${on ? "line-through text-muted-foreground" : ""}`}>{v}</span>
                </button>
              );
            })}
          </div>
          <div className="text-xs text-muted-foreground mt-4">Bajarildi: {done.length} / {VAX.length}</div>
        </Card>
      </div>
    </div>
  );
}