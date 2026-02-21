import { useState } from "react";
import {
  CreditCard, Tractor, Truck, GraduationCap, Cog, Monitor, ExternalLink
} from "lucide-react";
import Section from "@/components/Section";
import InfoCard from "@/components/InfoCard";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EDU_DEMOS = [
  { title: "Дистанционная образовательная платформа", url: "https://edu-demo.example.com", description: "Онлайн-обучение, тестирование и управление учебным процессом" },
  { title: "VR-симулятор безопасности", url: "https://vr-demo.example.com", description: "Интерактивный тренажёр в виртуальной реальности" },
  { title: "Цифровая лаборатория", url: "https://lab-demo.example.com", description: "Инженерные эксперименты в цифровой среде" },
];

const MONITOR_DEMOS = [
  { title: "Мониторинг инфраструктуры", url: "https://infra-monitor.example.com", description: "Контроль состояния объектов в реальном времени" },
  { title: "Экологический мониторинг", url: "https://eco-monitor.example.com", description: "Наблюдение за экологическими показателями территорий" },
  { title: "IoT-платформа", url: "https://iot-platform.example.com", description: "Управление сенсорными сетями и устройствами" },
];

const AGRO_DEMOS = [
  { title: "Мониторинг сельхозугодий", url: "https://agro-monitor.example.com", description: "Спутниковый и наземный контроль полей" },
  { title: "Анализ почв и урожайности", url: "https://agro-analytics.example.com", description: "Аналитика данных для оптимизации урожая" },
  { title: "Управление водными ресурсами", url: "https://water-mgmt.example.com", description: "Контроль ирригации и водоснабжения" },
];

const TRANSPORT_DEMOS = [
  { title: "Мониторинг транспорта", url: "https://transport-monitor.example.com", description: "Отслеживание транспорта и техники в реальном времени" },
  { title: "Управление автопарком", url: "https://fleet-mgmt.example.com", description: "Контроль состояния и обслуживания техники" },
  { title: "Аналитика перевозок", url: "https://logistics-analytics.example.com", description: "Оптимизация маршрутов и анализ эффективности" },
];

type ModalType = "payment" | "cnc" | "education" | "monitoring" | "agro" | "transport" | null;

const PDF_PATHS: Record<Exclude<ModalType, null>, string> = {
  payment: "/materials/payment/presentation.pdf",
  cnc: "/materials/cnc/presentation.pdf",
  education: "/materials/education/presentation.pdf",
  monitoring: "/materials/monitoring/presentation.pdf",
  agro: "/materials/agro/presentation.pdf",
  transport: "/materials/transport/presentation.pdf",
};

const MODAL_INFO: Record<Exclude<ModalType, null>, { title: string; description: string }> = {
  payment: { title: "Платёжные платформы — БриксПей", description: "Блокчейн-платёжная система для цифровых и фиатных операций" },
  cnc: { title: "Станки и цифровое производство", description: "CAD/CAM интеграции и автоматизация станочного оборудования" },
  education: { title: "Образование и обучение", description: "Дистанционные платформы, VR-обучение и цифровые лаборатории" },
  monitoring: { title: "Системы мониторинга", description: "Мониторинг инфраструктуры, экологии и IoT-платформы" },
  agro: { title: "AgroTech", description: "Агротехнологические решения для мониторинга и аналитики" },
  transport: { title: "Транспорт и логистика", description: "Мониторинг транспорта, управление автопарком и аналитика" },
};

const DEMOS: Partial<Record<Exclude<ModalType, null>, typeof EDU_DEMOS>> = {
  education: EDU_DEMOS,
  agro: AGRO_DEMOS,
  transport: TRANSPORT_DEMOS,
};

const categories = [
  {
    icon: CreditCard, title: "Платёжные платформы",
    items: ["Цифровые платёжные системы", "Автоматизация финансовых операций", "Интеграция с банковской инфраструктурой", "Управление транзакциями и отчётностью"],
    modal: "payment" as ModalType,
  },
  {
    icon: Monitor, title: "Системы мониторинга",
    items: ["Мониторинг инфраструктуры", "Контроль инженерных систем", "Экологический мониторинг", "IoT и сенсорные сети"],
    modal: "monitoring" as ModalType,
  },
  {
    icon: Tractor, title: "AgroTech",
    items: ["Мониторинг сельхозугодий", "Контроль техники и ресурсов", "Анализ почв и урожайности", "Управление водными ресурсами"],
    modal: "agro" as ModalType,
  },
  {
    icon: Truck, title: "Транспорт и логистика",
    items: ["Мониторинг транспорта", "Контроль маршрутов", "Управление автопарком", "Аналитика перевозок"],
    modal: "transport" as ModalType,
  },
  {
    icon: GraduationCap, title: "Образование и обучение",
    items: ["Дистанционные платформы", "VR-обучение и симуляторы", "Цифровые лаборатории", "Управление учебным процессом"],
    modal: "education" as ModalType,
  },
  {
    icon: Cog, title: "Станки и цифровое производство",
    items: ["CAD/CAM интеграции", "Системы управления станками", "Автоматизация производства", "Цифровые производственные процессы"],
    modal: "cnc" as ModalType,
  },
];

const DemoLinks = ({ demos }: { demos: typeof EDU_DEMOS }) => (
  <div className="space-y-3">
    {demos.map((demo) => (
      <a key={demo.title} href={demo.url} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/10 transition-colors group">
        <div>
          <h4 className="font-medium text-foreground group-hover:text-accent transition-colors">{demo.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{demo.description}</p>
        </div>
        <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-accent shrink-0" />
      </a>
    ))}
  </div>
);

const PdfViewer = ({ src }: { src: string }) => (
  <div className="rounded-lg overflow-hidden border border-border bg-muted">
    <iframe
      src={src}
      className="w-full"
      style={{ height: "70vh", minHeight: "400px" }}
      title="PDF документ"
    />
    <p className="text-xs text-muted-foreground p-3">
      Разместите PDF-файл по пути <code>{src}</code> на сервере. Если PDF не отображается, <a href={src} target="_blank" rel="noopener noreferrer" className="underline text-accent">скачайте файл</a>.
    </p>
  </div>
);

const Software = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const demos = activeModal ? DEMOS[activeModal] : undefined;
  const hasTabs = !!demos;

  return (
    <main className="pt-16">
      <Section title="Программное обеспечение / САПР" subtitle="Программные решения для ключевых отраслей">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((c, i) => (
            <InfoCard key={c.title} icon={c.icon} title={c.title} items={c.items} index={i}
              onClick={c.modal ? () => setActiveModal(c.modal!) : undefined} />
          ))}
        </div>
      </Section>

      {activeModal && (
        <Dialog open={!!activeModal} onOpenChange={(v) => !v && setActiveModal(null)}>
          <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto p-0">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-xl">{MODAL_INFO[activeModal].title}</DialogTitle>
              <DialogDescription>{MODAL_INFO[activeModal].description}</DialogDescription>
            </DialogHeader>
            {hasTabs ? (
              <Tabs defaultValue="pdf" className="px-6 pb-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="pdf">Презентация</TabsTrigger>
                  <TabsTrigger value="demos">Демо-версии</TabsTrigger>
                </TabsList>
                <TabsContent value="pdf">
                  <PdfViewer src={PDF_PATHS[activeModal]} />
                </TabsContent>
                <TabsContent value="demos">
                  <DemoLinks demos={demos!} />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="px-6 pb-6">
                <PdfViewer src={PDF_PATHS[activeModal]} />
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
};

export default Software;
