module.exports = async (req, res) => {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "Missing API key" });
    }

    const { text } = req.body || {};

    if (!text) {
      return res.status(400).json({ error: "No input text" });
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
                { text: `Answer this clearly and helpfully:\n${text}` }
              ]
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("API ERROR:", err);
      return res.status(500).json({ error: "Gemini API error" });
    }

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const result =
      data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join(" ")
      || "No response";

    return res.status(200).json({ result });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500
