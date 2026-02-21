import {
  CreditCard, Eye, Tractor, Truck, GraduationCap, Cog, Monitor, Radio
} from "lucide-react";
import Section from "@/components/Section";
import InfoCard from "@/components/InfoCard";

const categories = [
  {
    icon: CreditCard,
    title: "Платёжные платформы",
    items: ["Цифровые платёжные системы", "Автоматизация финансовых операций", "Интеграция с банковской инфраструктурой", "Управление транзакциями и отчётностью"],
  },
  {
    icon: Monitor,
    title: "Системы мониторинга",
    items: ["Мониторинг инфраструктуры", "Контроль инженерных систем", "Экологический мониторинг", "IoT и сенсорные сети"],
  },
  {
    icon: Tractor,
    title: "AgroTech",
    items: ["Мониторинг сельхозугодий", "Контроль техники и ресурсов", "Анализ почв и урожайности", "Управление водными ресурсами"],
  },
  {
    icon: Truck,
    title: "Транспорт и логистика",
    items: ["Мониторинг транспорта", "Контроль маршрутов", "Управление автопарком", "Аналитика перевозок"],
  },
  {
    icon: GraduationCap,
    title: "Образование и обучение",
    items: ["Дистанционные платформы", "VR-обучение и симуляторы", "Цифровые лаборатории", "Управление учебным процессом"],
  },
  {
    icon: Cog,
    title: "Станки и цифровое производство",
    items: ["CAD/CAM интеграции", "Системы управления станками", "Автоматизация производства", "Цифровые производственные процессы"],
  },
];

const Software = () => (
  <main className="pt-16">
    <Section
      title="Программное обеспечение / САПР"
      subtitle="Программные решения для ключевых отраслей"
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((c, i) => (
          <InfoCard key={c.title} icon={c.icon} title={c.title} items={c.items} index={i} />
        ))}
      </div>
    </Section>
  </main>
);

export default Software;
