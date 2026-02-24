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
import IdeaRealizationDialog from "@/components/IdeaRealizationDialog";

const products = [
  {
    icon: Building2,
    title: "Платформа автоматизации мониторинга",
    items: ["Контроль сроков и этапов", "Удалённый мониторинг объектов", "Предиктивная аналитика", "Цифровые двойники"],
  },
  {
    icon: CreditCard,
    title: "Финтех-платформа BrixPay",
    items: ["Блокчейн-расчёты", "Интеграция с банками", "Автоматизация финансов", "Аналитика транзакций"],
  },
  {
    icon: Factory,
    title: "Система промышленного мониторинга «ЯРАМ-1»",
    items: ["Контроль оборудования", "Прогнозирование аварий", "IoT-сенсорика", "ML-аналитика производства"],
  },
  {
    icon: GraduationCap,
    title: "Система иммерсивного образования и симуляции",
    items: ["VR-тренажёры и симуляторы", "Цифровые лаборатории", "Компьютерные классы «под ключ»", "Интерактивное обучение"],
  },
  {
    icon: Eye,
    title: "Платформа территориального мониторинга",
    items: ["Computer Vision для городской среды", "Экологический мониторинг", "Аналитика Big Data", "Антидроновая защита"],
  },
  {
    icon: Cog,
    title: "Платформа цифрового станкостроения",
    items: ["Модернизация станков с ЧПУ", "Отечественные решения", "Интеграция CAD/CAM", "Импортозамещение"],
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
  const [ideaOpen, setIdeaOpen] = useState(false);
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
            <p className="text-lg md:text-2xl text-primary-foreground font-semibold max-w-3xl mx-auto mb-3 leading-snug">
              Разработка наукоёмких технологических решений и мониторинговых систем
            </p>
            <p className="text-base md:text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8 leading-relaxed">
              Цифровые двойники · Компьютерное зрение · Иммерсивные среды · Промышленный ИИ
            </p>
          </motion.div>

          {/* Solution cards directly in hero */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-12 grid md:grid-cols-3 gap-5 max-w-4xl mx-auto"
          >
            {[
              {
                title: "Наши R&D проекты",
                description: "Computer Vision, Machine Learning, Big Data — узнайте о технологиях, которые мы создаём",
                onClick: () => window.location.href = "/rnd",
              },
              {
                title: "ИИ ассистент",
                description: "Интеллектуальный помощник для автоматизации рутинных задач, анализа данных и поддержки принятия решений",
                onClick: () => setAiOpen(true),
              },
              {
                title: "Интеллектуальная собственность",
                description: "Свидетельства о регистрации ПО и включение в Реестр отечественного софта Минцифры",
                onClick: () => window.location.href = "/ip",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="bg-card/80 backdrop-blur-md rounded-lg border border-accent/20 p-5 text-left cursor-pointer card-hover group"
                onClick={item.onClick}
              >
                <h3 className="font-semibold text-foreground text-base mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent group-hover:underline">
                  Попробовать →
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

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
      <Section title="Продукты и решения" subtitle="Наукоёмкие платформы: от проектирования до внедрения и масштабирования" alt>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
      <IdeaRealizationDialog open={ideaOpen} onOpenChange={setIdeaOpen} />
    </main>
  );
};

export default Index;
