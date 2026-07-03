import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { Card, Button, Textarea } from "@/components/ui-bits";
import { useT } from "@/providers/app-providers";
import { translateJargon } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Languages, Sparkles } from "lucide-react";

export const Route = createFileRoute("/jargon")({
  head: () => ({ meta: [{ title: "Jargon Translator — ExpatCareer AI" }] }),
  component: JargonPage,
});

const SAMPLE = "The applicant hereby acknowledges that the residence permit issued pursuant to §18b AufenthG is subject to revocation if the employment relationship constituting the basis for issuance is terminated prior to the expiration of the permit's validity period.";

function JargonPage() {
  const { t, lang } = useT();
  const fn = useServerFn(translateJargon);
  const [src, setSrc] = useState(SAMPLE);
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const r = await fn({ data: { text: src, lang } });
      setOut(r.text);
    } catch (e) { 
      toast.error(e.message || "Xato"); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div>
      <PageHeader badge="11 / 20  ·  JARGON DECODER" title={t("page.jargon.title")} subtitle={t("page.jargon.subtitle")} />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><Languages className="size-4" /> {t("page.jargon.input")}</h3>
          <Textarea rows={10} value={src} onChange={(e) => setSrc(e.target.value)} />
          <Button onClick={run} disabled={loading} className="mt-3 w-full">
            <Sparkles className="size-4" /> {loading ? t("common.loading") : t("page.jargon.translate")}
          </Button>
        </Card>
        <Card className="neon-border">
          <h3 className="text-sm font-semibold mb-2 gradient-text">{t("page.jargon.output")}</h3>
          <div className="bg-surface rounded-lg p-4 min-h-[260px] text-sm whitespace-pre-wrap">
            {loading && <div className="text-muted-foreground animate-pulse">AI tushuntirmoqda...</div>}
            {!loading && !out && <div className="text-muted-foreground">Murakkab matnni AI sodda tilga aylantiradi</div>}
            {out}
          </div>
        </Card>
      </div>
    </div>
  );
}