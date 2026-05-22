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

  const title = useTypewriter("나는 세 번 죽고 세 번 태어났다", 80);
  const desc = useTypewriter("어느 15년차 PM의 끈질긴 생존 기록. 세 번의 죽음과 세 번의 부활, 그리고 끝나지 않는 Healthcare IT 실험실에 오신 것을 환영합니다.", 40);

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
        <section className="retro-container !m-0 !max-w-[640px]">
          <div className="status-bar">
            <span>DATABASE: LOG_SURVIVAL</span>
            <span>USER: SEO YERIN</span>
            <span>ACCESS: GRANTED</span>
          </div>
          <h1 className="glitch-text">{title}</h1>
          <div className="retro-desc">
            {desc}
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => { playSound('click'); setView("list"); }} 
              className="retro-link"
            >
              ▸  데이터 기록 보기
            </button>
            <button 
              onClick={() => { playSound('click'); setView("mindmap"); }} 
              className="retro-link"
            >
              ▸  마인드맵 시스템
            </button>
            <a 
              href="https://chatgpts.kr" 
              target="_blank" 
              rel="noreferrer" 
              className="retro-link"
              onClick={() => playSound('click')}
            >
              ▸  새로운 기록 작성
            </a>
          </div>
          
          <div className="mt-12 pt-6 border-t border-[#1a2a1a]">
            <div className="text-[10px] text-[#2a3a2a] tracking-[3px] mb-4 uppercase">Survival Log Status</div>
            <div className="flex flex-wrap gap-4">
              {[2002, 2004, 2005, 2008, 2025].map(year => (
                <div key={year} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#4a7a4a]"></div>
                  <span className="text-[11px] text-[#5a6a4a]">{year}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {view === "list" && (
        <section className="retro-container !m-0 !max-w-[850px] w-full max-h-[85vh] flex flex-col">
          <div className="status-bar">
            <span>DATABASE: STRUCTURED_NODES</span>
            <span>RECORDS: {posts.length}</span>
            <button 
              onClick={() => { playSound('click'); setView("intro"); }} 
              className="hover:text-white transition-colors"
            >
              [ ESC_BACK ]
            </button>
          </div>
          
          <div className="overflow-y-auto pr-4 custom-scrollbar flex-1 py-2">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center p-10 space-y-6">
                <div className="text-[1.1rem] font-bold tracking-[4px] text-[#a0e080]">
                  SYNCHRONIZING... {progress}%
                </div>
                <div className="w-full max-w-sm h-1 bg-[#1a2a1a]">
                  <div 
                    className="h-full bg-[#6ab06a] transition-all duration-300 shadow-[0_0_10px_rgba(106,176,106,0.3)]"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                {Object.entries(
                  posts.reduce((acc, post) => {
                    if (!acc[post.category]) acc[post.category] = [];
                    acc[post.category].push(post);
                    return acc;
                  }, {} as Record<string, Post[]>)
                ).map(([category, catPosts], cIdx) => (
                  <div key={category} className="relative pl-6">
                    {/* Category Node */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-2 h-2 bg-[#6ab06a] rotate-45 flex-shrink-0"></div>
                      <h2 className="text-[1rem] font-bold text-[#a0e080] tracking-[2px] uppercase">
                        {category} <span className="text-[10px] text-[#5a6a4a] ml-2">({catPosts.length})</span>
                      </h2>
                      <div className="flex-1 h-[1px] bg-[#1a2a1a]"></div>
                    </div>
                    
                    {/* Connecting Vertical Line */}
                    <div className="absolute left-[3px] top-4 bottom-4 w-[1px] bg-[#1a2a1a]"></div>

                    {/* Post Nodes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                      {catPosts.map((post, pIdx) => (
                        <div key={pIdx} className="relative group">
                          {/* Horizontal Branch Line */}
                          <div className="absolute -left-4 top-1/2 w-4 h-[1px] bg-[#1a2a1a]"></div>
                          
                          <a 
                            href={post.link} 
                            target="_blank" 
                            rel="noreferrer"
                            className="block p-4 border border-[#1a2a1a] bg-[#0d120d] hover:border-[#4a8a4a] hover:bg-[#122012] transition-all duration-300"
                          >
                            <div className="text-[0.9rem] leading-relaxed text-[#c0c8a8] group-hover:text-[#a0e080]">
                              {post.title}
                            </div>
                            <div className="mt-3 text-[10px] text-[#5a6a4a] flex justify-between uppercase tracking-wider">
                              <span>Ref: {Math.random().toString(36).slice(2, 7)}</span>
                              <span className="group-hover:text-[#6ab06a]">▸ OPEN_LOG</span>
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
          
          <div className="mt-8 flex gap-3 border-t border-[#1a2a1a] pt-6">
            <button 
              onClick={() => { playSound('click'); setView("mindmap"); }} 
              className="retro-link !text-[11px] !py-2"
            >
              ▸  전체 마인드맵 가동
            </button>
            <button 
              onClick={() => { playSound('click'); setView("intro"); }} 
              className="retro-link !text-[11px] !py-2"
            >
              ▸  중앙 시스템으로
            </button>
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
