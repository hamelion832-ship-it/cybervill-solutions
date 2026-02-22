import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings, Plus, Trash2 } from "lucide-react";

export interface Rule {
  id: string;
  text: string;
  active: boolean;
  category: "design" | "data" | "security";
}

const STORAGE_KEY = "cyberville-rules";

const presets: Record<string, Rule[]> = {
  transport: [
    { id: "t1", text: "Все дашборды должны показывать план-факт анализ с цветовой индикацией", active: true, category: "data" },
    { id: "t2", text: "Данные мониторинга техники должны обновляться в реальном времени", active: true, category: "data" },
    { id: "t3", text: "Показывать координаты и скорость каждой единицы техники", active: true, category: "data" },
    { id: "t4", text: "Использовать оранжевый (#FF6B35) для акцентных элементов", active: true, category: "design" },
  ],
  industry: [
    { id: "i1", text: "Отображать статус оборудования: работает / простой / авария", active: true, category: "data" },
    { id: "i2", text: "Добавлять графики производительности за последние 24 часа", active: true, category: "data" },
    { id: "i3", text: "Красный индикатор для аварийных ситуаций", active: true, category: "design" },
    { id: "i4", text: "Уведомления о превышении пороговых значений", active: true, category: "security" },
  ],
  construction: [
    { id: "c1", text: "Показывать процент выполнения каждого этапа строительства", active: true, category: "data" },
    { id: "c2", text: "Таблица подрядчиков с рейтингами и сроками", active: true, category: "data" },
    { id: "c3", text: "Фотофиксация с привязкой к дате и объекту", active: true, category: "data" },
    { id: "c4", text: "Контроль бюджета: план vs факт", active: true, category: "data" },
  ],
};

const categoryLabels = { design: "🎨 Дизайн", data: "📊 Данные", security: "🔒 Безопасность" };

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rules: Rule[];
  setRules: (rules: Rule[]) => void;
}

const KnowledgeRulesDialog = ({ open, onOpenChange, rules, setRules }: Props) => {
  const [newRule, setNewRule] = useState("");
  const [newCategory, setNewCategory] = useState<Rule["category"]>("data");

  const saveRules = (updated: Rule[]) => {
    setRules(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addRule = () => {
    if (!newRule.trim()) return;
    const rule: Rule = { id: Date.now().toString(), text: newRule.trim(), active: true, category: newCategory };
    saveRules([...rules, rule]);
    setNewRule("");
  };

  const toggleRule = (id: string) => {
    saveRules(rules.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
  };

  const deleteRule = (id: string) => {
    saveRules(rules.filter((r) => r.id !== id));
  };

  const loadPreset = (key: string) => {
    saveRules(presets[key]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" /> Правила проекта
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 flex-wrap mb-4">
          <Button size="sm" variant="outline" onClick={() => loadPreset("transport")}>🚜 Мониторинг транспорта</Button>
          <Button size="sm" variant="outline" onClick={() => loadPreset("industry")}>🏭 Промышленная автоматизация</Button>
          <Button size="sm" variant="outline" onClick={() => loadPreset("construction")}>🏗️ Строительный контроль</Button>
        </div>

        <div className="space-y-2 mb-4">
          {(["design", "data", "security"] as const).map((cat) => {
            const catRules = rules.filter((r) => r.category === cat);
            if (!catRules.length) return null;
            return (
              <div key={cat}>
                <p className="text-xs font-semibold text-muted-foreground mb-1">{categoryLabels[cat]}</p>
                {catRules.map((r) => (
                  <div key={r.id} className="flex items-center gap-2 py-1">
                    <Checkbox checked={r.active} onCheckedChange={() => toggleRule(r.id)} />
                    <span className={`text-sm flex-1 ${!r.active ? "line-through text-muted-foreground" : ""}`}>{r.text}</span>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => deleteRule(r.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div className="flex gap-2">
          <select
            className="border rounded px-2 py-1 text-sm bg-background"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as Rule["category"])}
          >
            <option value="design">🎨 Дизайн</option>
            <option value="data">📊 Данные</option>
            <option value="security">🔒 Безопасность</option>
          </select>
          <Input
            placeholder="Новое правило..."
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addRule()}
            className="flex-1"
          />
          <Button size="icon" onClick={addRule}><Plus className="w-4 h-4" /></Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KnowledgeRulesDialog;
export { STORAGE_KEY };
