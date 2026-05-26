import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ── In-memory rate limiter (per IP, 3 req/hour) ──────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX    = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

function checkRateLimit(ip: string): boolean {
	const now  = Date.now();
	const entry = rateLimitMap.get(ip);

	if (!entry || now > entry.resetAt) {
		rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
		return true; // allowed
	}
	if (entry.count >= RATE_LIMIT_MAX) return false; // blocked
	entry.count++;
	return true; // allowed
}

// ── HTML sanitizer (prevent XSS in email body) ───────────────────────────────
function sanitize(str: string): string {
	return str
		.replace(/&/g,  "&amp;")
		.replace(/</g,  "&lt;")
		.replace(/>/g,  "&gt;")
		.replace(/"/g,  "&quot;")
		.replace(/'/g,  "&#x27;")
		.replace(/\//g, "&#x2F;");
}

// ── Email validator ───────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Handler ───────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
	// Rate limit by IP
	const ip =
		req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
		req.headers.get("x-real-ip") ??
		"unknown";

	if (!checkRateLimit(ip)) {
		return NextResponse.json(
			{ error: "Troppi tentativi. Riprova tra un'ora." },
			{ status: 429 }
		);
	}

	try {
		const body = await req.json();
		const { name, email, phone, message, budget } = body as Record<string, string>;

		// Server-side validation
		if (!name?.trim() || !email?.trim() || !message?.trim()) {
			return NextResponse.json({ error: "Campi obbligatori mancanti" }, { status: 400 });
		}
		if (!EMAIL_RE.test(email)) {
			return NextResponse.json({ error: "Indirizzo email non valido" }, { status: 400 });
		}
		if (name.length > 120 || message.length > 4000) {
			return NextResponse.json({ error: "Input troppo lungo" }, { status: 400 });
		}

		// Sanitize all user input before embedding in HTML
		const sName    = sanitize(name.trim());
		const sEmail   = sanitize(email.trim());
		const sPhone   = phone   ? sanitize(phone.trim())   : "";
		const sBudget  = budget  ? sanitize(budget.trim())  : "";
		const sMessage = sanitize(message.trim()).replace(/\n/g, "<br>");

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_APP_PASSWORD,
			},
		});

		await transporter.sendMail({
			from:    `"pabrogi.com" <${process.env.GMAIL_USER}>`,
			to:      "paolotttbrogi@gmail.com",
			replyTo: sEmail,
			subject: `🚀 Nuovo progetto da ${sName}`,
			html: `
				<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#020912;color:#E2E8F0;padding:32px;border-radius:12px;">
					<h2 style="color:#C2E812;font-size:20px;margin-bottom:24px;">
						Nuovo messaggio — pabrogi.com
					</h2>
					<table style="width:100%;border-collapse:collapse;">
						<tr>
							<td style="padding:10px 0;border-bottom:1px solid #1e3a5f;color:#8AAAD0;font-size:12px;text-transform:uppercase;letter-spacing:.1em;width:120px;">Nome</td>
							<td style="padding:10px 0;border-bottom:1px solid #1e3a5f;font-size:15px;">${sName}</td>
						</tr>
						<tr>
							<td style="padding:10px 0;border-bottom:1px solid #1e3a5f;color:#8AAAD0;font-size:12px;text-transform:uppercase;letter-spacing:.1em;">Email</td>
							<td style="padding:10px 0;border-bottom:1px solid #1e3a5f;font-size:15px;"><a href="mailto:${sEmail}" style="color:#16AEEF;">${sEmail}</a></td>
						</tr>
						${sPhone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #1e3a5f;color:#8AAAD0;font-size:12px;text-transform:uppercase;letter-spacing:.1em;">Telefono</td><td style="padding:10px 0;border-bottom:1px solid #1e3a5f;font-size:15px;">${sPhone}</td></tr>` : ""}
						${sBudget ? `<tr><td style="padding:10px 0;border-bottom:1px solid #1e3a5f;color:#8AAAD0;font-size:12px;text-transform:uppercase;letter-spacing:.1em;">Budget</td><td style="padding:10px 0;border-bottom:1px solid #1e3a5f;font-size:15px;color:#C2E812;">${sBudget}</td></tr>` : ""}
						<tr>
							<td style="padding:10px 0;color:#8AAAD0;font-size:12px;text-transform:uppercase;letter-spacing:.1em;vertical-align:top;">Messaggio</td>
							<td style="padding:10px 0;font-size:15px;line-height:1.7;">${sMessage}</td>
						</tr>
					</table>
					<div style="margin-top:32px;padding-top:16px;border-top:1px solid #1e3a5f;font-size:11px;color:#4a6a8a;">
						pabrogi.com — rispondi a questa email per contattare ${sName}
					</div>
				</div>
			`,
		});

		return NextResponse.json({ ok: true });
	} catch (err) {
		console.error("[contact] Email error:", err);
		return NextResponse.json({ error: "Errore invio email" }, { status: 500 });
	}
}
