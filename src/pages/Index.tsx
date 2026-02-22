import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2, Factory, GraduationCap, Monitor, Eye, Cog,
  CreditCard, Users, Shield, Cpu, Radio, Microscope
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import Section from "@/components/Section";
import InfoCard from "@/components/InfoCard";
import SpecGeneratorDialog from "@/components/SpecGeneratorDialog";
import AiAssistantDialog from "@/components/AiAssistantDialog";

const products = [
  {
    icon: Building2,
    title: "Мониторинг строительства",
    items: ["Контроль сроков и этапов", "Контроль подрядчиков", "Удалённый мониторинг", "Цифровые отчёты"],
  },
  {
    icon: CreditCard,
    title: "Платёжная система",
    items: ["Приём и обработка платежей", "Интеграция с банками", "Автоматизация финансов", "Аналитика транзакций"],
  },
  {
    icon: Factory,
    title: "Промышленный мониторинг",
    items: ["Контроль оборудования", "Прогнозирование аварий", "Мониторинг линий", "Аналитика производства"],
  },
  {
    icon: GraduationCap,
    title: "Цифровизация образования",
    items: ["Компьютерные классы «под ключ»", "IT-инфраструктура", "Цифровые лаборатории", "Системы управления"],
  },
  {
    icon: Microscope,
    title: "VR и обучающие системы",
    items: ["Виртуальные тренажёры", "Симуляторы безопасности", "Интерактивное обучение", "Иммерсивные среды"],
  },
  {
    icon: Eye,
    title: "Мониторинг территорий",
    items: ["Мониторинг городской среды", "Экологический мониторинг", "Аналитика данных", "Управление безопасностью"],
  },
  {
    icon: Cog,
    title: "Станкостроение",
    items: ["Модернизация станков", "Отечественные решения", "Интеграция CAD/CAM", "Импортозамещение"],
  },
];

const directions = [
  "Гражданские системы управления",
  "Промышленная автоматизация",
  "Мониторинг и аналитика",
  "Образовательные технологии",
  "Цифровая инфраструктура",
  "Импортозамещение",
];

const team = [
  { icon: Users, label: "Управленцы с международным опытом" },
  { icon: Cpu, label: "Архитекторы цифровых систем" },
  { icon: Factory, label: "Инженеры промышленной автоматизации" },
  { icon: Monitor, label: "Специалисты AI и аналитики" },
  { icon: Shield, label: "Разработчики корпоративного ПО" },
  { icon: GraduationCap, label: "Эксперты образовательных технологий" },
  { icon: Radio, label: "Инженеры IoT и мониторинга" },
  { icon: Microscope, label: "Специалисты VR-разработки" },
];

const Index = () => {
  const [specOpen, setSpecOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <img
          src={heroBg}
          alt="Цифровая инфраструктура"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-primary-foreground leading-tight mb-6">
              <span className="text-gradient">КИБЕРВИЛЛ</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8 leading-relaxed">
              Цифровые платформы и инженерные решения для городской инфраструктуры, промышленности и образовательной среды
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Мониторинг", "Автоматизация", "Образование", "Импортозамещение"].map((t) => (
                <span
                  key={t}
                  className="px-4 py-2 rounded-full border border-accent/30 text-accent text-sm font-medium bg-accent/5 backdrop-blur-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution */}
      <Section title="Решение сложных задач — наша работа">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Преобразуй замысел в ТЗ",
              description: "Превращаем вашу идею в детальное техническое задание с чёткими требованиями, сроками и метриками",
              onClick: () => setSpecOpen(true),
            },
            {
              title: "ИИ ассистент",
              description: "Интеллектуальный помощник для автоматизации рутинных задач, анализа данных и поддержки принятия решений",
              onClick: () => setAiOpen(true),
            },
            {
              title: "Воплоти свою идею",
              description: "Полный цикл реализации: от прототипа до готового продукта с сопровождением и поддержкой",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-card rounded-lg border border-border p-6 card-hover ${item.onClick ? "cursor-pointer" : ""}`}
              onClick={item.onClick}
            >
              <h3 className="font-semibold text-foreground text-lg mb-3">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Mission */}
      <Section title="Миссия" subtitle="Повышение эффективности, безопасности и управляемости городской среды, предприятий и образовательных учреждений за счёт цифровых технологий.">
        <div className="grid md:grid-cols-3 gap-4">
          {directions.map((d, i) => (
            <motion.div
              key={d}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 bg-card rounded-lg border border-border p-4"
            >
              <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">{d}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Products */}
      <Section title="Программные продукты" subtitle="Полный цикл: от проектирования до внедрения и сопровождения" alt>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((p, i) => (
            <InfoCard key={p.title} icon={p.icon} title={p.title} items={p.items} index={i} />
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section title="Команда" subtitle="Опыт специалистов: от 10 до 25+ лет">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {team.map(({ icon: Icon, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 bg-card rounded-lg border border-border p-4"
            >
              <Icon className="w-5 h-5 text-accent flex-shrink-0" />
              <span className="text-sm text-foreground">{label}</span>
            </motion.div>
          ))}
        </div>
      </Section>
      <SpecGeneratorDialog open={specOpen} onOpenChange={setSpecOpen} />
      <AiAssistantDialog open={aiOpen} onOpenChange={setAiOpen} />
    </main>
  );
};

export default Index;
