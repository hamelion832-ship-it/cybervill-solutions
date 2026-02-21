import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  items: string[];
  index?: number;
}

const InfoCard = ({ icon: Icon, title, items, index = 0 }: InfoCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.08 }}
    className="bg-card rounded-lg border border-border p-6 card-hover"
  >
    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
      <Icon className="w-5 h-5 text-accent" />
    </div>
    <h3 className="font-semibold text-foreground mb-3">{title}</h3>
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
          <span className="text-accent mt-0.5 text-xs">✔</span>
          {item}
        </li>
      ))}
    </ul>
  </motion.div>
);

export default InfoCard;
