import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { Card, Button, Textarea, Badge } from "@/components/ui-bits";
import { useT } from "@/providers/app-providers";
import { analyzeSkillGap } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Target, BookOpen, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/skills")({
  head: () => ({ meta: [{ title: "Skill Gap — ExpatCareer AI" }] }),
  component: SkillsPage,
});

function SkillsPage() {
  const { t, lang } = useT();
  const fn = useServerFn(analyzeSkillGap);
  const [resume, setResume] = useState("React, JavaScript, Node.js, 4 years experience, English B2");
  const [job, setJob] = useState("Required: React, TypeScript, AWS, Kubernetes, German B1, 5+ years");
  const [loading, setLoading] = useState(false);
  const [r, setR] = useState(null);

  const run = async () => {
    setLoading(true);
    try {
      const x = await fn({ data: { resume, jobRequirements: job, lang } });
      setR(x);
    } catch (e) {
      toast.error(e.message || "Xato");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div>
      <PageHeader badge="05 / 20  ·  SKILL GAP" title={t("page.skills.title")} subtitle={t("page.skills.subtitle")} />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold mb-2">Sizning ko'nikmalaringiz</h3>
          <Textarea rows={6} value={resume} onChange={(e) => setResume(e.target.value)} />
          <h3 className="text-sm font-semibold mt-4 mb-2">Vakansiya talablari</h3>
          <Textarea rows={6} value={job} onChange={(e) => setJob(e.target.value)} />
          <Button onClick={run} disabled={loading} className="mt-4 w-full">
            <Target className="size-4" /> {loading ? t("common.loading") : t("common.tryAi")}
          </Button>
        </Card>
        <Card>
          <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2"><Target className="size-5 text-warn" /> {t("page.skills.missing")}</h3>
          {!r && <div className="text-sm text-muted-foreground py-8 text-center">AI tahlilini kuting</div>}
          {r && (
            <>
              <div className="space-y-3 mb-6">
                {r.missing.map((m, i) => (
                  <div key={i} className="rounded-lg border border-border bg-surface p-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-sm">{m.name}</div>
                      <Badge tone={m.priority === "high" ? "danger" : m.priority === "medium" ? "warn" : "muted"}>{m.priority}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">{m.why}</div>
                    <a target="_blank" rel="noreferrer" href={`https://www.coursera.org/search?query=${encodeURIComponent(m.name)}`} className="text-xs text-neon hover:underline inline-flex items-center gap-1">
                      <BookOpen className="size-3" /> {t("page.skills.learn")} (Coursera) <ExternalLink className="size-3" />
                    </a>
                  </div>
                ))}
              </div>
              {r.have?.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Sizda bor:</div>
                  <div className="flex flex-wrap gap-1">{r.have.map((h) => <Badge key={h} tone="emerald">{h}</Badge>)}</div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}