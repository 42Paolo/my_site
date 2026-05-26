import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import SmoothScroll from "@/components/layout/SmoothScroll";
import StarField from "@/components/layout/StarField";
import CustomCursor from "@/components/ui/CustomCursor";

export const metadata: Metadata = {
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_SITE_URL ?? "https://pabrogi.com"
	),
	title: "pabrogi — Web Developer Freelance",
	description:
		"Sviluppatore web freelance. Creo siti professionali e premium per aziende e attività che vogliono crescere online.",
	keywords: ["web developer", "siti web", "web design", "freelance", "pabrogi", "firenze"],
	openGraph: {
		title: "pabrogi — Web Developer Freelance",
		description: "Siti web che fanno crescere la tua attività. Design premium, performance, SEO.",
		type: "website",
		locale: "it_IT",
		siteName: "pabrogi",
	},
	twitter: {
		card: "summary_large_image",
		title: "pabrogi — Web Developer Freelance",
		description: "Siti web che fanno crescere la tua attività.",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="it"
			suppressHydrationWarning
		>
			<head>
				{/* Fontshare — preconnect for faster loading */}
				<link rel="preconnect" href="https://api.fontshare.com" />
				<link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
				{/* Google Fonts — Cormorant Garamond */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
			</head>
			<body className="font-body antialiased">
				<a href="#main-content" className="skip-to-content">
					Salta al contenuto principale
				</a>
				<ThemeProvider>
					<LanguageProvider>
					<StarField />
					<CustomCursor />
					<SmoothScroll>
						<main id="main-content" tabIndex={-1}>
							{children}
						</main>
					</SmoothScroll>
					</LanguageProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
