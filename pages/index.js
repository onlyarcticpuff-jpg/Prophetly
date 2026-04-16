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

  useEffect(() => {
    fetchMarkets();
  }, []);

  return (
    <div className={inter.className} style={styles.page}>
      
      {/* NAV */}
      <div style={styles.nav}>
        <div style={styles.logo}>⚡ Prophetly</div>
        <button style={styles.navBtn}>Start</button>
      </div>

      {/* HERO */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Predict the future.
        </h1>
        <p style={styles.heroSub}>
          A new way to understand markets — powered by people.
        </p>

        <div style={styles.ctaContainer}>
          <button style={styles.primaryBtn}>Start Predicting</button>
        </div>
      </div>

      {/* FEATURE GLASS CARD */}
      <div style={styles.feature}>
        <div style={styles.featureCard}>
          <h2 style={styles.featureTitle}>
            Real-time market sentiment
          </h2>
          <p style={styles.featureText}>
            Watch probabilities shift as people place predictions.
          </p>
        </div>
      </div>

      {/* MARKETS */}
      <div style={styles.marketSection}>
        <h2 style={styles.sectionTitle}>Live Markets</h2>

        <div style={styles.marketGrid}>
          {markets.map((m) => {
            const total = m.yes + m.no;
            const yesPercent = ((m.yes / total) * 100).toFixed(0);

            return (
              <div key={m.id} style={styles.card}>
                <div style={styles.question}>{m.question}</div>
                <div style={styles.percent}>{yesPercent}% YES</div>
              </div>
            );
          })}
        </div>
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
  },

  navBtn: {
    background: "rgba(255,255,255,0.1)",
    border: "none",
    padding: "8px 14px",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
  },

  hero: {
    textAlign: "center",
    marginTop: "80px",
    marginBottom: "80px",
  },

  heroTitle: {
    fontSize: "56px",
    fontWeight: "800",
    letterSpacing: "-2px",
  },

  heroSub: {
    marginTop: "20px",
    opacity: 0.7,
    fontSize: "18px",
  },

  ctaContainer: {
    marginTop: "30px",
  },

  primaryBtn: {
    background: "white",
    color: "black",
    padding: "12px 20px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
  },

  feature: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "80px",
  },

  featureCard: {
    background: "rgba(255,255,255,0.05)",
    padding: "30px",
    borderRadius: "20px",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255,255,255,0.1)",
    maxWidth: "500px",
    textAlign: "center",
  },

  featureTitle: {
    fontSize: "22px",
    marginBottom: "10px",
  },

  featureText: {
    opacity: 0.7,
  },

  marketSection: {
    maxWidth: "800px",
    margin: "0 auto",
  },

  sectionTitle: {
    marginBottom: "20px",
  },

  marketGrid: {
    display: "grid",
    gap: "15px",
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    padding: "15px",
    borderRadius: "14px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  question: {
    marginBottom: "5px",
  },

  percent: {
    opacity: 0.7,
  },
};
