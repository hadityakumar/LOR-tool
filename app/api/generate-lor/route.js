import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { formData, qualities, softTraits } = body;

    const prompt = buildLORPrompt(formData, qualities, softTraits);

    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        try {
          for await (const chunk of response) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error generating LOR:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to generate LOR" 
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

function buildLORPrompt(formData, qualities, softTraits) {
  const {
    name,
    relationship,
    duration,
    institution,
    targetProgram,
    targetInstitution,
    field,
    achievements,
    anecdote,
    referrer,
    tone,
    lorType,
    strength,
  } = formData;

  return `You are an expert letter of recommendation writer. Generate a professional, compelling Letter of Recommendation based on the following details:

**CANDIDATE INFORMATION:**
- Name: ${name || "the candidate"}
- Relationship to referrer: ${relationship || "colleague"}
- Duration known: ${duration || "several years"}
- Current/Previous Institution: ${institution || "our institution"}
- Target Program/Role: ${targetProgram || "graduate program"}
- Target Institution: ${targetInstitution || "the institution"}
- Field of Interest: ${field || "their field"}

**REFERRER INFORMATION:**
- Referrer Identity/Title: ${referrer || "Professional"}

**QUALITIES & TRAITS:**
- Observed Qualities: ${qualities.length > 0 ? qualities.join(", ") : "strong work ethic, dedication"}
- Soft Traits: ${softTraits.length > 0 ? softTraits.join(", ") : "reliable, hardworking"}

**SPECIFIC DETAILS:**
- Key Achievements: ${achievements || "notable contributions to projects"}
- Memorable Anecdote: ${anecdote || "demonstrated exceptional skills in challenging situations"}

**LETTER SPECIFICATIONS:**
- Tone: ${tone || "Professional"}
- LOR Type: ${lorType || "Academic"}
- Recommendation Strength: ${strength || "Strong"}

**INSTRUCTIONS:**
1. Write a complete, well-structured Letter of Recommendation
2. Follow standard LOR format with proper greeting and closing
3. Use the specified tone (${tone || "Professional"})
4. Make it appropriate for ${lorType || "Academic"} purposes
5. Express ${strength || "Strong"} recommendation level
6. Include specific examples and the provided anecdote
7. Highlight the mentioned qualities and traits naturally
8. Make it personal, authentic, and compelling
9. Keep it concise but comprehensive (300-400 words)
10. Include proper salutation and signature from ${referrer || "the referrer"}

Generate the Letter of Recommendation now, start with dear admissions committee or hiring manager:`;
}
