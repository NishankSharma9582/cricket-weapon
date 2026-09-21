import React from "react";
import { motion } from "framer-motion";
import { Loader2, PackageOpen } from "lucide-react";

export const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};

export const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function PageShell({ children }) {
  return (
    <motion.main
      className="app-ambient"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative z-10">{children}</div>
    </motion.main>
  );
}

export function GlassCard({ children, className = "", hover = true }) {
  return (
    <div
      className={`glass glass-card ${hover ? "glass-card" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, icon: Icon, center = false }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <span className="block text-xs font-bold uppercase tracking-[0.2em] text-brand">
          {eyebrow}
        </span>
      )}
      <div
        className={`flex items-center gap-2.5 ${center ? "justify-center" : ""} ${eyebrow ? "mt-2" : ""}`}
      >
        {Icon && (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow">
            <Icon size={18} strokeWidth={2.2} />
          </span>
        )}
      </div>
      <div
        className={`mt-2 flex items-center gap-3 ${
          center ? "justify-center" : ""
        }`}
      >
        <span className="hidden h-px w-10 bg-gradient-to-r from-brand to-transparent md:block" />
        <h2 className="text-2xl font-bold text-ink-900 md:text-[2rem] md:leading-tight">
          {title}
        </h2>
        <span className="hidden h-px w-10 bg-gradient-to-l from-brand to-transparent md:block" />
      </div>
      {subtitle && (
        <p
          className={`mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink-500 ${
            center ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export function SectionHeadingDual({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="max-w-3xl"
    >
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
        {eyebrow}
      </span>
      <h2 className="mt-2 text-2xl font-bold text-ink-900 md:text-[2rem] md:leading-tight">
        {title}
      </h2>
      <span className="mt-3 block h-px w-14 bg-gradient-to-r from-brand to-transparent" />
      {subtitle && (
        <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink-500">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export function EmptyState({ title = "Nothing here yet", subtitle, icon: Icon = PackageOpen }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow">
        <Icon size={28} strokeWidth={1.8} />
      </span>
      <h4 className="text-lg font-semibold text-ink-800">{title}</h4>
      {subtitle && <p className="max-w-sm text-sm text-ink-500">{subtitle}</p>}
    </div>
  );
}

export function Spinner({ label = "Loading…" }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow">
        <Loader2 size={22} className="animate-spin" />
      </span>
      {label && <p className="text-sm font-medium text-ink-500">{label}</p>}
    </div>
  );
}

export function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral:
      "bg-ink-100 text-ink-600 border border-ink-200",
    brand:
      "bg-brand/10 text-brand-dark border border-brand/20",
    success:
      "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warn:
      "bg-amber-50 text-amber-700 border border-amber-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}