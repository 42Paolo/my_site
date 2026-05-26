"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

const CLICKABLE = new Set(["a", "button", "select", "textarea", "label"]);

function isPointer(el: Element | null): boolean {
	let node = el;
	while (node && node !== document.body) {
		const tag = node.tagName.toLowerCase();
		if (CLICKABLE.has(tag)) return true;
		if (node instanceof HTMLInputElement) return true;
		const role = node.getAttribute("role");
		if (role === "button" || role === "link" || role === "menuitem") return true;
		if (window.getComputedStyle(node).cursor === "pointer") return true;
		node = node.parentElement;
	}
	return false;
}

export default function CustomCursor() {
	const x = useMotionValue(-100);
	const y = useMotionValue(-100);
	const [hovered, setHovered] = useState(false);
	const rafId = useRef<number>(0);

	useEffect(() => {
		const onMove = (e: MouseEvent) => {
			// Cancel any pending RAF to avoid batching lag
			cancelAnimationFrame(rafId.current);
			rafId.current = requestAnimationFrame(() => {
				x.set(e.clientX);
				y.set(e.clientY);
			});
			setHovered(isPointer(e.target as Element));
		};

		const onLeave = () => { x.set(-100); y.set(-100); };

		window.addEventListener("mousemove", onMove);
		document.documentElement.addEventListener("mouseleave", onLeave);
		return () => {
			window.removeEventListener("mousemove", onMove);
			document.documentElement.removeEventListener("mouseleave", onLeave);
			cancelAnimationFrame(rafId.current);
		};
	}, [x, y]);

	return (
		<motion.div
			className="pointer-events-none fixed z-[9999] hidden lg:block"
			style={{
				x,
				y,
				translateX: "-50%",
				translateY: "-50%",
				borderRadius: "50%",
				background: "#E8F0FF",
				opacity: 0.9,
			}}
			animate={{
				width: hovered ? 20 : 10,
				height: hovered ? 20 : 10,
			}}
			transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
		/>
	);
}
