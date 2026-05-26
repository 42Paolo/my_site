"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";

export default function CustomCursor() {
	const x = useMotionValue(-100);
	const y = useMotionValue(-100);

	// Diretto — nessun lag, 1:1 con il mouse
	const sx = x;
	const sy = y;

	useEffect(() => {
		const move = (e: MouseEvent) => {
			x.set(e.clientX);
			y.set(e.clientY);
		};
		window.addEventListener("mousemove", move);
		return () => window.removeEventListener("mousemove", move);
	}, [x, y]);

	return (
		<motion.div
			className="pointer-events-none fixed z-[9999] hidden lg:block"
			style={{
				x: sx,
				y: sy,
				translateX: "-50%",
				translateY: "-50%",
				width: 10,
				height: 10,
				borderRadius: "50%",
				background: "#E8F0FF",
				opacity: 0.9,
			}}
		/>
	);
}
