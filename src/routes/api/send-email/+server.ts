import { sendEmail } from '$lib/email/send-email';

export async function POST({ request }) {
  const { to, from, subject, content } = await request.json();

  if (!to || !from || !subject || !content) {
    return new Response('Incomplete details', { status: 400 });
  }

  try {
    await sendEmail({ from, to, subject, content });
    return new Response('Email sent successfully!', { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response('Failed to send email.', { status: 500 });
  }
}
