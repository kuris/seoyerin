"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Maximize2, Minimize2, Zap } from "lucide-react"

const initialNodes = [
  { id: 1, label: "멋진 신세계 2화", angle: 200, size: 100, color: "primary", href: "https://chatgpts.kr/entry/%EB%93%9C%EB%9D%BC%EB%A7%88-%E3%80%8E%EB%A9%8B%EC%A7%84-%EC%8B%A0%EC%84%B8%EA%B3%84%E3%80%8F-2%ED%99%94-%EC%A1%B0%EC%84%A0-%EC%95%85%EB%85%80%EA%B0%80-%EC%A7%81%EC%A0%91-%EC%93%B0%EB%8A%94-%EC%9A%B4%EB%AA%85-%EC%82%AC%EC%9A%A9%EC%84%A4%EB%AA%... " },
  { id: 2, label: "K-Slang Day 1", angle: 260, size: 100, color: "accent", href: "https://chatgpts.kr/entry/K-Slang-Day-1-%ED%95%9C%EA%B8%80%EC%9D%B8-%EB%93%AF-%EC%98%81%EC%96%B4%EC%9D%B8-%EB%93%AF-%EB%87%8C%EC%97%90-%EB%B0%95%ED%9E%88%EB%8A%94-%EB%B3%91%EB%A7%9B-%ED%95%9C%EA%B5%AD%EC%96%B4-%EA%B0%9C%EC%9D%B4%EB%93%9D-%EB%85%B8%EB%8B%B5-%EB%A9%98%EB%B6%95-%EB%93%B1" },
  { id: 3, label: "Classic ZOZIGI #1", angle: 320, size: 100, color: "primary", href: "https://chatgpts.kr/entry/Classic-ZOZIGI-01%EB%B9%84%EB%8F%84-%EC%98%A4%EB%8A%94%EB%8D%B0-%EC%98%A4%EB%8A%98-%EB%AC%B8%EC%9E%A5-%ED%95%9C-%EC%A4%84%EC%97%90%EA%B0%90%EC%84%B1-%EC%A2%80-%EC%84%9E%EC%96%B4%EB%B3%BC%EA%B9%8C" },
  { id: 4, label: "병맛토익 Day 1", angle: 20, size: 100, color: "accent", href: "https://chatgpts.kr/entry/Day1-%EB%B3%91%EB%A7%9B%ED%86%A0%EC%9D%B5-%EC%96%B4%ED%94%8C%EB%A1%9C-%EC%A7%80%EC%9B%90Apply%ED%96%88%EB%8B%A4%EA%B0%80-%EC%9B%94%EA%B8%89%EC%9C%BC%EB%A1%9C-%EC%83%90%EB%9F%AC%EB%A6%ACSalary-%EB%B0%9B%EC%9D%80-%EC%8D%B0txt" },
]

export function Mindmap() {
  const [nodes, setNodes] = useState(initialNodes)
  const [radius, setRadius] = useState(180)
  const containerRef = useRef<HTMLDivElement | null>(null)

  function updateNode(id: number, patch: Partial<typeof initialNodes[0]>) {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)))
  }

  function addNode() {
    const id = Date.now()
    const pool = [
      { label: "봄날의 영어", href: "https://chatgpts.kr/entry/%EB%B4%84%EB%82%A0-%EB%8B%B9%EC%8B%A0%EC%9D%98-%EC%98%81%EC%96%B4%EB%A5%BC-%EA%BD%83%ED%94%BC%EC%9A%B8-%EC%8B%9C%EA%B0%84-%F0%9F%8C%B8" },
      { label: "전략적 결정", href: "https://chatgpts.kr/entry/div-stylemax-width850px-margin0-auto-font-familyNoto-Sans-KR-sans-serifh1-stylefont-size36px-color333-text-aligncenter-margin-bottom40px-line-height14%EC%95%BC-%EC%98%A4%EB%8A%98-%EC%98%A4%ED%9B%84-%EB%84%88-%ED%98%B9%EC%8B%9C%E2%80%A6-%EB%82%98%EB%9E%91-%EC%98%81%EC%96%B4-%EB%AC%B8%EC%9E%A5-%ED%95%98%EB%82%98-%EC%A1%B0%EC%A0%B8%EB%B3%BC-%..." }
    ]
    const item = pool[Math.floor(Math.random() * pool.length)]
    const newNode = {
      id,
      label: item.label,
      href: item.href,
      angle: Math.random() * 360,
      size: 80,
      color: Math.random() > 0.5 ? "primary" : "accent",
    }
    setNodes((prev) => [...prev, newNode])
  }

  function handleDragEnd(e: any, info: any, nodeId: number) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const dx = info.point.x - centerX
    const dy = info.point.y - centerY

    const newAngle = (Math.atan2(dy, dx) * 180) / Math.PI
    const normAngle = ((newAngle % 360) + 360) % 360
    const newRadius = Math.round(Math.sqrt(dx * dx + dy * dy))

    updateNode(nodeId, { angle: Math.round(normAngle) })
    setRadius(Math.min(Math.max(newRadius, 80), 350))
  }

  return (
    <section id="mindmap" className="relative py-20 bg-background overflow-hidden min-h-[95vh] flex flex-col justify-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm tracking-widest uppercase flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 animate-pulse text-yellow-400" />
            {"// Living System"}
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-6xl font-bold mt-4 leading-tight">
            The <span className="text-primary italic">Pulsing</span> Web
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg leading-relaxed">
            Click the center to spawn new nodes. Drag to move, use controls to resize.
            Feel the current flow through the network.
          </p>
        </div>

        <div className="relative h-[700px] w-full glass rounded-[3rem] overflow-hidden border border-border/50 shadow-2xl bg-gradient-to-br from-transparent via-primary/5 to-accent/5">
          {/* Background Animated Currents */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.1),transparent_70%)]" />
          </div>

          <div ref={containerRef} className="relative w-full h-full touch-none select-none">
            {/* SVG Layer for Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.5">
                    <animate attributeName="offset" values="0;1;0" dur="3s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {nodes.map((node) => {
                const rad = (node.angle * Math.PI) / 180
                // Simplified SVG lines pointing to center
                return (
                  <g key={`connection-${node.id}`}>
                    <line
                      x1="50%"
                      y1="50%"
                      x2={`calc(50% + ${Math.cos(rad) * radius}px)`}
                      y2={`calc(50% + ${Math.sin(rad) * radius}px)`}
                      stroke="url(#lineGradient)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    >
                        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="10s" repeatCount="indefinite" />
                    </line>
                  </g>
                )
              })}
            </svg>
            
            {/* Center Node (Click to Add) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <motion.button
                onClick={addNode}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(var(--primary-rgb), 0.2)",
                    "0 0 40px rgba(var(--primary-rgb), 0.4)",
                    "0 0 20px rgba(var(--primary-rgb), 0.2)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-44 h-44 rounded-full bg-background/40 border-2 border-primary/50 backdrop-blur-2xl flex flex-col items-center justify-center group"
              >
                <div className="relative">
                  <span className="block font-[family-name:var(--font-playfair)] font-bold text-primary text-3xl tracking-tighter group-hover:scale-110 transition-transform">ZOZIGI</span>
                  <Plus className="absolute -top-6 -right-6 w-8 h-8 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:rotate-90" />
                </div>
                <span className="block text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] mt-2 opacity-50">Click to Expand</span>
              </motion.button>
            </div>

            {/* Draggable & Resizable Nodes */}
            <AnimatePresence>
              {nodes.map((node) => {
                const rad = (node.angle * Math.PI) / 180
                const x = Math.cos(rad) * radius
                const y = Math.sin(rad) * radius

                return (
                  <motion.div
                    key={node.id}
                    drag
                    dragMomentum={false}
                    dragConstraints={containerRef}
                    onDragEnd={(e, info) => handleDragEnd(e, info, node.id)}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      x: x,
                      y: y
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    whileHover={{ zIndex: 50 }}
                    className="absolute left-1/2 top-1/2 z-20"
                    style={{ 
                      marginLeft: -node.size / 2,
                      marginTop: -node.size / 2,
                    }}
                  >
                    <div className="relative group">
                      {/* Node Body */}
                      <motion.a
                        href={node.href || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        animate={{ 
                          borderWidth: [2, 4, 2],
                          borderColor: node.color === "primary" ? ["rgba(var(--primary-rgb), 0.4)", "rgba(var(--primary-rgb), 0.8)", "rgba(var(--primary-rgb), 0.4)"] : ["rgba(var(--accent-rgb), 0.4)", "rgba(var(--accent-rgb), 0.8)", "rgba(var(--accent-rgb), 0.4)"]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className={`flex flex-col items-center justify-center rounded-full shadow-2xl backdrop-blur-xl transition-all duration-500 overflow-hidden cursor-pointer ${
                          node.color === "primary" 
                            ? "bg-primary/10 text-primary hover:bg-primary/20" 
                            : "bg-accent/10 text-accent hover:bg-accent/20"
                        }`}
                        style={{ width: node.size, height: node.size }}
                      >
                        <span className="font-bold text-[10px] sm:text-xs text-center px-2 leading-tight">{node.label}</span>
                        {/* Internal "Current" animation */}
                        <motion.div 
                          animate={{ 
                            opacity: [0.1, 0.3, 0.1],
                            scale: [0.8, 1.2, 0.8]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-current opacity-5 pointer-events-none rounded-full"
                        />
                      </motion.a>

                      {/* Resize Controls (Visible on hover) */}
                      <div className="absolute -top-2 -right-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateNode(node.id, { size: Math.min(node.size + 10, 150) }) }}
                          className="p-1.5 bg-background/80 border border-border rounded-full hover:bg-primary/20 hover:text-primary transition-colors shadow-lg"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateNode(node.id, { size: Math.max(node.size - 10, 60) }) }}
                          className="p-1.5 bg-background/80 border border-border rounded-full hover:bg-accent/20 hover:text-accent transition-colors shadow-lg"
                        >
                          <Minimize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
