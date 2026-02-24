import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

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

  return (
    <main className="pt-16 min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto p-8 bg-card border border-border rounded-xl shadow-lg space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Вход</h1>
          <p className="text-sm text-muted-foreground mt-1">Войдите в свой аккаунт</p>
        </div>

        {error && <p className="text-sm text-destructive text-center">{error}</p>}
        {success && <p className="text-sm text-accent text-center">{success}</p>}

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
      </div>
    </main>
  );
};

export default Login;
