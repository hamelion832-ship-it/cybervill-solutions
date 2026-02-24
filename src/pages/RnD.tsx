import { motion } from "framer-motion";
import { Brain, Eye, Database, Cpu, Server, Shield, MapPin } from "lucide-react";
import Section from "@/components/Section";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Example {
  title: string;
  location?: string;
  points: string[];
}

interface TechArea {
  icon: typeof Eye;
  title: string;
  description: string;
  tags: string[];
  examples: Example[];
}

const techAreas: TechArea[] = [
  {
    icon: Eye,
    title: "Computer Vision",
    description: "Алгоритмы распознавания объектов, детекции дефектов и анализа видеопотоков в реальном времени. Точность распознавания — до 98% (в зависимости от сценария и условий эксплуатации).",
    tags: ["YOLO", "OpenCV", "Semantic Segmentation", "Object Tracking"],
    examples: [
      {
        title: "Контроль промышленного оборудования и технологических зон",
        location: "машиностроительные предприятия Московской области",
        points: [
          "Обнаружение утечек технических жидкостей и задымления",
          "Контроль присутствия персонала в опасных зонах",
          "Выявление посторонних предметов в рабочей зоне станков",
        ],
      },
      {
        title: "Видеоаналитика для инфраструктурных объектов",
        location: "проекты мониторинга территорий",
        points: [
          "Обнаружение несанкционированного доступа",
          "Отслеживание перемещения объектов",
          "Автоматическая фиксация событий безопасности",
        ],
      },
      {
        title: "Распознавание дефектов поверхностей и узлов оборудования",
        location: "проекты модернизации станков",
        points: [
          "Визуальный контроль состояния узлов",
          "Выявление износа и повреждений",
          "Поддержка технической диагностики",
        ],
      },
    ],
  },
  {
    icon: Brain,
    title: "Machine Learning & AI",
    description: "Прогнозные модели, предиктивное обслуживание, интеллектуальная обработка данных.",
    tags: ["PyTorch", "TensorFlow", "Reinforcement Learning", "NLP"],
    examples: [
      {
        title: "Предиктивная диагностика промышленного оборудования",
        location: "проекты модернизации станков ЧПУ",
        points: [
          "Прогноз износа узлов гидравлики и шпинделей",
          "Выявление отклонений в вибрациях и нагрузках",
          "Предупреждение аварийных остановок",
        ],
      },
      {
        title: "Аналитика данных промышленного мониторинга",
        location: "системы безопасности и мониторинга",
        points: [
          "Анализ показателей газовой среды",
          "Выявление аномалий в производственных процессах",
          "Формирование предупреждений оператору",
        ],
      },
      {
        title: "NLP для автоматизации документооборота",
        location: "подготовка технических отчетов и дефектных ведомостей",
        points: [
          "Автоматизация структурирования технических актов",
          "Классификация заявок на ремонт",
          "Извлечение ключевых параметров из документов",
        ],
      },
    ],
  },
  {
    icon: Database,
    title: "Big Data в финтехе",
    description: "Обработка потоковых данных и построение отказоустойчивых финансовых систем.",
    tags: ["Apache Kafka", "ClickHouse", "Spark", "Blockchain"],
    examples: [
      {
        title: "Проект платформы «ЦифровойВексель»",
        points: [
          "Обработка транзакционных событий в реальном времени",
          "Хранение неизменяемых записей операций",
          "Аналитика оборота цифровых активов",
        ],
      },
      {
        title: "Концепция платежной системы BricsPay",
        points: [
          "Потоковая обработка межбанковских операций",
          "Распределённая архитектура расчетов",
          "Обеспечение прозрачности транзакций",
        ],
      },
      {
        title: "Аналитика финансовых потоков",
        points: [
          "Выявление аномалий операций",
          "Построение отчетности в реальном времени",
          "Контроль транзакционной активности",
        ],
      },
    ],
  },
  {
    icon: Cpu,
    title: "IoT и промышленная автоматизация",
    description: "Сенсорные сети и промышленный мониторинг.",
    tags: ["Modbus", "OPC UA", "Edge Computing", "SCADA"],
    examples: [
      {
        title: "Платформа промышленной безопасности «ЯРАМ-1»",
        location: "промышленные объекты",
        points: [
          "Мониторинг загазованности",
          "Биомониторинг персонала",
          "Контроль параметров среды",
          "Передача данных в диспетчерский центр",
        ],
      },
      {
        title: "Системы мониторинга инженерной инфраструктуры",
        location: "инфраструктурные объекты",
        points: [
          "Сбор телеметрии оборудования",
          "Контроль температуры, давления, влажности",
          "Удалённая диспетчеризация",
        ],
      },
      {
        title: "Edge-обработка данных на объектах",
        points: [
          "Локальная фильтрация и анализ данных",
          "Снижение нагрузки на каналы связи",
          "Обеспечение автономной работы при сбоях сети",
        ],
      },
    ],
  },
  {
    icon: Server,
    title: "Архитектура импортозамещения",
    description: "Разработка и адаптация отечественных решений.",
    tags: ["Отечественное ПО", "ЧПУ", "CAD/CAM", "Astra Linux"],
    examples: [
      {
        title: "Модернизация и восстановление станков ЧПУ",
        location: "предприятия машиностроения",
        points: [
          "Адаптация систем управления",
          "Замена кабельной инфраструктуры и датчиков",
          "Восстановление функциональности при ограниченном доступе к оригинальным компонентам",
        ],
      },
      {
        title: "Адаптация инженерного ПО и рабочих станций",
        location: "образовательные и технические центры",
        points: [
          "Настройка рабочих мест на базе отечественных ОС",
          "Интеграция CAD/CAM-сред",
          "Подготовка инфраструктуры для импортонезависимой эксплуатации",
        ],
      },
      {
        title: "Создание устойчивой ИТ-инфраструктуры",
        points: [
          "Локальные серверные решения",
          "Отказ от зарубежных облачных сервисов",
          "Обеспечение информационной безопасности",
        ],
      },
    ],
  },
  {
    icon: Shield,
    title: "Иммерсивные технологии",
    description: "VR-симуляторы, цифровые двойники и XR-обучение.",
    tags: ["Unity", "Unreal Engine", "Digital Twin", "XR"],
    examples: [
      {
        title: "Создание VR-классов и обучающих пространств",
        location: "образовательные учреждения Волгоградской области",
        points: [
          "Развёртывание VR-инфраструктуры",
          "Создание цифровой образовательной среды",
          "Обучение работе с инженерным оборудованием",
        ],
      },
      {
        title: "VR-симуляторы для безопасного обучения",
        points: [
          "Моделирование работы техники и оборудования",
          "Обучение действиям в опасных условиях",
          "Иммерсивные сценарии подготовки персонала",
        ],
      },
      {
        title: "Цифровые двойники инфраструктурных объектов (концептуальные разработки)",
        points: [
          "Визуализация инженерных систем",
          "Моделирование сценариев эксплуатации",
          "Анализ рисков и нагрузок",
        ],
      },
    ],
  },
];

const sntrDirections = [
  "Переход к передовым цифровым и интеллектуальным производственным технологиям",
  "Переход к экологически чистой и ресурсосберегающей энергетике",
  "Связанность территорий и развитие транспортной инфраструктуры",
  "Противодействие техногенным угрозам и обеспечение безопасности",
];

const ExampleCard = ({ example }: { example: Example }) => (
  <div className="bg-muted/40 rounded-md p-4">
    <p className="font-medium text-foreground text-sm mb-1">{example.title}</p>
    {example.location && (
      <p className="text-xs text-accent flex items-center gap-1 mb-2">
        <MapPin className="w-3 h-3" />
        {example.location}
      </p>
    )}
    <ul className="space-y-1">
      {example.points.map((pt, i) => (
        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
          <span className="text-accent mt-0.5">•</span>
          {pt}
        </li>
      ))}
    </ul>
  </div>
);

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
      <Accordion type="multiple" className="space-y-4">
        {techAreas.map((area, i) => {
          const Icon = area.icon;
          return (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <AccordionItem value={area.title} className="bg-card rounded-lg border border-border px-6 py-2">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{area.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{area.description}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-2 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {area.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-3">Примеры реализаций</p>
                      <div className="grid md:grid-cols-3 gap-3">
                        {area.examples.map((ex, j) => (
                          <ExampleCard key={j} example={ex} />
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          );
        })}
      </Accordion>
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
