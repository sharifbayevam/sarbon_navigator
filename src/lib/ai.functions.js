import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

function gateway() {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!key) throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
  return createLovableAiGatewayProvider(key);
}

const ResumeInput = z.object({
  source: z.string().min(20).max(8000),
  country: z.string().min(1).max(60),
  lang: z.string().min(2).max(10),
});

export const transformResume = createServerFn({ method: "POST" })
  .inputValidator((d) => ResumeInput.parse(d))
  .handler(async ({ data }) => {
    const model = gateway()("gemini-2.0-flash")
;
    const { text } = await generateText({
      model,
      system: `You are an expert international resume coach. Rewrite the user's resume to match the standard for ${data.country}. Use the language code ${data.lang} (uz-latn = Latin Uzbek, uz-cyrl = Cyrillic Uzbek, en = English) for the output. Keep it ATS-friendly, concise, achievement-focused. For Germany: photo-less Lebenslauf style with clear sections. For USA: strict 1-page, action verbs, quantified results. For UK/Korea/Japan: adapt accordingly. Return only the formatted resume text, no commentary.`,
      prompt: data.source,
    });
    return { text };
  });

const JargonInput = z.object({ text: z.string().min(3).max(3000), lang: z.string().max(10) });
export const translateJargon = createServerFn({ method: "POST" })
  .inputValidator((d) => JargonInput.parse(d))
  .handler(async ({ data }) => {
    const model = gateway()("gemini-2.0-flash")
;
    const { text } = await generateText({
      model,
      system: `You are a bureaucracy decoder. Take complex legal/government text and explain it in extremely simple, friendly terms a migrant could understand. Output language: ${data.lang}. Keep it to 3-6 short sentences with concrete examples.`,
      prompt: data.text,
    });
    return { text };
  });

const SkillInput = z.object({
  resume: z.string().min(10).max(4000),
  jobRequirements: z.string().min(5).max(2000),
  lang: z.string().max(10),
});
export const analyzeSkillGap = createServerFn({ method: "POST" })
  .inputValidator((d) => SkillInput.parse(d))
  .handler(async ({ data }) => {
    const model = gateway()("gemini-2.0-flash")
;
    const { text } = await generateText({
      model,
      system: `You analyze a candidate's resume against a job posting and list the missing skills. Output language: ${data.lang}. Return STRICT JSON only: {"missing":[{"name":"skill","priority":"high|medium|low","why":"short reason"}], "have":["skill1","skill2"]}. Up to 6 missing.`,
      prompt: `RESUME:\n${data.resume}\n\nJOB:\n${data.jobRequirements}`,
    });
    try {
      const cleaned = text.replace(/^```json\s*|\s*```$/g, "").trim();
      return JSON.parse(cleaned);
    } catch {
      return { missing: [], have: [], raw: text };
    }
  });

const DiplomaInput = z.object({
  university: z.string().min(2).max(200),
  degree: z.string().min(2).max(200),
  country: z.string().min(2).max(60),
  lang: z.string().max(10),
});
export const analyzeDiploma = createServerFn({ method: "POST" })
  .inputValidator((d) => DiplomaInput.parse(d))
  .handler(async ({ data }) => {
    const model = gateway()("gemini-2.0-flash")
;
    const { text } = await generateText({
      model,
      system: `You assess foreign diploma recognition (Anabin/WES/ECFMG/NARIC). Output language: ${data.lang}. Return STRICT JSON: {"status":"green|yellow|red","title":"short title","reason":"1-2 sentences","exams":["exam1","exam2"],"agency":"name of recognition body"}. Be realistic.`,
      prompt: `University: ${data.university}\nDegree: ${data.degree}\nTarget country: ${data.country}`,
    });
    try {
      const cleaned = text.replace(/^```json\s*|\s*```$/g, "").trim();
      return JSON.parse(cleaned);
    } catch {
      return { status: "yellow", title: "Manual review needed", reason: text.slice(0, 200), exams: [], agency: "Recognition office" };
    }
  });