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

    // --- Scroll tracking ---
    let scrollProgress = 0
    let smoothScroll = 0
    function onScroll() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      scrollProgress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    // Store original positions for geometries
    const icosaBasePos = { x: 3, y: 1, z: -2 }
    const torusBasePos = { x: -3.5, y: -1, z: -1 }
    const octaBasePos = { x: 0, y: -2.5, z: -3 }

    // --- Animation loop ---
    const clock = new THREE.Clock()
    let frameId: number

    function animate() {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Smooth scroll interpolation for fluid transitions
      smoothScroll += (scrollProgress - smoothScroll) * 0.04

      // Scroll-driven multipliers
      const spread = 1 + smoothScroll * 2.5
      const spinBoost = 1 + smoothScroll * 3
      const particleExpand = 1 + smoothScroll * 0.8

      // Particles rotation -- faster & expand with scroll
      particles.rotation.x = t * 0.02 * spinBoost
      particles.rotation.y = t * 0.03 * spinBoost
      particles.scale.setScalar(particleExpand)

      // Particle opacity pulse on scroll
      particleMaterial.opacity = 0.6 + smoothScroll * 0.3
      particleMaterial.size = 0.05 + smoothScroll * 0.03

      // Moving light -- wider orbit on scroll
      const lightRadius = 5 + smoothScroll * 4
      movingLight.position.x = Math.sin(t * 0.5) * lightRadius
      movingLight.position.y = Math.cos(t * 0.3) * lightRadius
      movingLight.intensity = 2 + smoothScroll * 3

      // Geometry group -- accelerated rotation on scroll
      geoGroup.rotation.y = t * 0.05 * spinBoost

      // Icosahedron -- drifts outward on scroll
      icosa.rotation.x = t * 0.3 * spinBoost
      icosa.rotation.z = t * 0.2 * spinBoost
      icosa.position.x = icosaBasePos.x * spread
      icosa.position.y = (icosaBasePos.y + Math.sin(t * 0.5) * 0.5) * spread
      icosa.position.z = icosaBasePos.z - smoothScroll * 2
      icosa.scale.setScalar(1 + smoothScroll * 0.4)

      // Torus -- drifts outward on scroll
      torus.rotation.x = t * 0.4 * spinBoost
      torus.rotation.y = t * 0.2 * spinBoost
      torus.position.x = torusBasePos.x * spread
      torus.position.y = (torusBasePos.y + Math.cos(t * 0.6) * 0.4) * spread
      torus.position.z = torusBasePos.z - smoothScroll * 1.5
      torus.scale.setScalar(1 + smoothScroll * 0.3)

      // Octahedron -- drifts outward on scroll
      octa.rotation.y = t * 0.35 * spinBoost
      octa.rotation.z = t * 0.15 * spinBoost
      octa.position.x = octaBasePos.x * spread
      octa.position.y = (octaBasePos.y + Math.sin(t * 0.4 + 1) * 0.3) * spread
      octa.position.z = octaBasePos.z - smoothScroll * 2.5
      octa.scale.setScalar(1 + smoothScroll * 0.5)

      // Wireframe opacity shift on scroll
      wireMat1.opacity = 0.25 + smoothScroll * 0.2
      wireMat2.opacity = 0.2 + smoothScroll * 0.2
      wireMat3.opacity = 0.2 + smoothScroll * 0.25

      // Grid -- scroll affects speed and tilt
      grid.position.z = ((t * (0.3 + smoothScroll * 0.5)) % 1) * -1
      grid.rotation.x = -Math.PI / 2 + smoothScroll * 0.15

      // Camera -- pulls back and shifts on scroll for depth
      const camZ = 6 + smoothScroll * 3
      const camY = smoothScroll * -1.5
      camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.02
      camera.position.y += ((mouse.y * 0.3 + camY) - camera.position.y) * 0.02
      camera.position.z += (camZ - camera.position.z) * 0.03
      camera.lookAt(0, smoothScroll * -0.5, 0)

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
      window.removeEventListener("scroll", onScroll)
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
