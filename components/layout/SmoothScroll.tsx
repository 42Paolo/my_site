"use client";

import { useRef, useEffect } from "react";
import ReactLenis, { type LenisRef } from "lenis/react";
import { useAnimationFrame } from "framer-motion";

/**
 * SmoothScroll — wraps the app with Lenis inertia scroll.
 * RAF is driven by Framer Motion's scheduler so both libraries
 * stay in sync and `useScroll` motion values remain accurate.
 *
 * On mobile (< 1024px) Lenis RAF is skipped entirely so the browser
 * uses native touch scroll (GPU-accelerated) instead of the JS loop.
 */
export default function SmoothScroll({
	children,
}: {
	children: React.ReactNode;
}) {
	const lenisRef  = useRef<LenisRef>(null);
	const isMobileRef = useRef(false);

	useEffect(() => {
		isMobileRef.current = window.innerWidth < 1024;
	}, []);

	// Tick Lenis only on desktop — mobile uses native scroll
	useAnimationFrame((time) => {
		if (!isMobileRef.current) {
			lenisRef.current?.lenis?.raf(time);
		}
	});

	return (
		<ReactLenis
			ref={lenisRef}
			root
			options={{
				lerp: 0.14,
				smoothWheel: true,
				wheelMultiplier: 1.1,
				touchMultiplier: 1.8,
				autoRaf: false,
				overscroll: false,
			}}
		>
			{children}
		</ReactLenis>
	);
}
