"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Maximize2, Minimize2, Zap } from "lucide-react"

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

  function addNode() {
    const id = Date.now()
    const labels = ["Insight", "New Idea", "Project", "Archive", "Secret"]
    const label = labels[Math.floor(Math.random() * labels.length)]
    const newNode = {
      id,
      label: `${label} #${nodes.length + 1}`,
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
                    <div className="relative group cursor-grab active:cursor-grabbing">
                      {/* Node Body */}
                      <motion.div 
                        animate={{ 
                          borderWidth: [2, 4, 2],
                          borderColor: node.color === "primary" ? ["rgba(var(--primary-rgb), 0.4)", "rgba(var(--primary-rgb), 0.8)", "rgba(var(--primary-rgb), 0.4)"] : ["rgba(var(--accent-rgb), 0.4)", "rgba(var(--accent-rgb), 0.8)", "rgba(var(--accent-rgb), 0.4)"]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className={`flex flex-col items-center justify-center rounded-full shadow-2xl backdrop-blur-xl transition-all duration-500 overflow-hidden ${
                          node.color === "primary" 
                            ? "bg-primary/10 text-primary" 
                            : "bg-accent/10 text-accent"
                        }`}
                        style={{ width: node.size, height: node.size }}
                      >
                        <span className="font-bold text-sm text-center px-2 leading-tight">{node.label}</span>
                        {/* Internal "Current" animation */}
                        <motion.div 
                          animate={{ 
                            opacity: [0.1, 0.3, 0.1],
                            scale: [0.8, 1.2, 0.8]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-current opacity-5 pointer-events-none rounded-full"
                        />
                      </motion.div>

                      {/* Resize Controls (Visible on hover) */}
                      <div className="absolute -top-2 -right-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                        <button 
                          onClick={(e) => { e.stopPropagation(); updateNode(node.id, { size: Math.min(node.size + 10, 150) }) }}
                          className="p-1.5 bg-background/80 border border-border rounded-full hover:bg-primary/20 hover:text-primary transition-colors shadow-lg"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); updateNode(node.id, { size: Math.max(node.size - 10, 60) }) }}
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
