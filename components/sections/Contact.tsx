"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import Button from "@/components/ui/Button";

const schema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	phone: z.string().optional(),
	message: z.string().min(10),
	budget: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
	const { t } = useLang();
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });
	const isMobile = useIsMobile();
	const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FormData>({ resolver: zodResolver(schema) });

	const onSubmit = async (data: FormData) => {
		setStatus("sending");
		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) throw new Error();
			setStatus("success");
			reset();
			setTimeout(() => setStatus("idle"), 5000);
		} catch {
			setStatus("error");
			setTimeout(() => setStatus("idle"), 4000);
		}
	};

	const inputClass = (hasError?: boolean) =>
		`w-full px-4 py-3 rounded-xl font-body text-sm
     bg-[var(--surface)] border transition-all duration-200 outline-none
     text-[var(--text)] placeholder:text-[var(--text-3)]
     ${hasError
			? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
			: "border-[var(--border-strong)] focus:border-solar focus:ring-2 focus:ring-solar/20"}`;

	return (
		<section id="contatto" className="section-padding bg-[var(--bg-2)] relative overflow-hidden">
			{/* Background */}
			<div className="absolute top-0 right-0 w-96 h-96 rounded-full
                      bg-gradient-radial from-solar/12 to-transparent blur-3xl pointer-events-none" />
			<div className="absolute bottom-0 left-0 w-80 h-80 rounded-full
                      bg-gradient-radial from-golden/10 to-transparent blur-3xl pointer-events-none" />

			<div ref={ref} className="max-w-7xl mx-auto px-5 md:px-8">
				{/* Header */}
				<div className="text-center mb-16">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={(isMobile || inView) ? { opacity: 1, y: 0 } : {}}
						transition={isMobile ? { duration: 0 } : { duration: 0.5 }}
						className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                       border border-solar/40 bg-solar/10 mb-5"
					>
						<span className="w-1.5 h-1.5 rounded-full bg-solar" />
						<span className="text-solar font-display font-600 text-sm">{t.contact.badge}</span>
					</motion.div>

					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						animate={(isMobile || inView) ? { opacity: 1, y: 0 } : {}}
						transition={isMobile ? { duration: 0 } : { duration: 0.55, delay: 0.1 }}
						className="font-800 text-4xl md:text-5xl lg:text-6xl" style={{ fontFamily: "'Syne', sans-serif" }}
					>
						{t.contact.title}{" "}
						<span className="gradient-text" style={{ textDecoration: "underline", textUnderlineOffset: "6px" }}>{t.contact.titleAccent}</span>
					</motion.h2>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={(isMobile || inView) ? { opacity: 1, y: 0 } : {}}
						transition={isMobile ? { duration: 0 } : { duration: 0.55, delay: 0.2 }}
						className="font-body font-light text-[var(--text-2)] text-lg max-w-xl mx-auto mt-4"
					>
						{t.contact.subtitle}
					</motion.p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
					{/* Info cards (left) */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						animate={(isMobile || inView) ? { opacity: 1, x: 0 } : {}}
						transition={isMobile ? { duration: 0 } : { duration: 0.6, delay: 0.2 }}
						className="lg:col-span-2 flex flex-col gap-5"
					>
						{[
							{
								Icon: Mail,
								label: t.contact.info.emailLabel,
								value: t.contact.info.emailValue,
							},
							{
								Icon: MapPin,
								label: t.contact.info.locationLabel,
								value: t.contact.info.locationValue,
							},
							{
								Icon: CheckCircle,
								label: t.contact.info.availabilityLabel,
								value: t.contact.info.availabilityValue,
								highlight: true,
							},
						].map((item, i) => (
							<div
								key={i}
								className={`flex items-start gap-4 p-5 rounded-2xl
                            border transition-all duration-200
                            ${item.highlight
										? "border-solar/40 bg-solar/10"
										: "border-[var(--border)] bg-[var(--surface)]"}`}
							>
								<div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                                 ${item.highlight ? "bg-solar text-white" : "bg-[var(--surface-2)] text-solar"}`}>
									<item.Icon size={18} />
								</div>
								<div>
									<p className="font-body text-xs text-[var(--text-3)] mb-0.5">{item.label}</p>
									<p className={`font-display font-600 text-sm
                                 ${item.highlight ? "text-solar" : "text-[var(--text)]"}`}>
										{item.value}
									</p>
								</div>
							</div>
						))}

					</motion.div>

					{/* Form (right) */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						animate={(isMobile || inView) ? { opacity: 1, x: 0 } : {}}
						transition={isMobile ? { duration: 0 } : { duration: 0.6, delay: 0.3 }}
						className="lg:col-span-3"
					>
						<div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-7 md:p-9">
							{status === "success" ? (
								<motion.div
									role="alert"
									aria-live="polite"
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									className="flex flex-col items-center justify-center py-12 text-center"
								>
									<div className="w-20 h-20 rounded-full bg-solar/15 flex items-center justify-center mb-4" aria-hidden="true">
										<CheckCircle size={40} className="text-solar" />
									</div>
									<p className="font-display font-700 text-xl text-[var(--text)]">
										{t.contact.form.success}
									</p>
								</motion.div>
							) : (
								<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label htmlFor="contact-name" className="font-body text-xs text-[var(--text-3)] mb-1 block">
												{t.contact.form.name}
											</label>
											<input
												id="contact-name"
												{...register("name")}
												placeholder={t.contact.form.namePlaceholder}
												autoComplete="name"
												aria-invalid={!!errors.name}
												aria-describedby={errors.name ? "name-error" : undefined}
												className={inputClass(!!errors.name)}
											/>
											{errors.name && <span id="name-error" role="alert" className="text-red-400 text-xs mt-1 block">{errors.name.message}</span>}
										</div>
										<div>
											<label htmlFor="contact-email" className="font-body text-xs text-[var(--text-3)] mb-1 block">
												{t.contact.form.email}
											</label>
											<input
												id="contact-email"
												{...register("email")}
												type="email"
												placeholder={t.contact.form.emailPlaceholder}
												autoComplete="email"
												aria-invalid={!!errors.email}
												aria-describedby={errors.email ? "email-error" : undefined}
												className={inputClass(!!errors.email)}
											/>
											{errors.email && <span id="email-error" role="alert" className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>}
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label htmlFor="contact-phone" className="font-body text-xs text-[var(--text-3)] mb-1 block">
												{t.contact.form.phone}
											</label>
											<input
												id="contact-phone"
												{...register("phone")}
												type="tel"
												placeholder={t.contact.form.phonePlaceholder}
												autoComplete="tel"
												className={inputClass()}
											/>
										</div>
										<div>
											<label htmlFor="contact-budget" className="font-body text-xs text-[var(--text-3)] mb-1 block">
												{t.contact.form.budget}
											</label>
											<select
												id="contact-budget"
												{...register("budget")}
												className={`${inputClass()} appearance-none cursor-pointer`}
											>
												<option value="">—</option>
												{t.contact.form.budgets.map((b) => (
													<option key={b} value={b}>{b}</option>
												))}
											</select>
										</div>
									</div>

									<div>
										<label htmlFor="contact-message" className="font-body text-xs text-[var(--text-3)] mb-1 block">
											{t.contact.form.message}
										</label>
										<textarea
											id="contact-message"
											{...register("message")}
											rows={5}
											placeholder={t.contact.form.messagePlaceholder}
											aria-invalid={!!errors.message}
											aria-describedby={errors.message ? "message-error" : undefined}
											className={`${inputClass(!!errors.message)} resize-none`}
										/>
										{errors.message && <span id="message-error" role="alert" className="text-red-400 text-xs mt-1 block">{errors.message.message}</span>}
									</div>

									{status === "error" && (
										<div role="alert" aria-live="assertive" className="flex items-center gap-2 text-red-500 text-sm">
											<AlertCircle size={16} aria-hidden="true" />
											{t.contact.form.error}
										</div>
									)}

									<Button
										type="submit"
										size="lg"
										disabled={status === "sending"}
										className="w-full mt-2"
									>
										{status === "sending" ? t.contact.form.sending : t.contact.form.submit}
									</Button>
								</form>
							)}
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
