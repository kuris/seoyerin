"use client"

import { useEffect, useState } from "react"
import { Mindmap } from "@/components/mindmap"
import { playSound } from "@/lib/sound"

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
        
        // 글자가 타이핑될 때 소리 재생 (공백 제외)
        if (text.charAt(i) !== ' ') {
          playSound('typewriter');
        }
        
        i++;
        timeoutId = setTimeout(type, speed + Math.random() * 30);
      }
    }
    
    type();
    return () => clearTimeout(timeoutId);
  }, [text, speed]);
  
  return displayed;
}

interface Post {
  title: string;
  link: string;
  category: string;
}

export default function Home() {
  const [view, setView] = useState<"intro" | "list" | "mindmap">("intro");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const title = useTypewriter("SEO YERIN'S SECRET BOARD", 70);
  const desc = useTypewriter("차분한 타자기 감성의 실험실 게시판입니다. 자유롭게 글을 남기거나, 실험실의 다양한 기능을 탐험해보세요.", 35);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setProgress(0);
      
      // 로딩 퍼센트 시뮬레이션
      const timer = setInterval(() => {
        setProgress((old) => {
          if (old >= 95) return old;
          return old + Math.floor(Math.random() * 10);
        });
      }, 150);

      try {
        const res = await fetch('/api/rss');
        const data = await res.json();
        if (Array.isArray(data)) {
          setPosts(data);
          setProgress(100);
        }
      } catch (e) {
        console.error(e);
      } finally {
        clearInterval(timer);
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      {view === "intro" && (
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
            <button 
              onClick={() => { playSound('click'); setView("list"); }} 
              className="retro-link"
            >
              [ 게시글 목록 ]
            </button>
            <button 
              onClick={() => { playSound('click'); setView("mindmap"); }} 
              className="retro-link"
            >
              [ 마인드맵 뷰 ]
            </button>
            <a 
              href="https://chatgpts.kr" 
              target="_blank" 
              rel="noreferrer" 
              className="retro-link"
              onClick={() => playSound('click')}
            >
              [ 새 글 작성 ]
            </a>
          </div>
        </section>
      )}

      {view === "list" && (
        <section className="retro-container !m-0 !max-w-[850px] w-full max-h-[85vh] flex flex-col">
          <div className="status-bar">
            <span>BOARD: STRUCTURED_DATABASE</span>
            <span>NODES: {posts.length}</span>
            <button 
              onClick={() => { playSound('click'); setView("intro"); }} 
              className="text-[#b2ffb2] hover:underline"
            >
              [ 뒤로가기 ]
            </button>
          </div>
          
          <div className="overflow-y-auto pr-4 custom-scrollbar flex-1 py-2">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center p-10 space-y-4">
                <div className="text-[1.2rem] font-bold animate-pulse tracking-widest">
                  SYNCHRONIZING_DATABASE... {progress}%
                </div>
                <div className="w-full max-w-md h-4 border border-[#b2ffb2]/50 p-[2px]">
                  <div 
                    className="h-full bg-[#b2ffb2] transition-all duration-300 shadow-[0_0_10px_#b2ffb2]"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-[0.7rem] opacity-50 font-mono">
                  FETCHING FROM: HTTPS://CHATGUTS.KR/RSS
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(
                  posts.reduce((acc, post) => {
                    if (!acc[post.category]) acc[post.category] = [];
                    acc[post.category].push(post);
                    return acc;
                  }, {} as Record<string, Post[]>)
                ).map(([category, catPosts], cIdx) => (
                  <div key={category} className="relative pl-6">
                    {/* Category Node */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-4 h-4 border border-[#b2ffb2] rotate-45 flex-shrink-0 bg-[#b2ffb2]/20"></div>
                      <h2 className="text-[1.1rem] font-bold text-[#b2ffb2] tracking-wider uppercase">
                        {category} <span className="text-[0.7rem] opacity-50 ml-2">[{catPosts.length}_ITEMS]</span>
                      </h2>
                      <div className="flex-1 h-[1px] bg-gradient-to-r from-[#b2ffb2]/50 to-transparent"></div>
                    </div>
                    
                    {/* Connecting Vertical Line */}
                    <div className="absolute left-[7px] top-6 bottom-4 w-[1px] bg-[#b2ffb2]/30"></div>

                    {/* Post Nodes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
                      {catPosts.map((post, pIdx) => (
                        <div key={pIdx} className="relative group">
                          {/* Horizontal Branch Line */}
                          <div className="absolute -left-4 top-1/2 w-4 h-[1px] bg-[#b2ffb2]/30"></div>
                          
                          <a 
                            href={post.link} 
                            target="_blank" 
                            rel="noreferrer"
                            className="block p-3 border border-[#b2ffb2]/20 bg-[#b2ffb2]/5 hover:bg-[#b2ffb2]/20 hover:border-[#b2ffb2]/60 transition-all duration-200 group-hover:translate-x-1"
                          >
                            <div className="text-[0.85rem] leading-snug line-clamp-2">
                              {post.title}
                            </div>
                            <div className="mt-2 text-[0.65rem] opacity-40 flex justify-between uppercase">
                              <span>ID: {Math.random().toString(16).slice(2, 8)}</span>
                              <span>LINK_READY</span>
                            </div>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-6 flex gap-2 border-t border-[#b2ffb2]/20 pt-4">
            <button 
              onClick={() => { playSound('click'); setView("mindmap"); }} 
              className="retro-link !text-[0.75rem]"
            >
              [ 인터랙티브 마인드맵 ]
            </button>
            <button 
              onClick={() => { playSound('click'); setView("intro"); }} 
              className="retro-link !text-[0.75rem]"
            >
              [ 루트 시스템 ]
            </button>
          </div>
        </section>
      )}
            <button onClick={() => setView("mindmap")} className="retro-link">[ 마인드맵 전환 ]</button>
            <button onClick={() => setView("intro")} className="retro-link">[ 홈으로 ]</button>
          </div>
        </section>
      )}

      {view === "mindmap" && (
        <div className="fixed inset-0 z-50 bg-[#181a1c] flex flex-col">
          <div className="p-4 flex justify-between items-center border-b border-[#b2ffb2]/30">
            <span className="text-[0.9rem]">MODE: INTERACTIVE_MINDMAP</span>
            <button 
              onClick={() => { playSound('click'); setView("intro"); }} 
              className="retro-link !m-0 !py-1"
            >
              [ EXIT ]
            </button>
          </div>
          <div className="flex-1 relative">
            <Mindmap />
          </div>
        </div>
      )}
    </main>
  );
}
