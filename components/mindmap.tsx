"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"

const initialNodes = [
  { id: 1, label: "TOEIC", angle: 200, size: 56 },
  { id: 2, label: "Language", angle: 260, size: 56 },
  { id: 3, label: "Comedy", angle: 320, size: 56 },
  { id: 4, label: "Lab", angle: 20, size: 56 },
]

export function Mindmap() {
  const [nodes, setNodes] = useState(initialNodes)
  const [radius, setRadius] = useState(120)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  function updateNode(id: number, patch: Partial<typeof initialNodes[0]>) {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)))
  }

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-accent font-mono text-sm tracking-widest uppercase">
            {"// Content Map"}
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold mt-4">
            Explore the Site as a <span className="text-primary">Mindmap</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="relative bg-transparent h-[520px] rounded-2xl flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center font-mono text-sm text-primary">
                  zozigi.com
                </div>
              </div>

              {/* nodes */}
              {nodes.map((node) => {
                const rad = (node.angle * Math.PI) / 180
                const x = Math.cos(rad) * radius
                const y = Math.sin(rad) * radius
                const size = node.size

                return (
                  <motion.div
                    key={node.id}
                    export function Mindmap() {
                      const [nodes, setNodes] = useState(initialNodes)
                      const [radius, setRadius] = useState(120)
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
                        setRadius(Math.min(Math.max(newRadius, 50), 300))
                      }

                      return (
                        <section className="relative py-6">
                          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-8">
                              <span className="text-accent font-mono text-sm tracking-widest uppercase">{"// Content Map"}</span>
                              <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold mt-4">
                                Explore the Site as a <span className="text-primary">Mindmap</span>
                              </h2>
                            </div>

                            <div className="relative bg-transparent h-[68vh] rounded-2xl flex items-center justify-center">
                              <div ref={containerRef} className="relative w-full h-full">
                                {/* center */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                  <div className="w-28 h-28 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center font-mono text-sm text-primary">
                                    zozigi.com
                                  </div>
                                </div>

                                {/* nodes */}
                                {nodes.map((node) => {
                                  const rad = (node.angle * Math.PI) / 180
                                  const x = Math.cos(rad) * radius
                                  const y = Math.sin(rad) * radius
                                  const size = node.size

                                  return (
                                    <motion.div
                                      key={node.id}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: node.id * 0.05 }}
                                      className="absolute"
                                      style={{
                                        left: "50%",
                                        top: "50%",
                                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                                      }}
                                    >
                                      <motion.button
                                        drag
                                        dragMomentum={false}
                                        dragConstraints={containerRef}
                                        onDragEnd={(e, info) => handleDragEnd(e, info, node.id)}
                                        className={`flex items-center justify-center rounded-full bg-accent/10 border border-accent/30 text-accent shadow-sm hover:scale-105 focus:outline-none transition-transform`}
                                        style={{ width: size, height: size }}
                                      >
                                        <span className="font-mono text-xs">{node.label}</span>
                                      </motion.button>
                                    </motion.div>
                                  )
                                })}
                              </div>
                            </div>

                            <div className="mt-6">
                              <div className="glass rounded-2xl p-6 max-w-3xl mx-auto text-center">
                                <h3 className="font-semibold mb-2">Interact</h3>
                                <p className="text-sm text-muted-foreground">노드를 직접 끌어 위치를 조정하세요. 드래그로 각도와 거리를 변경하면 맵이 즉시 반영됩니다.</p>
                              </div>
                            </div>
                          </div>
                        </section>
                      )
                    }
                            <input
                              type="range"
                              min={0}
                              max={360}
                              value={node.angle}
                              onChange={(e) => updateNode(node.id, { angle: Number(e.target.value) })}
                              className="w-full mt-2"
                            />
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold mb-2">Tips</h3>
              <p className="text-sm text-muted-foreground">
                클릭하여 노드를 선택한 뒤, 사이즈와 각도를 조정해보세요. 반지름을 변경하면 전체 레이아웃이 확장/축소됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Mindmap
