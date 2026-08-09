import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import * as z from 'zod';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  projectType: z.string().min(1),
  budgetRange: z.string().min(1),
  message: z.string().min(10),
  website: z.string().optional(), // Honeypot
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Zod Validation
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid payload specifications', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { name, email, projectType, budgetRange, message, website } = validation.data;

    // 2. Honeypot check (silently drop bot submissions)
    if (website) {
      console.warn(`[Spam Blocked] Honeypot field filled by bot: ${name} (${email})`);
      return NextResponse.json(
        { message: 'Inquiry processed successfully' },
        { status: 200 }
      );
    }

    // 3. Resend Integration
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const emailResponse = await resend.emails.send({
        from: 'Portfolio Contact Form <onboarding@resend.dev>', // Resend verified sending domain or default sandbox email
        to: 'developer@example.com', // Recipient email address
        subject: `New Lead: ${projectType} Proposal from ${name}`,
        html: `
          <h3>New Developer Inquiry</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Project Type:</strong> ${projectType}</p>
          <p><strong>Estimated Budget:</strong> ${budgetRange}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        `,
      });

      if (emailResponse.error) {
        throw new Error(emailResponse.error.message);
      }
    } else {
      // Mock Fallback when no Resend Key is supplied in .env
      console.log('--- [MOCK EMAIL SENT] ---');
      console.log(`From: ${name} <${email}>`);
      console.log(`Subject: New Lead: ${projectType} Proposal`);
      console.log(`Budget Range: ${budgetRange}`);
      console.log(`Message: ${message}`);
      console.log('-------------------------');
    }

    return NextResponse.json(
      { message: 'Inquiry registered successfully.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error processing contact submission.' },
      { status: 500 }
    );
  }
}
