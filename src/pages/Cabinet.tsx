import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { Bot, Trash2, User, LogOut, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

interface ChatEntry {
  id: string;
  user_message: string;
  assistant_message: string;
  created_at: string;
}

const Cabinet = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [history, setHistory] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate("/login");
        return;
      }
      setSession(data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!s) navigate("/login");
      setSession(s);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!session) return;
    const fetchHistory = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("chat_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      setHistory((data as ChatEntry[]) || []);
      setLoading(false);
    };
    fetchHistory();
  }, [session]);

  const handleDelete = async (id: string) => {
    await supabase.from("chat_history").delete().eq("id", id);
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const displayName = session?.user?.email || session?.user?.phone || "Пользователь";

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!session) return null;

  return (
    <main className="pt-24 pb-16 min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Profile card */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <User className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Личный кабинет</h1>
              <p className="text-sm text-muted-foreground">{displayName}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-1.5">
            <LogOut className="w-4 h-4" />
            Выйти
          </Button>
        </div>

        {/* Chat history */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            История запросов к ИИ
          </h2>

          {loading ? (
            <div className="text-center text-muted-foreground py-12 text-sm">Загрузка...</div>
          ) : history.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 space-y-2">
              <Bot className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-sm">Пока нет запросов. Воспользуйтесь ИИ-ассистентом на главной странице.</p>
            </div>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                  className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {entry.user_message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(entry.created_at)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(entry.id);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </button>

                {expandedId === entry.id && (
                  <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-3 h-3 text-primary" />
                      </div>
                      <p className="text-sm text-foreground">{entry.user_message}</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-3 h-3 text-accent" />
                      </div>
                      <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 text-sm">
                        <ReactMarkdown>{entry.assistant_message}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default Cabinet;
