let market = {
  yes: 62,
  no: 38
};

export default function handler(req, res) {
  if (req.method === "POST") {
    const { choice } = req.body;

    if (choice === "YES") market.yes += 1;
    if (choice === "NO") market.no += 1;

    res.status(200).json(market);
  }
}
