"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap } from "lucide-react"

export function Mindmap() {
  const [nodes, setNodes] = useState<any[]>([])
  const [radius] = useState(220)
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

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
            label: cat,
            angle: (index * (360 / categories.length)),
            size: 110,
            color: index % 2 === 0 ? "primary" : "accent",
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

  return (
    <section id="mindmap" className="relative py-20 bg-background overflow-hidden min-h-[95vh] flex flex-col justify-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm tracking-widest uppercase flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 animate-pulse text-yellow-400" />
            {"// Neural Network"}
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-6xl font-bold mt-4 leading-tight">
            Explore <span className="text-primary italic">Ye-rin&apos;s</span> Universe
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg leading-relaxed">
            Click a category to expand its nodes. Drag to reorganize your thoughts.
          </p>
        </div>

        <div className="relative h-[750px] w-full glass rounded-[3rem] overflow-hidden border border-border/50 shadow-2xl bg-gradient-to-br from-transparent via-primary/5 to-accent/5">
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
              {nodes.map((node) => {
                const rad = (node.angle * Math.PI) / 180
                const x = Math.cos(rad) * radius
                const y = Math.sin(rad) * radius
                return (
                  <React.Fragment key={`lines-${node.id}`}>
                    <line
                      x1="50%" y1="50%"
                      x2={`calc(50% + ${x}px)`} y2={`calc(50% + ${y}px)`}
                      stroke="url(#lineGradient)" strokeWidth="1.5" strokeDasharray="5,5"
                    >
                      <animate attributeName="stroke-dashoffset" from="100" to="0" dur="15s" repeatCount="indefinite" />
                    </line>
                    {expandedCategoryId === node.id && node.posts && node.posts.slice(0, 8).map((post: any, i: number) => {
                      const subAngle = node.angle - 40 + (i * (80 / Math.min(node.posts.length, 8)))
                      const subRad = (subAngle * Math.PI) / 180
                      const subX = Math.cos(subRad) * (radius + 140)
                      const subY = Math.sin(subRad) * (radius + 140)
                      return (
                        <line
                          key={`subline-${i}`}
                          x1={`calc(50% + ${x}px)`} y1={`calc(50% + ${y}px)`}
                          x2={`calc(50% + ${subX}px)`} y2={`calc(50% + ${subY}px)`}
                          stroke="oklch(0.65 0.28 300)" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="2,2"
                        />
                      )
                    })}
                  </React.Fragment>
                )
              })}
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-36 h-36 rounded-full bg-background/40 border-2 border-primary/50 backdrop-blur-2xl flex flex-col items-center justify-center shadow-[0_0_50px_rgba(var(--primary-rgb),0.1)]"
              >
                <span className="font-[family-name:var(--font-playfair)] font-bold text-primary text-2xl tracking-tighter">ZOZIGI</span>
                <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mt-1 opacity-50">Core</span>
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
                      whileHover={{ scale: 1.1, zIndex: 40 }}
                      className="absolute left-1/2 top-1/2 z-20"
                      style={{ marginLeft: -node.size / 2, marginTop: -node.size / 2 }}
                    >
                      <button
                        onClick={() => handleNodeClick(node)}
                        className={`flex flex-col items-center justify-center rounded-full border-2 shadow-xl backdrop-blur-md transition-all duration-300 ${
                          expandedCategoryId === node.id 
                            ? "bg-primary/40 border-primary text-white scale-110 shadow-primary/20" 
                            : node.color === "primary" ? "bg-primary/10 border-primary/40 text-primary" : "bg-accent/10 border-accent/40 text-accent"
                        }`}
                        style={{ width: node.size, height: node.size }}
                      >
                        <span className="font-bold text-[11px] text-center px-2 leading-tight">{node.label}</span>
                        <span className="text-[8px] opacity-60 mt-1">{node.posts?.length} posts</span>
                      </button>
                    </motion.div>
                    {expandedCategoryId === node.id && node.posts && node.posts.slice(0, 8).map((post: any, i: number) => {
                      const subAngle = node.angle - 40 + (i * (80 / Math.min(node.posts.length, 8)))
                      const subRad = (subAngle * Math.PI) / 180
                      const subX = Math.cos(subRad) * (radius + 140)
                      const subY = Math.sin(subRad) * (radius + 140)
                      const subSize = 85
                      return (
                        <motion.div
                          key={`post-${i}`}
                          initial={{ opacity: 0, scale: 0, x, y }}
                          animate={{ opacity: 1, scale: 1, x: subX, y: subY }}
                          exit={{ opacity: 0, scale: 0, x, y }}
                          whileHover={{ scale: 1.1, zIndex: 50 }}
                          className="absolute left-1/2 top-1/2 z-10"
                          style={{ marginLeft: -subSize / 2, marginTop: -subSize / 2 }}
                        >
                          <a
                            href={post.link} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center rounded-full bg-background/90 border border-border/50 text-muted-foreground text-[10px] font-medium text-center px-3 hover:border-accent hover:text-accent shadow-2xl transition-all overflow-hidden leading-tight"
                            style={{ width: subSize, height: subSize }}
                          >
                            {post.title.length > 30 ? post.title.substring(0, 30) + '...' : post.title}
                          </a>
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
