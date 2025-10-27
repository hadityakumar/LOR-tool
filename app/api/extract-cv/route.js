import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("cv");

    if (!file) {
      return Response.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const text = buffer.toString("utf-8");

    const prompt = `You are an expert at extracting information from CVs/resumes. 
    
Analyze the following CV text and extract relevant information for a Letter of Recommendation form.

CV Content:
${text}

Extract and return ONLY a JSON object with the following fields (use empty strings if information is not available):
{
  "name": "candidate's full name",
  "institution": "current/most recent institution or company",
  "field": "primary field of study or work",
  "achievements": "key achievements (comma-separated, max 200 chars)",
  "targetProgram": "likely target program based on background",
  "qualities": ["quality1", "quality2", "quality3"],
  "softTraits": ["trait1", "trait2"]
}

Return ONLY the JSON object, no other text.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    let extractedText = response.text.trim();
    
    // Remove markdown code blocks if present
    extractedText = extractedText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    
    const extractedData = JSON.parse(extractedText);

    return Response.json({
      success: true,
      data: extractedData,
    });
  } catch (error) {
    console.error("Error extracting CV:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Failed to extract CV information",
      },
      { status: 500 }
    );
  }
}
