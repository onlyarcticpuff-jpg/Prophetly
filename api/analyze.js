module.exports = async (req, res) => {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "Missing API key" });
    }

    // 👇 manually parse body
    let body = "";

    for await (const chunk of req) {
      body += chunk;
    }

    const parsed = JSON.parse(body || "{}");
    const text = parsed.text;

    if (!text) {
      return res.status(400).json({ error: "No input text" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key={API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `Answer clearly:\n${text}` }
              ]
            }
          ]
        }),
      }
    );

    const data = await response.json();

    const result =
      data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join(" ")
      || "No response";

    return res.status(200).json({ result });

  } catch (err) {
    console.error("CRASH:", err);
    return res.status(500).json({ error: err.toString() });
  }
};
