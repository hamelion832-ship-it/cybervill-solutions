import { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Sparkles, Send, RefreshCw, Maximize, Monitor, Tablet, Smartphone,
  Download, Mail, CalendarDays, Settings, RotateCcw, Loader2, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import KnowledgeRulesDialog, { Rule, STORAGE_KEY } from "./KnowledgeRulesDialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_STORAGE = "cyberville-idea-chat";
const CODE_STORAGE = "cyberville-idea-code";

const chips = [
  "📊 Дашборд мониторинга",
  "🚜 Телеметрия техники",
  "📈 План-факт анализ",
];

const defaultHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;background:#f8fafc;display:flex;align-items:center;justify-content:center;min-height:100vh;color:#334155}
.card{background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.08);padding:48px;text-align:center;max-width:420px}
h2{font-size:1.5rem;margin-bottom:12px}
p{color:#64748b;margin-bottom:24px}
.bar-wrap{display:flex;gap:8px;align-items:flex-end;justify-content:center;height:80px;margin-bottom:16px}
.bar{width:28px;border-radius:6px 6px 0 0;background:linear-gradient(180deg,#FF6B35,#ff914d)}
.label{font-size:.7rem;color:#94a3b8;margin-top:4px}
</style>
</head>
<body>
<div class="card">
<h2>✨ Ваше демо появится здесь</h2>
<p>Опишите идею в чате слева — ИИ создаст интерактивный прототип</p>
<div class="bar-wrap">
<div><div class="bar" style="height:40px"></div><div class="label">Пн</div></div>
<div><div class="bar" style="height:60px"></div><div class="label">Вт</div></div>
<div><div class="bar" style="height:35px"></div><div class="label">Ср</div></div>
<div><div class="bar" style="height:70px"></div><div class="label">Чт</div></div>
<div><div class="bar" style="height:50px"></div><div class="label">Пт</div></div>
</div>
</div>
</body>
</html>`;

const mockGenerate = (prompt: string): string => {
  const lower = prompt.toLowerCase();
  const title = prompt.slice(0, 60);
  const items = lower.includes("монитор") ? ["Комбайн №1 — Активен", "Трактор №2 — Простой", "Авто №3 — В пути"] :
    lower.includes("дашборд") ? ["Выручка: 12.4M ₽", "Заказы: 847", "Конверсия: 3.2%"] :
    ["Пункт 1", "Пункт 2", "Пункт 3"];
  return `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#f8fafc;padding:24px;color:#1e293b}
h1{font-size:1.4rem;margin-bottom:16px;color:#FF6B35}.card{background:#fff;border-radius:12px;padding:16px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,.06)}
.badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:.75rem;background:#FF6B35;color:#fff;margin-right:8px}</style>
</head><body><h1>${title}</h1>${items.map(i => `<div class="card">${i}</div>`).join("")}
<p style="margin-top:16px;color:#94a3b8;font-size:.85rem">⚡ Демо-режим — данные для примера</p></body></html>`;
};

const IdeaRealizationDialog = ({ open, onOpenChange }: Props) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try { return JSON.parse(localStorage.getItem(CHAT_STORAGE) || "[]"); } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentCode, setCurrentCode] = useState(() => localStorage.getItem(CODE_STORAGE) || defaultHtml);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [rules, setRules] = useState<Rule[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  });
  const [rulesOpen, setRulesOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [showEmail, setShowEmail] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Persist
  useEffect(() => { localStorage.setItem(CHAT_STORAGE, JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem(CODE_STORAGE, currentCode); }, [currentCode]);

  // Auto-scroll
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const updatePreview = useCallback((code: string) => {
    setCurrentCode(code);
    if (iframeRef.current) {
      const blob = new Blob([code], { type: "text/html" });
      iframeRef.current.src = URL.createObjectURL(blob);
    }
  }, []);

  // Init iframe
  useEffect(() => {
    if (open) {
      setTimeout(() => updatePreview(currentCode), 100);
    }
  }, [open]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const activeRules = rules.filter((r) => r.active).map((r) => r.text).join("\n- ");

    try {
      const { data, error } = await supabase.functions.invoke("generate-demo", {
        body: { prompt: text, rules: activeRules || undefined },
      });
      if (error) throw error;

      const code = data.code || mockGenerate(text);
      updatePreview(code);
      setMessages((prev) => [...prev, { role: "assistant", content: data.message || "Демо создано! Посмотрите результат справа →" }]);
    } catch {
      // Fallback to mock
      const code = mockGenerate(text);
      updatePreview(code);
      setMessages((prev) => [...prev, { role: "assistant", content: "⚡ Использована локальная генерация. Демо готово!" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleChip = (chip: string) => setInput(chip);

  const handleRefresh = () => updatePreview(currentCode);

  const handleFullscreen = () => {
    iframeRef.current?.requestFullscreen?.();
  };

  const handleOpenInWeb = () => {
    const blob = new Blob([currentCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const iframeWidth = device === "tablet" ? "768px" : device === "mobile" ? "375px" : "100%";

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `demo-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "✅ Файл скачан", description: "HTML-демо сохранено на ваш компьютер" });
  };

  const handleSendToTeam = () => {
    if (!emailInput.trim() && showEmail) {
      toast({ title: "Укажите email", variant: "destructive" });
      return;
    }
    if (!showEmail) { setShowEmail(true); return; }
    toast({ title: "📨 Отправлено!", description: "Наша команда свяжется с вами в течение 2 часов" });
    setShowEmail(false);
    setEmailInput("");
  };

  const handleSchedule = () => {
    const desc = encodeURIComponent(`Обсуждение проекта КИБЕРВИЛЛ\n\nИдея: ${messages.find(m => m.role === "user")?.content || "Новый проект"}`);
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Встреча — КИБЕРВИЛЛ")}&details=${desc}`, "_blank");
    toast({ title: "📅 Календарь открыт" });
  };

  const handleNewProject = () => {
    setMessages([]);
    setInput("");
    updatePreview(defaultHtml);
    localStorage.removeItem(CHAT_STORAGE);
    localStorage.removeItem(CODE_STORAGE);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] max-h-[90vh] p-0 gap-0 overflow-hidden">
          <div className="flex flex-col md:flex-row h-full">
            {/* LEFT PANEL */}
            <div className="w-full md:w-[30%] border-r border-border bg-card flex flex-col h-full md:max-h-full max-h-[45vh]">
              {/* Header */}
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FF6B35]" /> Воплоти свою идею
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Опишите, что нужно создать — ИИ построит демо</p>
                <div className="flex gap-1 mt-2">
                  <Button size="sm" variant="ghost" onClick={() => setRulesOpen(true)} className="text-xs">
                    <Settings className="w-3 h-3 mr-1" /> Правила
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleNewProject} className="text-xs">
                    <RotateCcw className="w-3 h-3 mr-1" /> Новый
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
                <AnimatePresence>
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-lg p-3 text-sm ${
                        m.role === "user"
                          ? "bg-[#FF6B35]/10 text-foreground ml-4"
                          : "bg-muted text-foreground mr-4"
                      }`}
                    >
                      {m.content}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-muted rounded-lg p-3 mr-4 flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                    <span className="text-xs text-muted-foreground">ИИ создаёт демо...</span>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chips */}
              <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
                {chips.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleChip(c)}
                    className="text-xs px-2.5 py-1 rounded-full border border-border bg-background hover:bg-accent/50 transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="p-3 border-t border-border">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Например: мониторинг пяти комбайнов, двух тракторов и легковой машины на ферме..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    rows={2}
                    className="resize-none flex-1 text-sm"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className="bg-[#FF6B35] hover:bg-[#e55a2b] text-white self-end"
                    size="icon"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 flex flex-col bg-muted/30 h-full md:max-h-full max-h-[45vh]">
              {/* Toolbar */}
              <div className="flex items-center justify-between p-2 border-b border-border bg-card">
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={device === "desktop" ? "default" : "ghost"}
                    onClick={() => setDevice("desktop")}
                  >
                    <Monitor className="w-4 h-4 mr-1" /> 100%
                  </Button>
                  <Button
                    size="sm"
                    variant={device === "tablet" ? "default" : "ghost"}
                    onClick={() => setDevice("tablet")}
                  >
                    <Tablet className="w-4 h-4 mr-1" /> 768px
                  </Button>
                  <Button
                    size="sm"
                    variant={device === "mobile" ? "default" : "ghost"}
                    onClick={() => setDevice("mobile")}
                  >
                    <Smartphone className="w-4 h-4 mr-1" /> 375px
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={handleRefresh}><RefreshCw className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={handleOpenInWeb} title="Открыть в новой вкладке"><ExternalLink className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={handleFullscreen}><Maximize className="w-4 h-4" /></Button>
                </div>
              </div>

              {/* Iframe */}
              <div className="flex-1 flex items-start justify-center p-4 overflow-auto min-h-0">
                <iframe
                  ref={iframeRef}
                  title="Demo Preview"
                  className="bg-white rounded-lg shadow-lg border border-border transition-all duration-300"
                  style={{ width: iframeWidth, height: "100%", maxWidth: "100%" }}
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>

              {/* Actions */}
              <div className="p-3 border-t border-border bg-card flex flex-wrap gap-2 items-center">
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-1" /> Скачать код
                </Button>
                <div className="flex gap-2 items-center">
                  {showEmail && (
                    <Input
                      placeholder="Ваш email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-48 h-9 text-sm"
                    />
                  )}
                  <Button size="sm" className="bg-[#FF6B35] hover:bg-[#e55a2b] text-white" onClick={handleSendToTeam}>
                    <Mail className="w-4 h-4 mr-1" /> Отправить нам
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={handleSchedule}>
                  <CalendarDays className="w-4 h-4 mr-1" /> Назначить встречу
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <KnowledgeRulesDialog open={rulesOpen} onOpenChange={setRulesOpen} rules={rules} setRules={setRules} />
    </>
  );
};

export default IdeaRealizationDialog;
