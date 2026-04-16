let market = {
  question: "Will SOL hit $80 today?",
  yes: 62,
  no: 38
};

export default function handler(req, res) {
  res.status(200).json(market);
}
