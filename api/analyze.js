export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ result: "NO API KEY" });
    }
    const response = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "Say hello. Just respond with 1 sentence." }
              ]
            }
          ]
        }),
      }
    );

    const data = await response.json();

    // 👇 RETURN FULL RESPONSE FOR DEBUG
    return res.status(200).json({
  result:
    data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join(" ") || "No response"
});

  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
}
