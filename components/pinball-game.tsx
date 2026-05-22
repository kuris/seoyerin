"use client"

import React, { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'
import { playSound } from '@/lib/sound'

export function PinballGame() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [msg, setMsg] = useState("경쾌한 타격감을 느껴보세요! ㅋㅋㅋ")
  const engineRef = useRef<Matter.Engine | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const { Engine, Render, Runner, Bodies, Composite, Body, Events } = Matter
    const container = containerRef.current
    const viewWidth = container.clientWidth
    const viewHeight = 500

    const engine = Engine.create()
    engineRef.current = engine
    engine.gravity.y = 1.2

    const render = Render.create({
      element: container,
      engine: engine,
      options: {
        width: viewWidth,
        height: viewHeight,
        wireframes: false,
        background: '#020617',
        pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1
      }
    })

    const wallOptions = { isStatic: true, restitution: 1, render: { fillStyle: '#1a2a1a' } }
    const leftWall = Bodies.rectangle(-10, viewHeight / 2, 30, viewHeight, wallOptions)
    const rightWall = Bodies.rectangle(viewWidth + 10, viewHeight / 2, 30, viewHeight, wallOptions)
    const ceiling = Bodies.rectangle(viewWidth / 2, -10, viewWidth, 30, wallOptions)
    const sensorBase = Bodies.rectangle(viewWidth / 2, viewHeight + 60, viewWidth, 40, { isStatic: true, isSensor: true, label: 'ground' })

    const flipperL = Bodies.rectangle(viewWidth * 0.35, viewHeight - 60, viewWidth * 0.23, 22, { 
      isStatic: true, 
      angle: 0.2, 
      chamfer: { radius: 10 }, 
      render: { fillStyle: '#6ab06a' }, 
      label: 'flipper' 
    })
    const flipperR = Bodies.rectangle(viewWidth * 0.65, viewHeight - 60, viewWidth * 0.23, 22, { 
      isStatic: true, 
      angle: -0.2, 
      chamfer: { radius: 10 }, 
      render: { fillStyle: '#6ab06a' }, 
      label: 'flipper' 
    })

    const wordList = [
      { eng: "Consistent", kor: "일관된" }, { eng: "Efficient", kor: "효율적인" },
      { eng: "Persist", kor: "계속하다" }, { eng: "Crucial", kor: "결정적인" },
      { eng: "Enhance", kor: "향상시키다" }, { eng: "Significant", kor: "중요한" },
      { eng: "Obtain", kor: "획득하다" }, { eng: "Precise", kor: "정확한" },
      { eng: "Alternative", kor: "대안" }, { eng: "Transform", kor: "변형시키다" }
    ]

    const targets = wordList.map((item, i) => {
      const col = i % 3
      const row = Math.floor(i / 3)
      const x = (viewWidth / 3.2) * (col + 0.6)
      const y = 80 + row * 85
      const radius = viewWidth < 350 ? 32 : 38
      const t = Bodies.circle(x, y, radius, { 
        isStatic: true, 
        restitution: 1.2, 
        render: { fillStyle: '#0d120d', strokeStyle: '#6ab06a', lineWidth: 2 } 
      }) as any
      t.eng = item.eng
      t.kor = item.kor
      return t
    })

    Composite.add(engine.world, [leftWall, rightWall, ceiling, sensorBase, flipperL, flipperR, ...targets])

    const flipLeft = () => {
      Body.setAngle(flipperL, -0.7)
      playSound('click')
      setTimeout(() => Body.setAngle(flipperL, 0.2), 100)
    }
    const flipRight = () => {
      Body.setAngle(flipperR, 0.7)
      playSound('click')
      setTimeout(() => Body.setAngle(flipperR, -0.2), 100)
    }

    const ballTimer = setInterval(() => {
      const ball = Bodies.circle(viewWidth / 2 + (Math.random() - 0.5) * (viewWidth * 0.6), 20, 10, {
        restitution: 0.9, friction: 0, frictionAir: 0, label: 'ball', render: { fillStyle: '#a05050' }
      })
      Composite.add(engine.world, ball)
    }, 1400)

    const handleInput = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      if (y > viewHeight * 0.4) {
        if (x < viewWidth * 0.5) flipLeft()
        else flipRight()
      }
    }

    const onMouseDown = (e: MouseEvent) => handleInput(e.clientX, e.clientY)
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      Array.from(e.changedTouches).forEach(t => handleInput(t.clientX, t.clientY))
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') flipLeft()
      if (e.key === 'ArrowRight') flipRight()
    }

    container.addEventListener('mousedown', onMouseDown)
    container.addEventListener('touchstart', onTouchStart, { passive: false })
    document.addEventListener('keydown', onKeyDown)

    Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair
        const target = targets.find(t => t === bodyA || t === bodyB)

        if (target) {
          setMsg(`🎯 ${target.eng}: ${target.kor}`)
          target.render.fillStyle = '#a0e080'
          playSound('ding')
          setTimeout(() => target.render.fillStyle = '#0d120d', 300)
        }

        if ((bodyA.label === 'flipper' || bodyB.label === 'flipper') && (bodyA.label === 'ball' || bodyB.label === 'ball')) {
          playSound('click')
        }

        if ((bodyA.label === 'ground' && bodyB.label === 'ball') || (bodyB.label === 'ground' && bodyA.label === 'ball')) {
          Composite.remove(engine.world, bodyA.label === 'ball' ? bodyA : bodyB)
        }
      })
    })

    Events.on(render, 'afterRender', () => {
      const ctx = render.context
      ctx.font = `bold ${viewWidth < 350 ? '10px' : '12px'} "Noto Serif KR", serif`
      ctx.fillStyle = "#c0c8a8"
      ctx.textAlign = "center"
      targets.forEach(t => ctx.fillText(t.eng, t.position.x, t.position.y + 5))
    })

    Render.run(render)
    const runner = Runner.create()
    Runner.run(runner, engine)

    return () => {
      clearInterval(ballTimer)
      container.removeEventListener('mousedown', onMouseDown)
      container.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('keydown', onKeyDown)
      Render.stop(render)
      Runner.stop(runner)
      Engine.clear(engine)
      if (render.canvas) render.canvas.remove()
    }
  }, [])

  return (
    <div className="flex flex-col space-y-4">
      <div 
        ref={containerRef} 
        className="relative w-full h-[500px] bg-[#020617] border border-[#1a2a1a] overflow-hidden cursor-crosshair touch-none"
      />
      <div className="text-center text-[#a0e080] font-bold text-[1rem] min-h-[1.5em] tracking-wider">
        {msg}
      </div>
    </div>
  )
}
