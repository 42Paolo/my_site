import { useState, useEffect } from "react";

/**
 * Returns true on viewports < 1024px (lg breakpoint).
 * Starts as false (SSR-safe), flips to true after mount on mobile.
 */
export function useIsMobile(breakpoint = 1024): boolean {
	const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		setIsMobile(window.innerWidth < breakpoint);
	}, []);
	return isMobile;
}
