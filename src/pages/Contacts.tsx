import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import Section from "@/components/Section";

const services = [
  "Цифровизация объектов",
  "Внедрение мониторинговых систем",
  "Оснащение образовательных учреждений",
  "Промышленная автоматизация",
  "Партнёрство и инвестиции",
];

const contactInfo = [
  { icon: MapPin, label: "Россия, Волгоградская область" },
  { icon: Phone, label: "+7 (927) 505-00-35" },
  { icon: Mail, label: "info@cybervill.ru" },
  { icon: Globe, label: "cybervill.ru" },
];

const Contacts = () => (
  <main className="pt-16">
    <Section title="Контакты" subtitle="Свяжитесь с нами для обсуждения проектов и сотрудничества">
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="space-y-4">
            {contactInfo.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <span className="text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-lg border border-border p-6"
        >
          <h3 className="font-semibold text-foreground mb-4">Связаться с нами</h3>
          <div className="space-y-3">
            {services.map((s) => (
              <div key={s} className="flex items-center gap-3">
                <span className="text-accent text-xs">✔</span>
                <span className="text-sm text-foreground/80">{s}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            <input
              type="text"
              placeholder="Ваше имя"
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <textarea
              rows={3}
              placeholder="Сообщение"
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
            />
            <button className="w-full py-3 rounded-lg bg-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
              Отправить
            </button>
          </div>
        </motion.div>
      </div>
    </Section>
  </main>
);

export default Contacts;
