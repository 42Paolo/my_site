"use client";

import { useLang } from "@/context/LanguageContext";

export default function LanguageToggle() {
	const { lang, toggleLang } = useLang();

	return (
		<button
			onClick={toggleLang}
			aria-label="Toggle language"
			className="relative flex items-center gap-0.5 px-3 py-1.5
                 bg-transparent border-none outline-none
                 hover:opacity-70
                 transition-all duration-300 text-sm font-display font-600 cursor-pointer"
		>
			<span className={`transition-all duration-200 ${lang === "it" ? "text-solar font-700" : "text-[var(--text-3)]"}`}>
				IT
			</span>
			<span className="text-[var(--text-3)] px-0.5">/</span>
			<span className={`transition-all duration-200 ${lang === "en" ? "text-solar font-700" : "text-[var(--text-3)]"}`}>
				EN
			</span>
		</button>
	);
}
