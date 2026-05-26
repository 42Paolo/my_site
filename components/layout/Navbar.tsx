"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import LanguageToggle from "@/components/ui/LanguageToggle";
import Button from "@/components/ui/Button";
import { useLenis } from "lenis/react";

const navLinks = [
	{ key: "about", href: "#chi-sono" },
	{ key: "services", href: "#servizi" },
	{ key: "portfolio", href: "#portfolio" },
	{ key: "process", href: "#processo" },
	{ key: "contact", href: "#contatto" },
] as const;

export default function Navbar() {
	const { t } = useLang();
	const lenis = useLenis();
	const [scrolled, setScrolled] = useState(false);
	const [hidden, setHidden] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const isMobileRef = useRef(false);
	useEffect(() => { isMobileRef.current = window.innerWidth < 1024; }, []);

	useEffect(() => {
		let lastY = window.scrollY;
		const onScroll = () => {
			const y = window.scrollY;
			setScrolled(y > 30);
			// nascondi se scrolli verso il basso di almeno 10px e non sei in cima
			if (y > lastY && y > 80) setHidden(true);
			// mostra solo se sei tornato completamente in cima
			if (y <= 0) setHidden(false);
			lastY = y;
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const handleNavClick = (href: string) => {
		setMobileOpen(false);
		if (lenis && window.innerWidth >= 1024) {
			lenis.scrollTo(href, { lerp: 0.08, duration: 1.4 });
		} else {
			document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<>
			<motion.header
				initial={isMobileRef.current ? false : { y: -64, opacity: 0 }}
				animate={{ y: hidden ? "-100%" : 0, opacity: hidden ? 0.4 : 1 }}
				transition={
					isMobileRef.current
						? { duration: 0 }
						: hidden
							? { duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }
							: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }
				}
				className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${scrolled
						? "bg-[var(--bg)]/90 backdrop-blur-xl border-b border-[var(--border)] shadow-lg shadow-solar/5"
						: "bg-transparent"
					}`}
			>
				<nav className="max-w-7xl mx-auto px-5 md:px-8 h-18 flex items-center justify-between py-4">
					{/* Logo */}
					<a
						href="#"
						onClick={(e) => { e.preventDefault(); lenis ? lenis.scrollTo(0, { lerp: 0.08, duration: 1.6 }) : window.scrollTo({ top: 0, behavior: "smooth" }); }}
						className="font-800 text-2xl tracking-tight" style={{ fontFamily: "'Integral CF', sans-serif" }}
					>
						<span style={{ color: "#C2E812" }}>pa</span>
						<span style={{ color: "#001547" }}>brogi</span>
					</a>

					{/* Desktop links */}
					<ul className="hidden md:flex items-center gap-7">
						{navLinks.map((link) => (
							<li key={link.key}>
								<button
									onClick={() => handleNavClick(link.href)}
									className="text-[var(--text-2)] hover:text-solar font-body text-sm font-500
                             transition-colors duration-200 relative group cursor-pointer"
								>
									{t.nav[link.key]}
									<span className="absolute -bottom-0.5 left-0 w-0 h-px bg-solar group-hover:w-full transition-all duration-300" />
								</button>
							</li>
						))}
					</ul>

					{/* Controls */}
					<div className="hidden md:flex items-center gap-3">
						<LanguageToggle />
					</div>

					{/* Mobile hamburger */}
					<div className="flex md:hidden items-center gap-3">
						<LanguageToggle />
						<button
							onClick={() => setMobileOpen(!mobileOpen)}
							className="w-10 h-10 flex items-center justify-center rounded-full
                         border border-[var(--border-strong)] bg-[var(--surface)]
                         text-[var(--text)] hover:text-solar transition-colors"
						>
							{mobileOpen ? <X size={18} /> : <Menu size={18} />}
						</button>
					</div>
				</nav>
			</motion.header>

			{/* Mobile menu */}
			<AnimatePresence>
				{mobileOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.25 }}
						className="fixed top-[72px] left-4 right-4 z-40 rounded-2xl
                       bg-[var(--surface)]/95 backdrop-blur-xl
                       border border-[var(--border-strong)] shadow-2xl shadow-solar/10 p-6"
					>
						<ul className="flex flex-col gap-4">
							{navLinks.map((link, i) => (
								<motion.li
									key={link.key}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.07 }}
								>
									<button
										onClick={() => handleNavClick(link.href)}
										className="w-full text-left font-display font-600 text-lg text-[var(--text)]
                               hover:text-solar transition-colors py-1 cursor-pointer"
									>
										{t.nav[link.key]}
									</button>
								</motion.li>
							))}
							<motion.li
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.4 }}
								className="pt-2"
							>
								<Button
									href="#contatto"
									className="w-full justify-center"
									onClick={() => setMobileOpen(false)}
								>
									{t.nav.cta}
								</Button>
							</motion.li>
						</ul>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
