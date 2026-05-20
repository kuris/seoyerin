"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Cpu, Terminal } from "lucide-react"

export function Mindmap() {
  const [nodes, setNodes] = useState<any[]>([])
  const [radius] = useState(250)
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

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
          const categoryNodes = categories.map((cat: any, index: number) => ({
            id: `cat-${cat}`,
            type: 'category',
            label: cleanTitle(cat),
            angle: (index * (360 / categories.length)),
            size: 120,
            color: index % 2 === 0 ? "#00f3ff" : "#ff00ff",
            posts: data.filter((p: any) => p.category === cat)
          }))
          setNodes(categoryNodes)
        }
      } catch (err) {
        console.error("Failed to load RSS:", err)
      }
    }
    fetchRSS()
  }, [])

  function handleNodeClick(node: any) {
    if (node.type === 'category') {
      setExpandedCategoryId(prev => prev === node.id ? null : node.id)
    }
  }

  function handleDragEnd(e: any, info: any, nodeId: string) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = info.point.x - centerX
    const dy = info.point.y - centerY
    const newAngle = (Math.atan2(dy, dx) * 180) / Math.PI
    const normAngle = ((newAngle % 360) + 360) % 360
    setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, angle: Math.round(normAngle) } : n)))
  }

  const glitchVariants = {
    hover: {
      x: [0, -2, 2, -1, 0],
      y: [0, 1, -1, 2, 0],
      filter: [
        "hue-rotate(0deg) brightness(1)",
        "hue-rotate(90deg) brightness(1.2)",
        "hue-rotate(-90deg) brightness(0.8)",
        "hue-rotate(0deg) brightness(1)"
      ],
      transition: { duration: 0.2, repeat: Infinity }
    }
  }

  return (
    <section id="mindmap" className="relative py-20 bg-black overflow-hidden min-h-screen flex flex-col justify-center font-mono">
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <motion.div 
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[2px] bg-cyan-500/20 shadow-[0_0_15px_rgba(0,243,255,0.5)] z-0 pointer-events-none"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyan-500/50 text-cyan-500 text-[10px] tracking-[0.3em] uppercase mb-4 bg-cyan-500/5">
            <Activity className="w-3 h-3 animate-pulse" />
            LIVE_FEED_ESTABLISHED
          </div>
          <h2 className="text-4xl sm:text-7xl font-black text-white leading-tight tracking-tighter">
            <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]">CYBER</span>_CORE
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-xs uppercase tracking-widest leading-relaxed">
            Interfacing with decentralized data nodes. Drag to reroute connections.
          </p>
        </div>

        <div className="relative h-[800px] w-full border-[3px] border-cyan-900/50 bg-black/40 backdrop-blur-sm overflow-hidden group shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-500" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-500" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#ff00ff]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#ff00ff]" />

          <div ref={containerRef} className="relative w-full h-full touch-none select-none">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {nodes.map((node) => {
                const rad = (node.angle * Math.PI) / 180
                const x = Math.cos(rad) * radius
                const y = Math.sin(rad) * radius
                return (
                  <React.Fragment key={`lines-${node.id}`}>
                    <path
                      d={`M 50% 50% L calc(50% + ${x}px) 50% L calc(50% + ${x}px) calc(50% + ${y}px)`}
                      fill="none" stroke={node.color} strokeWidth="2" strokeOpacity="0.3" strokeDasharray="10,5"
                    >
                      <animate attributeName="stroke-dashoffset" from="100" to="0" dur="5s" repeatCount="indefinite" />
                    </path>
                    {expandedCategoryId === node.id && node.posts && node.posts.slice(0, 6).map((post: any, i: number) => {
                      const subAngle = node.angle - 45 + (i * (90 / Math.min(node.posts.length, 6)))
                      const subRad = (subAngle * Math.PI) / 180
                      const subX = Math.cos(subRad) * (radius + 150)
                      const subY = Math.sin(subRad) * (radius + 150)
                      return (
                        <path
                          key={`subpath-${i}`}
                          d={`M calc(50% + ${x}px) calc(50% + ${y}px) L calc(50% + ${subX}px) calc(50% + ${y}px) L calc(50% + ${subX}px) calc(50% + ${subY}px)`}
                          fill="none" stroke={node.color} strokeWidth="1" strokeOpacity="0.2" strokeDasharray="4,4"
                        />
                      )
                    })}
                  </React.Fragment>
                )
              })}
            </svg>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
              <motion.div
                animate={{ 
                  borderColor: ["#00f3ff", "#ff00ff", "#00f3ff"],
                  boxShadow: ["0 0 20px #00f3ff", "0 0 40px #ff00ff", "0 0 20px #00f3ff"]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-40 h-40 bg-black border-4 flex flex-col items-center justify-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-cyan-500/5 animate-pulse" />
                <Cpu className="w-8 h-8 text-cyan-400 mb-2" />
                <span className="font-black text-white text-3xl tracking-tighter">ZOZIGI</span>
                <div className="text-[8px] text-cyan-500 font-bold bg-cyan-500/10 px-2 py-0.5 mt-2 border border-cyan-500/50">
                  CORE_MODULE: ACTIVE
                </div>
              </motion.div>
            </div>

            <AnimatePresence>
              {nodes.map((node) => {
                const rad = (node.angle * Math.PI) / 180
                const x = Math.cos(rad) * radius
                const y = Math.sin(rad) * radius
                return (
                  <React.Fragment key={node.id}>
                    <motion.div
                      drag dragMomentum={false} dragConstraints={containerRef}
                      onDragEnd={(e, info) => handleDragEnd(e, info, node.id)}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1, x, y }}
                      whileHover="hover"
                      className="absolute left-1/2 top-1/2 z-20"
                      style={{ marginLeft: -node.size / 2, marginTop: -node.size / 2 }}
                    >
                      <motion.button
                        variants={glitchVariants}
                        onClick={() => handleNodeClick(node)}
                        className={`w-full h-full flex flex-col items-center justify-center border-2 bg-black/80 relative transition-all duration-300 overflow-hidden ${
                          expandedCategoryId === node.id ? "border-white shadow-[0_0_30px_rgba(255,255,255,0.5)] scale-110" : ""
                        }`}
                        style={{ width: node.size, height: node.size, borderColor: node.color, boxShadow: `0 0 15px ${node.color}44` }}
                      >
                        <div className="absolute top-1 left-1 w-1 h-1 bg-white opacity-50" />
                        <div className="absolute bottom-1 right-1 w-1 h-1 bg-white opacity-50" />
                        <Terminal className="w-4 h-4 mb-1 opacity-70" style={{ color: node.color }} />
                        <span className="font-bold text-[10px] text-center px-1 leading-tight text-white">{node.label}</span>
                        <div className="text-[7px] mt-1 opacity-50 text-white">NODES: {node.posts?.length}</div>
                      </motion.button>
                    </motion.div>
                    {expandedCategoryId === node.id && node.posts && node.posts.slice(0, 6).map((post: any, i: number) => {
                      const subAngle = node.angle - 45 + (i * (90 / Math.min(node.posts.length, 6)))
                      const subRad = (subAngle * Math.PI) / 180
                      const subX = Math.cos(subRad) * (radius + 150)
                      const subY = Math.sin(subRad) * (radius + 150)
                      const subSize = 100
                      return (
                        <motion.div
                          key={`post-${i}`}
                          initial={{ opacity: 0, scale: 0, x, y }}
                          animate={{ opacity: 1, scale: 1, x: subX, y: subY }}
                          exit={{ opacity: 0, scale: 0, x, y }}
                          whileHover="hover"
                          className="absolute left-1/2 top-1/2 z-10"
                          style={{ marginLeft: -subSize / 2, marginTop: -subSize / 2 }}
                        >
                          <motion.a
                            variants={glitchVariants}
                            href={post.link} target="_blank" rel="noopener noreferrer"
                            className="w-full h-full flex flex-col items-center justify-center border bg-black/90 p-2 border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all overflow-hidden"
                            style={{ width: subSize, height: subSize }}
                          >
                            <span className="text-[8px] text-cyan-400 font-bold mb-1 w-full text-left truncate">DATA_STRM_{i}</span>
                            <span className="text-white text-[9px] font-medium text-center leading-tight uppercase">{cleanTitle(post.title)}</span>
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
