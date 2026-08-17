import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import * as z from 'zod';

// ---------------------------------------------------------------------------
// Validation schema (server-side source of truth)
// ---------------------------------------------------------------------------
const reviewSchema = z.object({
  clientName:  z.string().min(2,  'Name must be at least 2 characters.'),
  companyName: z.string().optional(),
  projectName: z.string().min(2,  'Project name must be at least 2 characters.'),
  rating:      z.number().int().min(1).max(5),
  feedback:    z.string().min(10, 'Feedback must be at least 10 characters.'),
  website:     z.string().optional(), // honeypot
});

// ---------------------------------------------------------------------------
// Strip HTML tags + trim
// ---------------------------------------------------------------------------
function sanitize(value: string | undefined): string {
  if (!value) return '';
  return value.replace(/<[^>]*>/g, '').trim();
}

// ---------------------------------------------------------------------------
// Send via Gmail SMTP (nodemailer)
// ---------------------------------------------------------------------------
async function sendViaGmail(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error('Gmail credentials not configured (GMAIL_USER / GMAIL_APP_PASSWORD).');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"Zentro Networks Portfolio" <${user}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}

// ---------------------------------------------------------------------------
// WhatsApp Cloud API notification (Meta free tier — optional)
// ---------------------------------------------------------------------------
async function sendWhatsApp(text: string): Promise<void> {
  const token   = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to      = process.env.WHATSAPP_TO_NUMBER;

  if (!token || !phoneId || !to) return;

  const res = await fetch(
    `https://graph.facebook.com/v20.0/${phoneId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.warn('[submit-review] WhatsApp send failed (non-fatal):', err);
  }
}

// ---------------------------------------------------------------------------
// POST /api/submit-review
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate
    const validation = reviewSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid review data.', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { clientName, companyName, projectName, rating, feedback, website } =
      validation.data;

    // 2. Honeypot
    if (website) {
      return NextResponse.json({ message: 'Review received. Thank you!' }, { status: 200 });
    }

    // 3. Sanitize
    const safeClientName  = sanitize(clientName);
    const safeCompanyName = sanitize(companyName);
    const safeProjectName = sanitize(projectName);
    const safeFeedback    = sanitize(feedback);
    const stars           = '★'.repeat(rating) + '☆'.repeat(5 - rating);

    const companyEmail = process.env.COMPANY_EMAIL ?? 'zentronetworks@gmail.com';

    // ---------------------------------------------------------------------------
    // 4. Persistence layer
    //    Currently: email notification with status=PENDING.
    //    To add a DB later: insert a row here, no UI changes required.
    // ---------------------------------------------------------------------------
    await sendViaGmail({
      to: companyEmail,
      subject: `⭐ New Client Review (Pending Approval) — ${safeClientName}`,
      html: `
        <h2 style="color:#071415;font-family:sans-serif;margin-bottom:4px;">New Review Submission</h2>
        <p style="font-family:sans-serif;background:#fff3cd;border:1px solid #ffc107;border-radius:6px;padding:10px 14px;color:#856404;font-size:13px;">
          ⚠️ <strong>Status: PENDING APPROVAL</strong> — do not publish without reviewing.
        </p>
        <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;width:100%;max-width:600px;margin-top:16px;">
          <tr>
            <td style="padding:10px 14px;background:#f5f5f5;font-weight:bold;width:160px;border-bottom:1px solid #e0e0e0;">Client Name</td>
            <td style="padding:10px 14px;border-bottom:1px solid #e0e0e0;">${safeClientName}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;background:#f5f5f5;font-weight:bold;border-bottom:1px solid #e0e0e0;">Company</td>
            <td style="padding:10px 14px;border-bottom:1px solid #e0e0e0;">${safeCompanyName || '—'}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;background:#f5f5f5;font-weight:bold;border-bottom:1px solid #e0e0e0;">Project / Service</td>
            <td style="padding:10px 14px;border-bottom:1px solid #e0e0e0;">${safeProjectName}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;background:#f5f5f5;font-weight:bold;border-bottom:1px solid #e0e0e0;">Rating</td>
            <td style="padding:10px 14px;border-bottom:1px solid #e0e0e0;font-size:18px;color:#f59e0b;">${stars} (${rating}/5)</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;background:#f5f5f5;font-weight:bold;vertical-align:top;">Feedback</td>
            <td style="padding:10px 14px;white-space:pre-wrap;">${safeFeedback}</td>
          </tr>
        </table>
        <p style="font-family:sans-serif;color:#999;font-size:12px;margin-top:20px;">
          Submitted at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </p>
      `,
    });

    // 5. WhatsApp notification (optional, non-blocking)
    const waText =
      `⭐ *New Client Review (Pending Approval)*\n\n` +
      `*Client:* ${safeClientName}${safeCompanyName ? ` (${safeCompanyName})` : ''}\n` +
      `*Project:* ${safeProjectName}\n` +
      `*Rating:* ${'★'.repeat(rating)} ${rating}/5\n` +
      `*Feedback:* ${safeFeedback.slice(0, 300)}${safeFeedback.length > 300 ? '…' : ''}`;

    await sendWhatsApp(waText).catch((err) =>
      console.warn('[submit-review] WhatsApp notification skipped:', err)
    );

    return NextResponse.json(
      { message: 'Thank you for your feedback!' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error.';
    console.error('[submit-review] Error:', message);
    return NextResponse.json(
      { message: 'We could not save your review. Please try again.' },
      { status: 500 }
    );
  }
}
