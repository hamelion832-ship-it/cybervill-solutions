import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { idea, industry, budget, timeline } = await req.json();

    if (!idea) {
      throw new Error("Описание идеи обязательно");
    }

    const prompt = `Ты — архитектор цифровых решений компании КИБЕРВИЛЛ. Пользователь описал свою идею проекта. Создай детальный план реализации.

**Идея:** ${idea}
**Отрасль:** ${industry || "Не указана"}
**Бюджет:** ${budget || "Не указан"}
**Желаемые сроки:** ${timeline || "Не указаны"}

Создай план в формате Markdown со следующими разделами:

## 🎯 Концепция проекта
Краткое описание и ценность продукта.

## 🏗️ Архитектура решения
Технический стек, компоненты системы, схема взаимодействия.

## 📋 Этапы реализации
Пошаговый план с описанием каждого этапа, сроками и результатами.

## 💡 Ключевые функции
Список основных функций продукта с приоритетами (MVP / v2 / v3).

## 🔧 Технологии и инструменты
Конкретные технологии для каждого компонента.

## 📊 Оценка ресурсов
Примерная оценка команды, сроков и этапов.

## 🚀 Следующие шаги
Конкретные действия для старта проекта.

Отвечай на русском языке. Будь конкретным и практичным.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4000,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    return new Response(JSON.stringify({ plan: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Внутренняя ошибка сервера" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
