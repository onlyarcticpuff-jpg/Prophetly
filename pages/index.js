import { useEffect, useState } from "react";

export default function Home() {
  const [market, setMarket] = useState(null);

  const fetchMarket = async () => {
    const res = await fetch("/api/market");
    const data = await res.json();
    setMarket(data);
  };

  const bet = async (choice) => {
    await fetch("/api/bet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ choice }),
    });
    fetchMarket();
  };

  useEffect(() => {
    fetchMarket();
  }, []);

  if (!market) return <div>Loading...</div>;

  const total = market.yes + market.no;
  const yesPercent = ((market.yes / total) * 100).toFixed(1);
  const noPercent = ((market.no / total) * 100).toFixed(1);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Prophetly</h1>

      <div style={styles.card}>
        <h2>{market.question}</h2>

        <div style={styles.buttons}>
          <button style={styles.yes} onClick={() => bet("YES")}>
            YES ({yesPercent}%)
          </button>
          <button style={styles.no} onClick={() => bet("NO")}>
            NO ({noPercent}%)
          </button>
        </div>

        <div style={styles.bar}>
          <div style={{ ...styles.yesBar, width: `${yesPercent}%` }} />
          <div style={{ ...styles.noBar, width: `${noPercent}%` }} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#0b0f1a",
    color: "white",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif",
  },
  title: {
    position: "absolute",
    top: 20,
    left: 30,
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    padding: "30px",
    borderRadius: "16px",
    width: "350px",
    textAlign: "center",
    backdropFilter: "blur(10px)",
  },
  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  yes: {
    flex: 1,
    background: "#16c784",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
  no: {
    flex: 1,
    background: "#ea3943",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
  bar: {
    display: "flex",
    height: "10px",
    marginTop: "20px",
    borderRadius: "10px",
    overflow: "hidden",
  },
  yesBar: {
    background: "#16c784",
  },
  noBar: {
    background: "#ea3943",
  },
};
