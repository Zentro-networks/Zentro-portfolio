import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import * as z from 'zod';

// ---------------------------------------------------------------------------
// Validation schema (server-side source of truth)
// ---------------------------------------------------------------------------
const reviewSchema = z.object({
  clientName: z.string().min(2, 'Name must be at least 2 characters.'),
  companyName: z.string().optional(), // optional
  projectName: z.string().min(2, 'Project name must be at least 2 characters.'),
  rating: z.number().int().min(1).max(5),
  feedback: z.string().min(10, 'Feedback must be at least 10 characters.'),
  // Honeypot — bots fill this, humans leave it blank
  website: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Sanitizer — strips HTML tags and trims whitespace
// ---------------------------------------------------------------------------
function sanitize(value: string | undefined): string {
  if (!value) return '';
  return value.replace(/<[^>]*>/g, '').trim();
}

// ---------------------------------------------------------------------------
// POST /api/submit-review
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Zod validation
    const validation = reviewSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid review data.', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { clientName, companyName, projectName, rating, feedback, website } =
      validation.data;

    // 2. Honeypot check — silently accept but do nothing real
    if (website) {
      return NextResponse.json(
        { message: 'Review received. Thank you!' },
        { status: 200 }
      );
    }

    // 3. Sanitize all user-supplied fields
    const safeClientName  = sanitize(clientName);
    const safeCompanyName = sanitize(companyName);
    const safeProjectName = sanitize(projectName);
    const safeFeedback    = sanitize(feedback);

    // ---------------------------------------------------------------------------
    // 4. Persistence layer
    //
    //    Currently: forwards the review via email (status = "pending").
    //    To add a database later, insert a row here before the email step and
    //    return early if the insert fails. The email step can stay as a
    //    notification or be removed entirely — the UI does not need to change.
    // ---------------------------------------------------------------------------

    const companyEmail = process.env.COMPANY_EMAIL ?? 'zentronetworks@gmail.com';
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);

      const emailResult = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
        to: companyEmail,
        subject: `New Client Review (Pending Approval) — ${safeClientName}`,
        html: `
          <h2 style="color:#071415;font-family:sans-serif;">New Review Submission — <em>Status: PENDING</em></h2>
          <p style="font-family:sans-serif;color:#333;">
            A client has submitted a review. Please review and publish if approved.
          </p>
          <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;width:100%;max-width:600px;">
            <tr>
              <td style="padding:8px 12px;background:#f4f4f4;font-weight:bold;width:160px;">Client Name</td>
              <td style="padding:8px 12px;border-bottom:1px solid #eee;">${safeClientName}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;background:#f4f4f4;font-weight:bold;">Company</td>
              <td style="padding:8px 12px;border-bottom:1px solid #eee;">${safeCompanyName || '—'}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;background:#f4f4f4;font-weight:bold;">Project / Service</td>
              <td style="padding:8px 12px;border-bottom:1px solid #eee;">${safeProjectName}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;background:#f4f4f4;font-weight:bold;">Rating</td>
              <td style="padding:8px 12px;border-bottom:1px solid #eee;">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;background:#f4f4f4;font-weight:bold;vertical-align:top;">Feedback</td>
              <td style="padding:8px 12px;white-space:pre-wrap;">${safeFeedback}</td>
            </tr>
          </table>
          <p style="font-family:sans-serif;color:#888;font-size:12px;margin-top:24px;">
            Submitted at ${new Date().toISOString()} — do NOT publish without review.
          </p>
        `,
      });

      if (emailResult.error) {
        throw new Error(emailResult.error.message);
      }
    } else {
      // Dev fallback when RESEND_API_KEY is not set — log to server only (never client)
      console.info('[submit-review] No RESEND_API_KEY set. Review would be emailed to:', companyEmail);
      console.info('[submit-review] Review data:', { safeClientName, safeCompanyName, safeProjectName, rating, safeFeedback });
    }

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
