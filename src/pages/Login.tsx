import { useState } from "react";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <main className="pt-16 min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto p-8 bg-card border border-border rounded-xl shadow-lg text-center space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Вход</h1>
        <p className="text-sm text-muted-foreground">Войдите с помощью Google-аккаунта</p>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button onClick={handleGoogleSignIn} disabled={loading} className="w-full gap-2" size="lg">
          <LogIn className="w-4 h-4" />
          {loading ? "Вход..." : "Войти через Google"}
        </Button>
      </div>
    </main>
  );
};

export default Login;
