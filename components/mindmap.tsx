"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Cpu, Maximize, Minimize, LayoutGrid, Network, Layers } from "lucide-react"
import { playSound } from "../lib/sound"

type ViewMode = "CYBER" | "TRADITIONAL" | "CLASSIC";

export function Mindmap() {
  const [nodes, setNodes] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("CYBER")
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const radius = isMobile ? 110 : 250

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      wrapperRef.current?.requestFullscreen().catch((err: any) => {
        console.error(`Error: ${err.message}`);
      })
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      window.removeEventListener('resize', checkMobile)
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  function cleanTitle(title: string) {
    if (!title) return "";
    let cleaned = title.replace(/&[a-z0-9#]+;/gi, ' ');
    cleaned = cleaned.replace(/#[^\s#]+/g, '');
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    if (!cleaned || cleaned.length < 2) {
      const firstTag = title.match(/#([^\s#]+)/);
      return firstTag ? firstTag[1].substring(0, 20) : "SYSTEM_ERROR";
    }
    return cleaned.length > 25 ? cleaned.substring(0, 25).toUpperCase() : cleaned.toUpperCase();
  }

  useEffect(() => {
    async function fetchRSS() {
      try {
        const response = await fetch('/api/rss')
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          const categories = Array.from(new Set(data.map((item: any) => item.category)))
          const categoryNodes = categories.map((cat: any, index: number) => {
            const postsInCategory = data.filter((p: any) => p.category === cat);
            const postCount = postsInCategory.length;
            const baseSize = isMobile ? 75 : 100;
            const dynamicSize = Math.min(baseSize + (postCount * (isMobile ? 2 : 5)), isMobile ? 110 : 160);
            return {
              id: `cat-${cat}`,
              type: 'category',
              label: cleanTitle(cat),
              angle: (index * (360 / categories.length)),
              size: dynamicSize,
              color: index % 2 === 0 ? "#00f3ff" : "#ff00ff",
              posts: postsInCategory
            };
          })
          setNodes(categoryNodes)
          // 마인드맵 최초 로딩시 사운드
          playSound('mechanical');
        }
      } catch (err) {
        console.error("Failed RSS fetch:", err)
      }
    }
    fetchRSS()
  }, [isMobile])

  function handleNodeClick(node: any) {
    if (node.type === 'category') {
      setExpandedCategoryId((prev: any) => {
        const isExpanding = prev !== node.id;
        playSound(isExpanding ? 'typewriter' : 'click');
        return isExpanding ? node.id : null;
      });
    } else {
      playSound('click');
    }
  }

  function handleDragEnd(e: any, info: any, nodeId: string) {
    if (isMobile || viewMode === "TRADITIONAL") return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = info.point.x - centerX
    const dy = info.point.y - centerY
    const newAngle = (Math.atan2(dy, dx) * 180) / Math.PI
    const normAngle = ((newAngle % 360) + 360) % 360
    setNodes((prev: any[]) => prev.map((n: any) => (n.id === nodeId ? { ...n, angle: Math.round(normAngle) } : n)))
  }

  const glitchVariants = {
    hover: {
      x: [0, -2, 2, -1, 0],
      y: [0, 1, -1, 2, 0],
      filter: ["hue-rotate(0deg) brightness(1.2)", "hue-rotate(90deg) brightness(1.5)", "hue-rotate(-90deg) brightness(0.8)", "hue-rotate(0deg) brightness(1.2)"],
      transition: { duration: 0.2, repeat: Infinity }
    }
  }

  const getPosition = (node: any, index: number, total: number) => {
    if (viewMode === "TRADITIONAL") {
      const spacing = isMobile ? 80 : 120;
      const x = isMobile ? -100 : -300;
      const y = (index - (total - 1) / 2) * spacing;
      return { x, y };
    }
    const rad = (node.angle * Math.PI) / 180
    return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
  }

  return (
    <section ref={wrapperRef} id="mindmap" className="relative py-10 md:py-20 bg-black overflow-hidden min-h-screen flex flex-col justify-center font-mono">
      {viewMode !== "TRADITIONAL" && (
        <>
          <div className="absolute inset-0 opacity-20 pointer-events-none" 
               style={{ backgroundImage: `linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)`, backgroundSize: isMobile ? '20px 20px' : '40px 40px' }} />
          <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute left-0 right-0 h-[2px] bg-cyan-500/20 shadow-[0_0_15px_rgba(0,243,255,0.5)] z-0 pointer-events-none" />
        </>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="text-center mb-8 md:mb-12">
          <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-8">
            <button onClick={() => setViewMode("CYBER")} className={`flex items-center gap-2 px-3 md:px-4 py-2 border text-[10px] md:text-xs tracking-widest transition-all ${viewMode === "CYBER" ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_15px_rgba(0,243,255,0.5)]" : "border-cyan-900 text-cyan-900 hover:border-cyan-500 hover:text-cyan-500"}`}>
              <Network className="w-3 h-3 md:w-4 md:h-4" /> CYBER
            </button>
            <button onClick={() => setViewMode("TRADITIONAL")} className={`flex items-center gap-2 px-3 md:px-4 py-2 border text-[10px] md:text-xs tracking-widest transition-all ${viewMode === "TRADITIONAL" ? "bg-white border-white text-black shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "border-gray-800 text-gray-800 hover:border-gray-400 hover:text-gray-400"}`}>
              <Layers className="w-3 h-3 md:w-4 md:h-4" /> TREE
            </button>
            <button onClick={() => setViewMode("CLASSIC")} className={`flex items-center gap-2 px-3 md:px-4 py-2 border text-[10px] md:text-xs tracking-widest transition-all ${viewMode === "CLASSIC" ? "bg-[#ff00ff] border-[#ff00ff] text-black shadow-[0_0_15px_rgba(255,0,255,0.5)]" : "border-magenta-900 text-magenta-900 hover:border-magenta-500 hover:text-magenta-500"}`} style={viewMode === "CLASSIC" ? { backgroundColor: '#ff00ff', borderColor: '#ff00ff' } : { color: '#ff00ff', borderColor: '#4a004a' }}>
              <LayoutGrid className="w-3 h-3 md:w-4 md:h-4" /> CLASSIC
            </button>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyan-500/50 text-cyan-500 text-[8px] md:text-[10px] tracking-[0.3em] uppercase mb-4 bg-cyan-500/5">
            <Activity className="w-3 h-3 animate-pulse" />
            INTERFACE_{viewMode}
          </div>
          <h2 className="text-3xl md:text-7xl font-black text-white leading-tight tracking-tighter uppercase">
            {viewMode === "TRADITIONAL" ? "Knowledge Tree" : "SEO YERIN'S SECRET LAB"}
          </h2>
        </div>

        <div className={`relative ${isMobile ? 'h-[600px]' : 'h-[800px]'} w-full border-[2px] md:border-[3px] ${viewMode === "TRADITIONAL" ? 'border-gray-800 bg-gray-900/20' : 'border-cyan-900/50 bg-black/40'} backdrop-blur-sm overflow-hidden group shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]`}>
          <div className="absolute top-0 left-0 w-4 md:w-8 h-4 md:h-8 border-t-2 md:border-t-4 border-l-2 md:border-l-4 border-cyan-500" />
          <div className="absolute top-0 right-0 w-4 md:w-8 h-4 md:h-8 border-t-2 md:border-t-4 border-r-2 md:border-r-4 border-cyan-500" />
          <div className="absolute bottom-0 left-0 w-4 md:w-8 h-4 md:h-8 border-b-2 md:border-b-4 border-l-2 md:border-l-4 border-[#ff00ff]" />
          <div className="absolute bottom-0 right-0 w-4 md:w-8 h-4 md:h-8 border-b-2 md:border-b-4 border-r-2 md:border-r-4 border-[#ff00ff]" />

          <button onClick={toggleFullscreen} className="absolute top-4 md:top-6 right-4 md:right-6 z-50 p-2 border border-cyan-500/30 bg-black/60 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all">
            {isFullscreen ? <Minimize className="w-4 h-4 md:w-5 md:h-5" /> : <Maximize className="w-4 h-4 md:w-5 md:h-5" />}
          </button>

          <div ref={containerRef} className="relative w-full h-full touch-none select-none">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="oklch(0.65 0.28 300)" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="oklch(0.65 0.28 300)" stopOpacity="0.4">
                    <animate attributeName="offset" values="0;1;0" dur="4s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor="oklch(0.65 0.28 300)" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {nodes.map((node, index) => {
                const pos = getPosition(node, index, nodes.length);
                const x = pos.x;
                const y = pos.y;
                return (
                  <React.Fragment key={`lines-${node.id}`}>
                    {viewMode === "TRADITIONAL" ? (
                      <path d={`M ${isMobile ? '30%' : '20%'} 50% Q ${isMobile ? '40%' : '35%'} ${50 + (y/700)*100}% calc(50% + ${x}px) calc(50% + ${y}px)`} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                    ) : (
                      <path d={viewMode === "CYBER" ? `M 50% 50% L calc(50% + ${x}px) 50% L calc(50% + ${x}px) calc(50% + ${y}px)` : `M 50% 50% L calc(50% + ${x}px) calc(50% + ${y}px)`} fill="none" stroke={node.color} strokeWidth={isMobile ? "1" : "2"} strokeOpacity="0.3" strokeDasharray={viewMode === "CYBER" ? "10,5" : "0"}>
                        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="5s" repeatCount="indefinite" />
                      </path>
                    )}
                    {expandedCategoryId === node.id && node.posts && node.posts.slice(0, 5).map((post: any, i: number) => {
                      const isLeftSide = x < 0;
                      const offset = isMobile ? 150 : (isFullscreen ? 550 : 420);
                      const subX = viewMode === "TRADITIONAL" ? (isMobile ? 120 : 300) : (isLeftSide ? -offset : offset);
                      const subY = viewMode === "TRADITIONAL" ? y + (i - 2) * (isMobile ? 50 : 100) : (isMobile ? -100 : -250) + (i * (isMobile ? 50 : 100));
                      return (
                        <path key={`subpath-${i}`} d={viewMode === "CYBER" ? `M calc(50% + ${x}px) calc(50% + ${y}px) L calc(50% + ${subX}px) calc(50% + ${y}px) L calc(50% + ${subX}px) calc(50% + ${subY}px)` : `M calc(50% + ${x}px) calc(50% + ${y}px) L calc(50% + ${subX}px) calc(50% + ${subY}px)`} fill="none" stroke={node.color} strokeWidth="1" strokeOpacity="0.2" strokeDasharray="4,4" />
                      )
                    })}
                  </React.Fragment>
                )
              })}
            </svg>
            {viewMode !== "TRADITIONAL" && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                <motion.div animate={{ borderColor: ["#00f3ff", "#ff00ff", "#00f3ff"], boxShadow: isMobile ? ["0 0 10px #00f3ff", "0 0 20px #ff00ff", "0 0 10px #00f3ff"] : ["0 0 20px #00f3ff", "0 0 40px #ff00ff", "0 0 20px #00f3ff"] }} transition={{ duration: 4, repeat: Infinity }} className={`${isMobile ? 'w-20 h-20' : 'w-40 h-40'} bg-black border-2 md:border-4 flex flex-col items-center justify-center relative overflow-hidden ${viewMode === "CLASSIC" ? "rounded-full" : ""}`}>
                  <Cpu className={`${isMobile ? 'w-4 h-4' : 'w-8 h-8'} text-cyan-400 mb-1`} />
                  <span className={`font-black text-white ${isMobile ? 'text-[10px]' : 'text-3xl'} tracking-tighter`}>ZOZIGI</span>
                </motion.div>
              </div>
            )}
            <AnimatePresence>
              {nodes.map((node, index) => {
                const pos = getPosition(node, index, nodes.length);
                const x = pos.x;
                const y = pos.y;
                return (
                  <React.Fragment key={node.id}>
                    <motion.div drag={!isMobile && viewMode !== "TRADITIONAL"} dragMomentum={false} dragConstraints={containerRef} onDragEnd={(e, info) => handleDragEnd(e, info, node.id)} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1, x, y }} whileHover={isMobile ? {} : "hover"} className="absolute left-1/2 top-1/2 z-20" style={{ marginLeft: -node.size / 2, marginTop: -node.size / 2 }}>
                      <motion.button variants={isMobile ? {} : glitchVariants} onClick={() => handleNodeClick(node)} className={`w-full h-full flex flex-col items-center justify-center border-2 bg-black/80 relative transition-all duration-300 overflow-hidden ${viewMode === "CLASSIC" ? "rounded-full" : ""} ${expandedCategoryId === node.id ? "border-white shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-110" : ""}`} style={{ width: node.size, height: node.size, borderColor: node.color, boxShadow: `0 0 8px ${node.color}44` }}>
                        <span className={`${isMobile ? 'text-[8px]' : 'text-[10px]'} font-bold text-center px-1 leading-tight text-white`}>{node.label}</span>
                      </motion.button>
                    </motion.div>
                    {expandedCategoryId === node.id && node.posts && node.posts.slice(0, 5).map((post: any, i: number) => {
                      const isLeftSide = x < 0;
                      const offset = isMobile ? 150 : (isFullscreen ? 550 : 420);
                      const subX = viewMode === "TRADITIONAL" ? (isMobile ? 120 : 300) : (isLeftSide ? -offset : offset);
                      const subY = viewMode === "TRADITIONAL" ? y + (i - 2) * (isMobile ? 50 : 100) : (isMobile ? -100 : -250) + (i * (isMobile ? 50 : 100));
                      const subSize = isMobile ? 65 : 110
                      return (
                        <motion.div key={`post-${i}`} initial={{ opacity: 0, scale: 0, x, y }} animate={{ opacity: 1, scale: 1, x: subX, y: subY }} exit={{ opacity: 0, scale: 0, x, y }} whileHover={isMobile ? {} : "hover"} className="absolute left-1/2 top-1/2 z-10" style={{ marginLeft: -subSize / 2, marginTop: -subSize / 2 }}>
                          <motion.a variants={isMobile ? {} : glitchVariants} href={post.link} target="_blank" rel="noopener noreferrer" className={`w-full h-full flex flex-col items-center justify-center border bg-black/90 p-1 md:p-2 border-cyan-500/30 hover:border-cyan-400 shadow-xl transition-all overflow-hidden ${viewMode === "CLASSIC" ? "rounded-full" : ""}`} style={{ width: subSize, height: subSize }}>
                            <span className={`text-white ${isMobile ? 'text-[7px]' : 'text-[9px]'} font-medium text-center leading-tight uppercase`}>{cleanTitle(post.title)}</span>
                          </motion.a>
                        </motion.div>
                      )
                    })}
                  </React.Fragment>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
