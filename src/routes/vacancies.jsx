import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/AppShell";
import { Card, Button, Badge, Input, Textarea } from "@/components/ui-bits";
import { useT, useAppState, COUNTRY_TO_DB, SPECIALTY_TO_DB, COUNTRY_META } from "@/providers/app-providers";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, MapPin, DollarSign, X } from "lucide-react";

export const Route = createFileRoute("/vacancies")({
  head: () => ({ meta: [{ title: "Vacancies — ExpatCareer AI" }] }),
  component: VacanciesPage,
});

function VacanciesPage() {
  const { t } = useT();
  const { country, specialty } = useAppState();
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("all");
  const [activeVacancy, setActiveVacancy] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("vacancies").select("*").order("match_score", { ascending: false });
      setRows(data ?? []);
    })();
  }, []);

  const filtered = rows.filter((r) => {
    if (filter === "country") return r.country === COUNTRY_TO_DB[country];
    if (filter === "specialty") return r.specialty === SPECIALTY_TO_DB[specialty];
    return true;
  });

  return (
    <div>
      <PageHeader badge="06 / 20  ·  GLOBAL JOB MATCHER" title={t("page.vacancies.title")} subtitle={t("page.vacancies.subtitle")} />
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "country", "specialty"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${filter === f ? "bg-neon text-primary-foreground border-neon" : "bg-surface border-border text-muted-foreground hover:text-foreground"}`}>
            {f === "all" ? "Hammasi" : f === "country" ? COUNTRY_META[country].flag + " " + t(`country.${country}`) : t(`specialty.${specialty}`)}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((v, i) => (
          <motion.div key={v.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="relative overflow-hidden h-full flex flex-col">
              <MatchRing score={v.match_score} />
              <Briefcase className="size-5 text-neon mb-2" />
              <h3 className="font-display font-semibold mb-1 pr-16">{v.title}</h3>
              <div className="text-sm text-muted-foreground mb-3">{v.company}</div>
              <div className="space-y-1.5 text-xs text-muted-foreground mb-4 flex-1">
                <div className="flex items-center gap-1.5"><MapPin className="size-3" /> {v.country}</div>
                {v.salary_range && <div className="flex items-center gap-1.5"><DollarSign className="size-3" /> {v.salary_range}</div>}
                {v.requirements && <div className="line-clamp-2 pt-1">{v.requirements}</div>}
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="muted">{v.specialty}</Badge>
                <div className="flex-1" />
                <Button onClick={() => setActiveVacancy(v)}>{t("page.vacancies.apply")}</Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeVacancy && (
          <ApplyModal vacancy={activeVacancy} onClose={() => setActiveVacancy(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ApplyModal({ vacancy, onClose }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      setStatus("error");
      setErrorMsg("Murojaat yuborish uchun avval hisobingizga kiring.");
      return;
    }

    const { error } = await supabase.from("applications").insert({
      user_id: user.id,
      vacancy_id: vacancy.id,
      full_name: fullName,
      email,
      cover_note: coverNote,
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }

    setStatus("done");
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="size-5" />
        </button>

        {status === "done" ? (
          <div className="py-6 text-center">
            <div className="text-lg font-semibold mb-2">Arizangiz yuborildi!</div>
            <div className="text-sm text-muted-foreground mb-6">
              {vacancy.company} kompaniyasiga bo'lgan murojaatingiz qabul qilindi.
            </div>
            <Button onClick={onClose}>Yopish</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="font-display font-semibold text-lg mb-1">{vacancy.title}</h3>
            <div className="text-sm text-muted-foreground mb-4">{vacancy.company}</div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">To'liq ism</label>
                <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ismingiz" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Qisqa xat (ixtiyoriy)</label>
                <Textarea rows={4} value={coverNote} onChange={(e) => setCoverNote(e.target.value)} placeholder="Nima uchun siz mos nomzodsiz?" />
              </div>
            </div>

            {status === "error" && (
              <div className="text-xs text-red-400 mt-3">{errorMsg}</div>
            )}

            <div className="flex gap-2 mt-5">
              <Button type="button" onClick={onClose} className="flex-1 !bg-surface-2 !text-foreground">
                Bekor qilish
              </Button>
              <Button type="submit" disabled={status === "sending"} className="flex-1">
                {status === "sending" ? "Yuborilmoqda..." : "Yuborish"}
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

function MatchRing({ score }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;
  const color = score >= 85 ? "var(--emerald-glow)" : score >= 70 ? "var(--neon)" : "var(--warn)";
  return (
    <div className="absolute top-4 right-4">
      <svg width="56" height="56">
        <circle cx="28" cy="28" r={r} stroke="var(--surface-2)" strokeWidth="4" fill="none" />
        <circle cx="28" cy="28" r={r} stroke={color} strokeWidth="4" fill="none" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 28 28)" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold" style={{ color }}>{score}%</div>
    </div>
  );
}