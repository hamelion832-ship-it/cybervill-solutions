import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { path: "/", label: "О компании" },
  { path: "/software", label: "ПО / САПР ознакомиться" },
  { path: "/portfolio", label: "Портфолио" },
  { path: "/products", label: "Товары и решения" },
  { path: "/contacts", label: "Контакты" },
];

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

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

        <Link to="/login" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors">
          <LogIn className="w-4 h-4" />
          Вход
        </Link>

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
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
