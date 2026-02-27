"use client"

import { useEffect, useRef } from "react"

interface Ripple {
  x: number
  y: number
  size: number
  opacity: number
  birth: number
}

interface Trail {
  x: number
  y: number
  opacity: number
  size: number
  angle: number
}

export default function WaterCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 })
  const ripplesRef = useRef<Ripple[]>([])
  const trailsRef = useRef<Trail[]>([])
  const frameRef = useRef<number>(0)
  const lastRippleRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.prevX = mouseRef.current.x
      mouseRef.current.prevY = mouseRef.current.y
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY

      // Calculate velocity
      const dx = mouseRef.current.x - mouseRef.current.prevX
      const dy = mouseRef.current.y - mouseRef.current.prevY
      const velocity = Math.sqrt(dx * dx + dy * dy)
      const angle = Math.atan2(dy, dx)

      // Add water trail particles based on movement
      if (velocity > 2) {
        const trailCount = Math.min(Math.floor(velocity / 4), 5)
        for (let i = 0; i < trailCount; i++) {
          trailsRef.current.push({
            x: mouseRef.current.x + (Math.random() - 0.5) * 20,
            y: mouseRef.current.y + (Math.random() - 0.5) * 20,
            opacity: 0.6 + Math.random() * 0.4,
            size: 3 + Math.random() * 8,
            angle: angle + (Math.random() - 0.5) * 0.5,
          })
        }
      }

      // Create ripples periodically
      const now = Date.now()
      if (now - lastRippleRef.current > 100 && velocity > 5) {
        lastRippleRef.current = now
        ripplesRef.current.push({
          x: mouseRef.current.x,
          y: mouseRef.current.y,
          size: 5,
          opacity: 0.8,
          birth: now,
        })
      }
    }

    const handleClick = (e: MouseEvent) => {
      // Create a bigger ripple on click
      for (let i = 0; i < 3; i++) {
        ripplesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          size: 5 + i * 15,
          opacity: 0.9 - i * 0.2,
          birth: Date.now() - i * 50,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("click", handleClick)

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const now = Date.now()

      // Draw and update ripples
      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        const age = now - ripple.birth
        const maxAge = 1000
        if (age > maxAge) return false

        const progress = age / maxAge
        const currentSize = ripple.size + progress * 60
        const currentOpacity = ripple.opacity * (1 - progress)

        // Water breathing teal color
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, currentSize, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(20, 184, 166, ${currentOpacity})`
        ctx.lineWidth = 2 - progress * 1.5
        ctx.stroke()

        // Inner glow
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, currentSize * 0.7, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(94, 234, 212, ${currentOpacity * 0.5})`
        ctx.lineWidth = 1
        ctx.stroke()

        return true
      })

      // Draw and update trails
      trailsRef.current = trailsRef.current.filter((trail) => {
        trail.opacity -= 0.03
        trail.size *= 0.96
        
        // Move trail slightly in its angle direction (water flowing effect)
        trail.x += Math.cos(trail.angle) * 0.5
        trail.y += Math.sin(trail.angle) * 0.5 + 0.3 // slight downward drift

        if (trail.opacity <= 0 || trail.size < 0.5) return false

        // Draw water droplet
        const gradient = ctx.createRadialGradient(
          trail.x, trail.y, 0,
          trail.x, trail.y, trail.size
        )
        gradient.addColorStop(0, `rgba(94, 234, 212, ${trail.opacity})`)
        gradient.addColorStop(0.5, `rgba(20, 184, 166, ${trail.opacity * 0.7})`)
        gradient.addColorStop(1, `rgba(13, 148, 136, 0)`)

        ctx.beginPath()
        ctx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        return true
      })

      // Draw main cursor water orb
      const gradient = ctx.createRadialGradient(
        mouseRef.current.x, mouseRef.current.y, 0,
        mouseRef.current.x, mouseRef.current.y, 20
      )
      gradient.addColorStop(0, "rgba(94, 234, 212, 0.4)")
      gradient.addColorStop(0.5, "rgba(20, 184, 166, 0.2)")
      gradient.addColorStop(1, "rgba(13, 148, 136, 0)")

      ctx.beginPath()
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 20, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Draw small inner orb
      ctx.beginPath()
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 4, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(167, 243, 208, 0.8)"
      ctx.fill()
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("click", handleClick)
      cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    />
  )
}
