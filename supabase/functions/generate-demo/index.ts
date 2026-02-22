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
    const { prompt, rules } = await req.json();

    const systemPrompt = `Ты — AI-генератор демо-приложений. Создавай полноценные одностраничные HTML-приложения на основе описания пользователя.

ПРАВИЛА:
- Возвращай ТОЛЬКО валидный HTML код (полная страница с <!DOCTYPE html>)
- Используй встроенные CSS стили (Tailwind CDN или inline)
- Используй встроенный JavaScript если нужна интерактивность
- Создавай реалистичные демо с тестовыми данными
- Используй современный дизайн: скругления, тени, градиенты
- Акцентный цвет: #FF6B35 (оранжевый)
- Фон: светлый (#f8fafc), карточки белые
- Шрифт: system-ui или Inter (через CDN)
- Делай адаптивную верстку
- Добавляй иконки через эмодзи или SVG
- Графики рисуй через SVG или Canvas
${rules ? `\nДОПОЛНИТЕЛЬНЫЕ ПРАВИЛА ПРОЕКТА:\n${rules}` : ""}

Отвечай ТОЛЬКО HTML кодом, без markdown, без пояснений.`;

    const res = await fetch("https://api.ai.lovable.dev/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        max_tokens: 8000,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`AI API error: ${res.status} ${errText}`);
    }

    const data = await res.json();
    let code = data.choices?.[0]?.message?.content || "";

    // Strip markdown fences if present
    code = code.replace(/^```html?\n?/i, "").replace(/\n?```$/i, "").trim();

    return new Response(
      JSON.stringify({
        code,
        message: `Принято! Создаю демо для: ${prompt.slice(0, 100)}...`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
