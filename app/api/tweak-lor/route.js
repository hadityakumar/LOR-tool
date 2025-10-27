import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { currentLOR, tweakRequest } = body;

    const prompt = `You are an expert letter of recommendation editor. 

Here is the current Letter of Recommendation:

${currentLOR}

The user wants the following changes/tweaks:
"${tweakRequest}"

Please rewrite the letter incorporating these changes while maintaining the professional tone, structure, and overall quality. Keep the same format and style, just apply the requested modifications.

Generate the revised Letter of Recommendation now:`;

    const response = await ai.models.generateContentStream({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    // Create a readable stream for the response
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
    console.error("Error tweaking LOR:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to tweak LOR" 
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
