
import { useEffect } from "react"
import { useState } from "react"


// 타자기 타이핑 효과
function useTypewriter(text: string, speed = 60) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    function type() {
      if (i < text.length) {
        setDisplayed((prev) => prev + text.charAt(i));
        i++;
        setTimeout(type, speed + Math.random() * 40);
      }
    }
    type();
    // eslint-disable-next-line
  }, [text]);
  return displayed;
}

export default function Home() {
  const title = useTypewriter("SEO YERIN'S SECRET BOARD", 70);
  const desc = useTypewriter("차분한 타자기 감성의 실험실 게시판입니다. 자유롭게 글을 남기거나, 실험실의 다양한 기능을 탐험해보세요.", 35);
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <section style={{
        background: "rgba(20,22,24,0.98)",
        border: "1.5px solid #b2ffb2",
        borderRadius: "12px",
        boxShadow: "0 2px 24px 0 rgba(0,0,0,0.18)",
        maxWidth: 540,
        width: "100%",
        padding: "36px 28px 32px 28px",
        fontFamily: "Courier New, Courier, monospace",
        position: "relative"
      }}>
        <div style={{
          fontSize: "0.92rem",
          color: "#b2ffb2",
          borderBottom: "1px solid #b2ffb2",
          paddingBottom: 8,
          marginBottom: 18,
          display: "flex",
          justifyContent: "space-between",
          letterSpacing: 1
        }}>
          <span>BOARD: LAB-NOTE</span>
          <span>USER: GUEST</span>
          <span>ACCESS: OPEN</span>
        </div>
        <h1 style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#b2ffb2",
          marginBottom: 18,
          letterSpacing: 2,
          textShadow: "1px 1px 0 #222, 0 0 8px #b2ffb2"
        }}>{title}</h1>
        <div className="retro-desc" style={{ color: "#eaffea", borderLeft: "2.5px solid #b2ffb2", background: "rgba(0,0,0,0.08)", paddingLeft: 14, minHeight: 48, marginBottom: 24 }}>
          {desc}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
          <a href="#" className="retro-link" style={{ color: "#b2ffb2", borderColor: "#b2ffb2" }}>[ 게시글 목록 ]</a>
          <a href="#" className="retro-link" style={{ color: "#b2ffb2", borderColor: "#b2ffb2" }}>[ 새 글 작성 ]</a>
          <a href="#" className="retro-link" style={{ color: "#b2b2ff", borderColor: "#b2b2ff" }}>[ 실험실 홈 ]</a>
        </div>
      </section>
    </main>
  );
}
