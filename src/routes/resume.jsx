import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { Card, Button, Textarea, Badge } from "@/components/ui-bits";
import { useT, useAppState, COUNTRY_META } from "@/providers/app-providers";
import { transformResume } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Sparkles, FileText, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/resume")({
  head: () => ({ meta: [{ title: "AI Resume Transformer — ExpatCareer AI" }] }),
  component: ResumePage,
});

const SAMPLE = `Ism: Akmal Karimov
Tug'ilgan kun: 15.03.1990
Manzil: Toshkent sh., Mirzo Ulug'bek t.
Tel: +998 90 123 45 67

TA'LIM:
Toshkent Axborot Texnologiyalari Universiteti (2008-2012)
Bakalavr, Dasturiy injiniring

ISH TAJRIBASI:
2018-hozir — IT Park, Senior dasturchi
- React va Node.js loyihalari ustida ishlash
- Jamoa boshqarish (5 kishi)

2014-2018 — UzMobile, dasturchi
- Veb saytlar ishlab chiqish

KO'NIKMALAR: JavaScript, React, Node.js, SQL, ingliz tili (B2)`;

function ResumePage() {
  const { t, lang } = useT();
  const { country } = useAppState();
  const fn = useServerFn(transformResume);
  const [src, setSrc] = useState(SAMPLE);
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setOut("");
    try {
      const r = await fn({ data: { source: src, country: t(`country.${country}`), lang } });
      setOut(r.text);
    } catch (e) {
      toast.error(e.message || "Xato");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader badge="03 / 20  ·  AI TRANSFORMER" title={t("page.resume.title")} subtitle={t("page.resume.subtitle")} />
      <div className="flex items-center justify-center gap-4 mb-4">
        <Badge tone="muted">UZ → {COUNTRY_META[country].flag} {t(`country.${country}`)}</Badge>
        <Button onClick={run} disabled={loading}>
          <Sparkles className="size-4" />
          {loading ? t("common.loading") : t("page.resume.transform")}
        </Button>
      </div>
      <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
        <Card className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">{t("page.resume.source")}</h3>
          </div>
          <Textarea value={src} onChange={(e) => setSrc(e.target.value)} rows={22} placeholder={t("page.resume.placeholder")} className="flex-1 font-mono text-xs" />
        </Card>

        <div className="hidden lg:flex items-center justify-center">
          <div className="size-12 rounded-full bg-neon/10 neon-border flex items-center justify-center">
            <ArrowRight className="size-5 text-neon" />
          </div>
        </div>

        <Card className="flex flex-col neon-border">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="size-4 text-neon" />
            <h3 className="text-sm font-semibold gradient-text">{t("page.resume.target")}</h3>
          </div>
          <div className="flex-1 bg-surface rounded-lg p-4 overflow-auto scrollbar-thin min-h-[400px]">
            {loading && <div className="text-sm text-muted-foreground animate-pulse">AI {t("common.loading")}</div>}
            {!loading && !out && <div className="text-sm text-muted-foreground">AI tomonidan moslashtirilgan rezyume bu yerda paydo bo'ladi</div>}
            {out && <pre className="text-xs whitespace-pre-wrap font-mono">{out}</pre>}
          </div>
        </Card>
      </div>
    </div>
  );
}