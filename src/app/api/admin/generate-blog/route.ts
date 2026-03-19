import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const BLOG_GENERATOR_SYSTEM_PROMPT = `You are a cybersecurity career blog writer for LumaShift, a Malaysian cybersecurity career coaching platform.

WRITING RULES:
- Voice: Practical, direct, no-fluff. Write for real people making career decisions.
- Context: Malaysian cybersecurity market + global relevance. Reference Malaysian specifics (NACSA, PDPA, MyCERT, local salary benchmarks, MDEC, etc.) where relevant, but keep advice applicable globally.
- Structure: Start with a compelling introduction (2-3 sentences, hook the reader), then 3-5 main sections with H2 headings, end with a conclusion that has a clear takeaway and call to action.
- Length: 1000-1500 words.
- Include practical, actionable advice — not just theory. Give readers something they can do TODAY.
- Include data points, statistics, and specific examples where possible.
- Use markdown formatting: H2 for sections, bold for emphasis, bullet lists for steps/tips, code blocks for technical examples if relevant.
- Do NOT use H1 headings (the title is rendered separately).
- Generate exactly 5 key takeaways that summarize the most actionable points.
- Suggest a category from: "Career Advice", "Technical Concepts", "Industry Insights", "Certifications", "Interview Prep", "Malaysian Market", "Tools & Frameworks", "Soft Skills".
- Suggest 5-8 relevant tags.
- Suggest a visual type from: "threat-landscape", "career-path", "concept-diagram", "timeline", "comparison-table".
- Estimate read time based on word count (roughly 1 min per 200 words).
- Generate a URL-friendly slug from the title (lowercase, hyphens, no special characters).
- Write a compelling excerpt (1-2 sentences, under 160 characters) for SEO/preview.

RESPOND WITH VALID JSON ONLY. No markdown code fences, no explanation — just the JSON object:
{
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "content": "... (full markdown body) ...",
  "category": "...",
  "tags": ["...", "..."],
  "readTime": "X min read",
  "visualType": "...",
  "keyTakeaways": ["...", "...", "...", "...", "..."]
}`;

interface GenerateBlogRequest {
  topic: string;
  category?: string;
  targetAudience?: string;
  tone?: string;
}

interface GeneratedBlogData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readTime: string;
  visualType: string;
  keyTakeaways: string[];
}

export async function POST(req: NextRequest) {
  try {
    // Check for API key first
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI generation not available' },
        { status: 503 }
      );
    }

    // Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body: GenerateBlogRequest = await req.json();

    if (!body.topic || typeof body.topic !== 'string' || body.topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const topic = body.topic.trim();
    const targetAudience = body.targetAudience?.trim() || 'aspiring cybersecurity professionals';
    const tone = body.tone?.trim() || 'practical';
    const categoryHint = body.category?.trim();

    // Build the user prompt
    let userPrompt = `Write a blog post about: "${topic}"\n\nTarget audience: ${targetAudience}\nTone: ${tone}`;
    if (categoryHint) {
      userPrompt += `\nPreferred category: ${categoryHint}`;
    }

    // Call Claude to generate the blog post
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: BLOG_GENERATOR_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    // Extract text from the response
    const textBlock = message.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json(
        { error: 'AI did not return a text response' },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let generated: GeneratedBlogData;
    try {
      // Strip markdown code fences if present (safety measure)
      let raw = textBlock.text.trim();
      if (raw.startsWith('```')) {
        raw = raw.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
      }
      generated = JSON.parse(raw);
    } catch (parseError) {
      console.error('[Generate Blog] Failed to parse AI response:', parseError);
      console.error('[Generate Blog] Raw response:', textBlock.text);
      return NextResponse.json(
        { error: 'Failed to parse AI-generated content. Please try again.' },
        { status: 500 }
      );
    }

    // Validate required fields from AI response
    if (!generated.title || !generated.slug || !generated.content || !generated.excerpt) {
      return NextResponse.json(
        { error: 'AI response missing required fields. Please try again.' },
        { status: 500 }
      );
    }

    // Save to Supabase as a draft
    const { data, error: dbError } = await supabase
      .from('blog_posts')
      .insert({
        slug: generated.slug,
        title: generated.title,
        excerpt: generated.excerpt,
        content: generated.content,
        category: generated.category,
        tags: generated.tags,
        author: 'LumaShift',
        date: new Date().toISOString().split('T')[0],
        read_time: generated.readTime,
        published: false,
        visual_type: generated.visualType,
        key_takeaways: generated.keyTakeaways,
        generated_by_ai: true,
        author_id: user.id,
      })
      .select()
      .single();

    if (dbError) {
      console.error('[Generate Blog] Supabase insert error:', dbError);
      return NextResponse.json(
        { error: `Failed to save blog post: ${dbError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      post: data,
    });
  } catch (err) {
    console.error('[Generate Blog] Unexpected error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred during blog generation' },
      { status: 500 }
    );
  }
}
