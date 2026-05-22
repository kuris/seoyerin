"use client"

import { useEffect, useState } from "react"
import { Mindmap } from "@/components/mindmap"

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

interface Post {
  title: string;
  link: string;
  category: string;
}

export default function Home() {
  const [view, setView] = useState<"intro" | "list" | "mindmap">("intro");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const title = useTypewriter("SEO YERIN'S SECRET BOARD", 70);
  const desc = useTypewriter("차분한 타자기 감성의 실험실 게시판입니다. 자유롭게 글을 남기거나, 실험실의 다양한 기능을 탐험해보세요.", 35);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/rss');
        const data = await res.json();
        if (Array.isArray(data)) {
          setPosts(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
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
            <button onClick={() => setView("list")} className="retro-link">[ 게시글 목록 ]</button>
            <button onClick={() => setView("mindmap")} className="retro-link">[ 마인드맵 뷰 ]</button>
            <a href="https://chatgpts.kr" target="_blank" rel="noreferrer" className="retro-link">[ 새 글 작성 ]</a>
          </div>
        </section>
      )}

      {view === "list" && (
        <section className="retro-container !m-0 !max-w-[800px] w-full max-h-[80vh] flex flex-col">
          <div className="status-bar">
            <span>BOARD: POST_LIST</span>
            <span>COUNT: {posts.length}</span>
            <button onClick={() => setView("intro")} className="text-[#b2ffb2] hover:underline">[ 뒤로가기 ]</button>
          </div>
          
          <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
            {loading ? (
              <div className="p-4 text-center">DATA_FETCHING...</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#b2ffb2]/30 text-[0.8rem]">
                    <th className="py-2 px-1 w-12">[ NO ]</th>
                    <th className="py-2 px-1">[ TITLE ]</th>
                    <th className="py-2 px-1 w-24 text-right">[ CAT ]</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post, idx) => (
                    <tr key={idx} className="border-b border-[#b2ffb2]/10 hover:bg-[#b2ffb2]/5 group cursor-pointer">
                      <td className="py-2 px-1 text-[0.8rem] opacity-60">{posts.length - idx}</td>
                      <td className="py-2 px-1">
                        <a href={post.link} target="_blank" rel="noreferrer" className="block group-hover:underline truncate max-w-[300px] sm:max-w-md">
                          {post.title}
                        </a>
                      </td>
                      <td className="py-2 px-1 text-right text-[0.75rem] opacity-60">{post.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          <div className="mt-4 flex gap-2">
            <button onClick={() => setView("mindmap")} className="retro-link">[ 마인드맵 전환 ]</button>
            <button onClick={() => setView("intro")} className="retro-link">[ 홈으로 ]</button>
          </div>
        </section>
      )}

      {view === "mindmap" && (
        <div className="fixed inset-0 z-50 bg-[#181a1c] flex flex-col">
          <div className="p-4 flex justify-between items-center border-b border-[#b2ffb2]/30">
            <span className="text-[0.9rem]">MODE: INTERACTIVE_MINDMAP</span>
            <button onClick={() => setView("intro")} className="retro-link !m-0 !py-1">[ EXIT ]</button>
          </div>
          <div className="flex-1 relative">
            <Mindmap />
          </div>
        </div>
      )}
    </main>
  );
}
