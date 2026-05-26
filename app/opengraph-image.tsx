import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import path from "path";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
	const integralCF = readFileSync(
		path.join(process.cwd(), "public/fonts/integral-cf-bold.woff2")
	);

	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					background: "#020912",
					padding: "52px 68px 0 68px",
					position: "relative",
					overflow: "hidden",
				}}
			>
				{/* ── Ambient glows ── */}
				<div
					style={{
						position: "absolute",
						top: "-80px",
						right: "-80px",
						width: "520px",
						height: "520px",
						borderRadius: "50%",
						background:
							"radial-gradient(circle, rgba(255,120,30,0.18) 0%, transparent 70%)",
						display: "flex",
					}}
				/>
				<div
					style={{
						position: "absolute",
						bottom: "40px",
						left: "-60px",
						width: "400px",
						height: "400px",
						borderRadius: "50%",
						background:
							"radial-gradient(circle, rgba(22,174,239,0.13) 0%, transparent 70%)",
						display: "flex",
					}}
				/>
				<div
					style={{
						position: "absolute",
						top: "50%",
						right: "180px",
						width: "280px",
						height: "280px",
						borderRadius: "50%",
						background:
							"radial-gradient(circle, rgba(148,107,225,0.10) 0%, transparent 70%)",
						display: "flex",
					}}
				/>

				{/* ── Top bar: logo + badge ── */}
				<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
					<div
						style={{
							color: "#FF781E",
							fontSize: 20,
							fontFamily: "Integral CF",
							letterSpacing: "0.06em",
							fontWeight: 700,
						}}
					>
						pabrogi
					</div>
					<div
						style={{
							width: 1,
							height: 18,
							background: "rgba(100,160,255,0.25)",
							display: "flex",
						}}
					/>
					<div
						style={{
							color: "#4A6A90",
							fontSize: 13,
							letterSpacing: "0.22em",
							fontFamily: "sans-serif",
							fontWeight: 400,
						}}
					>
						SVILUPPATORE WEB FREELANCE
					</div>
				</div>

				{/* ── Main content ── */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						justifyContent: "center",
						paddingBottom: "24px",
					}}
				>
					{/* Big name */}
					<div
						style={{
							fontSize: 152,
							fontFamily: "Integral CF",
							fontWeight: 700,
							color: "#E8F0FF",
							letterSpacing: "-0.045em",
							lineHeight: 0.88,
							display: "flex",
						}}
					>
						PABROGI
					</div>

					{/* Tagline */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "18px",
							marginTop: "32px",
						}}
					>
						<div
							style={{
								width: 36,
								height: 2,
								background: "#FF781E",
								display: "flex",
							}}
						/>
						<div
							style={{
								fontSize: 19,
								color: "#8AAAD0",
								letterSpacing: "0.16em",
								fontFamily: "sans-serif",
								fontWeight: 400,
							}}
						>
							SITI WEB CHE FANNO CRESCERE LA TUA ATTIVITÀ
						</div>
					</div>
				</div>

				{/* ── Bottom row: dots + url ── */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						paddingBottom: "36px",
					}}
				>
					{/* Color dots */}
					<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
						{(["#FF781E", "#16AEEF", "#5DC264", "#946BE1", "#F9CF57"] as const).map(
							(c, i) => (
								<div
									key={i}
									style={{
										width: i === 0 ? 10 : 7,
										height: i === 0 ? 10 : 7,
										borderRadius: "50%",
										background: c,
										display: "flex",
										opacity: i === 0 ? 1 : 0.65,
									}}
								/>
							)
						)}
					</div>

					{/* URL */}
					<div
						style={{
							color: "#4A6A90",
							fontSize: 15,
							letterSpacing: "0.1em",
							fontFamily: "sans-serif",
						}}
					>
						pabrogi.com
					</div>
				</div>

				{/* ── Rainbow stripe at the bottom ── */}
				<div
					style={{
						position: "absolute",
						bottom: 0,
						left: 0,
						right: 0,
						height: 5,
						background:
							"linear-gradient(90deg, #FF781E 0%, #F9CF57 25%, #5DC264 50%, #16AEEF 75%, #946BE1 100%)",
						display: "flex",
					}}
				/>
			</div>
		),
		{
			...size,
			fonts: [
				{
					name: "Integral CF",
					data: integralCF,
					style: "normal",
					weight: 700,
				},
			],
		}
	);
}
