import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import * as z from 'zod';

// ---------------------------------------------------------------------------
// Validation schema (server-side — never trust client-only validation)
// ---------------------------------------------------------------------------
const contactSchema = z.object({
  name:        z.string().min(2,  'Name must be at least 2 characters.'),
  email:       z.string().email( 'Please enter a valid email address.'),
  projectType: z.string().min(1,  'Project type is required.'),
  budgetRange: z.string().min(1,  'Budget range is required.'),
  message:     z.string().min(10, 'Message must be at least 10 characters.'),
  website:     z.string().optional(), // honeypot
});

// ---------------------------------------------------------------------------
// Strip HTML tags + trim to prevent header injection
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
// Send WhatsApp notification via WhatsApp Cloud API (Meta free tier)
// ---------------------------------------------------------------------------
async function sendWhatsApp(text: string): Promise<void> {
  const token   = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to      = process.env.WHATSAPP_TO_NUMBER; // e.g. 919384967955

  if (!token || !phoneId || !to) return; // silently skip if not configured

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
    console.warn('[contact] WhatsApp send failed (non-fatal):', err);
  }
}

// ---------------------------------------------------------------------------
// POST /api/contact
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid payload.', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { name, email, projectType, budgetRange, message, website } =
      validation.data;

    // 2. Honeypot check
    if (website) {
      return NextResponse.json({ message: 'Inquiry registered successfully.' }, { status: 200 });
    }

    // 3. Sanitize
    const safeName        = sanitize(name);
    const safeEmail       = sanitize(email);
    const safeProjectType = sanitize(projectType);
    const safeBudget      = sanitize(budgetRange);
    const safeMessage     = sanitize(message);

    const companyEmail = process.env.COMPANY_EMAIL ?? 'zentronetworks@gmail.com';

    // 4. Send email via Gmail SMTP
    await sendViaGmail({
      to: companyEmail,
      subject: `New Project Inquiry – ${safeName}`,
      html: `
        <h2 style="color:#071415;font-family:sans-serif;margin-bottom:4px;">New Project Inquiry</h2>
        <p style="font-family:sans-serif;color:#555;font-size:13px;margin-top:0;">
          Submitted via Zentro Networks portfolio at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </p>
        <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;width:100%;max-width:600px;margin-top:16px;">
          <tr>
            <td style="padding:10px 14px;background:#f5f5f5;font-weight:bold;width:160px;border-bottom:1px solid #e0e0e0;">Client Name</td>
            <td style="padding:10px 14px;border-bottom:1px solid #e0e0e0;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;background:#f5f5f5;font-weight:bold;border-bottom:1px solid #e0e0e0;">Email</td>
            <td style="padding:10px 14px;border-bottom:1px solid #e0e0e0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding:10px 14px;background:#f5f5f5;font-weight:bold;border-bottom:1px solid #e0e0e0;">Project Type</td>
            <td style="padding:10px 14px;border-bottom:1px solid #e0e0e0;">${safeProjectType}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;background:#f5f5f5;font-weight:bold;border-bottom:1px solid #e0e0e0;">Budget Range</td>
            <td style="padding:10px 14px;border-bottom:1px solid #e0e0e0;">${safeBudget}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;background:#f5f5f5;font-weight:bold;vertical-align:top;">Project Description</td>
            <td style="padding:10px 14px;white-space:pre-wrap;">${safeMessage}</td>
          </tr>
        </table>
        <p style="font-family:sans-serif;font-size:12px;color:#999;margin-top:20px;">
          Reply directly to this email to respond to ${safeName} at ${safeEmail}.
        </p>
      `,
    });

    // 5. WhatsApp notification (non-blocking — failure here won't fail the request)
    const waText =
      `🔔 *New Project Inquiry*\n\n` +
      `*Name:* ${safeName}\n` +
      `*Email:* ${safeEmail}\n` +
      `*Project Type:* ${safeProjectType}\n` +
      `*Budget:* ${safeBudget}\n` +
      `*Description:* ${safeMessage.slice(0, 300)}${safeMessage.length > 300 ? '…' : ''}`;

    await sendWhatsApp(waText).catch((err) =>
      console.warn('[contact] WhatsApp notification skipped:', err)
    );

    return NextResponse.json(
      { message: 'Inquiry registered successfully.' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error.';
    console.error('[contact] Error:', message);
    return NextResponse.json(
      { message: message || 'Internal server error processing your inquiry.' },
      { status: 500 }
    );
  }
}
