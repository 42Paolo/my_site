"use client";

import { useRef, useState, Fragment } from "react";
import { motion, useInView, useReducedMotion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ExternalLink, ArrowRight } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import Image from "next/image";

/* Project card data — image + shadow per card */
const projectCards = [
  { img: "/portfolio/gruppo-florence.svg",    shadow: "rgba(180,140,60,0.35)"   },
  { img: "/portfolio/ds-service-ncc.svg",     shadow: "rgba(22,174,239,0.35)"   },
  { img: "/portfolio/iq-hotel-firenze.svg",   shadow: "rgba(45,122,106,0.35)"   },
  { img: "/portfolio/taverna-della-rocca.svg",shadow: "rgba(196,112,90,0.35)"   },
  { img: "/portfolio/villa-le-fontanelle.svg",shadow: "rgba(212,150,58,0.35)"   },
  { img: "/portfolio/villa-bordoni.svg",      shadow: "rgba(196,132,106,0.35)"  },
];

const MOBILE_LIMIT = 2;
const CYCLE_COLORS = ["#FF781E", "#16AEEF", "#5DC264", "#946BE1", "#FF781E"];

export default function Portfolio() {
	const { t } = useLang();
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });
	const prefersReduced = useReducedMotion();
	const isMobile = useIsMobile();
	const [showAll, setShowAll] = useState(false);
	const [ctaHovered, setCtaHovered] = useState(false);

	return (
		<section
			id="portfolio"
			aria-label={t.portfolio.badge}
			className="section-padding bg-[var(--bg-2)] relative overflow-hidden"
		>
			<div ref={ref} className="max-w-7xl mx-auto px-5 md:px-12 lg:px-16">
				{/* Header — editorial */}
				<div className="mb-14">
					<motion.p
						initial={{ opacity: 0, x: -20 }}
						animate={(isMobile || inView) ? { opacity: 1, x: 0 } : {}}
						transition={(prefersReduced || isMobile) ? { duration: 0 } : { duration: 0.5 }}
						className="font-display font-500 text-xs tracking-[0.22em] uppercase
                       text-[var(--text-3)] flex items-center gap-3 mb-4"
					>
						<span className="w-6 h-px bg-current" aria-hidden="true" />
						{t.portfolio.badge}
					</motion.p>

					<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
						<motion.h2
							initial={{ opacity: 0, y: 24 }}
							animate={(isMobile || inView) ? { opacity: 1, y: 0 } : {}}
							transition={(prefersReduced || isMobile) ? { duration: 0 } : { duration: 0.65, delay: 0.08 }}
							className="font-700 leading-[0.92] tracking-[-0.04em]"
							style={{ fontSize: "clamp(2.8rem, 7vw, 7.5rem)", fontFamily: "'Syne', sans-serif" }}
						>
							{t.portfolio.title}{" "}
							<span className="gradient-text">{t.portfolio.titleAccent}</span>
						</motion.h2>

						<motion.p
							initial={{ opacity: 0, y: 16 }}
							animate={(isMobile || inView) ? { opacity: 1, y: 0 } : {}}
							transition={(prefersReduced || isMobile) ? { duration: 0 } : { duration: 0.55, delay: 0.18 }}
							className="font-body font-light text-[var(--text-2)] text-sm max-w-xs leading-relaxed
                         md:text-right shrink-0"
						>
							{t.portfolio.subtitle}
						</motion.p>
					</div>
				</div>

				{/* Grid */}
				<div
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
					role="list"
				>
					{t.portfolio.projects.map((project, i) => {
						const url = (project as typeof project & { url?: string }).url;
						const isHiddenOnMobile = !showAll && i >= MOBILE_LIMIT;

						return (
							<motion.a
								key={i}
								role="listitem"
								href={url || "#"}
								target={url && url !== "#" ? "_blank" : undefined}
								rel="noopener noreferrer"
								aria-label={`${project.title} — ${project.tag}${url && url !== "#" ? ", apre in una nuova scheda" : ""}`}
								initial={{ opacity: 0, y: 50, scale: 0.95 }}
								animate={(isMobile || inView) ? { opacity: 1, y: 0, scale: 1 } : {}}
								transition={(prefersReduced || isMobile)
									? { duration: 0 }
									: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
								}
								className={`group relative rounded-3xl overflow-hidden aspect-[4/3] cursor-pointer
                         hover:-translate-y-3 transition-all duration-400
                         ${isHiddenOnMobile ? "hidden md:block" : "block"}`}
								style={{
									boxShadow: `0 8px 32px ${projectCards[i].shadow}`,
								}}
							>
								{/* Project illustration */}
								<div
									className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
									aria-hidden="true"
								>
									<Image
										src={projectCards[i].img}
										alt=""
										fill
										className="object-cover"
										unoptimized
									/>
								</div>

								{/* Year badge */}
								<div
									className="absolute top-4 right-4 px-3 py-1 rounded-full
                              bg-white/20 backdrop-blur-sm border border-white/30
                              font-body text-xs font-500 text-white/90"
									aria-hidden="true"
								>
									{project.year}
								</div>

								{/* Hover overlay */}
								<div
									className="absolute inset-0 bg-espresso/75 opacity-0 group-hover:opacity-100
                              transition-opacity duration-400 flex flex-col justify-end p-6"
									aria-hidden="true"
								>
									<h3 className="font-display font-700 text-xl text-white mb-1">
										{project.title}
									</h3>
									<p className="font-body text-sm text-white/70 mb-4">{project.tag}</p>
									<div className="flex items-center gap-2 text-golden font-display font-600 text-sm">
										<ExternalLink size={14} aria-hidden="true" />
										{t.portfolio.viewProject}
									</div>
								</div>

								{/* Title visible always on mobile */}
								<div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t
                              from-espresso/80 to-transparent md:group-hover:opacity-0
                              transition-opacity duration-300 md:opacity-0 opacity-100">
									<h3 className="font-display font-700 text-base text-white">{project.title}</h3>
									<p className="font-body text-xs text-white/60 mt-0.5">{project.tag}</p>
								</div>
							</motion.a>
						);
					})}
				</div>

				{/* Mobile expand button */}
				{!showAll && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={(isMobile || inView) ? { opacity: 1, y: 0 } : {}}
						transition={(prefersReduced || isMobile) ? { duration: 0 } : { duration: 0.4, delay: 0.3 }}
						className="md:hidden mt-8 flex justify-center"
					>
						<button
							onClick={() => setShowAll(true)}
							aria-label={`Mostra tutti i ${t.portfolio.projects.length} progetti`}
							className="flex items-center gap-3 px-6 py-3.5 rounded-full
							           border border-[var(--border-strong)] text-[var(--text-2)]
							           hover:border-solar hover:text-solar active:scale-95
							           transition-all duration-300 font-display font-600
							           text-sm tracking-[0.08em]"
						>
							<span className="text-xl leading-none tracking-[0.3em]" aria-hidden="true">···</span>
							<span>{t.portfolio.expandProjects}</span>
						</button>
					</motion.div>
				)}

				{/* CTA — marquee band */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={(isMobile || inView) ? { opacity: 1 } : {}}
					transition={(prefersReduced || isMobile) ? { duration: 0 } : { duration: 0.6, delay: 0.7 }}
					className="-mx-5 md:-mx-12 lg:-mx-16 mt-14 md:mt-20 relative overflow-hidden"
				>
					<motion.a
						href="#contatto"
						onHoverStart={() => setCtaHovered(true)}
						onHoverEnd={() => setCtaHovered(false)}
						className="block relative overflow-hidden cursor-pointer py-5 md:py-6"
						aria-label={t.portfolio.allProjects}
					>
						{/* Border top */}
						<motion.div
							className="absolute top-0 left-0 right-0 pointer-events-none"
							animate={prefersReduced ? {} : {
								backgroundColor: CYCLE_COLORS,
								height: ctaHovered ? "2px" : "1px",
							}}
							transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
						/>
						{/* Border bottom */}
						<motion.div
							className="absolute bottom-0 left-0 right-0 pointer-events-none"
							animate={prefersReduced ? {} : {
								backgroundColor: CYCLE_COLORS,
								height: ctaHovered ? "2px" : "1px",
							}}
							transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 2 }}
						/>

						{/* Hover spotlight — soft radial that follows */}
						<motion.div
							className="absolute inset-0 pointer-events-none"
							animate={ctaHovered
								? { opacity: 1 }
								: { opacity: 0 }
							}
							transition={{ duration: 0.4 }}
							style={{
								background: "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(255,120,30,0.08) 0%, transparent 70%)",
							}}
						/>

						{/* Scrolling text */}
						<div className="flex overflow-hidden relative z-10" aria-hidden="true">
							<motion.div
								className="flex items-center shrink-0"
								animate={prefersReduced ? {} : { x: ["0%", "-50%"] }}
								transition={{
									duration: ctaHovered ? 12 : 22,
									repeat: Infinity,
									ease: "linear",
								}}
							>
								{Array.from({ length: 6 }).map((_, i) => (
									<Fragment key={i}>
										<span
											className="font-700 whitespace-nowrap px-6 md:px-10 transition-colors duration-400"
											style={{
												fontFamily: "'Syne', sans-serif",
												fontSize: "clamp(1.3rem, 2.2vw, 2rem)",
												letterSpacing: "-0.02em",
												color: ctaHovered ? "var(--text)" : "var(--text-2)",
											}}
										>
											{t.portfolio.allProjects}
										</span>
										<motion.span
											className="text-xs shrink-0 transition-colors duration-400"
											style={{ color: ctaHovered ? "#FF781E" : undefined }}
											animate={ctaHovered ? {} : (prefersReduced ? {} : { color: CYCLE_COLORS })}
											transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
										>
											✦
										</motion.span>
									</Fragment>
								))}
							</motion.div>
						</div>
					</motion.a>
				</motion.div>
			</div>
		</section>
	);
}
