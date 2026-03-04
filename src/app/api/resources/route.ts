import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, careerGoal } = body;

    if (!name || !email || !careerGoal) {
      return NextResponse.json({ error: 'Name, email, and career goal are required.' }, { status: 400 });
    }

    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
      console.log('[Resource Unlock Form]', { name, email, careerGoal });
      return NextResponse.json({ success: true, dev: true });
    }

    const payload = {
      formType: 'resource_unlock',
      name,
      email,
      careerGoal,
      timestamp: new Date().toISOString(),
      source: 'LumaShift Website – Resource Unlock',
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
    console.error('[Resources API Error]', err);
    return NextResponse.json({ error: 'Failed to process request. Please try again.' }, { status: 500 });
  }
}
