import { useState } from "react";
import {
  CreditCard, Tractor, Truck, GraduationCap, Cog, Monitor, ExternalLink, ChevronLeft, ChevronRight
} from "lucide-react";
import Section from "@/components/Section";
import InfoCard from "@/components/InfoCard";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CNC_PHOTOS = Array.from({ length: 10 }, (_, i) => `/materials/cnc/photo-${i + 1}.jpg`);

const EDU_DEMOS = [
  { title: "Дистанционная образовательная платформа", url: "https://edu-demo.example.com", description: "Онлайн-обучение, тестирование и управление учебным процессом" },
  { title: "VR-симулятор безопасности", url: "https://vr-demo.example.com", description: "Интерактивный тренажёр в виртуальной реальности" },
  { title: "Цифровая лаборатория", url: "https://lab-demo.example.com", description: "Инженерные эксперименты в цифровой среде" },
];

const AGRO_DEMOS = [
  { title: "Мониторинг сельхозугодий", url: "https://agro-monitor.example.com", description: "Спутниковый и наземный контроль полей" },
  { title: "Анализ почв и урожайности", url: "https://agro-analytics.example.com", description: "Аналитика данных для оптимизации урожая" },
  { title: "Управление водными ресурсами", url: "https://water-mgmt.example.com", description: "Контроль ирригации и водоснабжения" },
];

const TRANSPORT_DEMOS = [
  { title: "Мониторинг транспорта", url: "https://transport-monitor.example.com", description: "Отслеживание транспорта и техники в реальном времени" },
];

type ModalType = "payment" | "cnc" | "education" | "monitoring" | "agro" | "transport" | null;

const PDF_PATHS: Partial<Record<Exclude<ModalType, null>, string>> = {
  payment: "/materials/payment/presentation.pdf",
  education: "/materials/education/presentation.pdf",
  monitoring: "/materials/monitoring/presentation.pdf",
  agro: "/materials/agro/presentation.pdf",
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

const ImageGallery = ({ images, slide, setSlide }: { images: string[]; slide: number; setSlide: (s: number) => void }) => {
  const prev = () => setSlide(slide > 0 ? slide - 1 : images.length - 1);
  const next = () => setSlide(slide < images.length - 1 ? slide + 1 : 0);
  return (
    <div className="relative bg-muted rounded-lg overflow-hidden">
      <img src={images[slide]} alt={`Фото ${slide + 1}`} className="w-full h-auto object-contain min-h-[300px]"
        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
      <div className="absolute inset-y-0 left-0 flex items-center">
        <Button variant="ghost" size="icon" onClick={prev} className="ml-2 bg-background/70 hover:bg-background/90 rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <Button variant="ghost" size="icon" onClick={next} className="mr-2 bg-background/70 hover:bg-background/90 rounded-full">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/80 text-foreground text-xs px-3 py-1 rounded-full">
        {slide + 1} / {images.length}
      </div>
    </div>
  );
};

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
    <iframe src={src} className="w-full" style={{ height: "70vh", minHeight: "400px" }} title="PDF документ" />
    <p className="text-xs text-muted-foreground p-3">
      Разместите PDF-файл по пути <code>{src}</code> на сервере. Если PDF не отображается, <a href={src} target="_blank" rel="noopener noreferrer" className="underline text-accent">скачайте файл</a>.
    </p>
  </div>
);

const Software = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [slide, setSlide] = useState(0);

  const openModal = (type: ModalType) => { setActiveModal(type); setSlide(0); };

  const demos = activeModal ? DEMOS[activeModal] : undefined;
  const pdfPath = activeModal ? PDF_PATHS[activeModal] : undefined;
  const isCnc = activeModal === "cnc";
  const isTransport = activeModal === "transport";

  const renderModalContent = () => {
    if (!activeModal) return null;

    // CNC: photo gallery only
    if (isCnc) {
      return (
        <div className="px-6 pb-6">
          <ImageGallery images={CNC_PHOTOS} slide={slide} setSlide={setSlide} />
          <p className="text-xs text-muted-foreground mt-3">
            Разместите фотографии в папке <code>/materials/cnc/</code> на сервере.
          </p>
        </div>
      );
    }

    // Transport: demo links only
    if (isTransport) {
      return (
        <div className="px-6 pb-6">
          <DemoLinks demos={TRANSPORT_DEMOS} />
        </div>
      );
    }

    // Categories with PDF + demos tabs
    if (pdfPath && demos) {
      return (
        <Tabs defaultValue="pdf" className="px-6 pb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="pdf">Презентация</TabsTrigger>
            <TabsTrigger value="demos">Демо-версии</TabsTrigger>
          </TabsList>
          <TabsContent value="pdf"><PdfViewer src={pdfPath} /></TabsContent>
          <TabsContent value="demos"><DemoLinks demos={demos} /></TabsContent>
        </Tabs>
      );
    }

    // PDF only
    if (pdfPath) {
      return <div className="px-6 pb-6"><PdfViewer src={pdfPath} /></div>;
    }

    return null;
  };

  return (
    <main className="pt-16">
      <Section title="Программное обеспечение / САПР" subtitle="Программные решения для ключевых отраслей">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((c, i) => (
            <InfoCard key={c.title} icon={c.icon} title={c.title} items={c.items} index={i}
              onClick={c.modal ? () => openModal(c.modal!) : undefined} />
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
            {renderModalContent()}
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
};

export default Software;
