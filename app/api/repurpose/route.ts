import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content || content.length < 100) {
      return Response.json({ error: "Content too short" }, { status: 400 });
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `You are a content repurposing expert. Convert this blog post into multiple formats.

RULES:
- Twitter thread: 5-8 tweets, each UNDER 280 characters, numbered (1/, 2/, etc), first tweet is a hook, last tweet is a CTA
- LinkedIn post: Professional but human tone, use line breaks for readability, 1000-1300 characters, end with an engaging question
- Summary: 2-3 sentences capturing the core message, suitable for newsletter intros
- Key takeaways: 3-5 bullet points with actionable insights

Return ONLY valid JSON with no markdown formatting, no code blocks, just the raw JSON object:
{"twitter":["tweet1","tweet2","tweet3","tweet4","tweet5"],"linkedin":"full linkedin post text","summary":"summary text","takeaways":["point1","point2","point3"]}

Content to repurpose:
${content}`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    
    // Clean up the response - remove any markdown code blocks if present
    const cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const result = JSON.parse(cleanedText);

    return Response.json(result);
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Failed to process content" }, { status: 500 });
  }
}
