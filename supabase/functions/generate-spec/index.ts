import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectName, description, audience, features, constraints } = await req.json();

    const prompt = `Ты — опытный системный аналитик. Создай подробное техническое задание (ТЗ) на русском языке по следующим входным данным:

**Название проекта:** ${projectName || "Не указано"}
**Описание идеи:** ${description}
**Целевая аудитория:** ${audience || "Не указана"}
**Ключевые функции:** ${features || "Не указаны"}
**Ограничения и требования:** ${constraints || "Не указаны"}

Структура ТЗ:
1. **Общие сведения** — название, цель, краткое описание
2. **Целевая аудитория и стейкхолдеры**
3. **Функциональные требования** — подробный список с приоритетами
4. **Нефункциональные требования** — производительность, безопасность, масштабируемость
5. **Архитектура и технологический стек** — рекомендуемые технологии
6. **Этапы реализации** — разбивка на спринты/фазы с оценкой сроков
7. **Метрики успеха** — KPI и критерии приёмки
8. **Риски и ограничения**

Формат: Markdown. Будь конкретен, используй таблицы где уместно.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Ты эксперт по составлению технических заданий для IT-проектов." },
          { role: "user", content: prompt },
        ],
        max_tokens: 4000,
      }),
    });

    const data = await response.json();
    const spec = data.choices?.[0]?.message?.content;

    if (!spec) {
      throw new Error("No content in AI response");
    }

    return new Response(JSON.stringify({ spec }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
