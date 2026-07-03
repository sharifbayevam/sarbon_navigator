import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/AppShell";
import { Card, Button, Textarea } from "@/components/ui-bits";
import { useT, useAppState } from "@/providers/app-providers";
import { Send, Sparkles, Bot, User } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/mentor")({
  head: () => ({ meta: [{ title: "AI Mentor — ExpatCareer AI" }] }),
  component: MentorPage,
});

function MentorPage() {
  const { t, lang } = useT();
  const { country } = useAppState();
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat", body: { lang, country: t(`country.${country}`) } }),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const submit = (text) => {
    if (!text.trim()) return;
    sendMessage({ text });
    setInput("");
  };

  const tasks = [
    { key: "page.mentor.task.cv", prompt: "Iltimos, rezyumemga qarang va xatolarni toping" },
    { key: "page.mentor.task.interview", prompt: "Frontend dasturchi uchun 5 ta intervyu savolini bering" },
    { key: "page.mentor.task.visa", prompt: "Mendagi mutaxassislik uchun maqsadli davlatga viza jarayonini tushuntiring" },
  ];

  return (
    <div>
      <PageHeader badge="07 / 20  ·  AI MENTOR" title={t("page.mentor.title")} subtitle={t("page.mentor.subtitle")} />
      <Card className="flex flex-col h-[70vh]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin space-y-4 pr-2 mb-4">
          {messages.length === 0 && (
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-full bg-neon/15 neon-border flex items-center justify-center shrink-0"><Bot className="size-4 text-neon" /></div>
              <div className="space-y-3">
                <div className="text-sm">{t("page.mentor.greeting")}</div>
                <div className="flex flex-wrap gap-2">
                  {tasks.map((t2) => (
                    <button key={t2.key} onClick={() => submit(t2.prompt)} className="text-xs px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-neon hover:text-neon transition-colors">
                      <Sparkles className="size-3 inline mr-1" /> {t(t2.key)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {messages.map((m) => {
            const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
            const isUser = m.role === "user";
            return (
              <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
                <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? "bg-neon" : "bg-neon/15 neon-border"}`}>
                  {isUser ? <User className="size-4 text-primary-foreground" /> : <Bot className="size-4 text-neon" />}
                </div>
                <div className={`max-w-[80%] text-sm whitespace-pre-wrap ${isUser ? "bg-neon text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2" : ""}`}>
                  {text}
                </div>
              </motion.div>
            );
          })}
          {status === "submitted" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><div className="size-2 bg-neon rounded-full animate-pulse" /> AI fikr yuritmoqda...</div>
          )}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); submit(input); }} className="flex gap-2 items-end">
          <Textarea rows={2} value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("page.mentor.placeholder")} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(input); } }} />
          <Button type="submit" disabled={!input.trim() || status === "streaming" || status === "submitted"}>
            <Send className="size-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}