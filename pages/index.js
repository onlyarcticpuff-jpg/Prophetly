import { useEffect, useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [markets, setMarkets] = useState([]);

  const fetchMarkets = async () => {
    const res = await fetch("/api/market");
    const data = await res.json();
    setMarkets(data);
  };

  const bet = async (id, choice) => {
    await fetch("/api/bet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, choice, amount: 100 }),
    });

    fetchMarkets();
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  return (
    <div className={inter.className} style={styles.page}>
      {/* NAVBAR */}
      <div style={styles.nav}>
        <div style={styles.logo}>⚡ Prophetly</div>
      </div>

      {/* HERO */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Predict the future.</h1>
        <p style={styles.heroSub}>Beat the market.</p>
      </div>

      {/* MARKETS */}
      <div style={styles.marketContainer}>
        {markets.map((m) => {
          const total = m.yes + m.no;
          const yesPercent = ((m.yes / total) * 100).toFixed(1);
          const noPercent = ((m.no / total) * 100).toFixed(1);

          return (
            <div key={m.id} style={styles.card}>
              <h2 style={styles.question}>{m.question}</h2>

              <div style={styles.buttons}>
                <button
                  style={styles.yes}
                  onClick={() => bet(m.id, "YES")}
                >
                  YES ({yesPercent}%)
                </button>

                <button
                  style={styles.no}
                  onClick={() => bet(m.id, "NO")}
                >
                  NO ({noPercent}%)
                </button>
              </div>

              {/* BAR */}
              <div style={styles.bar}>
                <div
                  style={{
                    ...styles.yesBar,
                    width: `${yesPercent}%`,
                  }}
                />
                <div
                  style={{
                    ...styles.noBar,
                    width: `${noPercent}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#05070d",
    color: "white",
    minHeight: "100vh",
    padding: "20px",
  },

  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },

  logo: {
    fontWeight: "700",
    fontSize: "20px",
    letterSpacing: "-0.5px",
  },

  hero: {
    textAlign: "center",
    marginBottom: "60px",
  },

  heroTitle: {
    fontSize: "48px",
    fontWeight: "700",
    letterSpacing: "-1px",
  },

  heroSub: {
    fontSize: "18px",
    opacity: 0.7,
    marginTop: "10px",
  },

  marketContainer: {
    display: "grid",
    gap: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    padding: "20px",
    borderRadius: "16px",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  question: {
    fontSize: "18px",
    marginBottom: "15px",
  },

  buttons: {
    display: "flex",
    gap: "10px",
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
    height: "8px",
    marginTop: "15px",
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
