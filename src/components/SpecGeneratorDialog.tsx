import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Download, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";

interface SpecGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SpecGeneratorDialog = ({ open, onOpenChange }: SpecGeneratorDialogProps) => {
  const [step, setStep] = useState<"form" | "result">("form");
  const [loading, setLoading] = useState(false);
  const [spec, setSpec] = useState("");
  const [form, setForm] = useState({
    projectName: "",
    description: "",
    audience: "",
    features: "",
    constraints: "",
  });
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!form.description.trim()) {
      toast({ title: "Опишите вашу идею", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-spec", {
        body: form,
      });
      if (error) throw error;
      setSpec(data.spec);
      setStep("result");
    } catch (e: any) {
      toast({ title: "Ошибка генерации", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([spec], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.projectName || "spec"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setStep("form");
    setSpec("");
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      handleReset();
      setForm({ projectName: "", description: "", audience: "", features: "", constraints: "" });
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            Генератор технического задания
          </DialogTitle>
          <DialogDescription>
            Опишите вашу идею — ИИ превратит её в структурированное ТЗ
          </DialogDescription>
        </DialogHeader>

        {step === "form" ? (
          <div className="space-y-4 mt-2">
            <div>
              <Label htmlFor="projectName">Название проекта</Label>
              <Input
                id="projectName"
                placeholder="Например: CRM для малого бизнеса"
                value={form.projectName}
                onChange={(e) => setForm({ ...form, projectName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Описание идеи *</Label>
              <Textarea
                id="description"
                placeholder="Подробно опишите, что вы хотите создать..."
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="audience">Целевая аудитория</Label>
              <Input
                id="audience"
                placeholder="Кто будет пользоваться продуктом?"
                value={form.audience}
                onChange={(e) => setForm({ ...form, audience: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="features">Ключевые функции</Label>
              <Textarea
                id="features"
                placeholder="Перечислите основные функции через запятую..."
                rows={3}
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="constraints">Ограничения и требования</Label>
              <Input
                id="constraints"
                placeholder="Бюджет, сроки, технологии..."
                value={form.constraints}
                onChange={(e) => setForm({ ...form, constraints: e.target.value })}
              />
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Генерация ТЗ...
                </>
              ) : (
                "Сгенерировать ТЗ"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            <div className="prose prose-sm dark:prose-invert max-w-none bg-muted/50 rounded-lg p-4 border border-border overflow-y-auto max-h-[50vh]">
              <ReactMarkdown>{spec}</ReactMarkdown>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleDownload} variant="outline" className="flex-1">
                <Download className="w-4 h-4" />
                Скачать .md
              </Button>
              <Button onClick={handleReset} className="flex-1">
                Создать новое ТЗ
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SpecGeneratorDialog;
