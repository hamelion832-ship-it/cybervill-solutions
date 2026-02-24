import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SMSAERO_API = "https://gate.smsaero.ru/v2";

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  if (!digits) return "";

  // Приводим к формату РФ: 7XXXXXXXXXX
  if (digits.length === 11 && digits.startsWith("8")) {
    return `7${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    return `7${digits}`;
  }

  return digits;
}

function isValidRuPhone(phone: string): boolean {
  return /^7\d{10}$/.test(phone);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SMSAERO_EMAIL = Deno.env.get("SMSAERO_EMAIL");
  const SMSAERO_API_KEY = Deno.env.get("SMSAERO_API_KEY");

  if (!SMSAERO_EMAIL || !SMSAERO_API_KEY) {
    return new Response(
      JSON.stringify({ success: false, error: "SMS credentials not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const authHeader = "Basic " + btoa(`${SMSAERO_EMAIL}:${SMSAERO_API_KEY}`);

  try {
    const { action, phone, code } = await req.json();
    const normalizedPhone = normalizePhone(phone || "");

    if (!normalizedPhone) {
      return new Response(
        JSON.stringify({ success: false, error: "Номер телефона обязателен" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!isValidRuPhone(normalizedPhone)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Введите номер в формате +7XXXXXXXXXX",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "send") {
      const otpCode = generateCode();

      // Clean up expired codes, then upsert new one
      await supabaseAdmin
        .from("otp_codes")
        .delete()
        .lt("expires_at", new Date().toISOString());

      await supabaseAdmin.from("otp_codes").upsert({
        phone: normalizedPhone,
        code: otpCode,
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
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

        const providerMessage = String(smsData?.message || "");
        const isInvalidCreds = providerMessage.toLowerCase().includes("invalid credentials");

        return new Response(
          JSON.stringify({
            success: false,
            error: isInvalidCreds
              ? "Ошибка настроек SMS-сервиса: проверьте логин (user) и API-ключ"
              : providerMessage || "Ошибка отправки SMS. Проверьте номер.",
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Код отправлен" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify") {
      const { data: stored } = await supabaseAdmin
        .from("otp_codes")
        .select("code, expires_at")
        .eq("phone", normalizedPhone)
        .single();

      if (!stored) {
        return new Response(
          JSON.stringify({ success: false, error: "Сначала запросите код" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (new Date() > new Date(stored.expires_at)) {
        await supabaseAdmin.from("otp_codes").delete().eq("phone", normalizedPhone);
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

      // OTP verified — delete it
      await supabaseAdmin.from("otp_codes").delete().eq("phone", normalizedPhone);

      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      let user = existingUsers?.users?.find(
        (u) => u.phone === normalizedPhone || u.phone === `+${normalizedPhone}`
      );

      if (!user) {
        const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          phone: normalizedPhone,
          phone_confirm: true,
          email: `phone_${normalizedPhone}@placeholder.local`,
          email_confirm: true,
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

      // Generate a proper authenticated session for the user
      const { data: sessionData, error: sessionError } =
        await supabaseAdmin.auth.admin.generateLink({
          type: "magiclink",
          email: user.email!,
        });

      if (sessionError || !sessionData) {
        console.error("Session generation error:", sessionError);
        return new Response(
          JSON.stringify({ success: false, error: "Ошибка создания сессии" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Extract the token from the generated link and exchange it for a session
      const linkUrl = new URL(sessionData.properties.action_link);
      const tokenHash = linkUrl.searchParams.get("token") ||
        linkUrl.hash.replace("#", "").split("&").find((p) => p.startsWith("token="))?.split("=")[1];

      // Use verifyOtp to exchange the token for access/refresh tokens
      const { data: verifyData, error: verifyError } = await supabaseAdmin.auth.verifyOtp({
        token_hash: sessionData.properties.hashed_token,
        type: "magiclink",
      });

      if (verifyError || !verifyData.session) {
        console.error("Token exchange error:", verifyError);
        return new Response(
          JSON.stringify({ success: false, error: "Ошибка создания сессии" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Код подтверждён",
          session: {
            access_token: verifyData.session.access_token,
            refresh_token: verifyData.session.refresh_token,
          },
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
