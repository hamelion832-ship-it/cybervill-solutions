import { useState } from "react";
import {
  CreditCard, Eye, Tractor, Truck, GraduationCap, Cog, Monitor, ChevronLeft, ChevronRight, X, Play
} from "lucide-react";
import Section from "@/components/Section";
import InfoCard from "@/components/InfoCard";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PAYMENT_SLIDES = Array.from({ length: 12 }, (_, i) => `/materials/payment/slide-${i + 1}.jpg`);

const categories = [
  {
    icon: CreditCard,
    title: "Платёжные платформы",
    items: ["Цифровые платёжные системы", "Автоматизация финансовых операций", "Интеграция с банковской инфраструктурой", "Управление транзакциями и отчётностью"],
    hasDetails: true,
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

const Software = () => {
  const [open, setOpen] = useState(false);
  const [slide, setSlide] = useState(0);

  const prev = () => setSlide((s) => (s > 0 ? s - 1 : PAYMENT_SLIDES.length - 1));
  const next = () => setSlide((s) => (s < PAYMENT_SLIDES.length - 1 ? s + 1 : 0));

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
              onClick={c.hasDetails ? () => { setOpen(true); setSlide(0); } : undefined}
            />
          ))}
        </div>
      </Section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl">Платёжные платформы — БриксПей</DialogTitle>
            <DialogDescription>
              Блокчейн-платёжная система для цифровых и фиатных операций
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="slides" className="px-6 pb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="slides">Материалы</TabsTrigger>
              <TabsTrigger value="video">Видео</TabsTrigger>
            </TabsList>

            <TabsContent value="slides">
              <div className="relative bg-muted rounded-lg overflow-hidden">
                <img
                  src={PAYMENT_SLIDES[slide]}
                  alt={`Слайд ${slide + 1}`}
                  className="w-full h-auto object-contain"
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
                  {slide + 1} / {PAYMENT_SLIDES.length}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="video">
              <div className="bg-muted rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                {/* Replace src with actual video URL from your server */}
                <video
                  controls
                  className="w-full h-full"
                  poster={PAYMENT_SLIDES[0]}
                >
                  <source src="/materials/payment/video.mp4" type="video/mp4" />
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Play className="w-12 h-12" />
                    <p>Видео будет доступно после размещения на сервере</p>
                  </div>
                </video>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Разместите видеофайл по пути <code>/materials/payment/video.mp4</code> на сервере.
              </p>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Software;
