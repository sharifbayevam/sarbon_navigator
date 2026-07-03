import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // TypeScript tiplari (as {messages...}) olib tashlandi
        const { messages, lang, country } = await request.json();
        
        const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!key) return new Response("Missing GOOGLE_GENERATIVE_AI_API_KEY", { status: 500 });
        
        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");
        
        const result = streamText({
          model,
          system: `You are Sarbon Mentor — a warm, practical career and migration coach for Uzbek-speaking professionals moving to ${country ?? "their target country"}. Reply concisely in language code ${lang ?? "uz-latn"} (uz-latn = Latin Uzbek, uz-cyrl = Cyrillic Uzbek, en = English). Cover: diploma recognition (Anabin/WES/ECFMG), CV/ATS, interviews, visa steps, language tests, taxes, housing, daily life. Always end with one concrete next step.`,
          messages: await convertToModelMessages(messages),
        });
        
        return result.toUIMessageStreamResponse();
      },
    },
  },
});