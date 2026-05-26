"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
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

				{/* CTA desktop — editorial */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={(isMobile || inView) ? { opacity: 1, y: 0 } : {}}
					transition={(prefersReduced || isMobile) ? { duration: 0 } : { duration: 0.5, delay: 0.7 }}
					className="hidden md:flex justify-center mt-20"
				>
					<motion.a
						href="#contatto"
						className="group inline-flex items-center gap-6 relative pb-3"
						whileHover={{ x: 6 }}
						transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
					>
						{/* Cycling color dot */}
						<motion.span
							className="block w-3 h-3 rounded-full shrink-0"
							animate={prefersReduced ? {} : { backgroundColor: CYCLE_COLORS }}
							transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
						/>
						{/* Editorial text */}
						<span
							className="font-700 tracking-[-0.02em] text-[var(--text)] leading-none"
							style={{
								fontFamily: "'Syne', sans-serif",
								fontSize: "clamp(2rem, 3.5vw, 3rem)",
							}}
						>
							{t.portfolio.allProjects}
						</span>
						{/* Animated arrow circle */}
						<motion.span
							className="relative w-14 h-14 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
							animate={prefersReduced ? {} : { backgroundColor: CYCLE_COLORS }}
							transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
						>
							<ArrowRight
								size={22}
								strokeWidth={2}
								className="text-white transition-transform duration-400 group-hover:translate-x-1"
							/>
						</motion.span>
						{/* Animated underline */}
						<motion.span
							aria-hidden
							className="absolute left-9 right-16 bottom-0 h-px"
							style={{
								background: "linear-gradient(90deg, #FF781E, #16AEEF, #5DC264, #946BE1)",
								backgroundSize: "300% 100%",
							}}
							animate={prefersReduced ? {} : { backgroundPosition: ["0% 50%", "100% 50%"] }}
							transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
						/>
					</motion.a>
				</motion.div>

				{/* CTA mobile — after expand */}
				{showAll && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={(prefersReduced || isMobile) ? { duration: 0 } : { duration: 0.4 }}
						className="md:hidden flex justify-center mt-14"
					>
						<motion.a
							href="#contatto"
							className="group inline-flex items-center gap-4 relative pb-2"
						>
							<motion.span
								className="block w-2.5 h-2.5 rounded-full shrink-0"
								animate={prefersReduced ? {} : { backgroundColor: CYCLE_COLORS }}
								transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
							/>
							<span
								className="font-700 tracking-[-0.02em] text-[var(--text)] leading-none"
								style={{
									fontFamily: "'Syne', sans-serif",
									fontSize: "clamp(1.5rem, 6vw, 2rem)",
								}}
							>
								{t.portfolio.allProjects}
							</span>
							<motion.span
								className="relative w-11 h-11 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
								animate={prefersReduced ? {} : { backgroundColor: CYCLE_COLORS }}
								transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
							>
								<ArrowRight size={18} strokeWidth={2} className="text-white" />
							</motion.span>
							<motion.span
								aria-hidden
								className="absolute left-7 right-13 bottom-0 h-px"
								style={{
									background: "linear-gradient(90deg, #FF781E, #16AEEF, #5DC264, #946BE1)",
									backgroundSize: "300% 100%",
								}}
								animate={prefersReduced ? {} : { backgroundPosition: ["0% 50%", "100% 50%"] }}
								transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
							/>
						</motion.a>
					</motion.div>
				)}
			</div>
		</section>
	);
}
