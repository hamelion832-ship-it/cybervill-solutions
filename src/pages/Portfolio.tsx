import { motion } from "framer-motion";
import Section from "@/components/Section";

const cases = [
  {
    period: "2023–2025",
    title: "Цифровизация образовательных учреждений",
    partner: "Образовательные организации и учебные центры",
    done: ["Создание компьютерных классов", "Монтаж сетевой инфраструктуры", "Внедрение IT-оборудования", "Создание цифровой образовательной среды"],
    results: ["Современная образовательная инфраструктура", "Повышение качества обучения", "Цифровая трансформация учебного процесса"],
  },
  {
    period: "2024–2025",
    title: "VR и интерактивные обучающие системы",
    partner: "Образовательные и инженерные центры",
    done: ["Разработка VR-приложений", "Создание интерактивных симуляторов", "Внедрение обучающих VR-решений"],
    results: ["Повышение эффективности обучения", "Безопасная практическая подготовка", "Иммерсивное обучение специалистов"],
  },
  {
    period: "2024–2025",
    title: "Поставка инженерного и учебного оборудования",
    partner: "Образовательные учреждения и технические центры",
    done: ["Поставка беспилотного оборудования для обучения", "Оснащение инженерных лабораторий", "Внедрение учебных технических комплексов"],
    results: ["Развитие инженерных навыков учащихся", "Создание современных учебных лабораторий"],
  },
  {
    period: "2023–2025",
    title: "Мониторинг инфраструктуры и территорий",
    partner: "Муниципальные и промышленные структуры",
    done: ["Внедрение мониторинговых систем", "Контроль территорий и объектов", "Аналитика данных и визуализация"],
    results: ["Повышение безопасности объектов", "Оперативное управление инфраструктурой"],
  },
  {
    period: "2024–2025",
    title: "Промышленный мониторинг и автоматизация",
    partner: "Промышленные предприятия",
    done: ["Внедрение систем мониторинга оборудования", "Контроль технологических процессов", "Внедрение аналитических систем"],
    results: ["Снижение аварийности", "Повышение эффективности производства", "Оптимизация затрат"],
  },
  {
    period: "2024",
    title: "Системы связи и мониторинга объектов",
    partner: "Инфраструктурные и производственные организации",
    done: ["Внедрение систем связи", "Обеспечение устойчивой передачи данных", "Мониторинг объектов и инфраструктуры"],
    results: ["Стабильная связь на объектах", "Повышение управляемости процессов"],
  },
  {
    period: "2024–2025",
    title: "Цифровизация территорий и городской среды",
    partner: "Муниципальные структуры",
    done: ["Мониторинг общественных пространств", "Цифровое управление объектами", "Аналитика городской среды"],
    results: ["Повышение безопасности городской среды", "Улучшение управления инфраструктурой"],
  },
];

const Portfolio = () => (
  <main className="pt-16">
    <Section title="Портфолио" subtitle="Реализованные проекты и кейсы">
      <div className="space-y-6">
        {cases.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-lg border border-border p-6 md:p-8"
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                {c.period}
              </span>
              <h3 className="text-lg font-bold text-foreground">{c.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Партнёры: {c.partner}
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Выполнено</h4>
                <ul className="space-y-1.5">
                  {c.done.map((d) => (
                    <li key={d} className="text-sm text-foreground/80 flex items-start gap-2">
                      <span className="text-accent text-xs mt-0.5">▸</span>{d}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Результат</h4>
                <ul className="space-y-1.5">
                  {c.results.map((r) => (
                    <li key={r} className="text-sm text-foreground/80 flex items-start gap-2">
                      <span className="text-accent text-xs mt-0.5">✔</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  </main>
);

export default Portfolio;
