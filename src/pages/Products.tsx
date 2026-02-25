import { useState } from "react";
import { Radio, Eye, Plane, Monitor, Waves, ChevronLeft, ChevronRight } from "lucide-react";
import Section from "@/components/Section";
import InfoCard from "@/components/InfoCard";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ModalType = "radio" | "monitoring" | "drones" | "interactive" | "pools" | null;

const PHOTOS: Record<Exclude<ModalType, null>, string[]> = {
  radio: Array.from({ length: 6 }, (_, i) => `/materials/products/radio/photo-${i + 1}.jpg`),
  monitoring: Array.from({ length: 10 }, (_, i) => `/materials/products/monitoring/photo-${i + 1}.jpg`),
  drones: Array.from({ length: 6 }, (_, i) => `/materials/products/drones/photo-${i + 1}.jpg`),
  interactive: Array.from({ length: 8 }, (_, i) => `/materials/products/interactive/photo-${i + 1}.jpg`),
  pools: Array.from({ length: 5 }, (_, i) => `/materials/products/pools/photo-${i + 1}.jpg`),
};

const MODAL_INFO: Record<Exclude<ModalType, null>, { title: string; description: string; folder: string }> = {
  radio: { title: "Средства связи", description: "Фотогалерея оборудования связи", folder: "/materials/products/radio/" },
  monitoring: { title: "Средства мониторинга", description: "Фотогалерея средств мониторинга", folder: "/materials/products/monitoring/" },
  drones: { title: "Учебные дроны", description: "Фотогалерея учебных дронов и робототехники", folder: "/materials/products/drones/" },
  interactive: { title: "Учебные интерактивные пространства", description: "Фотогалерея VR-классов и цифровых лабораторий", folder: "/materials/products/interactive/" },
  pools: { title: "Учебные бассейны и полигоны", description: "Фотогалерея испытательных комплексов", folder: "/materials/products/pools/" },
};

const groups = [
  { icon: Radio, title: "Средства связи", items: ["Радиостанции", "Сетевое оборудование", "Системы передачи данных", "Защищённые каналы связи"], modal: "radio" as ModalType },
  { icon: Eye, title: "Средства мониторинга", items: ["Системы наблюдения", "Экологические датчики", "Платформы мониторинга", "IoT-решения"], modal: "monitoring" as ModalType },
  { icon: Plane, title: "Учебные дроны", items: ["FPV-дроны для обучения", "Инженерные комплекты", "Наборы робототехники", "Системы управления для обучения"], modal: "drones" as ModalType },
  { icon: Monitor, title: "Учебные интерактивные пространства", items: ["VR-классы", "Цифровые лаборатории", "Мультимедийные пространства", "Инженерные учебные зоны"], modal: "interactive" as ModalType },
  { icon: Waves, title: "Учебные бассейны и полигоны", items: ["Бассейны для испытаний подводных аппаратов", "Тренировочные комплексы", "Инженерные испытательные среды"], modal: "pools" as ModalType },
];

const Products = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [slide, setSlide] = useState(0);

  const openModal = (type: ModalType) => { setActiveModal(type); setSlide(0); };
  const images = activeModal ? PHOTOS[activeModal] : [];
  const prev = () => setSlide((s) => (s > 0 ? s - 1 : images.length - 1));
  const next = () => setSlide((s) => (s < images.length - 1 ? s + 1 : 0));

  return (
    <main className="pt-16">
      <Section title="Товары и решения" subtitle="Оборудование и комплексные решения для образования, мониторинга и связи">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((g, i) => (
            <InfoCard key={g.title} icon={g.icon} title={g.title} items={g.items} index={i} onClick={() => openModal(g.modal)} />
          ))}
        </div>
      </Section>

      <Dialog open={activeModal !== null} onOpenChange={(v) => !v && setActiveModal(null)}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-0">
          {activeModal && (
            <>
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-xl">{MODAL_INFO[activeModal].title}</DialogTitle>
                <DialogDescription>{MODAL_INFO[activeModal].description}</DialogDescription>
              </DialogHeader>
              <div className="px-6 pb-6">
                <div className="relative bg-muted rounded-lg overflow-hidden">
                  <img
                    src={images[slide]}
                    alt={`Фото ${slide + 1}`}
                    className="w-full h-auto object-contain min-h-[300px]"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
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
                <p className="text-xs text-muted-foreground mt-3">
                  Разместите фотографии в папке <code>{MODAL_INFO[activeModal].folder}</code> на сервере с именами <code>photo-1.jpg</code>, <code>photo-2.jpg</code> и т.д.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Products;
