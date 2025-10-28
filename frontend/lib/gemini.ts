export async function getGeminiResponse(prompt: string) {
  const context = `
You are the CargoOptix AI Assistant — a maritime logistics AI designed to optimize container placement, 
analyze ship stability, and report load balance efficiency. 
Answer concisely and professionally in a technical yet understandable tone.
  `;

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
      process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: context + "\n\nUser query: " + prompt }],
          },
        ],
      }),
    }
  );

  const data = await res.json();

  // Handle Gemini API structure variations safely
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No response from AI."
  );
}
