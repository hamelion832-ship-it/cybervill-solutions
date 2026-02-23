import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SMSAERO_API = "https://gate.smsaero.ru/v2";

// In-memory OTP store (per isolate). For production, use a database table.
const otpStore = new Map<string, { code: string; expiresAt: number }>();

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function normalizePhone(phone: string): string {
  // SMS Aero expects phone without '+' prefix
  return phone.replace(/[^\d]/g, "");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SMSAERO_EMAIL = Deno.env.get("SMSAERO_EMAIL");
  const SMSAERO_API_KEY = Deno.env.get("SMSAERO_API_KEY");

  if (!SMSAERO_EMAIL || !SMSAERO_API_KEY) {
    return new Response(
      JSON.stringify({ success: false, error: "SMS Aero credentials not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Basic Auth header for SMS Aero
  const authHeader = "Basic " + btoa(`${SMSAERO_EMAIL}:${SMSAERO_API_KEY}`);

  try {
    const { action, phone, code } = await req.json();
    const normalizedPhone = normalizePhone(phone || "");

    if (!normalizedPhone) {
      return new Response(
        JSON.stringify({ success: false, error: "Номер телефона обязателен" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "send") {
      const otpCode = generateCode();
      otpStore.set(normalizedPhone, {
        code: otpCode,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });

      const params = new URLSearchParams({
        number: normalizedPhone,
        text: `Ваш код входа: ${otpCode}`,
        sign: "SMS Aero",
      });

      const smsRes = await fetch(`${SMSAERO_API}/sms/send?${params.toString()}`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          Accept: "application/json",
        },
      });

      const smsData = await smsRes.json();
      console.log("SMS Aero response:", JSON.stringify(smsData));

      if (!smsData.success) {
        console.error("SMS Aero error:", JSON.stringify(smsData));
        return new Response(
          JSON.stringify({ success: false, error: smsData.message || "Ошибка отправки SMS. Проверьте номер." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Код отправлен" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify") {
      const stored = otpStore.get(normalizedPhone);

      if (!stored) {
        return new Response(
          JSON.stringify({ success: false, error: "Сначала запросите код" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (Date.now() > stored.expiresAt) {
        otpStore.delete(normalizedPhone);
        return new Response(
          JSON.stringify({ success: false, error: "Код истёк. Запросите новый." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (stored.code !== code) {
        return new Response(
          JSON.stringify({ success: false, error: "Неверный код" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      otpStore.delete(normalizedPhone);

      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      let user = existingUsers?.users?.find((u) => u.phone === normalizedPhone || u.phone === `+${normalizedPhone}`);

      if (!user) {
        const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          phone: normalizedPhone,
          phone_confirm: true,
        });
        if (createErr) {
          console.error("Create user error:", createErr);
          return new Response(
            JSON.stringify({ success: false, error: "Ошибка создания пользователя" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        user = newUser.user;
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Код подтверждён",
          user_id: user.id,
          verified: true,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Неизвестное действие" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("SMS OTP error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Внутренняя ошибка сервера" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
