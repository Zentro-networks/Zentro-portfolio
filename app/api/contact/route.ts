import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import * as z from 'zod';

// ---------------------------------------------------------------------------
// Validation schema (server-side source of truth — never trust client alone)
// ---------------------------------------------------------------------------
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  projectType: z.string().min(1, 'Project type is required.'),
  budgetRange: z.string().min(1, 'Budget range is required.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
  website: z.string().optional(), // Honeypot — bots fill this, humans leave it blank
});

// ---------------------------------------------------------------------------
// Sanitizer — strips HTML tags and trims whitespace to prevent header injection
// ---------------------------------------------------------------------------
function sanitize(value: string | undefined): string {
  if (!value) return '';
  return value.replace(/<[^>]*>/g, '').trim();
}

// ---------------------------------------------------------------------------
// POST /api/contact
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Zod validation
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid payload specifications.', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { name, email, projectType, budgetRange, message, website } =
      validation.data;

    // 2. Honeypot check — silently accept bot submissions so they think they succeeded
    if (website) {
      return NextResponse.json(
        { message: 'Inquiry registered successfully.' },
        { status: 200 }
      );
    }

    // 3. Sanitize all user-supplied fields before inserting into email
    const safeName        = sanitize(name);
    const safeEmail       = sanitize(email);
    const safeProjectType = sanitize(projectType);
    const safeBudget      = sanitize(budgetRange);
    const safeMessage     = sanitize(message);

    // 4. Company email — single source of truth via env var
    const companyEmail   = process.env.COMPANY_EMAIL ?? 'zentronetworks@gmail.com';
    // RESEND_TO_EMAIL overrides the delivery recipient for Resend sandbox compatibility.
    const recipientEmail = process.env.RESEND_TO_EMAIL ?? companyEmail;
    const resendApiKey   = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      // In production without a key the form should surface an error,
      // not silently pretend it succeeded.
      console.error('[contact] RESEND_API_KEY is not set. Cannot send inquiry email.');
      return NextResponse.json(
        { message: 'Email service is not configured. Please contact us directly.' },
        { status: 503 }
      );
    }

    const resend = new Resend(resendApiKey);

    const emailResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
      to: recipientEmail,
      subject: `New Project Inquiry – ${safeName}`,
      html: `
        <h2 style="color:#071415;font-family:sans-serif;">New Project Inquiry</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;width:100%;max-width:600px;">
          <tr>
            <td style="padding:8px 12px;background:#f4f4f4;font-weight:bold;width:160px;">Client Name</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;background:#f4f4f4;font-weight:bold;">Email</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;">${safeEmail}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;background:#f4f4f4;font-weight:bold;">Project Type</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;">${safeProjectType}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;background:#f4f4f4;font-weight:bold;">Budget Range</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;">${safeBudget}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;background:#f4f4f4;font-weight:bold;vertical-align:top;">Project Description</td>
            <td style="padding:8px 12px;white-space:pre-wrap;">${safeMessage}</td>
          </tr>
        </table>
        <p style="font-family:sans-serif;color:#888;font-size:12px;margin-top:24px;">
          Submitted via Zentro Networks portfolio at ${new Date().toISOString()}
        </p>
      `,
    });

    if (emailResult.error) {
      throw new Error(emailResult.error.message);
    }

    return NextResponse.json(
      { message: 'Inquiry registered successfully.' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error.';
    console.error('[contact] Error processing inquiry:', message);
    return NextResponse.json(
      { message: message || 'Internal server error processing your inquiry.' },
      { status: 500 }
    );
  }
}
