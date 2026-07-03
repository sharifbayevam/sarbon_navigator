import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dictionaries } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";

// ---------- Language ----------
const LangContext = createContext(null);

// ---------- App state (specialty + target country) ----------
const AppStateContext = createContext(null);

// ---------- Auth ----------
const AuthContext = createContext(null);

function readLS(key, fallback) {
  if (typeof window === "undefined") return fallback;
  return window.localStorage.getItem(key) || fallback;
}

export function AppProviders({ children }) {
  const [lang, setLangState] = useState("uz-latn");
  const [specialty, setSpecState] = useState("developer");
  const [country, setCountryState] = useState("germany");
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on client
  useEffect(() => {
    setLangState(readLS("lang", "uz-latn"));
    setSpecState(readLS("specialty", "developer"));
    setCountryState(readLS("country", "germany"));
  }, []);

  // Auth
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const setLang = (l) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("lang", l);
  };
  const setSpecialty = (s) => {
    setSpecState(s);
    if (typeof window !== "undefined") window.localStorage.setItem("specialty", s);
  };
  const setCountry = (c) => {
    setCountryState(c);
    if (typeof window !== "undefined") window.localStorage.setItem("country", c);
  };

  const t = useMemo(() => {
    return (key) => dictionaries[lang][key] ?? dictionaries["uz-latn"][key] ?? key;
  }, [lang]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      <AppStateContext.Provider value={{ specialty, country, setSpecialty, setCountry }}>
        <AuthContext.Provider value={{ user, session, loading, signOut }}>
          {children}
        </AuthContext.Provider>
      </AppStateContext.Provider>
    </LangContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useT outside LangContext");
  return ctx;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState outside provider");
  return ctx;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside provider");
  return ctx;
}

export const COUNTRY_META = {
  usa: { flag: "🇺🇸", key: "country.usa", gradient: "from-blue-500/30 to-red-500/30" },
  germany: { flag: "🇩🇪", key: "country.germany", gradient: "from-yellow-500/30 to-red-600/30" },
  korea: { flag: "🇰🇷", key: "country.korea", gradient: "from-blue-600/30 to-red-500/30" },
  uk: { flag: "🇬🇧", key: "country.uk", gradient: "from-blue-700/30 to-red-600/30" },
  japan: { flag: "🇯🇵", key: "country.japan", gradient: "from-red-500/30 to-rose-300/30" },
};

export const SPECIALTIES = ["doctor", "developer", "teacher", "engineer", "designer"];
export const COUNTRIES = ["usa", "germany", "korea", "uk", "japan"];
export const COUNTRY_TO_DB = {
  usa: "USA",
  germany: "Germany",
  korea: "South Korea",
  uk: "UK",
  japan: "Japan",
};
export const SPECIALTY_TO_DB = {
  doctor: "Doctor",
  developer: "Developer",
  teacher: "Teacher",
  engineer: "Developer",
  designer: "Developer",
};