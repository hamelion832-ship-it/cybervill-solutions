import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, Mail, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Email state
  const [email, setEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  // Phone state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result?.error) {
      setError("Ошибка входа. Попробуйте снова.");
    }
    setLoading(false);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password: emailPassword,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Проверьте почту для подтверждения регистрации.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: emailPassword });
      if (error) {
        setError(error.message);
      } else {
        navigate("/");
      }
    }
    setLoading(false);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await supabase.functions.invoke("sms-otp", {
        body: { action: "send", phone },
      });
      if (res.error || !res.data?.success) {
        setError(res.data?.error || "Ошибка отправки SMS");
      } else {
        setOtpSent(true);
        setSuccess("Код отправлен на ваш номер.");
      }
    } catch {
      setError("Ошибка соединения с сервером");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await supabase.functions.invoke("sms-otp", {
        body: { action: "verify", phone, code: otp },
      });
      if (res.error || !res.data?.success) {
        setError(res.data?.error || "Ошибка проверки кода");
      } else {
        // Set the authenticated session with returned tokens
        if (res.data.session) {
          await supabase.auth.setSession({
            access_token: res.data.session.access_token,
            refresh_token: res.data.session.refresh_token,
          });
        }
        setSuccess("Вход выполнен!");
        navigate("/");
      }
    } catch {
      setError("Ошибка соединения с сервером");
    }
    setLoading(false);
  };

  return (
    <main className="pt-16 min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto p-8 bg-card border border-border rounded-xl shadow-lg space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Вход</h1>
          <p className="text-sm text-muted-foreground mt-1">Выберите способ входа</p>
        </div>

        {error && <p className="text-sm text-destructive text-center">{error}</p>}
        {success && <p className="text-sm text-accent text-center">{success}</p>}

        <Button onClick={handleGoogleSignIn} disabled={loading} variant="outline" className="w-full gap-2" size="lg">
          <LogIn className="w-4 h-4" />
          Войти через Google
        </Button>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">или</span>
          <Separator className="flex-1" />
        </div>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="email" className="flex-1 gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Почта
            </TabsTrigger>
            <TabsTrigger value="phone" className="flex-1 gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Телефон
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="mt-4">
            <form onSubmit={handleEmailAuth} className="space-y-3">
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Пароль"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                required
                minLength={6}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Подождите..." : isSignUp ? "Зарегистрироваться" : "Войти"}
              </Button>
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccess(null); }}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {isSignUp ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
              </button>
            </form>
          </TabsContent>

          <TabsContent value="phone" className="mt-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <Input
                  type="tel"
                  placeholder="+7 999 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Отправка..." : "Получить код"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <p className="text-sm text-muted-foreground">Код отправлен на {phone}</p>
                <Input
                  type="text"
                  placeholder="Код из SMS"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Проверка..." : "Подтвердить"}
                </Button>
                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setOtp(""); setError(null); setSuccess(null); }}
                  className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Изменить номер
                </button>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Login;
