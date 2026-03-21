import { NextRequest, NextResponse } from 'next/server';
import { checkAdmin } from '@/lib/admin';

const TOPIC_SUGGESTION_SYSTEM_PROMPT = `You are a cybersecurity content strategist for LumaShift, a Malaysian cybersecurity career coaching platform that serves both Malaysian and global professionals.

Your job is to suggest trending, relevant blog topics that will attract and engage LumaShift's audience.

CONSIDER THESE FACTORS:
- Current cybersecurity trends: AI security, cloud security, zero trust architecture, supply chain security, ransomware, identity & access management, DevSecOps, OT/ICS security, privacy regulations
- Malaysian market relevance: PDPA compliance, NACSA initiatives, MyCERT advisories, MDEC digital economy, Malaysian cybersecurity talent gap, ASEAN cyber landscape
- Career-focused angle: job market insights, certification guidance, skill development, salary trends, interview preparation, career transitions — NOT pure technical deep-dives
- Mix of experience levels: university students, fresh graduates, early-career professionals (1-3 years), and mid-career professionals (3-7 years)
- SEO potential: topics people are actively searching for
- Timeliness: recent incidents, new frameworks, upcoming regulatory changes, industry shifts

RESPOND WITH VALID JSON ONLY. No markdown code fences, no explanation — just the JSON object:
{
  "topics": [
    {
      "title": "Blog post title — compelling, specific, SEO-friendly",
      "description": "2-3 sentence description of what the post should cover and why it matters to the audience",
      "category": "One of: Career Guide, Technical Concepts, Certifications, Malaysia Market, AI Security, Security Awareness, Cloud Security, Interview Tips, GRC & Compliance",
      "audience": "One of: Students, Fresh Graduates, Early Career, Mid-Career, Career Switchers, All Levels"
    }
  ]
}`;

interface SuggestTopicsRequest {
  count?: number;
}

interface TopicSuggestion {
  title: string;
  description: string;
  category: string;
  audience: string;
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const adminCheck = await checkAdmin();
    if (!adminCheck.authorized) {
      return NextResponse.json(
        { error: adminCheck.userId ? 'Admin access required' : 'Authentication required' },
        { status: adminCheck.userId ? 403 : 401 }
      );
    }

    // Check for API key
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI topic suggestions not available — GROQ_API_KEY is not configured' },
        { status: 503 }
      );
    }

    // Parse request body
    const body: SuggestTopicsRequest = await req.json();
    const count = Math.min(Math.max(body.count ?? 5, 1), 10); // clamp 1-10

    // Call Groq
    const Groq = (await import('groq-sdk')).default;
    const client = new Groq({ apiKey });

    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2048,
      messages: [
        { role: 'system', content: TOPIC_SUGGESTION_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Suggest exactly ${count} trending cybersecurity blog topics. Each topic should be unique, timely, and actionable. Make sure to cover a mix of categories and audience levels. Today's date is ${new Date().toISOString().split('T')[0]}.`,
        },
      ],
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return NextResponse.json(
        { error: 'AI did not return a response' },
        { status: 500 }
      );
    }

    // Parse JSON response
    let parsed: { topics: TopicSuggestion[] };
    try {
      let raw = responseText.trim();
      if (raw.startsWith('```')) {
        raw = raw.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
      }
      parsed = JSON.parse(raw);
    } catch (parseError) {
      console.error('[Suggest Topics] Failed to parse AI response:', parseError);
      console.error('[Suggest Topics] Raw response:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse AI suggestions. Please try again.' },
        { status: 500 }
      );
    }

    if (!parsed.topics || !Array.isArray(parsed.topics)) {
      return NextResponse.json(
        { error: 'AI response did not contain topics array. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      topics: parsed.topics.slice(0, count),
    });
  } catch (err) {
    console.error('[Suggest Topics] Unexpected error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while generating topic suggestions' },
      { status: 500 }
    );
  }
}
