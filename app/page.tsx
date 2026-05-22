"use client"

import { useEffect } from "react"
import { useState } from "react"


// 타자기 타이핑 효과
function useTypewriter(text: string, speed = 50) {
  const [displayed, setDisplayed] = useState("");
  
  useEffect(() => {
    let i = 0;
    let timeoutId: NodeJS.Timeout;
    setDisplayed("");
    
    function type() {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
        timeoutId = setTimeout(type, speed + Math.random() * 30);
      }
    }
    
    type();
    return () => clearTimeout(timeoutId);
  }, [text, speed]);
  
  return displayed;
}

export default function Home() {
  const title = useTypewriter("SEO YERIN'S SECRET BOARD", 70);
  const desc = useTypewriter("차분한 타자기 감성의 실험실 게시판입니다. 자유롭게 글을 남기거나, 실험실의 다양한 기능을 탐험해보세요.", 35);
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <section className="retro-container !m-0 !max-w-[540px]">
        <div className="status-bar">
          <span>BOARD: LAB-NOTE</span>
          <span>USER: GUEST</span>
          <span>ACCESS: OPEN</span>
        </div>
        <h1 className="glitch-text mb-4">{title}</h1>
        <div className="retro-desc mb-6">
          {desc}
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="#" className="retro-link">[ 게시글 목록 ]</a>
          <a href="#" className="retro-link">[ 새 글 작성 ]</a>
          <a href="#" className="retro-link">[ 실험실 홈 ]</a>
        </div>
      </section>
    </main>
  );
}
