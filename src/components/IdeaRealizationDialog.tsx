import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Download, RotateCcw, Rocket, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const industries = [
  "Строительство и инфраструктура",
  "Промышленность и производство",
  "Образование",
  "Финансы и платежи",
  "Городская среда и экология",
  "Транспорт и логистика",
  "Здравоохранение",
  "Другое",
];

const timelines = [
  "1–3 месяца",
  "3–6 месяцев",
  "6–12 месяцев",
  "Более 12 месяцев",
];

const IdeaRealizationDialog = ({ open, onOpenChange }: Props) => {
  const [idea, setIdea] = useState("");
  const [industry, setIndustry] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setPlan("");
    try {
      const { data, error } = await supabase.functions.invoke("generate-project-plan", {
        body: { idea, industry, budget, timeline },
      });
      if (error) throw error;
      setPlan(data.plan);
    } catch (e: any) {
      setPlan(`❌ Ошибка: ${e.message || "Не удалось сгенерировать план"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([plan], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `project-plan-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setIdea("");
    setIndustry("");
    setBudget("");
    setTimeline("");
    setPlan("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-accent" />
            Воплоти свою идею
          </DialogTitle>
          <DialogDescription>
            Опишите вашу идею — ИИ создаст детальный план реализации с архитектурой, этапами и оценкой ресурсов
          </DialogDescription>
        </DialogHeader>

        {!plan ? (
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Опишите вашу идею *
              </label>
              <Textarea
                placeholder="Например: Платформа для мониторинга строительных площадок с AI-анализом видеопотока..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Отрасль</label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите отрасль" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Сроки</label>
                <Select value={timeline} onValueChange={setTimeline}>
                  <SelectTrigger>
                    <SelectValue placeholder="Желаемые сроки" />
                  </SelectTrigger>
                  <SelectContent>
                    {timelines.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Бюджет (необязательно)</label>
              <Input
                placeholder="Например: до 5 млн руб."
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!idea.trim() || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Генерация плана...
                </>
              ) : (
                <>
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Создать план реализации
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            <div className="prose prose-sm dark:prose-invert max-w-none bg-muted/30 rounded-lg p-4 border border-border overflow-y-auto max-h-[50vh]">
              <ReactMarkdown>{plan}</ReactMarkdown>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Новый план
              </Button>
              <Button onClick={handleDownload} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Скачать .md
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default IdeaRealizationDialog;
