import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { useT, useAppState, COUNTRIES, COUNTRY_META } from "@/providers/app-providers";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sarban - platform" },
      { name: "description", content: "Chet elga ko'chayotgan mutaxassislar uchun premium karyera platformasi." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useT();
  const { setCountry } = useAppState();
  return (
    <div>
      <PageHeader badge="01 / 20  ·  ONBOARDING HUB" title={t("page.onboarding.title")} subtitle={t("page.onboarding.subtitle")} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
        {COUNTRIES.map((c, i) => {
          const meta = COUNTRY_META[c];
          return (
            <motion.button
              key={c}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => setCountry(c)}
              className={`relative overflow-hidden glass neon-border rounded-2xl p-6 text-left group bg-gradient-to-br ${meta.gradient}`}
            >
              <div className="text-6xl mb-3">{meta.flag}</div>
              <div className="font-display text-xl font-semibold mb-1">{t(`country.${c}`)}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {t("common.start")} <ArrowRight className="size-3" />
              </div>
              <div className="absolute -top-10 -right-10 size-32 rounded-full bg-neon/10 blur-3xl" />
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { n: "20", l: "Interfaol modul" },
          { n: "5", l: "Maqsadli davlat" },
          { n: "AI", l: "Lovable AI mentor" },
        ].map((s) => (
          <div key={s.l} className="glass rounded-xl p-6 text-center">
            <div className="font-display text-4xl font-bold gradient-text mb-1">{s.n}</div>
            <div className="text-sm text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/diploma" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-neon text-primary-foreground font-medium neon-glow">
          <Sparkles className="size-4" /> {t("page.onboarding.cta")}
        </Link>
      </div>
    </div>
  );
}