"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const ACCENTS = ["#FF781E", "#16AEEF", "#5DC264", "#946BE1"] as const;
const NUMS    = ["01", "02", "03", "04"] as const;

export default function Services() {
  const { t }   = useLang();
  const ref     = useRef<HTMLDivElement>(null);
  const inView  = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="servizi" className="section-padding bg-[var(--bg-2)] relative overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-5 md:px-12 lg:px-16">

        {/* ── Header — editorial left-aligned ── */}
        <div className="mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="font-display font-500 text-xs tracking-[0.22em] uppercase
                       text-[var(--text-3)] flex items-center gap-3 mb-4"
          >
            <span className="w-6 h-px bg-current" />
            {t.services.badge}
          </motion.p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="font-700 leading-[0.92] tracking-[-0.04em]"
              style={{ fontSize: "clamp(2.8rem, 7vw, 7.5rem)", fontFamily: "'Syne', sans-serif" }}
            >
              {t.services.title}{" "}
              <span className="gradient-text">{t.services.titleAccent}</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="font-body font-light text-[var(--text-2)] text-sm max-w-xs leading-relaxed
                         md:text-right shrink-0"
            >
              {t.services.subtitle}
            </motion.p>
          </div>
        </div>

        {/* ── Stacked list ── */}
        <div className="border-t border-[var(--border)]" role="list">
          {t.services.items.map((service, i) => {
            const color  = ACCENTS[i];
            const isOpen = active === i;
            return (
              <motion.div
                key={i}
                role="listitem"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-label={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.25 + i * 0.08 }}
                className="border-b border-[var(--border)] relative overflow-hidden cursor-default group"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              >
                {/* Hover bg fill */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `${color}09`,
                    opacity: isOpen ? 1 : 0,
                    transition: "opacity 0.3s",
                  }}
                />
                {/* Left accent bar */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none"
                  animate={{ scaleY: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }}
                  style={{ background: color, transformOrigin: "top" }}
                  transition={{ duration: 0.35 }}
                />

                {/* Main row */}
                <div className="flex items-center gap-6 md:gap-10 py-6 md:py-8 px-4 md:px-8 relative">
                  {/* Number */}
                  <motion.span
                    className="font-700 text-3xl md:text-5xl w-14 md:w-20 shrink-0 tabular-nums" style={{ fontFamily: "'Integral CF', sans-serif" }}
                    animate={{ color: isOpen ? color : "var(--text-3)" }}
                    transition={{ duration: 0.25 }}
                  >
                    {NUMS[i]}
                  </motion.span>

                  {/* Name + desc on mobile */}
                  <div className="flex-1 min-w-0">
                    <span className="font-700 text-xl md:text-3xl lg:text-4xl
                                     tracking-[-0.02em] text-[var(--text)] block leading-tight mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {service.title}
                    </span>
                    {/* Description — always visible on mobile, visible on hover desktop */}
                    <AnimatePresence mode="wait">
                      {isOpen && (
                        <motion.p
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="font-body text-sm text-[var(--text-2)] leading-relaxed
                                     max-w-xl overflow-hidden"
                        >
                          {service.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    {/* Always-on description on mobile */}
                    <p className="md:hidden font-body text-xs text-[var(--text-2)] leading-relaxed mt-2">
                      {service.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <motion.div
                    className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full
                               flex items-center justify-center border border-[var(--border)]"
                    animate={{
                      borderColor: isOpen ? `${color}60` : "var(--border)",
                      backgroundColor: isOpen ? `${color}12` : "transparent",
                      x: isOpen ? 4 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowUpRight
                        size={16}
                        style={{ color: isOpen ? color : "var(--text-3)" }}
                      />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
