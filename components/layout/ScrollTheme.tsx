"use client";

import { useEffect } from "react";

// Colori di partenza (panna) e arrivo (spazio)
const LIGHT = {
	bg:      [245, 240, 232],
	bg2:     [240, 234, 224],
	surface: [245, 240, 232],
	text:    [14,  8,   32],
	text2:   [61,  40, 112],
	text3:   [122, 96, 168],
	border:  [150, 107, 225, 0.18],
};
const SPACE = {
	bg:      [2,   9,  18],
	bg2:     [4,  14,  28],
	surface: [5,  15,  30],
	text:    [232, 240, 255],
	text2:   [138, 170, 208],
	text3:   [74,  106, 144],
	border:  [100, 160, 255, 0.12],
};

function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

function lerpColor(a: number[], b: number[], t: number) {
	if (a.length === 4) {
		return `rgba(${Math.round(lerp(a[0],b[0],t))},${Math.round(lerp(a[1],b[1],t))},${Math.round(lerp(a[2],b[2],t))},${lerp(a[3],b[3],t).toFixed(2)})`;
	}
	return `rgb(${Math.round(lerp(a[0],b[0],t))},${Math.round(lerp(a[1],b[1],t))},${Math.round(lerp(a[2],b[2],t))})`;
}

export default function ScrollTheme() {
	useEffect(() => {
		const root = document.documentElement;

		const update = () => {
			const vh = window.innerHeight;
			const heroScrollable = (260 / 100) * vh - vh; // 160vh in px

			// La transizione parte al 40% dello scroll nell'hero e finisce al 100%
			const start = heroScrollable * 0.4;
			const end   = heroScrollable;

			const t = Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)));

			root.style.setProperty("--bg",      lerpColor(LIGHT.bg,      SPACE.bg,      t));
			root.style.setProperty("--bg-2",    lerpColor(LIGHT.bg2,     SPACE.bg2,     t));
			root.style.setProperty("--bg-3",    lerpColor(LIGHT.bg2,     SPACE.bg2,     t));
			root.style.setProperty("--surface", lerpColor(LIGHT.surface, SPACE.surface, t));
			root.style.setProperty("--text",    lerpColor(LIGHT.text,    SPACE.text,    t));
			root.style.setProperty("--text-2",  lerpColor(LIGHT.text2,   SPACE.text2,   t));
			root.style.setProperty("--text-3",  lerpColor(LIGHT.text3,   SPACE.text3,   t));
			root.style.setProperty("--border",  lerpColor(LIGHT.border,  SPACE.border,  t));
		};

		window.addEventListener("scroll", update, { passive: true });
		update();
		return () => window.removeEventListener("scroll", update);
	}, []);

	return null;
}
