"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function SceneBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // --- Renderer & Scene ---
    const scene = new THREE.Scene()
    scene.background = new THREE.Color("#060b1a")
    scene.fog = new THREE.FogExp2("#060b1a", 0.035)

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 4, 12)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.appendChild(renderer.domElement)

    // --- Wave terrain mesh ---
    const segW = 128
    const segH = 128
    const planeGeo = new THREE.PlaneGeometry(40, 40, segW, segH)
    planeGeo.rotateX(-Math.PI / 2)

    const waveMat = new THREE.ShaderMaterial({
      vertexShader: `
        uniform float uTime;
        uniform float uScroll;
        varying float vHeight;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 pos = position;

          float scrollFactor = 1.0 + uScroll * 1.5;

          // Layered waves
          float w1 = sin(pos.x * 0.3 + uTime * 0.15) * cos(pos.z * 0.2 + uTime * 0.1) * 1.2 * scrollFactor;
          float w2 = sin(pos.x * 0.8 - uTime * 0.08 + pos.z * 0.5) * 0.4;
          float w3 = cos(pos.z * 0.6 + uTime * 0.12 + pos.x * 0.3) * 0.3 * scrollFactor;
          float ripple = sin(length(pos.xz) * 0.5 - uTime * 0.2) * 0.2;

          pos.y += w1 + w2 + w3 + ripple;
          vHeight = pos.y;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uScroll;
        varying float vHeight;
        varying vec2 vUv;

        void main() {
          // Height-based color: deep navy -> soft blue glow on peaks
          vec3 deep = vec3(0.02, 0.04, 0.1);
          vec3 mid  = vec3(0.04, 0.1, 0.25);
          vec3 peak = vec3(0.12, 0.3, 0.6);

          float t = smoothstep(-1.2, 1.8, vHeight);
          vec3 col = mix(deep, mid, smoothstep(0.0, 0.4, t));
          col = mix(col, peak, smoothstep(0.5, 1.0, t));

          // Subtle glow intensifies with scroll
          col += peak * smoothstep(0.6, 1.0, t) * (0.15 + uScroll * 0.2);

          // Edge fade
          float edgeFade = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
          edgeFade *= smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.88, vUv.y);

          float alpha = 0.85 * edgeFade;
          gl_FragColor = vec4(col, alpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
      },
      transparent: true,
      side: THREE.DoubleSide,
      wireframe: false,
    })

    const terrain = new THREE.Mesh(planeGeo, waveMat)
    terrain.position.set(0, -2, -4)
    scene.add(terrain)

    // --- Wireframe overlay (very faint grid lines on the terrain) ---
    const wireGeo = new THREE.PlaneGeometry(40, 40, 48, 48)
    wireGeo.rotateX(-Math.PI / 2)
    const wireMat = new THREE.ShaderMaterial({
      vertexShader: `
        uniform float uTime;
        uniform float uScroll;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 pos = position;
          float scrollFactor = 1.0 + uScroll * 1.5;
          float w1 = sin(pos.x * 0.3 + uTime * 0.15) * cos(pos.z * 0.2 + uTime * 0.1) * 1.2 * scrollFactor;
          float w2 = sin(pos.x * 0.8 - uTime * 0.08 + pos.z * 0.5) * 0.4;
          float w3 = cos(pos.z * 0.6 + uTime * 0.12 + pos.x * 0.3) * 0.3 * scrollFactor;
          float ripple = sin(length(pos.xz) * 0.5 - uTime * 0.2) * 0.2;
          pos.y += w1 + w2 + w3 + ripple;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        void main() {
          float edgeFade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
          edgeFade *= smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
          gl_FragColor = vec4(0.15, 0.35, 0.7, 0.08 * edgeFade);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
      },
      transparent: true,
      wireframe: true,
      depthWrite: false,
    })
    const wireOverlay = new THREE.Mesh(wireGeo, wireMat)
    wireOverlay.position.set(0, -1.98, -4)
    scene.add(wireOverlay)

    // --- Floating tiny particles (dust motes) ---
    const dustCount = 60
    const dustGeo = new THREE.BufferGeometry()
    const dustPositions = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 25
      dustPositions[i * 3 + 1] = Math.random() * 8 - 1
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3))
    const dustMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x4488cc,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const dust = new THREE.Points(dustGeo, dustMat)
    scene.add(dust)

    // --- Ambient light ---
    scene.add(new THREE.AmbientLight(0x1a2a4a, 0.5))

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

    // --- Animation loop ---
    const clock = new THREE.Clock()
    let frameId: number

    function animate() {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      smoothScroll += (scrollProgress - smoothScroll) * 0.04

      // Update wave shader uniforms
      waveMat.uniforms.uTime.value = t
      waveMat.uniforms.uScroll.value = smoothScroll
      wireMat.uniforms.uTime.value = t
      wireMat.uniforms.uScroll.value = smoothScroll

      // Terrain slowly rotates on Y to give life
      terrain.rotation.y = t * 0.008 + smoothScroll * 0.3
      wireOverlay.rotation.y = terrain.rotation.y

      // Dust drifts
      dust.rotation.y = t * 0.005
      dust.position.y = Math.sin(t * 0.1) * 0.2
      dustMat.opacity = 0.3 + smoothScroll * 0.15

      // Camera: subtle mouse parallax + scroll-driven tilt
      const camX = mouse.x * 0.4
      const camY = 4 - smoothScroll * 2
      const camZ = 12 - smoothScroll * 3
      camera.position.x += (camX - camera.position.x) * 0.02
      camera.position.y += (camY - camera.position.y) * 0.02
      camera.position.z += (camZ - camera.position.z) * 0.02
      camera.lookAt(0, -smoothScroll * 1.5, -4)

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

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      planeGeo.dispose()
      waveMat.dispose()
      wireGeo.dispose()
      wireMat.dispose()
      dustGeo.dispose()
      dustMat.dispose()
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
