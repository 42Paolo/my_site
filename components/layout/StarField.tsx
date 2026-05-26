"use client";

import { useMemo, useEffect, useState } from "react";

// xorshift32 — deterministic, same output on server + client
function mkRng(seed: number) {
	let s = seed >>> 0;
	return () => {
		s ^= s << 13;
		s ^= s >> 17;
		s ^= s << 5;
		return (s >>> 0) / 0x100000000;
	};
}

const COUNT   = 180;
const COLORS  = ["#FFFFFF", "#E8F0FF", "#C0D8F8"];

export default function StarField() {
	const stars = useMemo(() => {
		const rng = mkRng(0xdeadbeef);
		return Array.from({ length: COUNT }, (_, i) => ({
			i,
			x:       rng() * 100,
			y:       rng() * 100,
			size:    1 + rng() * 1.5,
			op:      0.3 + rng() * 0.7,
			color:   Math.floor(rng() * 3),
			dur:     2.5 + rng() * 5,
			delay:   -(rng() * 8),
			variant: Math.floor(rng() * 5),
			twinkle: rng() > 0.15,
		}));
	}, []);

	// Nascondi le stelle quando la sezione #chi-sono è in vista
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		const target = document.getElementById("chi-sono");
		if (!target) return;

		const observer = new IntersectionObserver(
			([entry]) => setHidden(entry.isIntersecting),
			{ threshold: 0.05 }
		);
		observer.observe(target);
		return () => observer.disconnect();
	}, []);

	return (
		<>
			<style>{`
				@keyframes tw0{0%,100%{opacity:var(--so)}50%{opacity:calc(var(--so)*0.08)}}
				@keyframes tw1{0%,100%{opacity:calc(var(--so)*0.25)}45%{opacity:var(--so)}}
				@keyframes tw2{0%,60%,100%{opacity:var(--so)}30%{opacity:calc(var(--so)*0.12)}}
				@keyframes tw3{0%,100%{opacity:var(--so)}35%{opacity:calc(var(--so)*0.35)}70%{opacity:calc(var(--so)*0.08)}}
				@keyframes tw4{0%,100%{opacity:calc(var(--so)*0.15)}50%{opacity:var(--so)}}
			`}</style>
			<div
				aria-hidden="true"
				style={{
					position: "fixed",
					inset: 0,
					zIndex: 1,
					pointerEvents: "none",
					overflow: "hidden",
					opacity: hidden ? 0 : 1,
					transition: "opacity 0.9s ease",
				}}
			>
				{stars.map((s) => (
					<div
						key={s.i}
						style={{
							position:     "absolute",
							left:         `${s.x}%`,
							top:          `${s.y}%`,
							width:        `${s.size}px`,
							height:       `${s.size}px`,
							borderRadius: "50%",
							background:   COLORS[s.color],
							opacity:      s.op,
							["--so" as string]: s.op,
							animation:    s.twinkle
								? `tw${s.variant} ${s.dur}s ${s.delay}s ease-in-out infinite`
								: "none",
						} as React.CSSProperties}
					/>
				))}
			</div>
		</>
	);
}
