"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function SceneBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color("#0d0a1a")
    scene.fog = new THREE.FogExp2("#0d0a1a", 0.04)

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0, 14)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.appendChild(renderer.domElement)

    // --- Floating orbs (large blurry spheres for ambient glow) ---
    const orbGroup = new THREE.Group()
    const orbData: { mesh: THREE.Mesh; basePos: THREE.Vector3; speed: number; phase: number }[] = []
    const orbGeo = new THREE.SphereGeometry(1, 32, 32)

    const orbConfigs = [
      { pos: [-5, 3, -8], scale: 2.5, color: "#6b21a8", opacity: 0.08 },
      { pos: [6, -2, -10], scale: 3, color: "#7c3aed", opacity: 0.06 },
      { pos: [-3, -4, -6], scale: 1.8, color: "#a855f7", opacity: 0.07 },
      { pos: [4, 4, -12], scale: 3.5, color: "#581c87", opacity: 0.05 },
      { pos: [0, -1, -5], scale: 1.5, color: "#9333ea", opacity: 0.04 },
    ]

    orbConfigs.forEach((cfg) => {
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(cfg.color),
        transparent: true,
        opacity: cfg.opacity,
        depthWrite: false,
      })
      const mesh = new THREE.Mesh(orbGeo, mat)
      mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2])
      mesh.scale.setScalar(cfg.scale)
      orbGroup.add(mesh)
      orbData.push({
        mesh,
        basePos: new THREE.Vector3(cfg.pos[0], cfg.pos[1], cfg.pos[2]),
        speed: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      })
    })
    scene.add(orbGroup)

    // --- Particle field ---
    const particleCount = 120
    const particleGeo = new THREE.BufferGeometry()
    const pPositions = new Float32Array(particleCount * 3)
    const pVelocities: number[] = []

    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 30
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 20
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5
      pVelocities.push(
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.001
      )
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.025,
      color: new THREE.Color("#a78bfa"),
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // --- Connection lines between nearby particles ---
    const lineGeo = new THREE.BufferGeometry()
    const maxLines = particleCount * 6
    const linePositions = new Float32Array(maxLines * 6)
    const lineColors = new Float32Array(maxLines * 6)
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3))
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3))

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const lines = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lines)

    // --- Floating ring ---
    const ringGeo = new THREE.TorusGeometry(3.5, 0.015, 16, 100)
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#7c3aed"),
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.position.set(0, 0, -4)
    ring.rotation.x = Math.PI / 3
    scene.add(ring)

    // Second ring
    const ring2Geo = new THREE.TorusGeometry(5, 0.01, 16, 120)
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#a855f7"),
      transparent: true,
      opacity: 0.06,
      depthWrite: false,
    })
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
    ring2.position.set(0, 0, -6)
    ring2.rotation.x = Math.PI / 4
    ring2.rotation.z = Math.PI / 6
    scene.add(ring2)

    // --- Mouse ---
    const mouse = { x: 0, y: 0 }
    function onMouseMove(e: MouseEvent) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", onMouseMove)

    // --- Scroll ---
    let scrollProgress = 0
    let smoothScroll = 0
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollProgress = max > 0 ? Math.min(window.scrollY / max, 1) : 0
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    // --- Animate ---
    const clock = new THREE.Clock()
    let frameId: number
    const connectionDist = 4
    const purpleBase = new THREE.Color("#9333ea")

    function animate() {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      smoothScroll += (scrollProgress - smoothScroll) * 0.04

      // Animate orbs - gentle float
      orbData.forEach((orb) => {
        const drift = smoothScroll * 1.5
        orb.mesh.position.x = orb.basePos.x + Math.sin(t * orb.speed + orb.phase) * (0.8 + drift)
        orb.mesh.position.y = orb.basePos.y + Math.cos(t * orb.speed * 0.7 + orb.phase) * (0.6 + drift * 0.5)
        const s = orb.mesh.scale.x
        orb.mesh.scale.setScalar(s + Math.sin(t * 0.3 + orb.phase) * 0.002)
      })

      // Animate particles - gentle drift
      const posArr = particleGeo.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3
        posArr[idx] += pVelocities[idx] * (1 + smoothScroll * 2)
        posArr[idx + 1] += pVelocities[idx + 1] * (1 + smoothScroll * 2)
        posArr[idx + 2] += pVelocities[idx + 2]

        // Wrap around boundaries
        if (posArr[idx] > 15) posArr[idx] = -15
        if (posArr[idx] < -15) posArr[idx] = 15
        if (posArr[idx + 1] > 10) posArr[idx + 1] = -10
        if (posArr[idx + 1] < -10) posArr[idx + 1] = 10
      }
      particleGeo.attributes.position.needsUpdate = true
      particleMat.opacity = 0.5 + smoothScroll * 0.3

      // Draw connection lines between nearby particles
      let lineIdx = 0
      const dist = connectionDist + smoothScroll * 2
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          if (lineIdx >= maxLines) break
          const ix = i * 3, jx = j * 3
          const dx = posArr[ix] - posArr[jx]
          const dy = posArr[ix + 1] - posArr[jx + 1]
          const dz = posArr[ix + 2] - posArr[jx + 2]
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
          if (d < dist) {
            const alpha = 1 - d / dist
            const lIdx = lineIdx * 6
            linePositions[lIdx] = posArr[ix]
            linePositions[lIdx + 1] = posArr[ix + 1]
            linePositions[lIdx + 2] = posArr[ix + 2]
            linePositions[lIdx + 3] = posArr[jx]
            linePositions[lIdx + 4] = posArr[jx + 1]
            linePositions[lIdx + 5] = posArr[jx + 2]
            const c = purpleBase.clone().multiplyScalar(alpha)
            lineColors[lIdx] = c.r
            lineColors[lIdx + 1] = c.g
            lineColors[lIdx + 2] = c.b
            lineColors[lIdx + 3] = c.r
            lineColors[lIdx + 4] = c.g
            lineColors[lIdx + 5] = c.b
            lineIdx++
          }
        }
      }
      // Zero out unused
      for (let i = lineIdx * 6; i < maxLines * 6; i++) {
        linePositions[i] = 0
        lineColors[i] = 0
      }
      lineGeo.attributes.position.needsUpdate = true
      lineGeo.attributes.color.needsUpdate = true
      lineGeo.setDrawRange(0, lineIdx * 2)
      lineMat.opacity = 0.15 + smoothScroll * 0.1

      // Rings rotate
      ring.rotation.z = t * 0.08 + smoothScroll * 0.5
      ring.rotation.y = t * 0.03
      ringMat.opacity = 0.12 + smoothScroll * 0.08

      ring2.rotation.z = -t * 0.05 + smoothScroll * 0.3
      ring2.rotation.y = t * 0.04
      ring2Mat.opacity = 0.06 + smoothScroll * 0.06

      // Camera parallax + scroll
      const camX = mouse.x * 0.3
      const camY = mouse.y * 0.2
      const camZ = 14 - smoothScroll * 2
      camera.position.x += (camX - camera.position.x) * 0.015
      camera.position.y += (camY - camera.position.y) * 0.015
      camera.position.z += (camZ - camera.position.z) * 0.02
      camera.lookAt(0, 0, -2)

      renderer.render(scene, camera)
    }
    animate()

    // --- Resize ---
    function onResize() {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      orbGeo.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      ringGeo.dispose()
      ringMat.dispose()
      ring2Geo.dispose()
      ring2Mat.dispose()
      lineGeo.dispose()
      lineMat.dispose()
      orbData.forEach((o) => (o.mesh.material as THREE.Material).dispose())
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      aria-hidden="true"
    />
  )
}
