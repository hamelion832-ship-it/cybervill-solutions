import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { path: "/", label: "О компании" },
  { path: "/rnd", label: "R&D" },
  { path: "/ip", label: "Интеллектуальная собственность" },
  { path: "/software", label: "ПО / САПР" },
  { path: "/portfolio", label: "Портфолио" },
  { path: "/products", label: "Товары и решения" },
  { path: "/contacts", label: "Контакты" },
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate("/");
  };

  const displayName = session?.user?.email || session?.user?.phone || "Пользователь";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-accent/10">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
            <span className="text-accent-foreground font-extrabold text-sm">К</span>
          </div>
          <span className="text-primary-foreground font-bold text-lg tracking-tight">
            КИБЕРВИЛЛ
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-accent/20 text-accent"
                  : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-accent/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded bg-accent/20 text-primary-foreground text-sm font-medium hover:bg-accent/30 transition-colors outline-none">
              <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-accent-foreground" />
              </div>
              <span className="max-w-[140px] truncate">{displayName}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate("/cabinet")}>
                <User className="w-4 h-4 mr-2" />
                Личный кабинет
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/login" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors">
            <LogIn className="w-4 h-4" />
            Вход
          </Link>
        )}

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-primary border-t border-accent/10 overflow-hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-6 py-3 text-sm font-medium border-b border-accent/5 ${
                  location.pathname === item.path
                    ? "text-accent bg-accent/10"
                    : "text-primary-foreground/70 hover:text-primary-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link
                  to="/cabinet"
                  onClick={() => setMobileOpen(false)}
                  className="block px-6 py-3 text-sm font-medium border-b border-accent/5 text-primary-foreground/70 hover:text-primary-foreground"
                >
                  Личный кабинет
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleSignOut(); }}
                  className="block w-full text-left px-6 py-3 text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground"
                >
                  Выйти
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-6 py-3 text-sm font-medium text-accent"
              >
                Вход
              </Link>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
