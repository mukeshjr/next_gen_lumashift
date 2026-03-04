import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message, phone, formType = 'contact' } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 });
    }

    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
      // In dev/no-config mode: just log and return success
      console.log('[Contact Form]', { name, email, message, phone, formType });
      return NextResponse.json({ success: true, dev: true });
    }

    const payload = {
      formType,
      name,
      email,
      phone: phone ?? '',
      message,
      timestamp: new Date().toISOString(),
      source: 'LumaShift Website – Contact Form',
    };

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Google Script responded with ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Contact API Error]', err);
    return NextResponse.json({ error: 'Failed to submit form. Please email lumashift@outlook.com directly.' }, { status: 500 });
  }
}
