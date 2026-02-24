import { motion } from "framer-motion";
import { FileText, Award, ShieldCheck, Download } from "lucide-react";
import Section from "@/components/Section";
import { Button } from "@/components/ui/button";

const certificates = [
  { name: "Платформа автоматизации мониторинга строительства", regNumber: "2024XXXXXX", date: "2024", registry: true },
  { name: "Финтех-платформа BrixPay", regNumber: "2024XXXXXX", date: "2024", registry: true },
  { name: "Система промышленного мониторинга «ЯРАМ-1»", regNumber: "2023XXXXXX", date: "2023", registry: true },
  { name: "Система иммерсивного образования и симуляции", regNumber: "2023XXXXXX", date: "2023", registry: false },
  { name: "Платформа территориального мониторинга", regNumber: "2024XXXXXX", date: "2024", registry: true },
  { name: "Платформа цифрового станкостроения", regNumber: "2023XXXXXX", date: "2023", registry: false },
];

const IntellectualProperty = () => (
  <main className="pt-16">
    <section className="bg-primary py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground mb-4">
            Интеллектуальная собственность
          </h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl">
            Реестр свидетельств о регистрации программ для ЭВМ и включение в Реестр отечественного ПО Минцифры
          </p>
          <div className="w-16 h-1 bg-accent mt-6 rounded-full" />
        </motion.div>
      </div>
    </section>

    <Section title="Свидетельства о государственной регистрации" subtitle="Программные продукты, зарегистрированные в установленном порядке">
      <div className="grid gap-4">
        {certificates.map((cert, i) => (
          <motion.div
            key={cert.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-lg border border-border p-5 flex flex-col md:flex-row md:items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm">{cert.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Свидетельство № {cert.regNumber} · {cert.date} г.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {cert.registry && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Реестр Минцифры
                </span>
              )}
              <Button variant="outline" size="sm" className="gap-1.5" disabled>
                <Download className="w-3.5 h-3.5" />
                PDF
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>

    <Section title="Реестр отечественного ПО" subtitle="Подтверждение соответствия требованиям Минцифры России" alt>
      <div className="bg-card rounded-lg border border-border p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg mb-2">Включение в Единый реестр российских программ</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Программные продукты КИБЕРВИЛЛ включены в Единый реестр российских программ для электронных вычислительных машин 
              и баз данных Министерства цифрового развития, связи и массовых коммуникаций Российской Федерации.
              Это подтверждает их соответствие требованиям импортозамещения и возможность использования 
              в государственных и муниципальных организациях.
            </p>
            <p className="text-xs text-muted-foreground italic">
              * Конкретные номера реестровых записей будут добавлены после предоставления документации
            </p>
          </div>
        </div>
      </div>
    </Section>
  </main>
);

export default IntellectualProperty;
