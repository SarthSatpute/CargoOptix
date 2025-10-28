import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Gemini API error: ${errorText}` }, { status: 500 });
    }

    const data = await response.json();
    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

    return NextResponse.json({ output });
  } catch (error: any) {
    console.error("Gemini Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
