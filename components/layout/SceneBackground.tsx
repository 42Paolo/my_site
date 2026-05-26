"use client";

import { useEffect, useRef } from "react";

const LIGHT = {
	bg:      [245, 240, 232],
	bg2:     [240, 234, 224],
	bg3:     [235, 228, 216],
	surface: [245, 240, 232],
	text:    [14,  8,   32 ],
	text2:   [61,  40,  112],
	text3:   [122, 96,  168],
	border:  [150, 107, 225, 0.18],
};
const SPACE = {
	bg:      [2,   9,   18 ],
	bg2:     [4,   14,  28 ],
	bg3:     [6,   18,  36 ],
	surface: [5,   15,  30 ],
	text:    [232, 240, 255],
	text2:   [138, 170, 208],
	text3:   [74,  106, 144],
	border:  [100, 160, 255, 0.12],
};

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function lerpRgb(a: number[], b: number[], t: number) {
	return `rgb(${Math.round(lerp(a[0],b[0],t))},${Math.round(lerp(a[1],b[1],t))},${Math.round(lerp(a[2],b[2],t))})`;
}
function lerpRgba(a: number[], b: number[], t: number) {
	return `rgba(${Math.round(lerp(a[0],b[0],t))},${Math.round(lerp(a[1],b[1],t))},${Math.round(lerp(a[2],b[2],t))},${lerp(a[3],b[3],t).toFixed(2)})`;
}

export default function SceneBackground() {
	const spaceLayerRef = useRef<HTMLDivElement>(null);
	const rafRef        = useRef<number>(0);
	const currentT      = useRef(0);

	useEffect(() => {
		const root = document.documentElement;

		const tick = () => {
			const vh             = window.innerHeight;
			const heroScrollable = 1.6 * vh;
			const start          = heroScrollable * 0.35;
			const end            = heroScrollable;
			const targetT        = Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)));

			currentT.current += (targetT - currentT.current) * 0.06;
			const t = currentT.current;

			if (spaceLayerRef.current) {
				spaceLayerRef.current.style.opacity = String(t.toFixed(4));
			}

			root.style.setProperty("--bg",      lerpRgb(LIGHT.bg,      SPACE.bg,      t));
			root.style.setProperty("--bg-2",    lerpRgb(LIGHT.bg2,     SPACE.bg2,     t));
			root.style.setProperty("--bg-3",    lerpRgb(LIGHT.bg3,     SPACE.bg3,     t));
			root.style.setProperty("--surface", lerpRgb(LIGHT.surface, SPACE.surface, t));
			root.style.setProperty("--text",    lerpRgb(LIGHT.text,    SPACE.text,    t));
			root.style.setProperty("--text-2",  lerpRgb(LIGHT.text2,   SPACE.text2,   t));
			root.style.setProperty("--text-3",  lerpRgb(LIGHT.text3,   SPACE.text3,   t));
			root.style.setProperty("--border",  lerpRgba(LIGHT.border, SPACE.border,  t));

			rafRef.current = requestAnimationFrame(tick);
		};

		rafRef.current = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafRef.current);
	}, []);

	return (
		<>
			<div style={{ position: "fixed", inset: 0, zIndex: -2, background: "#F5F0E8", pointerEvents: "none" }} />
			<div
				ref={spaceLayerRef}
				style={{ position: "fixed", inset: 0, zIndex: -1, background: "#020912", opacity: 0, pointerEvents: "none", willChange: "opacity" }}
			/>
		</>
	);
}
