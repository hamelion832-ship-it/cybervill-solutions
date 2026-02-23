import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SMSRU_API = "https://sms.ru/sms/send";

// In-memory OTP store (per isolate). For production, use a database table.
const otpStore = new Map<string, { code: string; expiresAt: number }>();

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SMSRU_API_KEY = Deno.env.get("SMSRU_API_KEY");
  if (!SMSRU_API_KEY) {
    return new Response(
      JSON.stringify({ success: false, error: "SMSRU_API_KEY is not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

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
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      });

      const params = new URLSearchParams({
        api_id: SMSRU_API_KEY,
        to: normalizedPhone,
        msg: `Ваш код входа: ${otpCode}`,
        json: "1",
      });

      const smsRes = await fetch(`${SMSRU_API}?${params.toString()}`);
      const smsData = await smsRes.json();

      if (smsData.status !== "OK") {
        console.error("SMS.RU error:", JSON.stringify(smsData));
        return new Response(
          JSON.stringify({ success: false, error: "Ошибка отправки SMS. Проверьте номер." }),
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

      // Sign in the user via Supabase Admin — create or get user by phone
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      // Try to find existing user by phone
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      let user = existingUsers?.users?.find((u) => u.phone === normalizedPhone);

      if (!user) {
        // Create user with phone
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

      // Generate session token
      const { data: session, error: sessionErr } =
        await supabaseAdmin.auth.admin.generateLink({
          type: "magiclink",
          email: user.email || `${normalizedPhone.replace("+", "")}@phone.local`,
        });

      // Alternative: use signInWithPassword with a generated password
      // For simplicity, return a custom token approach
      // Actually let's just use admin to create a session
      const { data: tokenData, error: tokenErr } = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: user.email ?? `${normalizedPhone.replace(/\D/g, "")}@phone.user`,
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: "Код подтверждён",
          user_id: user.id,
          // Frontend can use this to set session
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
