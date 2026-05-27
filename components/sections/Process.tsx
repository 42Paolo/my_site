"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLang } from "@/context/LanguageContext";
import { useLenis } from "lenis/react";

const STEP_COLORS = ["#FF781E", "#16AEEF", "#5DC264", "#946BE1"] as const;

export default function Process() {
  const { t }   = useLang();
  const lenis   = useLenis();
  const ref     = useRef<HTMLDivElement>(null);
  const inView  = useInView(ref, { once: true, margin: "-80px" });
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState<number | null>(null);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    if (lenis && window.innerWidth >= 1024) lenis.scrollTo("#contatto", { lerp: 0.08, duration: 1.4 });
    else document.querySelector("#contatto")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="processo" className="section-padding bg-[var(--bg)] relative">

      <div ref={ref} className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">

        {/* ── Header row ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={(isMobile || inView) ? { opacity: 1, y: 0 } : {}}
          transition={isMobile ? { duration: 0 } : { duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-20 pb-10 border-b border-[var(--border)]"
        >
          <div>
            <p className="font-display font-500 text-xs tracking-[0.22em] uppercase
                          text-[var(--text-3)] flex items-center gap-3 mb-6">
              <span className="w-6 h-px bg-current" />
              {t.process.badge}
            </p>
            <h2
              className="font-700 leading-[0.92] tracking-[-0.04em] text-[var(--text)]"
              style={{ fontSize: "clamp(2.8rem, 7vw, 7.5rem)", fontFamily: "'Syne', sans-serif" }}
            >
              {t.process.title}{" "}
              <span
                className="italic"
                style={{ fontFamily: "var(--font-accent)", color: STEP_COLORS[0] }}
              >
                {t.process.titleAccent}
              </span>
            </h2>
          </div>
          <p className="font-body font-light text-[var(--text-2)] text-base md:text-lg max-w-xs lg:max-w-sm leading-relaxed lg:text-right">
            {t.process.subtitle}
          </p>
        </motion.div>

        {/* ── Step rows ── */}
        <div className="flex flex-col">
          {t.process.steps.map((step, i) => {
            const color  = STEP_COLORS[i];
            const isHov  = hovered === i;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 36 }}
                animate={(isMobile || inView) ? { opacity: 1, y: 0 } : {}}
                transition={isMobile ? { duration: 0 } : { duration: 0.7, delay: 0.1 + i * 0.13, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="relative grid grid-cols-[auto_1fr] lg:grid-cols-[5rem_2fr_3fr_auto]
                           items-start lg:items-center gap-6 lg:gap-16
                           py-10 lg:py-12 border-b border-[var(--border)]
                           transition-colors duration-300 cursor-default overflow-hidden"
              >
                {/* Hover bg — plain div to avoid Framer Motion transparent warning */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `${color}06`,
                    opacity: isHov ? 1 : 0,
                    transition: "opacity 0.3s",
                  }}
                />
                {/* Giant background number */}
                <span
                  className="absolute right-0 bottom-0 font-700 leading-none
                             select-none pointer-events-none transition-opacity duration-500"
                  style={{
                    fontFamily: "'Integral CF', sans-serif",
                    fontSize: "clamp(9rem, 20vw, 26rem)",
                    color,
                    opacity: isHov ? 0.07 : 0.04,
                    lineHeight: 0.85,
                    letterSpacing: "-0.05em",
                  }}
                >
                  {step.number}
                </span>

                {/* Step index + color bar */}
                <div className="flex flex-col items-center gap-3 relative z-10">
                  <span
                    className="font-display font-700 text-[10px] tracking-[0.18em] uppercase"
                    style={{ color }}
                  >
                    {step.number}
                  </span>
                  <motion.div
                    className="w-px rounded-full"
                    style={{ background: color }}
                    animate={{ height: isHov ? 56 : 28 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>

                {/* Step title */}
                <div className="relative z-10 lg:hidden flex flex-col gap-3">
                  <h3
                    className="font-700 leading-none tracking-[-0.03em] text-[var(--text)]
                               transition-colors duration-300"
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
                      color: isHov ? color : undefined,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p className="font-body text-sm text-[var(--text-2)] leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </div>

                {/* Title (desktop) */}
                <h3
                  className="hidden lg:block font-700 leading-none tracking-[-0.03em]
                             text-[var(--text)] relative z-10 transition-colors duration-300"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
                    color: isHov ? color : undefined,
                  }}
                >
                  {step.title}
                </h3>

                {/* Description (desktop) */}
                <p className="hidden lg:block font-body text-base text-[var(--text-2)]
                              leading-relaxed max-w-md relative z-10">
                  {step.description}
                </p>

                {/* Arrow circle (desktop) */}
                <div className="hidden lg:flex relative z-10">
                  <motion.div
                    className="w-12 h-12 rounded-full border flex items-center justify-center
                               transition-colors duration-300"
                    animate={{
                      borderColor: isHov ? color : "var(--border)",
                      color: isHov ? color : "var(--text-3)",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </div>

                {/* Hover progress bar */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[1.5px]"
                  style={{ originX: 0, background: color }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isHov ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* ── Typographic CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={(isMobile || inView) ? { opacity: 1, y: 0 } : {}}
          transition={isMobile ? { duration: 0 } : { duration: 0.7, delay: 0.65 }}
          className="mt-28 lg:mt-36"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <div>
              <p className="font-display font-500 text-xs tracking-[0.22em] uppercase
                            text-[var(--text-3)] flex items-center gap-3 mb-6">
                <span className="w-6 h-px bg-current" />
                {t.contact.subtitle}
              </p>
              <h2
                className="font-display font-700 leading-[0.92] tracking-[-0.04em] text-[var(--text)]"
                style={{ fontSize: "clamp(2.4rem, 6vw, 6.5rem)" }}
              >
                {t.hero.ctaSecondary.split(" ").slice(0, -1).join(" ")}
                <br />
                <span
                  className="italic"
                  style={{ fontFamily: "var(--font-accent)", color: STEP_COLORS[1] }}
                >
                  {t.hero.ctaSecondary.split(" ").pop()}?
                </span>
              </h2>
            </div>

            <a
              href="#contatto"
              onClick={scrollToContact}
              className="group inline-flex items-center gap-4 cursor-pointer select-none"
            >
              <span className="font-display font-600 text-base tracking-[0.06em] uppercase
                               text-[var(--text-2)] group-hover:text-[var(--text)] transition-colors">
                {t.hero.ctaSecondary}
              </span>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-14 h-14 rounded-full border border-[var(--border-strong)]
                           flex items-center justify-center text-[var(--text)]
                           group-hover:border-solar group-hover:text-solar group-hover:bg-solar/8
                           transition-colors duration-300"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
