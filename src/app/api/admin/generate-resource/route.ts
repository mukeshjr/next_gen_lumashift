import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkAdmin } from '@/lib/admin';

/* ─── System Prompts by Resource Type ────────────────────────────────────── */

const BASE_CONTEXT = `You are a cybersecurity resource creator for LumaShift, a Malaysian cybersecurity career coaching platform.
Your audience includes Malaysian and global professionals — from students to mid-career professionals.
Make content practical, actionable, and career-focused. Reference Malaysian specifics (PDPA, NACSA, MyCERT, local market) where relevant, but keep advice globally applicable.`;

const TYPE_PROMPTS: Record<string, string> = {
  checklist: `${BASE_CONTEXT}

Generate a comprehensive markdown checklist with 20-30 items organized by logical sections.

FORMAT RULES:
- Use H2 (##) for section headings
- Use markdown checkboxes: "- [ ] Item description"
- Group items into 4-6 sections of 4-6 items each
- Each item should be specific and actionable — not vague
- Include brief context in parentheses where helpful, e.g. "- [ ] Enable MFA on all admin accounts (prioritise Azure AD/Entra ID)"
- End with a "Next Steps" section with 2-3 recommendations

RESPOND WITH VALID JSON ONLY:
{
  "title": "Descriptive, specific title",
  "description": "1-2 sentence description of what this checklist covers and who it's for",
  "content": "Full markdown content with checkboxes",
  "category": "One of: Resume & Job Search, Interview Prep, Certifications, Personal Branding, SOC / Blue Team, GRC & Compliance, Cloud Security, Career Strategy, OT / ICS Security, General Security"
}`,

  guide: `${BASE_CONTEXT}

Generate a comprehensive guide of 1500-2000 words in markdown format.

FORMAT RULES:
- Use H2 (##) for main sections and H3 (###) for subsections
- Include an introduction paragraph that hooks the reader
- 4-6 main sections with practical, detailed content
- Use bullet lists, numbered steps, bold emphasis, and code blocks where relevant
- Include real-world examples, tool recommendations, and actionable steps
- End with a "Summary" or "Key Takeaways" section and a call to action
- Do NOT use H1 headings

RESPOND WITH VALID JSON ONLY:
{
  "title": "Descriptive, specific title",
  "description": "1-2 sentence description of what this guide covers and who it's for",
  "content": "Full markdown content (1500-2000 words)",
  "category": "One of: Resume & Job Search, Interview Prep, Certifications, Personal Branding, SOC / Blue Team, GRC & Compliance, Cloud Security, Career Strategy, OT / ICS Security, General Security"
}`,

  template: `${BASE_CONTEXT}

Generate a structured template with fill-in sections that users can copy and customise.

FORMAT RULES:
- Use H2 (##) for main template sections
- Use placeholder text in square brackets, e.g. "[Your Name]", "[Company Name]", "[Date]"
- Include instructions in italics explaining how to fill each section
- Provide example text where helpful, marked as "> Example: ..."
- The template should be immediately usable — not just an outline
- Include 6-10 sections depending on complexity
- End with usage tips

RESPOND WITH VALID JSON ONLY:
{
  "title": "Descriptive, specific title",
  "description": "1-2 sentence description of what this template is for and who should use it",
  "content": "Full markdown template with fill-in sections",
  "category": "One of: Resume & Job Search, Interview Prep, Certifications, Personal Branding, SOC / Blue Team, GRC & Compliance, Cloud Security, Career Strategy, OT / ICS Security, General Security"
}`,
};

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface GenerateResourceRequest {
  topic: string;
  type: 'checklist' | 'guide' | 'template';
  category?: string;
  free?: boolean;
}

interface GeneratedResourceData {
  title: string;
  description: string;
  content: string;
  category: string;
}

/* ─── POST Handler ───────────────────────────────────────────────────────── */

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
        { error: 'AI resource generation not available — GROQ_API_KEY is not configured' },
        { status: 503 }
      );
    }

    // Parse and validate request body
    const body: GenerateResourceRequest = await req.json();

    if (!body.topic || typeof body.topic !== 'string' || body.topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const validTypes = ['checklist', 'guide', 'template'] as const;
    if (!body.type || !validTypes.includes(body.type)) {
      return NextResponse.json(
        { error: 'Type must be one of: checklist, guide, template' },
        { status: 400 }
      );
    }

    const topic = body.topic.trim();
    const type = body.type;
    const categoryHint = body.category?.trim();
    const isFree = body.free !== false; // default true

    const systemPrompt = TYPE_PROMPTS[type];
    if (!systemPrompt) {
      return NextResponse.json(
        { error: 'Invalid resource type' },
        { status: 400 }
      );
    }

    // Build user prompt
    let userPrompt = `Create a ${type} about: "${topic}"`;
    if (categoryHint) {
      userPrompt += `\nPreferred category: ${categoryHint}`;
    }
    userPrompt += `\n\nMake it comprehensive, practical, and immediately useful for cybersecurity professionals.`;

    // Call Groq
    const Groq = (await import('groq-sdk')).default;
    const client = new Groq({ apiKey });

    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 4096,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
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
    let generated: GeneratedResourceData;
    try {
      let raw = responseText.trim();
      if (raw.startsWith('```')) {
        raw = raw.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
      }
      generated = JSON.parse(raw);
    } catch (parseError) {
      console.error('[Generate Resource] Failed to parse AI response:', parseError);
      console.error('[Generate Resource] Raw response:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse AI-generated content. Please try again.' },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!generated.title || !generated.content || !generated.description) {
      return NextResponse.json(
        { error: 'AI response missing required fields. Please try again.' },
        { status: 500 }
      );
    }

    // Save to Supabase
    const supabase = await createClient();
    const { data, error: dbError } = await supabase
      .from('generated_resources')
      .insert({
        title: generated.title,
        description: generated.description,
        content: generated.content,
        type,
        category: generated.category || categoryHint || 'General Security',
        free: isFree,
        published: false,
        generated_by_ai: true,
        author_id: adminCheck.userId!,
      })
      .select()
      .single();

    if (dbError) {
      console.error('[Generate Resource] Supabase insert error:', dbError);
      // Return the generated content even if DB save fails
      return NextResponse.json({
        success: true,
        saved: false,
        resource: {
          title: generated.title,
          description: generated.description,
          content: generated.content,
          type,
          category: generated.category || categoryHint || 'General Security',
          free: isFree,
        },
        dbError: dbError.message,
      });
    }

    return NextResponse.json({
      success: true,
      saved: true,
      resource: data,
    });
  } catch (err) {
    console.error('[Generate Resource] Unexpected error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred during resource generation' },
      { status: 500 }
    );
  }
}
