"use client";

import { useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

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
	const x    = useMotionValue(-100);
	const y    = useMotionValue(-100);
	const size = useMotionValue(10);

	useEffect(() => {
		const onMove = (e: MouseEvent) => {
			x.set(e.clientX);
			y.set(e.clientY);
			const target = isPointer(e.target as Element) ? 20 : 10;
			if (Math.abs(size.get() - target) > 0.5) {
				animate(size, target, { duration: 0.12, ease: [0.16, 1, 0.3, 1] });
			}
		};
		const onLeave = () => { x.set(-100); y.set(-100); };

		window.addEventListener("mousemove", onMove);
		document.documentElement.addEventListener("mouseleave", onLeave);
		return () => {
			window.removeEventListener("mousemove", onMove);
			document.documentElement.removeEventListener("mouseleave", onLeave);
		};
	}, [x, y, size]);

	return (
		<motion.div
			className="pointer-events-none fixed z-[9999] hidden lg:block"
			style={{
				x,
				y,
				translateX: "-50%",
				translateY: "-50%",
				width: size,
				height: size,
				borderRadius: "50%",
				background: "#E8F0FF",
				opacity: 0.9,
			}}
		/>
	);
}
