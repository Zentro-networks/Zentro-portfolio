'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle } from 'lucide-react';

// ---------------------------------------------------------------------------
// Zod Validation Schema
// ---------------------------------------------------------------------------
const contactSchema = z.object({
  name:        z.string().min(2,  { message: 'Name must be at least 2 characters.' }),
  email:       z.string().email( { message: 'Please enter a valid email address.' }),
  projectType: z.string().min(1,  { message: 'Please select a project category.' }),
  budgetRange: z.string().min(1,  { message: 'Please select your estimated budget.' }),
  message:     z.string().min(10, { message: 'Message must be at least 10 characters.' }),
  website:     z.string().optional(), // Honeypot spam protection
});

type ContactFormValues = z.infer<typeof contactSchema>;

// ---------------------------------------------------------------------------
// Company constants — single source of truth matching the rest of the portfolio
// ---------------------------------------------------------------------------
const COMPANY_EMAIL    = 'zentronetworks@gmail.com';
const COMPANY_PHONE    = '+91 9384967955';
const COMPANY_WHATSAPP = '919384967955'; // wa.me format — country code + number, no +/spaces

// Map select values → human-readable labels for the email/WhatsApp body
const PROJECT_TYPE_LABELS: Record<string, string> = {
  'custom-web':           'Custom Web Application',
  'ai-integration':       'AI / LLM System',
  'backend-api':          'High-Performance API',
  'redesign-performance': 'Performance Optimization',
  'consulting':           'Hourly Consulting',
};

const BUDGET_LABELS: Record<string, string> = {
  'starter':    '₹3,500 – ₹6,000',
  'mid':        '₹6,000 – ₹12,000',
  'high':       '₹12,000 – ₹25,000',
  'enterprise': '₹25,000+',
};

// ---------------------------------------------------------------------------
// Prepared-link shape — generated after successful validation
// ---------------------------------------------------------------------------
interface PreparedLinks {
  gmailUrl:    string;
  whatsappUrl: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function Contact() {
  const [formState, setFormState]       = useState<'idle' | 'prepared'>('idle');
  const [preparedLinks, setPreparedLinks] = useState<PreparedLinks | null>(null);
  const [phoneCopied, setPhoneCopied]   = useState(false);

  const handleCopyPhone = useCallback(async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(COMPANY_PHONE);
      } else {
        // Fallback for browsers without Clipboard API
        const el = document.createElement('textarea');
        el.value = COMPANY_PHONE;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.focus();
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setPhoneCopied(true);
      setTimeout(() => setPhoneCopied(false), 2000);
    } catch {
      // Silently ignore if clipboard is unavailable
    }
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name:        '',
      email:       '',
      projectType: '',
      budgetRange: '',
      message:     '',
      website:     '',
    },
  });

  // ---------------------------------------------------------------------------
  // onSubmit — pure client-side: build Gmail + WhatsApp URLs, show action buttons
  // ---------------------------------------------------------------------------
  const onSubmit = (data: ContactFormValues) => {
    // Honeypot: silently ignore bots
    if (data.website) {
      setFormState('prepared');
      return;
    }

    const projectLabel = PROJECT_TYPE_LABELS[data.projectType] ?? data.projectType;
    const budgetLabel  = BUDGET_LABELS[data.budgetRange]       ?? data.budgetRange;

    // ── Email (Gmail compose) ────────────────────────────────────────────────
    const subject = `New Project Inquiry – ${data.name}`;

    const emailBody =
      `New Project Inquiry\n` +
      `${'─'.repeat(40)}\n\n` +
      `Client Name:\n${data.name}\n\n` +
      `Email:\n${data.email}\n\n` +
      `Project Type:\n${projectLabel}\n\n` +
      `Budget:\n${budgetLabel}\n\n` +
      `Project Description:\n${data.message}`;

    const gmailUrl =
      `https://mail.google.com/mail/?view=cm&fs=1` +
      `&to=${encodeURIComponent(COMPANY_EMAIL)}` +
      `&su=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(emailBody)}`;

    // ── WhatsApp ─────────────────────────────────────────────────────────────
    const waMessage =
      `*New Project Inquiry*\n\n` +
      `*Client Name:* ${data.name}\n` +
      `*Email:* ${data.email}\n` +
      `*Project Type:* ${projectLabel}\n` +
      `*Budget:* ${budgetLabel}\n\n` +
      `*Project Description:*\n${data.message}`;

    const whatsappUrl = `https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(waMessage)}`;

    setPreparedLinks({ gmailUrl, whatsappUrl });
    setFormState('prepared');
  };

  // Go back to the form to modify details
  const handleReset = () => {
    setFormState('idle');
    setPreparedLinks(null);
    reset();
  };

  return (
    <section id="contact" className="relative z-10 border-t border-zinc-900/50 light:border-zinc-200/50 overflow-hidden"
      style={{
        paddingTop: 'clamp(3rem, 8vw, 6rem)',
        paddingBottom: 'clamp(3rem, 8vw, 6rem)',
        paddingLeft: 'clamp(1rem, 4vw, 2rem)',
        paddingRight: 'clamp(1rem, 4vw, 2rem)',
      }}
    >
      <div className="max-w-6xl mx-auto">

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <div className="mb-10 md:mb-16 text-center">
          <h2
            className="font-display font-bold text-white light:text-zinc-950"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3.25rem)' }}
          >
            Initialize Proposal
          </h2>
          <p className="text-xs text-muted mt-2 max-w-md mx-auto">
            Ready to build? Send your system specifications for an immediate feasibility report.
          </p>
          <div className="h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-4 rounded-full w-20" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* ── Direct Details (5 columns) ─────────────────────────────────── */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h3 className="font-display font-bold text-lg md:text-xl text-white light:text-zinc-950 mb-3">
                Let&apos;s build together.
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Connect directly for emergency developer bookings, consulting arrangements, or general architecture reviews.
              </p>
            </div>

            {/* Direct Coordinates */}
            <div className="space-y-4 text-xs font-semibold">
              {/* Email — opens Gmail compose in a new tab */}
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(COMPANY_EMAIL)}&su=${encodeURIComponent('Website Enquiry')}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Click to email us via Gmail"
                className="flex items-center gap-4 p-4 rounded-lg bg-zinc-900/40 light:bg-zinc-100 border border-white/5 light:border-zinc-200 hover:border-accent/30 transition-all text-muted hover:text-white light:hover:text-zinc-950"
              >
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <span>{COMPANY_EMAIL}</span>
              </a>

              {/* Phone — copies number to clipboard (no navigation) */}
              <button
                type="button"
                onClick={handleCopyPhone}
                title="Click to copy phone number"
                className="relative w-full flex items-center gap-4 p-4 rounded-lg bg-zinc-900/40 light:bg-zinc-100 border border-white/5 light:border-zinc-200 hover:border-accent/30 transition-all text-muted hover:text-white light:hover:text-zinc-950 cursor-pointer focus:outline-none focus:border-accent/50 focus-visible:ring-2 focus-visible:ring-accent/40 text-left"
              >
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>{COMPANY_PHONE}</span>
                {/* Copied confirmation tooltip */}
                {phoneCopied && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full animate-pulse">
                    Copied!
                  </span>
                )}
              </button>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-900/40 light:bg-zinc-100 border border-white/5 light:border-zinc-200 text-muted">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <span>Chennai, Tamil Nadu, India</span>
              </div>
            </div>
          </div>

          {/* ── Form / Prepared panel (7 columns) ─────────────────────────── */}
          <div className="lg:col-span-7 rounded-xl glass-panel p-6 md:p-8 border border-white/5 light:border-zinc-200">
            <h3 className="font-display font-bold text-base md:text-lg text-white light:text-zinc-950 mb-6 border-b border-zinc-900 pb-3">
              Proposal Details
            </h3>

            {/* ══ PREPARED STATE ══════════════════════════════════════════════ */}
            {formState === 'prepared' && preparedLinks && (
              <div className="space-y-6">
                {/* Status banner */}
                <div className="flex gap-3 p-4 rounded-lg text-xs font-semibold border bg-emerald-950/20 border-emerald-900 text-emerald-400">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm mb-1">Your inquiry has been prepared.</p>
                    <p className="font-normal opacity-80 leading-relaxed">
                      Choose Email or WhatsApp to send it to us. Your details are already filled in — just press&nbsp;Send.
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Send via Email */}
                  <a
                    href={preparedLinks.gmailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="proposal-send-email"
                    className="flex items-center justify-center gap-2.5 py-4 px-5 rounded-lg bg-accent hover:bg-accent/90 text-[#071415] font-bold text-xs transition-all min-h-[52px] cursor-pointer select-none"
                  >
                    <Mail className="w-4 h-4 shrink-0" />
                    Send via Email
                  </a>

                  {/* Send via WhatsApp */}
                  <a
                    href={preparedLinks.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="proposal-send-whatsapp"
                    className="flex items-center justify-center gap-2.5 py-4 px-5 rounded-lg bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs transition-all min-h-[52px] cursor-pointer select-none"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    Send via WhatsApp
                  </a>
                </div>

                {/* Clarification note */}
                <p className="text-[10px] text-muted text-center leading-relaxed">
                  Clicking opens your email or WhatsApp app with the inquiry pre-filled.
                  Your message is only delivered when you press&nbsp;<strong>Send</strong>&nbsp;in that app.
                </p>

                {/* Modify details */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-2.5 text-xs text-muted hover:text-white light:hover:text-zinc-950 transition-colors underline underline-offset-2 cursor-pointer"
                >
                  ← Modify proposal details
                </button>
              </div>
            )}

            {/* ══ FORM (idle) ══════════════════════════════════════════════ */}
            {formState === 'idle' && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-xs">
                {/* Spam Honeypot Field (hidden from humans, visible to bots) */}
                <div className="hidden">
                  <label htmlFor="website">Skip this field</label>
                  <input
                    type="text"
                    id="website"
                    autoComplete="off"
                    {...register('website')}
                  />
                </div>

                {/* Row: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-muted font-bold uppercase tracking-wider">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Jane Doe"
                      {...register('name')}
                      className="w-full p-3 rounded-lg bg-zinc-900/60 light:bg-zinc-100 border border-white/5 light:border-zinc-200 text-white light:text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-accent"
                    />
                    {errors.name && <p className="text-red-400 mt-1 font-semibold">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-muted font-bold uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="jane@company.com"
                      {...register('email')}
                      className="w-full p-3 rounded-lg bg-zinc-900/60 light:bg-zinc-100 border border-white/5 light:border-zinc-200 text-white light:text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-accent"
                    />
                    {errors.email && <p className="text-red-400 mt-1 font-semibold">{errors.email.message}</p>}
                  </div>
                </div>

                {/* Row: Project Category & Budget Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="projectType" className="block text-muted font-bold uppercase tracking-wider">
                      Project Type
                    </label>
                    <select
                      id="projectType"
                      {...register('projectType')}
                      className="w-full p-3 rounded-lg bg-zinc-900/60 light:bg-zinc-100 border border-white/5 light:border-zinc-200 text-white light:text-zinc-950 focus:outline-none focus:border-accent"
                    >
                      <option value="" disabled className="text-zinc-500">
                        Select project type...
                      </option>
                      <option value="custom-web">Custom Web Application</option>
                      <option value="ai-integration">AI / LLM System</option>
                      <option value="backend-api">High-Performance API</option>
                      <option value="redesign-performance">Performance Optimization</option>
                      <option value="consulting">Hourly Consulting</option>
                    </select>
                    {errors.projectType && <p className="text-red-400 mt-1 font-semibold">{errors.projectType.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="budgetRange" className="block text-muted font-bold uppercase tracking-wider">
                      Estimated Budget
                    </label>
                    <select
                      id="budgetRange"
                      {...register('budgetRange')}
                      className="w-full p-3 rounded-lg bg-zinc-900/60 light:bg-zinc-100 border border-white/5 light:border-zinc-200 text-white light:text-zinc-950 focus:outline-none focus:border-accent"
                    >
                      <option value="" disabled className="text-zinc-500">
                        Select budget range...
                      </option>
                      <option value="starter">₹3,500 - ₹6,000</option>
                      <option value="mid">₹6,000 - ₹12,000</option>
                      <option value="high">₹12,000 - ₹25,000</option>
                      <option value="enterprise">₹25,000+</option>
                    </select>
                    {errors.budgetRange && <p className="text-red-400 mt-1 font-semibold">{errors.budgetRange.message}</p>}
                  </div>
                </div>

                {/* Project Description */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-muted font-bold uppercase tracking-wider">
                    Project Description
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Outline your application features, technical dependencies, and deadline benchmarks..."
                    {...register('message')}
                    className="w-full p-3 rounded-lg bg-zinc-900/60 light:bg-zinc-100 border border-white/5 light:border-zinc-200 text-white light:text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-accent"
                  />
                  {errors.message && <p className="text-red-400 mt-1 font-semibold">{errors.message.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="proposal-submit"
                  className="w-full py-3.5 bg-accent hover:bg-accent/90 text-[#071415] rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-2 text-xs min-h-[48px]"
                >
                  <Send className="w-4 h-4" />
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
