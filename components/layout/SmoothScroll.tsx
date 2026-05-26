"use client";

import { useRef } from "react";
import ReactLenis, { type LenisRef } from "lenis/react";
import { useAnimationFrame } from "framer-motion";

/**
 * SmoothScroll — wraps the app with Lenis inertia scroll.
 * RAF is driven by Framer Motion's scheduler so both libraries
 * stay in sync and `useScroll` motion values remain accurate.
 */
export default function SmoothScroll({
	children,
}: {
	children: React.ReactNode;
}) {
	const lenisRef = useRef<LenisRef>(null);

	// Tick Lenis inside Framer Motion's animation frame loop
	useAnimationFrame((time) => {
		lenisRef.current?.lenis?.raf(time);
	});

	return (
		<ReactLenis
			ref={lenisRef}
			root
			options={{
				lerp: 0.14,           // più reattivo — lo scroll risponde prima
				smoothWheel: true,
				wheelMultiplier: 1.1, // velocità naturale
				touchMultiplier: 1.8,
				autoRaf: false,       // RAF guidato da Framer Motion
				overscroll: false,
			}}
		>
			{children}
		</ReactLenis>
	);
}
