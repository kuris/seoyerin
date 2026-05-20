"use client"

import React, { useState, useRef } from "react"
import { motion } from "framer-motion"

const initialNodes = [
  { id: 1, label: "TOEIC", angle: 200, size: 90, color: "primary" },
  { id: 2, label: "Language", angle: 260, size: 90, color: "accent" },
  { id: 3, label: "Comedy", angle: 320, size: 90, color: "primary" },
  { id: 4, label: "Lab", angle: 20, size: 90, color: "accent" },
]

export function Mindmap() {
  const [nodes, setNodes] = useState(initialNodes)
  const [radius, setRadius] = useState(180)
  const containerRef = useRef<HTMLDivElement | null>(null)

  function updateNode(id: number, patch: Partial<typeof initialNodes[0]>) {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)))
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
    setRadius(Math.min(Math.max(newRadius, 80), 300))
  }

  return (
    <section id="mindmap" className="relative py-20 bg-background overflow-hidden min-h-[90vh] flex flex-col justify-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm tracking-widest uppercase">
            {"// Interactive Map"}
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-6xl font-bold mt-4 leading-tight">
            Explore <span className="text-primary italic">Ye-rin&apos;s</span> Universe
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg leading-relaxed">
            Drag the nodes to reorganize the world. Click a node to dive into the content.
          </p>
        </div>

        <div className="relative h-[650px] w-full glass rounded-[2.5rem] overflow-hidden border border-border/50 shadow-2xl bg-gradient-to-b from-transparent to-muted/10">
          <div ref={containerRef} className="relative w-full h-full touch-none select-none">
            
            {/* Center Node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  filter: ["blur(0px)", "blur(1px)", "blur(0px)"]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-40 h-40 rounded-full bg-primary/10 border-2 border-primary/30 backdrop-blur-xl flex items-center justify-center shadow-[0_0_80px_rgba(var(--primary),0.15)]"
              >
                <div className="text-center">
                  <span className="block font-[family-name:var(--font-playfair)] font-bold text-primary text-2xl tracking-tight">ZOZIGI</span>
                  <span className="block text-[11px] font-mono text-muted-foreground uppercase tracking-[0.2em] mt-1 opacity-60">Center</span>
                </div>
              </motion.div>
            </div>

            {/* Draggable Nodes */}
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
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    x: x,
                    y: y
                  }}
                  whileHover={{ scale: 1.1, zIndex: 30 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute left-1/2 top-1/2 z-20 cursor-grab active:cursor-grabbing"
                  style={{ 
                    marginLeft: -node.size / 2,
                    marginTop: -node.size / 2,
                  }}
                >
                  <div 
                    className={`flex flex-col items-center justify-center rounded-full border-2 shadow-2xl backdrop-blur-md transition-all duration-500 ${
                      node.color === "primary" 
                        ? "bg-primary/20 border-primary/40 text-primary hover:border-primary hover:bg-primary/30" 
                        : "bg-accent/20 border-accent/40 text-accent hover:border-accent hover:bg-accent/30"
                    }`}
                    style={{ width: node.size, height: node.size }}
                  >
                    <span className="font-bold text-sm sm:text-base tracking-tight">{node.label}</span>
                    <div className="w-1 h-1 rounded-full bg-current mt-1 opacity-40 animate-pulse" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
