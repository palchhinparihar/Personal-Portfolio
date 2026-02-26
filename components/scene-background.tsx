"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function SceneBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // --- Renderer setup ---
    const scene = new THREE.Scene()
    scene.background = new THREE.Color("#08060e")
    scene.fog = new THREE.FogExp2("#08060e", 0.02)

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    )
    camera.position.set(0, 2, 18)
    camera.lookAt(0, 4, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.appendChild(renderer.domElement)

    // --- Color palette ---
    const purpleDark = new THREE.Color("#3b0764")
    const purpleMid = new THREE.Color("#7c3aed")
    const purpleLight = new THREE.Color("#c084fc")
    const purpleGlow = new THREE.Color("#a855f7")

    // --- Light Pillars ---
    const pillarCount = 14
    const pillars: THREE.Mesh[] = []
    const pillarData: {
      baseX: number
      baseZ: number
      speed: number
      phase: number
      height: number
      pulseSpeed: number
    }[] = []

    for (let i = 0; i < pillarCount; i++) {
      const height = 12 + Math.random() * 20
      const width = 0.08 + Math.random() * 0.25
      const geo = new THREE.PlaneGeometry(width, height, 1, 64)

      // Tint each pillar a slightly different shade
      const t = Math.random()
      const col = new THREE.Color().lerpColors(purpleMid, purpleLight, t)

      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: col },
          uTime: { value: 0 },
          uPulseSpeed: { value: 0.5 + Math.random() * 1.5 },
          uOpacity: { value: 0.12 + Math.random() * 0.18 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uTime;
          uniform float uPulseSpeed;
          uniform float uOpacity;
          varying vec2 vUv;

          void main() {
            // Vertical fade: strongest in center, fades to top and bottom
            float vertFade = 1.0 - abs(vUv.y - 0.45) * 1.6;
            vertFade = clamp(vertFade, 0.0, 1.0);
            vertFade = pow(vertFade, 1.8);

            // Horizontal fade: thin beam effect
            float horizFade = 1.0 - abs(vUv.x - 0.5) * 2.0;
            horizFade = pow(clamp(horizFade, 0.0, 1.0), 0.6);

            // Pulsing brightness
            float pulse = 0.7 + 0.3 * sin(uTime * uPulseSpeed + vUv.y * 4.0);

            // Traveling light effect going upward
            float travel = sin(vUv.y * 10.0 - uTime * 1.5) * 0.5 + 0.5;
            travel = pow(travel, 3.0) * 0.3;

            float alpha = vertFade * horizFade * pulse * uOpacity + travel * vertFade * horizFade * 0.05;
            vec3 finalColor = uColor * (1.0 + travel * 0.5);

            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })

      const pillar = new THREE.Mesh(geo, mat)

      // Distribute around the scene
      const angle = (i / pillarCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
      const radius = 5 + Math.random() * 18
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius - 5

      pillar.position.set(x, height * 0.35, z)

      // Face camera roughly but with some rotation variation
      pillar.lookAt(camera.position)
      pillar.rotation.z = (Math.random() - 0.5) * 0.08

      scene.add(pillar)
      pillars.push(pillar)
      pillarData.push({
        baseX: x,
        baseZ: z,
        speed: 0.15 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        height,
        pulseSpeed: 0.5 + Math.random() * 1.5,
      })
    }

    // --- Ground glow plane ---
    const groundGeo = new THREE.PlaneGeometry(80, 80, 1, 1)
    const groundMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: purpleDark },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;

        void main() {
          float dist = length(vUv - 0.5) * 2.0;
          float glow = 1.0 - smoothstep(0.0, 0.7, dist);
          glow = pow(glow, 2.5);
          float pulse = 0.8 + 0.2 * sin(uTime * 0.5);
          gl_FragColor = vec4(uColor * 1.5, glow * 0.12 * pulse);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -1
    scene.add(ground)

    // --- Floating dust particles ---
    const dustCount = 180
    const dustGeo = new THREE.BufferGeometry()
    const dustPos = new Float32Array(dustCount * 3)
    const dustVel: { x: number; y: number; z: number }[] = []

    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 40
      dustPos[i * 3 + 1] = Math.random() * 25
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5
      dustVel.push({
        x: (Math.random() - 0.5) * 0.005,
        y: 0.005 + Math.random() * 0.015,
        z: (Math.random() - 0.5) * 0.005,
      })
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3))

    const dustMat = new THREE.PointsMaterial({
      size: 0.06,
      color: purpleLight,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
    const dust = new THREE.Points(dustGeo, dustMat)
    scene.add(dust)

    // --- Ambient light ---
    const ambientLight = new THREE.AmbientLight("#1a0a2e", 0.3)
    scene.add(ambientLight)

    // --- Mouse ---
    const mouse = { x: 0, y: 0 }
    function onMouseMove(e: MouseEvent) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", onMouseMove)

    // --- Scroll ---
    let scrollTarget = 0
    let smoothScroll = 0
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollTarget = max > 0 ? Math.min(window.scrollY / max, 1) : 0
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    // --- Animation ---
    const clock = new THREE.Clock()
    let frameId: number

    function animate() {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      smoothScroll += (scrollTarget - smoothScroll) * 0.04

      // Define scroll phases (0-0.25, 0.25-0.5, 0.5-0.75, 0.75-1)
      const phase1 = Math.min(smoothScroll / 0.25, 1) // Hero to About
      const phase2 = Math.max(0, Math.min((smoothScroll - 0.25) / 0.25, 1)) // About to Experience
      const phase3 = Math.max(0, Math.min((smoothScroll - 0.5) / 0.25, 1)) // Experience to Skills
      const phase4 = Math.max(0, Math.min((smoothScroll - 0.75) / 0.25, 1)) // Skills to Contact

      // Dynamic movement multipliers based on scroll position
      const swayIntensity = 0.3 + phase1 * 0.4 - phase3 * 0.2 + phase4 * 0.3
      const rotationSpeed = 0.2 + phase2 * 0.3 - phase4 * 0.1
      const pulseMultiplier = 1 + phase1 * 0.5 + phase3 * 0.3

      // Update pillar uniforms and dynamic sway based on scroll
      for (let i = 0; i < pillarCount; i++) {
        const mat = pillars[i].material as THREE.ShaderMaterial
        mat.uniforms.uTime.value = t * pulseMultiplier
        // Increase opacity on scroll for more dramatic effect
        mat.uniforms.uOpacity.value =
          (0.12 + Math.random() * 0.001) + smoothScroll * 0.15

        const d = pillarData[i]
        
        // Dynamic sway patterns based on scroll position
        const swayX = Math.sin(t * d.speed * (1 + phase2 * 0.5) + d.phase) * swayIntensity
        const swayZ = Math.cos(t * d.speed * 0.7 * (1 + phase3 * 0.3) + d.phase) * swayIntensity * 0.7
        
        // Add circular motion on deeper scroll
        const circleMotion = phase3 * Math.sin(t * 0.5 + i * 0.3) * 0.5
        const circleMotionZ = phase3 * Math.cos(t * 0.5 + i * 0.3) * 0.5
        
        pillars[i].position.x = d.baseX + swayX + circleMotion
        pillars[i].position.z = d.baseZ + swayZ + circleMotionZ

        // Pillars billow and twist with scroll
        const scrollScale = 1 + smoothScroll * 0.35 + phase4 * 0.2
        pillars[i].scale.y = scrollScale
        pillars[i].scale.x = 1 + smoothScroll * 0.15 + phase2 * 0.1

        // Keep facing camera with dynamic rotation
        pillars[i].lookAt(camera.position)
        pillars[i].rotation.z = Math.sin(t * rotationSpeed + d.phase) * (0.05 + phase2 * 0.03)
      }

      // Ground glow with scroll-based intensity
      groundMat.uniforms.uTime.value = t
      const groundColor = new THREE.Color().lerpColors(
        purpleDark,
        purpleGlow,
        smoothScroll * 0.4
      )
      groundMat.uniforms.uColor.value = groundColor

      // Dust particles with dynamic movement based on scroll
      const dArr = dustGeo.attributes.position.array as Float32Array
      for (let i = 0; i < dustCount; i++) {
        const idx = i * 3
        
        // Horizontal drift changes with scroll
        const driftX = dustVel[i].x * (1 + phase2 * 2 - phase4)
        const driftZ = dustVel[i].z * (1 + phase3 * 1.5)
        
        // Vertical speed increases then slows
        const verticalSpeed = dustVel[i].y * (1 + smoothScroll * 0.8 - phase4 * 0.3)
        
        // Add swirl motion at deeper scroll positions
        const swirlAngle = t * 0.3 + i * 0.1
        const swirlRadius = phase3 * 0.02
        
        dArr[idx] += driftX + Math.cos(swirlAngle) * swirlRadius
        dArr[idx + 1] += verticalSpeed
        dArr[idx + 2] += driftZ + Math.sin(swirlAngle) * swirlRadius
        
        // Reset particles that go too high
        if (dArr[idx + 1] > 25) {
          dArr[idx + 1] = -1
          dArr[idx] = (Math.random() - 0.5) * 40
          dArr[idx + 2] = (Math.random() - 0.5) * 40 - 5
        }
      }
      dustGeo.attributes.position.needsUpdate = true
      dustMat.opacity = 0.35 + smoothScroll * 0.3 - phase4 * 0.1
      dustMat.size = 0.06 + phase2 * 0.02

      // Camera movement changes based on scroll phase
      const camY = 2 + phase1 * 2 + phase2 * 1 + phase3 * 0.5 + phase4 * 1
      const camZ = 18 - phase1 * 3 - phase2 * 1 + phase4 * 2
      const camX = phase2 * 2 - phase3 * 1 + phase4 * -1
      
      camera.position.x += (camX + mouse.x * (1.5 - smoothScroll * 0.5) - camera.position.x) * 0.015
      camera.position.y += (camY + mouse.y * (1 - smoothScroll * 0.3) - camera.position.y) * 0.015
      camera.position.z += (camZ - camera.position.z) * 0.02
      
      // Look at point shifts with scroll
      const lookY = 4 + phase1 * 1.5 + phase2 * 0.5 + phase3 * 0.5
      const lookZ = -3 - phase2 * 2 + phase4 * 1
      camera.lookAt(phase3 * 1 - phase4 * 0.5, lookY, lookZ)

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
      dustGeo.dispose()
      dustMat.dispose()
      groundGeo.dispose()
      groundMat.dispose()
      pillars.forEach((p) => {
        p.geometry.dispose()
        ;(p.material as THREE.ShaderMaterial).dispose()
      })
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
