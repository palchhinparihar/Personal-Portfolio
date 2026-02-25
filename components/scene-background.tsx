"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function SceneBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color("#060b18")
    scene.fog = new THREE.FogExp2("#060b18", 0.06)

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0, 6)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.appendChild(renderer.domElement)

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x4a7cff, 0.5, 30)
    pointLight1.position.set(5, 5, 5)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x1e4fff, 0.3, 30)
    pointLight2.position.set(-5, -3, 3)
    scene.add(pointLight2)

    const movingLight = new THREE.PointLight(0x4a7cff, 2, 15)
    scene.add(movingLight)

    // --- Particles ---
    const particleCount = 300
    const particleGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    )
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x4a7cff,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    // --- Wireframe Geometries ---
    const wireMat1 = new THREE.MeshStandardMaterial({
      color: 0x2a4fff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    })
    const wireMat2 = new THREE.MeshStandardMaterial({
      color: 0x1e90ff,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    })
    const wireMat3 = new THREE.MeshStandardMaterial({
      color: 0x5b8cff,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    })

    const icosa = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.8, 1),
      wireMat1
    )
    icosa.position.set(3, 1, -2)
    scene.add(icosa)

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.7, 0.2, 16, 32),
      wireMat2
    )
    torus.position.set(-3.5, -1, -1)
    scene.add(torus)

    const octa = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.6, 0),
      wireMat3
    )
    octa.position.set(0, -2.5, -3)
    scene.add(octa)

    const geoGroup = new THREE.Group()
    geoGroup.add(icosa, torus, octa)
    scene.add(geoGroup)

    // --- Grid Floor ---
    const grid = new THREE.GridHelper(30, 30, 0x1a3a6a, 0x0d1f3c)
    grid.position.y = -4
    scene.add(grid)

    // --- Mouse tracking ---
    const mouse = { x: 0, y: 0 }
    function onMouseMove(e: MouseEvent) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", onMouseMove)

    // --- Animation loop ---
    const clock = new THREE.Clock()
    let frameId: number

    function animate() {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Particles rotation
      particles.rotation.x = t * 0.02
      particles.rotation.y = t * 0.03

      // Moving light
      movingLight.position.x = Math.sin(t * 0.5) * 5
      movingLight.position.y = Math.cos(t * 0.3) * 5

      // Geometry group slow rotation
      geoGroup.rotation.y = t * 0.05

      // Icosahedron
      icosa.rotation.x = t * 0.3
      icosa.rotation.z = t * 0.2
      icosa.position.y = 1 + Math.sin(t * 0.5) * 0.5

      // Torus
      torus.rotation.x = t * 0.4
      torus.rotation.y = t * 0.2
      torus.position.y = -1 + Math.cos(t * 0.6) * 0.4

      // Octahedron
      octa.rotation.y = t * 0.35
      octa.rotation.z = t * 0.15
      octa.position.y = -2.5 + Math.sin(t * 0.4 + 1) * 0.3

      // Grid scroll
      grid.position.z = ((t * 0.3) % 1) * -1

      // Subtle camera parallax from mouse
      camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.02
      camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.02
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    animate()

    // --- Resize handler ---
    function onResize() {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener("resize", onResize)

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
      wireMat1.dispose()
      wireMat2.dispose()
      wireMat3.dispose()
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
