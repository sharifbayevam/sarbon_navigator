import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card, Button, Badge } from "@/components/ui-bits";
import { useT } from "@/providers/app-providers";
import { Stamp, Star } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/translators")({
  head: () => ({ meta: [{ title: "Translators — ExpatCareer AI" }] }),
  component: TranslatorsPage,
});

const LIST = [
  { name: "Dilshod Yusupov", langs: ["UZ→DE", "UZ→EN"], rating: 4.9, price: "$25 / sahifa", apostille: true },
  { name: "Sevara Tashkentova", langs: ["UZ→EN", "RU→EN"], rating: 4.8, price: "$22 / sahifa", apostille: true },
  { name: "Berlin Notar Büro", langs: ["UZ→DE", "RU→DE"], rating: 4.7, price: "€40 / sahifa", apostille: true },
  { name: "Seoul K-Doc Services", langs: ["UZ→KO", "EN→KO"], rating: 4.6, price: "₩30,000 / sahifa", apostille: false },
  { name: "Tokyo Bilingual Office", langs: ["UZ→JA", "EN→JA"], rating: 4.5, price: "¥4,000 / sahifa", apostille: true },
  { name: "London Apostille Hub", langs: ["UZ→EN"], rating: 5.0, price: "£35 / sahifa", apostille: true },
];

function TranslatorsPage() {
  const { t } = useT();
  return (
    <div>
      <PageHeader badge="12 / 20  ·  MARKETPLACE" title={t("page.translators.title")} subtitle={t("page.translators.subtitle")} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {LIST.map((p, i) => (
          <Card key={i}>
            <div className="flex items-center gap-3 mb-3">
              <div className="size-12 rounded-full bg-gradient-to-br from-neon to-emerald-glow flex items-center justify-center font-display font-bold text-primary-foreground">{p.name[0]}</div>
              <div className="flex-1">
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs flex items-center gap-1 text-warn"><Star className="size-3 fill-current" /> {p.rating}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">{p.langs.map((l) => <Badge key={l}>{l}</Badge>)}</div>
            <div className="text-sm mb-2">{p.price}</div>
            {p.apostille && <Badge tone="emerald"><Stamp className="size-3" /> Apostil</Badge>}
            <Button className="w-full mt-4" onClick={() => toast.success(`${p.name} ga buyurtma yuborildi`)}>{t("page.translators.order")}</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}