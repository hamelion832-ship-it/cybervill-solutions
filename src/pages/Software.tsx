import { useState } from "react";
import {
  CreditCard, Tractor, Truck, GraduationCap, Cog, Monitor, ChevronLeft, ChevronRight, Play, Image, ExternalLink
} from "lucide-react";
import Section from "@/components/Section";
import InfoCard from "@/components/InfoCard";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PAYMENT_SLIDES = Array.from({ length: 12 }, (_, i) => `/materials/payment/slide-${i + 1}.jpg`);

const CNC_PHOTOS = Array.from({ length: 10 }, (_, i) => `/materials/cnc/photo-${i + 1}.jpg`);
const EDU_PHOTOS = Array.from({ length: 10 }, (_, i) => `/materials/education/photo-${i + 1}.jpg`);
const MONITOR_PHOTOS = Array.from({ length: 10 }, (_, i) => `/materials/monitoring/photo-${i + 1}.jpg`);
const AGRO_PHOTOS = Array.from({ length: 10 }, (_, i) => `/materials/agro/photo-${i + 1}.jpg`);
const TRANSPORT_PHOTOS = Array.from({ length: 10 }, (_, i) => `/materials/transport/photo-${i + 1}.jpg`);

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

const categories = [
  {
    icon: CreditCard,
    title: "Платёжные платформы",
    items: ["Цифровые платёжные системы", "Автоматизация финансовых операций", "Интеграция с банковской инфраструктурой", "Управление транзакциями и отчётностью"],
    modal: "payment" as ModalType,
  },
  {
    icon: Monitor,
    title: "Системы мониторинга",
    items: ["Мониторинг инфраструктуры", "Контроль инженерных систем", "Экологический мониторинг", "IoT и сенсорные сети"],
    modal: "monitoring" as ModalType,
  },
  {
    icon: Tractor,
    title: "AgroTech",
    items: ["Мониторинг сельхозугодий", "Контроль техники и ресурсов", "Анализ почв и урожайности", "Управление водными ресурсами"],
    modal: "agro" as ModalType,
  },
  {
    icon: Truck,
    title: "Транспорт и логистика",
    items: ["Мониторинг транспорта", "Контроль маршрутов", "Управление автопарком", "Аналитика перевозок"],
    modal: "transport" as ModalType,
  },
  {
    icon: GraduationCap,
    title: "Образование и обучение",
    items: ["Дистанционные платформы", "VR-обучение и симуляторы", "Цифровые лаборатории", "Управление учебным процессом"],
    modal: "education" as ModalType,
  },
  {
    icon: Cog,
    title: "Станки и цифровое производство",
    items: ["CAD/CAM интеграции", "Системы управления станками", "Автоматизация производства", "Цифровые производственные процессы"],
    modal: "cnc" as ModalType,
  },
];

const ImageGallery = ({ images, slide, setSlide }: { images: string[]; slide: number; setSlide: (s: number) => void }) => {
  const prev = () => setSlide(slide > 0 ? slide - 1 : images.length - 1);
  const next = () => setSlide(slide < images.length - 1 ? slide + 1 : 0);

  return (
    <div className="relative bg-muted rounded-lg overflow-hidden">
      <img
        src={images[slide]}
        alt={`Фото ${slide + 1}`}
        className="w-full h-auto object-contain min-h-[300px]"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder.svg";
        }}
      />
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

const Software = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [slide, setSlide] = useState(0);

  const openModal = (type: ModalType) => {
    setActiveModal(type);
    setSlide(0);
  };

  return (
    <main className="pt-16">
      <Section
        title="Программное обеспечение / САПР"
        subtitle="Программные решения для ключевых отраслей"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((c, i) => (
            <InfoCard
              key={c.title}
              icon={c.icon}
              title={c.title}
              items={c.items}
              index={i}
              onClick={c.modal ? () => openModal(c.modal!) : undefined}
            />
          ))}
        </div>
      </Section>

      {/* Платёжные платформы */}
      <Dialog open={activeModal === "payment"} onOpenChange={(v) => !v && setActiveModal(null)}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl">Платёжные платформы — БриксПей</DialogTitle>
            <DialogDescription>Блокчейн-платёжная система для цифровых и фиатных операций</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="slides" className="px-6 pb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="slides">Материалы</TabsTrigger>
              <TabsTrigger value="video">Видео</TabsTrigger>
            </TabsList>
            <TabsContent value="slides">
              <ImageGallery images={PAYMENT_SLIDES} slide={slide} setSlide={setSlide} />
            </TabsContent>
            <TabsContent value="video">
              <div className="bg-muted rounded-lg overflow-hidden aspect-video">
                <video controls className="w-full h-full" poster={PAYMENT_SLIDES[0]}>
                  <source src="/materials/payment/video.mp4" type="video/mp4" />
                </video>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Разместите видеофайл по пути <code>/materials/payment/video.mp4</code> на сервере.
              </p>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Станки и цифровое производство */}
      <Dialog open={activeModal === "cnc"} onOpenChange={(v) => !v && setActiveModal(null)}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl">Станки и цифровое производство</DialogTitle>
            <DialogDescription>Фотогалерея проектов модернизации и автоматизации станочного оборудования</DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6">
            <ImageGallery images={CNC_PHOTOS} slide={slide} setSlide={setSlide} />
            <p className="text-xs text-muted-foreground mt-3">
              Разместите фотографии в папке <code>/materials/cnc/</code> на сервере с именами <code>photo-1.jpg</code>, <code>photo-2.jpg</code> и т.д.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Образование и обучение */}
      <Dialog open={activeModal === "education"} onOpenChange={(v) => !v && setActiveModal(null)}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl">Образование и обучение</DialogTitle>
            <DialogDescription>Фотоматериалы и демонстрационные версии образовательных платформ</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="photos" className="px-6 pb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="photos">Фотографии</TabsTrigger>
              <TabsTrigger value="demos">Демо-версии</TabsTrigger>
            </TabsList>
            <TabsContent value="photos">
              <ImageGallery images={EDU_PHOTOS} slide={slide} setSlide={setSlide} />
              <p className="text-xs text-muted-foreground mt-3">
                Разместите фотографии в папке <code>/materials/education/</code> на сервере.
              </p>
            </TabsContent>
            <TabsContent value="demos">
              <div className="space-y-3">
                {EDU_DEMOS.map((demo) => (
                  <a
                    key={demo.title}
                    href={demo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/10 transition-colors group"
                  >
                    <div>
                      <h4 className="font-medium text-foreground group-hover:text-accent transition-colors">{demo.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{demo.description}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-accent shrink-0" />
                  </a>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Замените URL в коде на реальные адреса демонстрационных версий.
              </p>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Системы мониторинга */}
      <Dialog open={activeModal === "monitoring"} onOpenChange={(v) => !v && setActiveModal(null)}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl">Системы мониторинга</DialogTitle>
            <DialogDescription>Фотоматериалы и демонстрационные версии платформ мониторинга</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="photos" className="px-6 pb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="photos">Фотографии</TabsTrigger>
              <TabsTrigger value="demos">Демо-версии</TabsTrigger>
            </TabsList>
            <TabsContent value="photos">
              <ImageGallery images={MONITOR_PHOTOS} slide={slide} setSlide={setSlide} />
              <p className="text-xs text-muted-foreground mt-3">Разместите фотографии в папке <code>/materials/monitoring/</code> на сервере.</p>
            </TabsContent>
            <TabsContent value="demos">
              <div className="space-y-3">
                {MONITOR_DEMOS.map((demo) => (
                  <a key={demo.title} href={demo.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/10 transition-colors group">
                    <div>
                      <h4 className="font-medium text-foreground group-hover:text-accent transition-colors">{demo.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{demo.description}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-accent shrink-0" />
                  </a>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">Замените URL на реальные адреса демо-версий.</p>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* AgroTech */}
      <Dialog open={activeModal === "agro"} onOpenChange={(v) => !v && setActiveModal(null)}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl">AgroTech</DialogTitle>
            <DialogDescription>Фотоматериалы и демонстрационные версии агротехнологических решений</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="photos" className="px-6 pb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="photos">Фотографии</TabsTrigger>
              <TabsTrigger value="demos">Демо-версии</TabsTrigger>
            </TabsList>
            <TabsContent value="photos">
              <ImageGallery images={AGRO_PHOTOS} slide={slide} setSlide={setSlide} />
              <p className="text-xs text-muted-foreground mt-3">Разместите фотографии в папке <code>/materials/agro/</code> на сервере.</p>
            </TabsContent>
            <TabsContent value="demos">
              <div className="space-y-3">
                {AGRO_DEMOS.map((demo) => (
                  <a key={demo.title} href={demo.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/10 transition-colors group">
                    <div>
                      <h4 className="font-medium text-foreground group-hover:text-accent transition-colors">{demo.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{demo.description}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-accent shrink-0" />
                  </a>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">Замените URL на реальные адреса демо-версий.</p>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Транспорт и логистика */}
      <Dialog open={activeModal === "transport"} onOpenChange={(v) => !v && setActiveModal(null)}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl">Транспорт и логистика</DialogTitle>
            <DialogDescription>Фотоматериалы и демонстрационные версии транспортных решений</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="photos" className="px-6 pb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="photos">Фотографии</TabsTrigger>
              <TabsTrigger value="demos">Демо-версии</TabsTrigger>
            </TabsList>
            <TabsContent value="photos">
              <ImageGallery images={TRANSPORT_PHOTOS} slide={slide} setSlide={setSlide} />
              <p className="text-xs text-muted-foreground mt-3">Разместите фотографии в папке <code>/materials/transport/</code> на сервере.</p>
            </TabsContent>
            <TabsContent value="demos">
              <div className="space-y-3">
                {TRANSPORT_DEMOS.map((demo) => (
                  <a key={demo.title} href={demo.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/10 transition-colors group">
                    <div>
                      <h4 className="font-medium text-foreground group-hover:text-accent transition-colors">{demo.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{demo.description}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-accent shrink-0" />
                  </a>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">Замените URL на реальные адреса демо-версий.</p>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Software;
