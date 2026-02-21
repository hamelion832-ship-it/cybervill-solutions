import { Radio, Eye, Plane, Monitor, Waves } from "lucide-react";
import Section from "@/components/Section";
import InfoCard from "@/components/InfoCard";

const groups = [
  {
    icon: Radio,
    title: "Средства связи",
    items: ["Радиостанции", "Сетевое оборудование", "Системы передачи данных", "Защищённые каналы связи"],
  },
  {
    icon: Eye,
    title: "Средства мониторинга",
    items: ["Системы наблюдения", "Экологические датчики", "Платформы мониторинга", "IoT-решения"],
  },
  {
    icon: Plane,
    title: "Учебные дроны",
    items: ["FPV-дроны для обучения", "Инженерные комплекты", "Наборы робототехники", "Системы управления для обучения"],
  },
  {
    icon: Monitor,
    title: "Учебные интерактивные пространства",
    items: ["VR-классы", "Цифровые лаборатории", "Мультимедийные пространства", "Инженерные учебные зоны"],
  },
  {
    icon: Waves,
    title: "Учебные бассейны и полигоны",
    items: ["Бассейны для испытаний подводных аппаратов", "Тренировочные комплексы", "Инженерные испытательные среды"],
  },
];

const Products = () => (
  <main className="pt-16">
    <Section title="Товары и решения" subtitle="Оборудование и комплексные решения для образования, мониторинга и связи">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {groups.map((g, i) => (
          <InfoCard key={g.title} icon={g.icon} title={g.title} items={g.items} index={i} />
        ))}
      </div>
    </Section>
  </main>
);

export default Products;
