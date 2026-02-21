import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  alt?: boolean;
  id?: string;
}

const Section = ({ title, subtitle, children, alt, id }: SectionProps) => (
  <section id={id} className={`py-16 md:py-24 ${alt ? "section-alt" : ""}`}>
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="mt-2 text-muted-foreground max-w-2xl">{subtitle}</p>
        )}
        <div className="w-16 h-1 bg-accent mt-4 rounded-full" />
      </motion.div>
      {children}
    </div>
  </section>
);

export default Section;
