"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { useLenis } from "lenis/react";
import Image from "next/image";

const P = {
	orange: "#FF781E",
	sky:    "#16AEEF",
	purple: "#946BE1",
	yellow: "#F9CF57",
	green:  "#5DC264",
};

// solo caratteri piccoli/minuscoli
const CHARS = "abcdefghijklmnopqrstuvwxyz";
const N = 3; // ultime N lettere scramble

function ScrambleLine({
	text, scrambling, className, style,
}: {
	text: string;
	scrambling: boolean;
	className?: string;
	style?: React.CSSProperties;
}) {
	const prefix = text.slice(0, -N);
	const suffix = text.slice(-N);
	const [tail, setTail] = useState(suffix);
	const interval = useRef<ReturnType<typeof setInterval> | null>(null);
	const prefersReduced = useReducedMotion();

	useEffect(() => {
		if (scrambling && !prefersReduced) {
			interval.current = setInterval(() => {
				setTail(
					suffix.split("").map((c) =>
						c === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)]
					).join("")
				);
			}, 160);
		} else {
			if (interval.current) clearInterval(interval.current);
			setTail(suffix);
		}
		return () => { if (interval.current) clearInterval(interval.current); };
	}, [scrambling, suffix, prefersReduced]);

	return (
		<span className={className} style={style} aria-hidden="true">
			{prefix}
			<span style={{ opacity: scrambling ? 0.7 : 1 }}>{tail}</span>
		</span>
	);
}

export default function Hero() {
	const { t } = useLang();
	const lenis = useLenis();
	const sectionRef = useRef<HTMLDivElement>(null);
	const prefersReduced = useReducedMotion();
	const [scrambling, setScrambling] = useState([false, false, false]);
	const isMobileRef = useRef(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const mobile = window.innerWidth < 1024;
		isMobileRef.current = mobile;
		setIsMobile(mobile);
	}, []);

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});

	useMotionValueEvent(scrollYProgress, "change", (v) => {
		if (prefersReduced || isMobileRef.current) return;
		setScrambling([
			v > 0.38 && v < 0.65,
			v > 0.22 && v < 0.50,
			v > 0.08 && v < 0.35,
		]);
	});

	const rocketY             = useTransform(scrollYProgress, [0, 1], [0, -1200]);
	const rocketOpacity       = useTransform(scrollYProgress, [0.55, 1], [1, 0]);
	// Mobile: solo opacity, nessun parallax Y (evita lag JS-driven su touch scroll)
	const rocketOpacityMobile = useTransform(
		scrollYProgress,
		[0, 0.55, 0.82],
		[0.35, 0.35, 0]
	);
	const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

	const scrollDown = () => {
		if (lenis) lenis.scrollTo("#chi-sono", { lerp: 0.08, duration: 1.6 });
		else document.querySelector("#chi-sono")?.scrollIntoView({ behavior: "smooth" });
	};

	const lines = [t.hero.title, t.hero.titleAccent, t.hero.titleEnd];
	const fullHeading = `${t.hero.title} ${t.hero.titleAccent} ${t.hero.titleEnd}`;

	return (
		<section
			ref={sectionRef}
			className="relative bg-[var(--bg)]"
			style={{ height: "195vh" }}
			aria-label="Hero"
		>
			<div className="sticky top-0 h-screen overflow-hidden">

				{/* ── Razzo — mobile (centered background) ── */}
				<motion.div
					className="lg:hidden pointer-events-none absolute"
					style={{
						left: "50%",
						top: "50%",
						width: "min(85vw, 400px)",
						zIndex: 1,
						opacity: isMobile ? 0.35 : rocketOpacityMobile,
						x: "-50%",
						marginTop: "-44vh",
					}}
				>
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={prefersReduced ? { duration: 0 } : { duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
					>
						{/* Float disabilitato su mobile: evita conflitto tra y scroll-linked e y float */}
						<div>
							<Image
								src="/rocket.png"
								alt=""
								role="presentation"
								width={672}
								height={1564}
								style={{
									width: "100%",
									height: "auto",
									filter: "drop-shadow(0 24px 56px rgba(255,120,30,0.45))",
								}}
								priority
							/>
						</div>
					</motion.div>
				</motion.div>

				{/* ── Razzo — desktop (right, parallax) ── */}
				<motion.div
					className="pointer-events-none absolute hidden lg:block"
					style={{
						right: "-2%",
						bottom: "calc(-45% + 40px)",
						width: "29%",
						zIndex: 2,
						y: rocketY,
						opacity: rocketOpacity,
					}}
					aria-hidden="true"
				>
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={prefersReduced ? { duration: 0 } : { duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
					>
						<motion.div
							animate={prefersReduced ? {} : { y: [0, -18, 0] }}
							transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
						>
							<Image
								src="/rocket.png"
								alt=""
								role="presentation"
								width={672}
								height={1564}
								style={{
									width: "100%",
									height: "auto",
									filter: "drop-shadow(0 32px 64px rgba(255,120,30,0.18))",
								}}
								priority
							/>
						</motion.div>
					</motion.div>
				</motion.div>

				{/* ── Accenti geometrici ── */}
				<div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden="true">
					<div className="absolute rounded-full opacity-40"
						style={{ width: 18, height: 18, top: "calc(8% + 22px)", right: "calc(4% + 22px)", background: P.orange }} />
					<div className="absolute opacity-30"
						style={{ width: 2, height: 140, bottom: "22%", left: "7%", background: `linear-gradient(to bottom, ${P.sky}, transparent)` }} />
					<div className="absolute rotate-12 opacity-20"
						style={{ width: 56, height: 56, bottom: "30%", right: "12%", border: `2.5px solid ${P.yellow}` }} />
					{[P.green, P.purple, P.sky].map((c, i) => (
						<div key={i} className="absolute rounded-full opacity-50"
							style={{ width: 6, height: 6, top: `${28 + i * 12}%`, left: `${48 + i * 3}%`, background: c }} />
					))}
				</div>

				{/* ── Testo ── */}
				<div className="relative z-10 flex flex-col justify-center h-full">
					<div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-16 pt-20 pb-8">

						<motion.p
							initial={{ opacity: 0, x: -16 }}
							animate={{ opacity: 1, x: 0 }}
							transition={(prefersReduced || isMobile) ? { duration: 0 } : { duration: 0.5, delay: 0.05 }}
							className="flex items-center gap-3 font-display font-500 text-xs
							           tracking-[0.22em] uppercase text-[var(--text-3)] mb-6"
						>
							<span className="w-6 h-px bg-current" aria-hidden="true" />
							{t.hero.badge}
							<span className="w-6 h-px bg-current" aria-hidden="true" />
						</motion.p>

						{/* ── Heading — single semantic h1, visual lines aria-hidden ── */}
						<h1 className="sr-only">{fullHeading}</h1>

						<div className="mb-10 md:mb-12" aria-hidden="true">
							{lines.map((line, i) => (
								<div key={i} className="pb-[0.06em]">
									<motion.div
										initial={{ opacity: 0, y: 32 }}
										animate={{ opacity: 1, y: 0 }}
										transition={(prefersReduced || isMobile)
											? { duration: 0 }
											: { duration: 0.85, delay: 0.12 + i * 0.16, ease: [0.16, 1, 0.3, 1] }
										}
										className={`font-700 leading-[0.96] block
											${i === 1
												? "pl-[5vw] md:pl-[8vw] italic tracking-[-0.02em]"
												: "font-display tracking-[-0.04em] text-[var(--text)]"
											}`}
										style={{
											fontSize: "clamp(2.6rem, 8.5vw, 9.5rem)",
											fontFamily: i === 1 ? "var(--font-accent)" : "'Syne', sans-serif",
											color: i === 1 ? "#16AEEF" : undefined,
											textShadow: i !== 1
												? "2px 4px 0px rgba(0,0,0,0.06), 4px 8px 0px rgba(0,0,0,0.04), 0 2px 24px rgba(0,0,0,0.04)"
												: undefined,
										}}
									>
										<ScrambleLine
											text={line}
											scrambling={scrambling[i]}
											className="font-inherit"
										/>
									</motion.div>
								</div>
							))}
						</div>

						<motion.div
							initial={{ opacity: 0, y: 28 }}
							animate={{ opacity: 1, y: 0 }}
							transition={(prefersReduced || isMobile) ? { duration: 0 } : { duration: 0.7, delay: 0.62 }}
						>
							<p
								className="font-body text-base md:text-lg leading-relaxed max-w-md"
								style={{ color: "var(--text-2)", opacity: 0.6 }}
							>
								{t.hero.subtitle}
							</p>
						</motion.div>

					</div>
				</div>

				{/* ── Scroll cue ── */}
				<motion.button
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={(prefersReduced || isMobile) ? { duration: 0 } : { delay: 1.5 }}
					onClick={scrollDown}
					aria-label="Scorri verso il basso"
					className="hidden lg:flex absolute bottom-10 left-8 md:left-14 items-center gap-3 cursor-pointer group z-10"
					style={{ opacity: cueOpacity, color: "var(--text-3)" }}
				>
					<motion.div
						animate={(prefersReduced || isMobile) ? {} : { scaleX: [1, 1.6, 1] }}
						transition={{ duration: 2, repeat: Infinity }}
						className="w-8 h-px bg-current group-hover:bg-solar transition-colors"
					/>
					<span className="font-display font-500 text-[10px] tracking-[0.25em] uppercase group-hover:text-solar transition-colors">
						scroll
					</span>
				</motion.button>

			</div>
		</section>
	);
}
