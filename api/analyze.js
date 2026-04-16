module.exports = async (req, res) => {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "Missing API key" });
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
                { text: "Say hello in one short sentence." }
              ]
            }
          ]
        }),
      }
    );

    // ✅ Check HTTP status
    if (!response.ok) {
      const errText = await response.text();
      console.error("HTTP ERROR:", errText);
      return res.status(response.status).json({ error: "Upstream API error" });
    }

    const data = await response.json();

    // ✅ Gemini error inside body
    if (data.error) {
      console.error("GEMINI ERROR:", data.error);
      return res.status(500).json({ error: data.error.message || "Gemini error" });
    }

    const result =
      data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join(" ")
      || "No response";

    return res.status(200).json({ result });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
