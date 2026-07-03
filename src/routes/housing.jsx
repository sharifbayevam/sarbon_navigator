import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card, Badge } from "@/components/ui-bits";
import { useT, useAppState, COUNTRY_META } from "@/providers/app-providers";
import { Building2, CheckSquare, MapPin } from "lucide-react";

export const Route = createFileRoute("/housing")({
  head: () => ({ meta: [{ title: "Housing — ExpatCareer AI" }] }),
  component: HousingPage,
});

const AREAS = {
  germany: [
    { name: "Berlin Prenzlauer Berg", rent: "€1,400 / 60m²", transit: "U-Bahn 12 min" },
    { name: "Munich Schwabing", rent: "€1,900 / 55m²", transit: "U6 18 min" },
    { name: "Hamburg Eimsbüttel", rent: "€1,300 / 60m²", transit: "S-Bahn 15 min" },
  ],
  usa: [
    { name: "Brooklyn, Williamsburg", rent: "$3,200 / 1BR", transit: "L Train 22 min" },
    { name: "SF SOMA", rent: "$3,800 / studio", transit: "MUNI 12 min" },
    { name: "Austin East Side", rent: "$2,100 / 1BR", transit: "Car 15 min" },
  ],
  korea: [
    { name: "Seoul Gangnam-gu", rent: "₩1.8M / 1room", transit: "Line 2  10 min" },
    { name: "Seoul Mapo", rent: "₩1.3M / 1room", transit: "Line 6  12 min" },
  ],
  uk: [
    { name: "London Shoreditch", rent: "£1,800 / 1BR", transit: "Overground 18 min" },
    { name: "Manchester Ancoats", rent: "£1,100 / 1BR", transit: "Tram 14 min" },
  ],
  japan: [
    { name: "Tokyo Setagaya", rent: "¥160k / 1K", transit: "Den-en-toshi 22 min" },
    { name: "Osaka Namba", rent: "¥110k / 1K", transit: "Midosuji 15 min" },
  ],
};

const CHECKS = [
  "Shartnoma davlat tilida (asl nusxa)",
  "Kafolat puli (Kaution / deposit) miqdori qonuniy chegarada",
  "Ijara bekor qilish shartlari yozilgan",
  "Kommunal to'lovlar (Nebenkosten) aniqlangan",
  "Anmeldung / address registration o'tkazish mumkin",
  "Uy egasi rasmiy reyestrda",
];

function HousingPage() {
  const { t } = useT();
  const { country } = useAppState();
  const areas = AREAS[country] ?? [];
  return (
    <div>
      <PageHeader badge="10 / 20  ·  HOUSING" title={t("page.housing.title")} subtitle={t("page.housing.subtitle")} />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-2 mb-4"><Building2 className="size-5 text-neon" /><h3 className="font-display text-lg font-semibold">{COUNTRY_META[country].flag} Tavsiya etilgan hududlar</h3></div>
          <div className="space-y-2">
            {areas.map((a) => (
              <div key={a.name} className="rounded-lg border border-border bg-surface p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm flex items-center gap-2"><MapPin className="size-3 text-neon" />{a.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{a.transit}</div>
                </div>
                <Badge tone="emerald">{a.rent}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-4"><CheckSquare className="size-5 text-neon" /><h3 className="font-display text-lg font-semibold">{t("page.housing.checklist")}</h3></div>
          <div className="space-y-2">
            {CHECKS.map((c, i) => (
              <label key={i} className="flex items-start gap-3 p-2 rounded-md hover:bg-surface-2 cursor-pointer">
                <input type="checkbox" className="mt-1 accent-[color:var(--neon)]" />
                <span className="text-sm">{c}</span>
              </label>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}