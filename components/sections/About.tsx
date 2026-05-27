"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import Image from "next/image";

const STATS = [
	{ value: "3+",  glitch: "NO",     color: "#CBD5E1" },
	{ value: "30+", glitch: "LIMITS", color: "#CBD5E1" },
	{ value: "25+", glitch: "HERE",   color: "#CBD5E1" },
];

const SCREEN_WORDS_1 = [
	{
		text: "NO",
		color: "#111111",
		bg: "#FFE600",
		font: "'Anton', sans-serif",
		size: "clamp(9rem, 24vw, 22rem)",
	},
	{
		text: "LIMITS",
		color: "#E040FB",
		bg: "#1C0042",
		font: "'Anton', sans-serif",
		size: "clamp(9rem, 24vw, 22rem)",
	},
	{
		text: "HERE",
		color: "#FFFFFF",
		bg: "#E50914",
		font: "'Anton', sans-serif",
		size: "clamp(9rem, 24vw, 22rem)",
	},
];

const SCREEN_WORDS_2 = [
	{
		text: "THINK",
		color: "#A78BFA",
		bg: "#0C0C0C",
		font: "'Anton', sans-serif",
		size: "clamp(10rem, 28vw, 28rem)",
	},
	{
		text: "BUILD",
		color: "#1A0800",
		bg: "#FF6900",
		font: "'Anton', sans-serif",
		size: "clamp(10rem, 28vw, 28rem)",
	},
	{
		text: "EVOLVE",
		color: "#4ADE80",
		bg: "#003D1F",
		font: "'Anton', sans-serif",
		size: "clamp(10rem, 28vw, 28rem)",
	},
];

const NORMAL = "2026";
const HACKED = "pabrogi";
const NOISE  = "!#$%@/\\|^<>[]{}X";
const CYCLE_COLORS = ["#FF781E", "#16AEEF", "#5DC264", "#946BE1", "#FF781E"];


type Phase = "idle" | "warning" | "to-hacked" | "hacked" | "to-normal";

function mixWord(from: string, to: string, t: number) {
	const len = Math.max(from.length, to.length);
	return Array.from({ length: len }, (_, i) => {
		if (Math.random() < 0.42)
			return NOISE[Math.floor(Math.random() * NOISE.length)];
		return Math.random() < t ? (to[i] ?? "") : (from[i] ?? "");
	}).join("");
}

export default function About() {
	const { t }  = useLang();
	const ref    = useRef<HTMLDivElement>(null);
	const prefersReduced = useReducedMotion();
	const sectionRef = useRef<HTMLElement>(null);
	const inView        = useInView(ref, { once: true, margin: "-100px" });
	const inViewForGlitch = useInView(ref, { once: true, amount: 0.6 });

	const isMobileRef = useRef(false);
	const [isMobile, setIsMobile] = useState(false);
	const [mobileVH, setMobileVH] = useState<number | null>(null);
	useEffect(() => {
		const mobile = window.innerWidth < 1024;
		isMobileRef.current = mobile;
		setIsMobile(mobile);
		if (mobile) setMobileVH(window.innerHeight);
	}, []);

	// ── Nave — scroll-triggered (desktop) / inView-triggered (mobile) ──
	const { scrollYProgress: shipProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});
	const sectionInView = useInView(sectionRef, { once: true, amount: 0.3 });
	const [shipState, setShipState] = useState<"hidden" | "arriving" | "visible">("hidden");
	const [secRState, setSecRState] = useState<"hidden" | "visible">("hidden");
	const [secLState, setSecLState] = useState<"hidden" | "visible">("hidden");
	const shipTriggered = useRef(false);
	const secRTriggered = useRef(false);
	const secLTriggered = useRef(false);

	// Desktop: scroll progress triggers ships
	useMotionValueEvent(shipProgress, "change", (v) => {
		if (isMobileRef.current) return;
		if (v > 0.05 && !shipTriggered.current) {
			shipTriggered.current = true;
			setShipState("arriving");
			setTimeout(() => setShipState("visible"), 650);
		}
		if (v > 0.20 && !secRTriggered.current) {
			secRTriggered.current = true;
			setSecRState("visible");
		}
		if (v > 0.55 && !secLTriggered.current) {
			secLTriggered.current = true;
			setSecLState("visible");
		}
	});

	// Mobile: staggered appearance when section enters view
	useEffect(() => {
		if (!isMobile || !sectionInView) return;
		const t1 = setTimeout(() => {
			if (!shipTriggered.current) {
				shipTriggered.current = true;
				setShipState("arriving");
				setTimeout(() => setShipState("visible"), 650);
			}
		}, 200);
		const t2 = setTimeout(() => {
			if (!secRTriggered.current) { secRTriggered.current = true; setSecRState("visible"); }
		}, 800);
		const t3 = setTimeout(() => {
			if (!secLTriggered.current) { secLTriggered.current = true; setSecLState("visible"); }
		}, 1400);
		return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
	}, [isMobile, sectionInView]);

	const [phase,             setPhase]             = useState<Phase>("idle");
	const [word,              setWord]              = useState(NORMAL);
	const [accent,            setAccent]            = useState(true);
	const [warningLetters,    setWarningLetters]    = useState<Set<number>>(new Set());
	const [screenIdx,         setScreenIdx]         = useState<number | null>(null);
	const [corruptedLetters,  setCorruptedLetters]  = useState(0);
	const [ctaHovered,        setCtaHovered]        = useState(false);
	const [textExpanded,      setTextExpanded]      = useState(false);

	const tmr            = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const itv            = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
	const corruptedRef   = useRef(0);
	const glitchCountRef = useRef(0);

	const [currentWordSet, setCurrentWordSet] = useState<typeof SCREEN_WORDS_1>(SCREEN_WORDS_1);

	const doGlitch = useCallback(() => {
		glitchCountRef.current += 1;
		const words = glitchCountRef.current === 1 ? SCREEN_WORDS_1 : SCREEN_WORDS_2;
		// ── warning ──
		setPhase("warning");
		let flickers = 0;
		const total = 3 + Math.floor(Math.random() * 2);

		itv.current = setInterval(() => {
			flickers++;
			if (flickers % 2 === 0) {
				setWarningLetters(new Set());
			} else {
				const corrupted = corruptedRef.current;
				const available = NORMAL.length - corrupted;
				if (available > 0) {
					const set = new Set<number>();
					set.add(corrupted + Math.floor(Math.random() * available));
					setWarningLetters(set);
				}
			}
			if (flickers >= total) {
				clearInterval(itv.current);
				setWarningLetters(new Set());
				setAccent(false);
				setPhase("to-hacked");
				let p = 0;
				itv.current = setInterval(() => {
					p += 0.2;
					setWord(mixWord(NORMAL, HACKED, Math.min(p, 1)));
					if (p >= 1) {
						clearInterval(itv.current);
						setWord(HACKED);
						setPhase("hacked");

						// ── fullscreen word sequence ──
						setCurrentWordSet(words);
						setScreenIdx(0);
						tmr.current = setTimeout(() => {
							setScreenIdx(1);
							tmr.current = setTimeout(() => {
								setScreenIdx(2);
								tmr.current = setTimeout(() => {
									setScreenIdx(null);
									// ── to-normal ──
									let r = 0;
									setPhase("to-normal");
									itv.current = setInterval(() => {
										r += 0.25;
										setWord(mixWord(HACKED, NORMAL, Math.min(r, 1)));
										if (r >= 1) {
											clearInterval(itv.current);
											setWord(NORMAL);
											setPhase("idle");
											setAccent(true);
											corruptedRef.current = Math.min(corruptedRef.current + 1, 2);
											setCorruptedLetters(corruptedRef.current);
											if (glitchCountRef.current < 2) {
												tmr.current = setTimeout(doGlitch, 6000 + Math.random() * 9000);
											}
										}
									}, 60);
								}, 420);
							}, 420);
						}, 420);
					}
				}, 55);
			}
		}, 200);
	}, []);

	// useEffect(() => {
	// 	if (!inViewForGlitch) return;
	// 	tmr.current = setTimeout(doGlitch, 1500);
	// 	return () => { clearTimeout(tmr.current); clearInterval(itv.current); };
	// }, [inViewForGlitch, doGlitch]);

	const isGlitching = phase === "to-hacked" || phase === "hacked" || phase === "to-normal";
	const titleParts  = t.about.title.split("2026");

	const getStatDisplay = (stat: { value: string; glitch: string }) => {
		if (phase === "idle" || phase === "warning") return stat.value;
		if (phase === "hacked") return stat.glitch;
		return Array.from({ length: stat.glitch.length }, () =>
			NOISE[Math.floor(Math.random() * NOISE.length)]
		).join("");
	};

	const activeWord = screenIdx !== null ? currentWordSet[screenIdx] : null;

	return (
		<>
			{/* ── Fullscreen word overlay — COMMENTATO TEMPORANEAMENTE ── */}
			{/* <AnimatePresence mode="wait">
				{activeWord && (
					<motion.div
						key={activeWord.text}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.07 }}
						style={{
							position: "fixed", inset: 0, zIndex: 9999,
							background: activeWord.bg,
							display: "flex", alignItems: "center", justifyContent: "center",
							pointerEvents: "none",
							transition: "background 0s",
						}}
					>
						<motion.span
							initial={{ scaleY: 1.1, opacity: 0.5 }}
							animate={{ scaleY: 1, opacity: 1 }}
							transition={{ duration: 0.09, ease: "easeOut" }}
							style={{
								fontFamily: activeWord.font,
								fontSize: activeWord.size,
								color: activeWord.color,
								letterSpacing: "0.04em",
								lineHeight: 1,
								userSelect: "none",
								display: "block",
							}}
						>
							{activeWord.text}
						</motion.span>
					</motion.div>
				)}
			</AnimatePresence> */}

			<section ref={sectionRef} id="chi-sono" className="bg-[var(--bg)] relative" style={{ height: mobileVH ? `${mobileVH}px` : "260vh" }}>
			  <div className="sticky top-0 h-screen overflow-hidden" style={{ height: mobileVH ? `${mobileVH}px` : undefined }}>

				{/* ── Nave Principale — Star Wars arrival ── */}
				<div className="pointer-events-none absolute inset-0" style={{ zIndex: 0 }}>

					{/* Nave */}
					<AnimatePresence>
						{shipState !== "hidden" && (
							<motion.div
								key="ship"
								className="absolute inset-0 flex items-center justify-center"
								initial={{ scale: 0.01, opacity: 0 }}
								animate={{ scale: 1, opacity: 0.38 }}
								transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
							>
								<motion.div
									style={{ width: "min(62vw, 880px)" }}
									animate={isMobile ? {} : { y: [0, -12, 0] }}
									transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
								>
									<Image
										src="/nave_princ_vero.png"
										alt=""
										width={1672}
										height={941}
										style={{
											width: "100%",
											height: "auto",
										}}
									/>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Nave secondaria destra */}
					<AnimatePresence>
						{secRState !== "hidden" && (
							<motion.div
								key="sec-r"
								className="absolute"
								style={{ right: "14%", top: "18%", width: "min(32vw, 420px)" }}
								initial={{ scale: 0.01, opacity: 0 }}
								animate={{ scale: 1, opacity: 0.42 }}
								transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
							>
								<motion.div
									animate={isMobile ? {} : { y: [0, -11, 0] }}
									transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
								>
									<Image src="/nave_secondaria.png" alt="" width={1586} height={992}
										style={{ width: "100%", height: "auto" }} />
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Nave secondaria sinistra */}
					<AnimatePresence>
						{secLState !== "hidden" && (
							<motion.div
								key="sec-l"
								className="absolute"
								style={{ left: "14%", top: "18%", width: "min(32vw, 420px)", transform: "scaleX(-1)" }}
								initial={{ scale: 0.01, opacity: 0 }}
								animate={{ scale: 1, opacity: 0.28 }}
								transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
							>
								<motion.div
									animate={isMobile ? {} : { y: [0, -11, 0] }}
									transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
								>
									<Image src="/nave_secondaria.png" alt="" width={1586} height={992}
										style={{ width: "100%", height: "auto" }} />
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>


				</div>

				<div className="relative z-10 flex flex-col justify-between lg:justify-center h-full">
				<div ref={ref} className="max-w-7xl mx-auto px-5 md:px-12 lg:px-16 py-2 lg:py-16 w-full">
					{/* ── Badge ── */}
					<motion.p
						initial={{ opacity: 0, x: -20 }}
						animate={inView ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 0.5 }}
						className="font-display font-500 text-xs tracking-[0.22em] uppercase
						           text-[var(--text-3)] flex items-center justify-center lg:justify-start gap-3 mb-4 lg:mb-16"
					>
						<span className="w-6 h-px bg-current" />
						{t.about.badge}
					</motion.p>

					<div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-3 lg:gap-24 items-start">

						{/* ── Left — stats ── */}
						<div className="flex flex-col gap-0 items-start">
							{STATS.map((stat, i) => {
								const labels = [t.about.yearsLabel, t.about.projectsLabel, t.about.clientsLabel];
								return (
									<motion.div
										key={i}
										initial={{ opacity: 0, x: -90 }}
										animate={inView ? { opacity: 1, x: 0 } : {}}
										transition={{ duration: 0.8, delay: 0.05 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
										className={`w-full py-2 lg:py-8 ${i < 2 ? "border-b border-[var(--border)]" : ""}`}
									>
										{/* Mobile: numero e label in riga */}
										<div className="flex lg:hidden items-center gap-3">
											<span
												className="font-700 shrink-0"
												style={{
													fontSize: "clamp(2.2rem, 8vw, 3rem)",
													lineHeight: 1,
													fontFamily: isGlitching ? "'Bebas Neue', sans-serif" : "'Integral CF', var(--font-display), sans-serif",
													letterSpacing: isGlitching ? "0.06em" : "-0.04em",
													animation: isGlitching ? "glitch-shake 0.11s steps(1) infinite" : "none",
													transition: "font-family 0s, letter-spacing 0.05s",
													background: isGlitching ? stat.color : "linear-gradient(160deg, #F8FAFC 0%, #CBD5E1 40%, #8096B0 100%)",
													WebkitBackgroundClip: isGlitching ? undefined : "text",
													WebkitTextFillColor: isGlitching ? stat.color : "transparent",
													backgroundClip: isGlitching ? undefined : "text",
												}}
											>
												{getStatDisplay(stat)}
											</span>
											<span
												className="font-body text-sm uppercase tracking-[0.14em] leading-tight"
												style={{
													color: "var(--text-3)",
													opacity: phase === "hacked" ? 0 : 1,
													transition: "opacity 0.15s",
												}}
											>
												{labels[i]}
											</span>
										</div>
										{/* Desktop: numero sopra, label sotto */}
										<div className="hidden lg:flex flex-col">
											<span
												className="font-700 leading-none block"
												style={{
													fontSize: "clamp(3rem, 9vw, 9rem)",
													display: "inline-block",
													fontFamily: isGlitching ? "'Bebas Neue', sans-serif" : "'Integral CF', var(--font-display), sans-serif",
													letterSpacing: isGlitching ? "0.06em" : "-0.04em",
													animation: isGlitching ? "glitch-shake 0.11s steps(1) infinite" : "none",
													transition: "font-family 0s, letter-spacing 0.05s",
													background: isGlitching ? stat.color : "linear-gradient(160deg, #F8FAFC 0%, #CBD5E1 40%, #8096B0 100%)",
													WebkitBackgroundClip: isGlitching ? undefined : "text",
													WebkitTextFillColor: isGlitching ? stat.color : "transparent",
													backgroundClip: isGlitching ? undefined : "text",
												}}
											>
												{getStatDisplay(stat)}
											</span>
											<span
												className="font-body text-xs uppercase tracking-[0.18em] mt-2"
												style={{
													color: "var(--text-3)",
													opacity: phase === "hacked" ? 0 : 1,
													transition: "opacity 0.15s",
												}}
											>
												{labels[i]}
											</span>
										</div>
									</motion.div>
								);
							})}
						</div>

						{/* ── Right — text ── */}
						<div className="lg:pt-4 text-center lg:text-left">
							<motion.h2
								initial={{ opacity: 0, x: 80 }}
								animate={inView ? { opacity: 1, x: 0 } : {}}
								transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
								className="font-700 leading-[0.94] tracking-[-0.03em] mb-3 lg:mb-10"
								style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)", fontFamily: "'Integral CF', var(--font-display), sans-serif" }}
							>
								{titleParts[0]}

								<span className={`pf${isGlitching ? " glitching" : ""}`} style={{ animation: isGlitching ? "glitch-shake 0.11s steps(1) infinite" : "none" }}>
									{/* Corner frame */}
									<span className="c tl" aria-hidden /><span className="c tr" aria-hidden />
									<span className="c bl" aria-hidden /><span className="c br" aria-hidden />
									{/* Chromatic layers — solo durante il glitch */}
									<span aria-hidden style={{
										position: "absolute", top: 0, left: 0, whiteSpace: "nowrap", pointerEvents: "none",
										color: "#ff2255", opacity: isGlitching ? 0.8 : 0, transition: "opacity 0.1s",
										animation: isGlitching ? "glitch-r 0.12s steps(1) infinite" : "none",
									}}>{phase === "hacked" ? HACKED : word}</span>
									<span aria-hidden style={{
										position: "absolute", top: 0, left: 0, whiteSpace: "nowrap", pointerEvents: "none",
										color: "#00ffdd", opacity: isGlitching ? 0.7 : 0, transition: "opacity 0.1s",
										animation: isGlitching ? "glitch-c 0.17s steps(1) infinite" : "none",
									}}>{phase === "hacked" ? HACKED : word}</span>
									<span style={{ position: "relative" }}>
										{phase === "hacked" ? (
											<>
												<span style={{ color: "#C2E812" }}>pa</span>
												<span style={{ color: "#001547" }}>brogi</span>
											</>
										) : phase === "warning" ? (
											NORMAL.split("").map((char, idx) => {
												const perm = idx < corruptedLetters;
												const warn = !perm && warningLetters.has(idx);
												return (
													<span key={idx} style={{
														display: "inline-block",
														color: (perm || warn) ? "#C2E812" : "var(--text)",
														transition: "color 0.06s",
													}}>
														{(perm || warn) ? char.toLowerCase() : char}
													</span>
												);
											})
										) : corruptedLetters > 0 ? (
											NORMAL.split("").map((char, idx) => (
												<span key={idx} style={{
													display: "inline-block",
													color: idx < corruptedLetters ? "#C2E812" : "var(--text)",
												}}>
													{idx < corruptedLetters ? char.toLowerCase() : char}
												</span>
											))
										) : (
											<span style={{ color: "var(--text)" }}>{word}</span>
										)}
									</span>
								</span>

								{titleParts[1]}{" "}

								<span
									style={{
										display: "inline-block",
										color: "#39FF14",
										opacity: accent ? 1 : 0,
										transform: phase === "warning"
											? warningLetters.size > 0 ? "translateX(-3px)" : "translateX(1px)"
											: "none",
										animation: !accent && phase === "to-hacked"
											? "accent-flicker 0.28s steps(1) forwards"
											: "none",
										transition: phase === "warning" ? "transform 0.05s" : accent ? "opacity 0.35s ease" : "none",
									}}
								>
									{t.about.titleAccent}
								</span>
							</motion.h2>

							{/* Descriptions — desktop only; mobile version is a separate flex block */}
							<div className="hidden lg:block">
								<motion.p
									initial={{ opacity: 0, x: 60 }}
									animate={inView ? { opacity: 1, x: 0 } : {}}
									transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
									className="font-body font-light leading-relaxed lg:text-lg mb-2 lg:mb-5"
									style={{ color: "#E2E8F0" }}
								>
									{t.about.description}
								</motion.p>
								<motion.p
									initial={{ opacity: 0, x: 60 }}
									animate={inView ? { opacity: 1, x: 0 } : {}}
									transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
									className="font-body font-light leading-relaxed lg:text-lg lg:mb-12"
									style={{ color: "#E2E8F0" }}
								>
									{t.about.description2}
								</motion.p>
							</div>

							{/* ── Cyberpunk CTA — desktop only ── */}
							<motion.div
								initial={{ opacity: 0, x: 50 }}
								animate={inView ? { opacity: 1, x: 0 } : {}}
								transition={{ duration: 0.7, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
								className="hidden lg:flex justify-start"
							>
								{/* Signal beacon wrapper with corner reticles */}
								<div style={{ position: "relative", display: "inline-block" }}>

									{/* Corner targeting reticles */}
									{/* TL */}
									<div style={{ position: "absolute", top: -10, left: -10, width: 14, height: 14, pointerEvents: "none" }}>
										<motion.div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1 }} animate={prefersReduced ? {} : { background: CYCLE_COLORS }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />
										<motion.div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 1 }} animate={prefersReduced ? {} : { background: CYCLE_COLORS }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />
									</div>
									{/* TR */}
									<div style={{ position: "absolute", top: -10, right: -10, width: 14, height: 14, pointerEvents: "none" }}>
										<motion.div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1 }} animate={prefersReduced ? {} : { background: CYCLE_COLORS }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />
										<motion.div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 1 }} animate={prefersReduced ? {} : { background: CYCLE_COLORS }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />
									</div>
									{/* BL */}
									<div style={{ position: "absolute", bottom: -10, left: -10, width: 14, height: 14, pointerEvents: "none" }}>
										<motion.div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1 }} animate={prefersReduced ? {} : { background: CYCLE_COLORS }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />
										<motion.div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 1 }} animate={prefersReduced ? {} : { background: CYCLE_COLORS }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />
									</div>
									{/* BR */}
									<div style={{ position: "absolute", bottom: -10, right: -10, width: 14, height: 14, pointerEvents: "none" }}>
										<motion.div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1 }} animate={prefersReduced ? {} : { background: CYCLE_COLORS }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />
										<motion.div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 1 }} animate={prefersReduced ? {} : { background: CYCLE_COLORS }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />
									</div>

									{/* Border shell — cycling background creates the 1.5px border */}
									<motion.div
										animate={prefersReduced ? {} : { backgroundColor: CYCLE_COLORS }}
										transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
										style={{
											padding: "1.5px",
											clipPath: "polygon(0% 0%, calc(100% - 24px) 0%, 100% 24px, 100% 100%, 24px 100%, 0% calc(100% - 24px))",
											display: "inline-flex",
										}}
									>
										<motion.a
											href="#portfolio"
											onHoverStart={() => setCtaHovered(true)}
											onHoverEnd={() => setCtaHovered(false)}
											animate={{
												boxShadow: ctaHovered
													? "0 0 48px rgba(255,120,30,0.45), inset 0 0 32px rgba(255,120,30,0.08)"
													: "0 0 18px rgba(255,120,30,0.18), inset 0 0 14px rgba(255,120,30,0.04)",
											}}
											transition={{ duration: 0.35 }}
											style={{
												width: 410, height: 64,
												overflow: "hidden", display: "flex",
												alignItems: "center", position: "relative",
												background: "#06060A",
												textDecoration: "none", cursor: "pointer",
											}}
										>
											{/* Triple scan lines */}
											{!prefersReduced && [0, 0.4, 0.8].map((delay, i) => (
												<motion.div key={i}
													animate={{ x: ["-100%", "620%"] }}
													transition={{ duration: 1.7, ease: "linear", repeat: Infinity, repeatDelay: 1.9, delay }}
													style={{
														position: "absolute", height: 1, width: "20%",
														top: `${18 + i * 26}%`,
														background: "linear-gradient(90deg, transparent, rgba(255,120,30,0.22), transparent)",
														pointerEvents: "none",
													}}
												/>
											))}

											{/* Play icon zone */}
											<div style={{ minWidth: 66, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
												{/* Pulsing ring */}
												<motion.div
													animate={prefersReduced ? {} : { scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
													transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
													style={{ position: "absolute", width: 26, height: 26, borderRadius: "50%", border: "1px solid #FF781E", pointerEvents: "none" }}
												/>
												<motion.span
													animate={prefersReduced ? {} : { color: CYCLE_COLORS }}
													transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
													style={{ fontSize: 15, fontFamily: "monospace", position: "relative", zIndex: 1 }}
												>▶</motion.span>
											</div>

											{/* Separator */}
											<motion.div
												animate={prefersReduced ? {} : { backgroundColor: CYCLE_COLORS }}
												transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
												style={{ width: 1, height: 30, flexShrink: 0, opacity: 0.35 }}
											/>

											{/* Text */}
											<span style={{
												fontFamily: "'Integral CF', sans-serif",
												fontSize: 10.5, letterSpacing: "0.22em",
												color: "rgba(255,255,255,0.88)",
												whiteSpace: "nowrap", paddingLeft: 18, paddingRight: 22, flex: 1,
											}}>
												WATCH MY PROJECTS
											</span>

											{/* Status dot */}
											<motion.div
												animate={prefersReduced ? {} : { backgroundColor: CYCLE_COLORS, opacity: [1, 0.25, 1] }}
												transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
												style={{ position: "absolute", top: 10, right: 13, width: 5, height: 5, borderRadius: "50%" }}
											/>
										</motion.a>
									</motion.div>

									{/* HUD coordinates */}
									<motion.div
										animate={prefersReduced ? {} : { color: CYCLE_COLORS }}
										transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
										style={{ fontFamily: "monospace", fontSize: 8, letterSpacing: "0.18em", marginTop: 7, paddingLeft: 3, opacity: 0.22 }}
									>
										43.7731°N 11.2560°E · FI-IT
									</motion.div>
								</div>
							</motion.div>
						</div>
					</div>
				</div>

				{/* ── Mobile description — flex item centered by justify-between ── */}
				<div className="lg:hidden max-w-7xl mx-auto px-5 w-full text-center">
					<p className="font-body font-light leading-relaxed text-sm mb-2" style={{ color: "#E2E8F0" }}>
						{t.about.description}
					</p>
					<AnimatePresence>
						{textExpanded && (
							<motion.p
								key="desc2-mobile"
								initial={{ opacity: 0, height: 0, marginBottom: 0 }}
								animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
								exit={{ opacity: 0, height: 0, marginBottom: 0 }}
								transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
								className="font-body font-light leading-relaxed text-sm overflow-hidden"
								style={{ color: "#E2E8F0" }}
							>
								{t.about.description2}
							</motion.p>
						)}
					</AnimatePresence>
					{!textExpanded && (
						<button
							onClick={() => setTextExpanded(true)}
							className="flex items-center gap-2 mt-1 mx-auto font-display font-600 text-xs
							           tracking-[0.2em] text-[var(--text-3)] hover:text-[var(--text-2)]
							           transition-colors"
						>
							<span className="text-base leading-none tracking-[0.3em]">···</span>
							<span>leggi di più</span>
						</button>
					)}
				</div>

				{/* ── Cyberpunk CTA — mobile, at bottom via justify-between ── */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={inView ? { opacity: 1 } : {}}
					transition={{ duration: 0.7, delay: 0.5 }}
					className="lg:hidden flex items-center justify-center pb-8"
				>
									<div style={{ position: "relative", display: "inline-block" }}>
						{/* Border shell */}
						<motion.div
							animate={prefersReduced ? {} : { backgroundColor: CYCLE_COLORS }}
							transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
							style={{
								padding: "1.5px",
								clipPath: "polygon(0% 0%, calc(100% - 20px) 0%, 100% 20px, 100% 100%, 20px 100%, 0% calc(100% - 20px))",
								display: "inline-flex",
							}}
						>
							<a
								href="#portfolio"
								style={{
									width: 310, height: 56,
									overflow: "hidden", display: "flex",
									alignItems: "center", position: "relative",
									background: "#06060A",
									textDecoration: "none", cursor: "pointer",
								}}
							>
								{/* Scan lines */}
								{!prefersReduced && [0, 0.45].map((delay, i) => (
									<motion.div key={i}
										animate={{ x: ["-100%", "620%"] }}
										transition={{ duration: 1.8, ease: "linear", repeat: Infinity, repeatDelay: 1.8, delay }}
										style={{
											position: "absolute", height: 1, width: "22%",
											top: `${28 + i * 30}%`,
											background: "linear-gradient(90deg, transparent, rgba(255,120,30,0.2), transparent)",
											pointerEvents: "none",
										}}
									/>
								))}

								{/* Play icon */}
								<div style={{ minWidth: 60, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
									<motion.div
										animate={prefersReduced ? {} : { scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
										transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
										style={{ position: "absolute", width: 24, height: 24, borderRadius: "50%", border: "1px solid #FF781E", pointerEvents: "none" }}
									/>
									<motion.span
										animate={prefersReduced ? {} : { color: CYCLE_COLORS }}
										transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
										style={{ fontSize: 13, fontFamily: "monospace", position: "relative", zIndex: 1 }}
									>▶</motion.span>
								</div>

								{/* Separator */}
								<motion.div
									animate={prefersReduced ? {} : { backgroundColor: CYCLE_COLORS }}
									transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
									style={{ width: 1, height: 26, flexShrink: 0, opacity: 0.35 }}
								/>

								{/* Text */}
								<span style={{
									fontFamily: "'Integral CF', sans-serif",
									fontSize: 10, letterSpacing: "0.2em",
									color: "rgba(255,255,255,0.88)",
									whiteSpace: "nowrap", paddingLeft: 16, paddingRight: 18,
								}}>
									WATCH MY PROJECTS
								</span>

								{/* Status dot */}
								<motion.div
									animate={prefersReduced ? {} : { backgroundColor: CYCLE_COLORS, opacity: [1, 0.25, 1] }}
									transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
									style={{ position: "absolute", top: 9, right: 11, width: 4, height: 4, borderRadius: "50%" }}
								/>
							</a>
						</motion.div>

						{/* HUD label */}
						<motion.div
							animate={prefersReduced ? {} : { color: CYCLE_COLORS }}
							transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
							style={{ fontFamily: "monospace", fontSize: 7, letterSpacing: "0.15em", marginTop: 6, opacity: 0.22, textAlign: "center" }}
						>
							FI-IT · PABROGI.COM
						</motion.div>
					</div>
				</motion.div>

				</div> {/* flex wrapper */}
			  </div> {/* sticky */}
			</section>
		</>
	);
}
