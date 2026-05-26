"use client";

import { useLang } from "@/context/LanguageContext";
import { useLenis } from "lenis/react";

const navLinks = [
	{ key: "about", href: "#chi-sono" },
	{ key: "services", href: "#servizi" },
	{ key: "portfolio", href: "#portfolio" },
	{ key: "process", href: "#processo" },
	{ key: "contact", href: "#contatto" },
] as const;

export default function Footer() {
	const { t } = useLang();
	const lenis = useLenis();

	const handleClick = (href: string) => {
		if (lenis) {
			lenis.scrollTo(href, { lerp: 0.08, duration: 1.4 });
		} else {
			document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<footer className="bg-espresso border-t border-[#2E1A00] relative overflow-hidden">
			{/* Vivid top gradient border */}
			<div className="absolute top-0 left-0 right-0 h-0.5"
				style={{ background: "linear-gradient(90deg, #FF4400, #FFD200, #FF6B6B, #0AC8FF, #FF4400)", backgroundSize: "200% 100%" }}
			/>
			{/* Ambient glow */}
			<div className="absolute top-0 left-1/4 w-80 h-48
                      bg-gradient-radial from-solar/20 to-transparent blur-3xl pointer-events-none" />
			<div className="absolute top-0 right-1/4 w-60 h-36
                      bg-gradient-radial from-golden/15 to-transparent blur-2xl pointer-events-none" />

			<div className="max-w-7xl mx-auto px-5 md:px-8 py-14">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
					{/* Brand */}
					<div>
						<div className="font-800 text-3xl mb-3" style={{ fontFamily: "'Integral CF', sans-serif" }}>
							<span className="gradient-text">pab</span>
							<span className="text-white">rogi</span>
						</div>
						<p className="font-body font-light text-sm text-white/50 max-w-xs leading-relaxed">
							{t.footer.tagline}
						</p>
					</div>

					{/* Navigation */}
					<div>
						<h4 className="font-display font-700 text-sm text-white/40 uppercase tracking-widest mb-5">
							{t.footer.nav}
						</h4>
						<ul className="flex flex-col gap-3">
							{navLinks.map((link) => (
								<li key={link.key}>
									<button
										onClick={() => handleClick(link.href)}
										className="font-body text-sm text-white/60 hover:text-solar
                               transition-colors duration-200 cursor-pointer bg-transparent border-none outline-none p-0"
									>
										{t.nav[link.key]}
									</button>
								</li>
							))}
						</ul>
					</div>

					{/* Social */}
					<div>
						<h4 className="font-display font-700 text-sm text-white/40 uppercase tracking-widest mb-5">
							{t.footer.social}
						</h4>
						<div className="flex flex-col gap-3">
							{[
								{ name: "LinkedIn", handle: "@Paolo Brogi", href: "https://www.linkedin.com/in/paolo-brogi" },
								{ name: "GitHub",   handle: "@42Paolo",     href: "https://github.com/42Paolo" },
								{ name: "Instagram",handle: "@pabrogi",     href: "https://www.instagram.com/pabrogi" },
							].map((s) => (
								<a
									key={s.name}
									href={s.href}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`${s.name} ${s.handle}`}
									className="font-body text-sm text-white/60 hover:text-solar
                             transition-colors duration-200 flex items-center gap-2"
								>
									<span>{s.name}</span>
									<span className="text-white/30 text-xs">{s.handle}</span>
								</a>
							))}
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="pt-6 border-t border-white/10 flex flex-col md:flex-row
                        items-center justify-between gap-3">
					<p className="font-body text-xs text-white/30">
						© {new Date().getFullYear()} pabrogi. {t.footer.rights}
					</p>
					<p className="font-body text-xs text-white/20">
						Made with ☀️ in Italy
					</p>
				</div>
			</div>
		</footer>
	);
}
