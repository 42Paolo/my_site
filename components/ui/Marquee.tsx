"use client";

/* ──────────────────────────────────────────────────────────────────────
   Marquee — kinetic horizontal ticker strip between sections
   ────────────────────────────────────────────────────────────────────── */

const ITEMS = [
  { text: "WordPress",     color: "#5DC264" },
  { text: "Framer Motion", color: "#946BE1" },
];

export default function Marquee({ reverse = false }: { reverse?: boolean }) {
  /* duplicate for seamless loop */
  const items = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div className="relative overflow-hidden border-y border-[var(--border)] bg-[var(--surface)] py-[14px]">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10
                      bg-gradient-to-r from-[var(--surface)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10
                      bg-gradient-to-l from-[var(--surface)] to-transparent" />

      <div
        className="flex whitespace-nowrap"
        style={{
          width: "max-content",
          animation: `marquee-scroll${reverse ? "-rev" : ""} 28s linear infinite`,
        }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 px-6 font-display font-500 text-xs
                       tracking-[0.16em] uppercase text-[var(--text-2)]"
          >
            {item.text}
            <span
              className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: item.color }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
