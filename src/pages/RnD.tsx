import { motion } from "framer-motion";
import { Brain, Eye, Database, Cpu, Server, Shield } from "lucide-react";
import Section from "@/components/Section";

const techAreas = [
  {
    icon: Eye,
    title: "Computer Vision",
    description: "Алгоритмы распознавания объектов, детекции дефектов и анализа видеопотоков в реальном времени. Точность распознавания — до 98%.",
    tags: ["YOLO", "OpenCV", "Semantic Segmentation", "Object Tracking"],
  },
  {
    icon: Brain,
    title: "Machine Learning & AI",
    description: "Прогнозные модели для промышленного мониторинга, предиктивное обслуживание оборудования, NLP для автоматизации документооборота.",
    tags: ["PyTorch", "TensorFlow", "Reinforcement Learning", "NLP"],
  },
  {
    icon: Database,
    title: "Big Data в финтехе",
    description: "Обработка потоковых данных, блокчейн-аналитика, построение отказоустойчивых pipeline для финансовых транзакций.",
    tags: ["Apache Kafka", "ClickHouse", "Spark", "Blockchain"],
  },
  {
    icon: Cpu,
    title: "IoT и промышленная автоматизация",
    description: "Проектирование сенсорных сетей, протоколы Modbus/OPC UA, edge-вычисления для промышленных систем мониторинга.",
    tags: ["Modbus", "OPC UA", "Edge Computing", "SCADA"],
  },
  {
    icon: Server,
    title: "Архитектура импортозамещения",
    description: "Разработка отечественных систем управления станками с ЧПУ, замена зарубежных контроллеров, адаптация CAD/CAM-систем.",
    tags: ["Отечественное ПО", "ЧПУ", "CAD/CAM", "Astra Linux"],
  },
  {
    icon: Shield,
    title: "Иммерсивные технологии",
    description: "VR-симуляторы для обучения и промышленной безопасности, цифровые двойники объектов инфраструктуры.",
    tags: ["Unity", "Unreal Engine", "Digital Twin", "XR"],
  },
];

const sntrDirections = [
  "Переход к передовым цифровым и интеллектуальным производственным технологиям",
  "Переход к экологически чистой и ресурсосберегающей энергетике",
  "Связанность территорий и развитие транспортной инфраструктуры",
  "Противодействие техногенным угрозам и обеспечение безопасности",
];

const RnD = () => (
  <main className="pt-16">
    {/* Hero */}
    <section className="bg-primary py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground mb-4">
            R&D и Технологический стек
          </h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl">
            Мы не просто программируем — мы создаём новые технологические подходы для промышленности, финтеха и образования
          </p>
          <div className="w-16 h-1 bg-accent mt-6 rounded-full" />
        </motion.div>
      </div>
    </section>

    {/* Tech areas */}
    <Section title="Ключевые направления исследований" subtitle="Алгоритмы и платформы, разрабатываемые командой КИБЕРВИЛЛ">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techAreas.map((area, i) => {
          const Icon = area.icon;
          return (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-card rounded-lg border border-border p-6 card-hover"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">{area.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{area.description}</p>
              <div className="flex flex-wrap gap-2">
                {area.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>

    {/* SNTR alignment */}
    <Section title="Соответствие СНТР" subtitle="Наши продукты соответствуют приоритетным направлениям Стратегии научно-технологического развития РФ" alt>
      <div className="grid md:grid-cols-2 gap-4">
        {sntrDirections.map((d, i) => (
          <motion.div
            key={d}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex items-start gap-3 bg-card rounded-lg border border-border p-5"
          >
            <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1.5" />
            <span className="text-sm font-medium text-foreground leading-relaxed">{d}</span>
          </motion.div>
        ))}
      </div>
    </Section>

    {/* Methodology */}
    <Section title="Методология" subtitle="Наукоёмкий подход к каждому проекту">
      <div className="grid md:grid-cols-4 gap-4">
        {["Исследование и анализ", "Прототипирование", "Пилотное внедрение", "Масштабирование"].map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-lg border border-border p-5 text-center"
          >
            <div className="w-8 h-8 rounded-full bg-accent/20 text-accent font-bold text-sm flex items-center justify-center mx-auto mb-3">
              {i + 1}
            </div>
            <span className="text-sm font-semibold text-foreground">{step}</span>
          </motion.div>
        ))}
      </div>
    </Section>
  </main>
);

export default RnD;
