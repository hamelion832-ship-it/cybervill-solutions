import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground/70">
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-extrabold text-sm">К</span>
            </div>
            <span className="text-primary-foreground font-bold text-lg">КИБЕРВИЛЛ</span>
          </div>
          <p className="text-sm leading-relaxed">
            Цифровые платформы и инженерные решения для городской инфраструктуры, промышленности и образования.
          </p>
        </div>
        <div>
          <h4 className="text-primary-foreground font-semibold mb-3 text-sm uppercase tracking-wider">Навигация</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/" className="hover:text-accent transition-colors">О компании</Link>
            <Link to="/software" className="hover:text-accent transition-colors">ПО / САПР</Link>
            <Link to="/portfolio" className="hover:text-accent transition-colors">Портфолио</Link>
            <Link to="/products" className="hover:text-accent transition-colors">Товары и решения</Link>
            <Link to="/contacts" className="hover:text-accent transition-colors">Контакты</Link>
          </div>
        </div>
        <div>
          <h4 className="text-primary-foreground font-semibold mb-3 text-sm uppercase tracking-wider">Контакты</h4>
          <div className="text-sm space-y-2">
            <p>📍 Россия</p>
            <p>📞 +7 (927) 505-00-35</p>
            <p>✉ info@cybervill.ru</p>
          </div>
        </div>
      </div>
      <div className="border-t border-accent/10 mt-8 pt-6 text-center text-xs">
        © {new Date().getFullYear()} Кибервилл. Все права защищены.
      </div>
    </div>
  </footer>
);

export default Footer;
