import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const items = body.items.map(id => {
    const item = require('@/data/items').ITEMS.find(i => i.id === id);
    return `• ${item.name} – $${(item.price / 100).toFixed(2)}`;
  }).join('\n');

  const message = `
New Order!

Name: ${body.name}
Email: ${body.email}
Phone: ${body.phone || '—'}

Items:
${items}

Total: $${(body.total / 100).toFixed(2)}

Notes:
${body.notes || '—'}
  `.trim();

  // SEND TO YOUR EMAIL (we'll set this up in Vercel later)
  const emailTo = process.env.EMAIL_TO || 'you@example.com';

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Order <order@your-site.com>',
      to: emailTo,
      subject: `New Order from ${body.name}`,
      text: message,
    }),
  });

  return Response.json({ success: true });
}
