import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  Home, GraduationCap, FileText, Gauge, Target, Briefcase, MessageSquare,
  Plane, Calculator, Building2, Languages, Stamp, Building, ShieldCheck,
  Wallet, Package, Receipt, Users, Trophy, MessagesSquare, Menu, X, LogIn, LogOut, Globe2,
} from "lucide-react";
import { useT, useAppState, useAuth, COUNTRIES, SPECIALTIES, COUNTRY_META } from "@/providers/app-providers";
import { LANGS } from "@/i18n";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { to: "/", icon: Home, key: "page.onboarding.title" },
  { to: "/diploma", icon: GraduationCap, key: "page.diploma.title" },
  { to: "/resume", icon: FileText, key: "page.resume.title" },
  { to: "/ats", icon: Gauge, key: "page.ats.title" },
  { to: "/skills", icon: Target, key: "page.skills.title" },
  { to: "/vacancies", icon: Briefcase, key: "page.vacancies.title" },
  { to: "/mentor", icon: MessageSquare, key: "page.mentor.title" },
  { to: "/visa", icon: Plane, key: "page.visa.title" },
  { to: "/calculator", icon: Calculator, key: "page.calc.title" },
  { to: "/housing", icon: Building2, key: "page.housing.title" },
  { to: "/jargon", icon: Languages, key: "page.jargon.title" },
  { to: "/translators", icon: Stamp, key: "page.translators.title" },
  { to: "/employer", icon: Building, key: "page.employer.title" },
  { to: "/insurance", icon: ShieldCheck, key: "page.insurance.title" },
  { to: "/wallet", icon: Wallet, key: "page.wallet.title" },
  { to: "/cargo", icon: Package, key: "page.cargo.title" },
  { to: "/freelance", icon: Receipt, key: "page.freelance.title" },
  { to: "/family", icon: Users, key: "page.family.title" },
  { to: "/rewards", icon: Trophy, key: "page.rewards.title" },
  { to: "/forum", icon: MessagesSquare, key: "page.forum.title" },
];

export function AppShell({ children }) {
  const { t, lang, setLang } = useT();
  const { specialty, country, setSpecialty, setCountry } = useAppState();
  const { user, signOut } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="flex items-center gap-3 px-4 lg:px-6 h-16">
          <button
            className="lg:hidden p-2 -ml-2 rounded-md hover:bg-surface-2"
            onClick={() => setOpen((o) => !o)}
            aria-label="menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <Link to="/" className="flex items-center gap-2 mr-2 group">
            <div className="size-9 rounded-lg neon-border flex items-center justify-center bg-surface">
              <Globe2 className="size-5 text-neon" />
            </div>
            <div className="hidden sm:block">
              <div className="font-display text-base font-semibold gradient-text leading-none">
                Sarban AI
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5 leading-none">
                TalentBridge Platform
              </div>
            </div>
          </Link>

          <div className="flex-1" />

          {/* Specialty selector */}
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="hidden md:block bg-surface border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-neon/50"
            aria-label={t("nav.specialty")}
          >
            {SPECIALTIES.map((s) => (
              <option key={s} value={s}>{t(`specialty.${s}`)}</option>
            ))}
          </select>

          {/* Country selector */}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="hidden md:block bg-surface border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-neon/50"
            aria-label={t("nav.country")}
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {COUNTRY_META[c].flag} {t(`country.${c}`)}
              </option>
            ))}
          </select>

          {/* Language switcher */}
          <div className="flex rounded-md border border-border overflow-hidden bg-surface">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  lang === l.code
                    ? "bg-neon text-primary-foreground"
                    : "hover:bg-surface-2 text-muted-foreground"
                }`}
              >
                {l.short}
              </button>
            ))}
          </div>

          {user ? (
            <button
              onClick={() => signOut()}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md hover:bg-surface-2 text-muted-foreground"
            >
              <LogOut className="size-4" /> {t("nav.logout")}
            </button>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md bg-neon text-primary-foreground font-medium hover:emerald-glow transition-shadow"
            >
              <LogIn className="size-4" /> {t("nav.login")}
            </Link>
          )}
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <AnimatePresence>
          {(open || true) && (
            <motion.aside
              initial={false}
              className={`fixed lg:sticky lg:top-16 top-16 bottom-0 left-0 z-30 w-64 glass border-r border-border/50 overflow-y-auto scrollbar-thin transition-transform lg:translate-x-0 ${
                open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
              }`}
              style={{ height: "calc(100vh - 4rem)" }}
            >
              <nav className="p-3 space-y-0.5">
                {NAV.map((item, i) => {
                  const Icon = item.icon;
                  const active = pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all relative group ${
                        active
                          ? "bg-neon/10 text-neon neon-border"
                          : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
                      }`}
                    >
                      <span className="text-[10px] font-mono w-5 text-neon/60">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{t(item.key)}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        <main className="flex-1 min-w-0 p-4 lg:p-8 max-w-full">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, badge }) {
  return (
    <div className="mb-8">
      {badge && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass neon-border text-xs text-neon mb-4 font-mono">
          <span className="size-1.5 rounded-full bg-neon animate-pulse" />
          {badge}
        </div>
      )}
      <h1 className="font-display text-3xl lg:text-4xl font-bold gradient-text mb-2">{title}</h1>
      {subtitle && <p className="text-muted-foreground max-w-2xl">{subtitle}</p>}
    </div>
  );
}