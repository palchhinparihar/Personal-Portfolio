"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function SceneBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // --- Scene Setup ---
    const scene = new THREE.Scene()
    scene.background = new THREE.Color("#020408")
    scene.fog = new THREE.FogExp2("#020408", 0.012)

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      300
    )
    camera.position.set(0, 5, 25)
    camera.lookAt(0, 5, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.appendChild(renderer.domElement)

    // --- Demon Slayer Colors ---
    const wisteriaPurple = new THREE.Color("#a78bfa")
    const wisteriaLight = new THREE.Color("#c4b5fd")
    const wisteriaPink = new THREE.Color("#f0abfc")
    const moonGlow = new THREE.Color("#fef3c7")
    const crimsonFlame = new THREE.Color("#dc2626")
    const tealWater = new THREE.Color("#14b8a6")
    const nightBlue = new THREE.Color("#0f172a")

    // --- Large Moon ---
    const moonGeo = new THREE.CircleGeometry(8, 64)
    const moonMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: moonGlow },
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
          vec2 center = vUv - 0.5;
          float dist = length(center);
          
          // Moon surface
          float moon = 1.0 - smoothstep(0.3, 0.5, dist);
          
          // Glow effect
          float glow = 1.0 - smoothstep(0.0, 0.5, dist);
          glow = pow(glow, 2.0);
          
          // Subtle pulse
          float pulse = 0.95 + 0.05 * sin(uTime * 0.3);
          
          // Crater-like details
          float detail = sin(vUv.x * 20.0 + vUv.y * 15.0) * 0.03;
          
          vec3 color = uColor * (moon + glow * 0.3) * pulse;
          float alpha = (moon * 0.9 + glow * 0.4) * pulse;
          
          gl_FragColor = vec4(color + detail, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const moon = new THREE.Mesh(moonGeo, moonMat)
    moon.position.set(-15, 25, -60)
    scene.add(moon)

    // --- Wisteria Petals (falling flower particles) ---
    const petalCount = 300
    const petalGeo = new THREE.BufferGeometry()
    const petalPos = new Float32Array(petalCount * 3)
    const petalColors = new Float32Array(petalCount * 3)
    const petalSizes = new Float32Array(petalCount)
    const petalData: { 
      rotSpeed: number
      fallSpeed: number
      swaySpeed: number
      swayAmount: number
      phase: number
    }[] = []

    for (let i = 0; i < petalCount; i++) {
      petalPos[i * 3] = (Math.random() - 0.5) * 80
      petalPos[i * 3 + 1] = Math.random() * 50 + 10
      petalPos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10
      
      // Wisteria color variations
      const colorChoice = Math.random()
      let color
      if (colorChoice < 0.5) {
        color = wisteriaPurple
      } else if (colorChoice < 0.8) {
        color = wisteriaLight
      } else {
        color = wisteriaPink
      }
      petalColors[i * 3] = color.r
      petalColors[i * 3 + 1] = color.g
      petalColors[i * 3 + 2] = color.b
      
      petalSizes[i] = 0.15 + Math.random() * 0.25
      
      petalData.push({
        rotSpeed: 0.5 + Math.random() * 1.5,
        fallSpeed: 0.01 + Math.random() * 0.025,
        swaySpeed: 0.3 + Math.random() * 0.7,
        swayAmount: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
      })
    }
    
    petalGeo.setAttribute("position", new THREE.BufferAttribute(petalPos, 3))
    petalGeo.setAttribute("color", new THREE.BufferAttribute(petalColors, 3))
    petalGeo.setAttribute("size", new THREE.BufferAttribute(petalSizes, 1))

    const petalMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          
          // Petal shape (elongated)
          float petalShape = 1.0 - smoothstep(0.2, 0.5, dist);
          petalShape *= smoothstep(0.0, 0.1, 0.5 - abs(center.y));
          
          if (petalShape < 0.1) discard;
          
          gl_FragColor = vec4(vColor, petalShape * 0.7);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const petals = new THREE.Points(petalGeo, petalMat)
    scene.add(petals)

    // --- Breathing Effect Trails (Sword slashes) ---
    const slashCount = 6
    const slashes: THREE.Mesh[] = []
    const slashData: {
      startAngle: number
      speed: number
      radius: number
      isWater: boolean
      opacity: number
      targetOpacity: number
      cooldown: number
    }[] = []

    for (let i = 0; i < slashCount; i++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(2, 1, 0),
        new THREE.Vector3(5, 0.5, 0),
        new THREE.Vector3(8, -0.5, 0),
        new THREE.Vector3(12, 0, 0),
      ])
      
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.08, 8, false)
      const isWater = i % 2 === 0
      
      const slashMat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: isWater ? tealWater : crimsonFlame },
          uOpacity: { value: 0 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uOpacity;
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            // Trail fade along length
            float trail = smoothstep(0.0, 0.3, vUv.x) * (1.0 - smoothstep(0.7, 1.0, vUv.x));
            
            // Energy wave
            float wave = sin(vUv.x * 20.0 - uTime * 8.0) * 0.5 + 0.5;
            wave = pow(wave, 2.0);
            
            // Core brightness
            float core = 1.0 - abs(vUv.y - 0.5) * 2.0;
            core = pow(core, 0.5);
            
            vec3 color = uColor * (1.0 + wave * 0.5);
            float alpha = trail * core * uOpacity * (0.6 + wave * 0.4);
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      })

      const slash = new THREE.Mesh(tubeGeo, slashMat)
      slash.position.set(
        (Math.random() - 0.5) * 30,
        Math.random() * 15 + 2,
        (Math.random() - 0.5) * 20 - 10
      )
      slash.rotation.set(
        (Math.random() - 0.5) * 0.5,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 0.8
      )
      slash.scale.setScalar(0.8 + Math.random() * 0.6)
      
      scene.add(slash)
      slashes.push(slash)
      slashData.push({
        startAngle: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1,
        radius: 5 + Math.random() * 10,
        isWater,
        opacity: 0,
        targetOpacity: 0,
        cooldown: Math.random() * 3,
      })
    }

    // --- Floating Embers/Particles ---
    const emberCount = 120
    const emberGeo = new THREE.BufferGeometry()
    const emberPos = new Float32Array(emberCount * 3)
    const emberVel: { x: number; y: number; z: number }[] = []

    for (let i = 0; i < emberCount; i++) {
      emberPos[i * 3] = (Math.random() - 0.5) * 50
      emberPos[i * 3 + 1] = Math.random() * 30
      emberPos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5
      emberVel.push({
        x: (Math.random() - 0.5) * 0.01,
        y: 0.02 + Math.random() * 0.03,
        z: (Math.random() - 0.5) * 0.01,
      })
    }
    emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPos, 3))

    const emberMat = new THREE.PointsMaterial({
      size: 0.08,
      color: new THREE.Color("#fbbf24"),
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
    const embers = new THREE.Points(emberGeo, emberMat)
    scene.add(embers)

    // --- Ground Mist ---
    const mistGeo = new THREE.PlaneGeometry(100, 100)
    const mistMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: nightBlue },
        uColor2: { value: wisteriaPurple },
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
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec2 vUv;
        
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        void main() {
          vec2 uv = vUv;
          
          // Swirling mist
          float n1 = noise(uv * 3.0 + uTime * 0.1);
          float n2 = noise(uv * 5.0 - uTime * 0.15);
          float mist = (n1 + n2) * 0.5;
          
          // Distance fade from center
          float dist = length(uv - 0.5) * 2.0;
          float fade = 1.0 - smoothstep(0.2, 0.8, dist);
          
          vec3 color = mix(uColor1, uColor2, mist * 0.3);
          float alpha = fade * mist * 0.15;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const mist = new THREE.Mesh(mistGeo, mistMat)
    mist.rotation.x = -Math.PI / 2
    mist.position.y = -2
    scene.add(mist)

    // --- Ambient Light ---
    const ambientLight = new THREE.AmbientLight("#1e1b4b", 0.2)
    scene.add(ambientLight)

    // --- Mouse Tracking ---
    const mouse = { x: 0, y: 0 }
    function onMouseMove(e: MouseEvent) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", onMouseMove)

    // --- Scroll Tracking ---
    let scrollTarget = 0
    let smoothScroll = 0
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollTarget = max > 0 ? Math.min(window.scrollY / max, 1) : 0
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    // --- Animation Loop ---
    const clock = new THREE.Clock()
    let frameId: number

    function animate() {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      smoothScroll += (scrollTarget - smoothScroll) * 0.04

      // Scroll phases
      const phase1 = Math.min(smoothScroll / 0.25, 1)
      const phase2 = Math.max(0, Math.min((smoothScroll - 0.25) / 0.25, 1))
      const phase3 = Math.max(0, Math.min((smoothScroll - 0.5) / 0.25, 1))
      const phase4 = Math.max(0, Math.min((smoothScroll - 0.75) / 0.25, 1))

      // Moon animation
      moonMat.uniforms.uTime.value = t
      moon.position.y = 25 + Math.sin(t * 0.1) * 0.5 - smoothScroll * 8

      // Wisteria petals falling
      const petalArr = petalGeo.attributes.position.array as Float32Array
      for (let i = 0; i < petalCount; i++) {
        const idx = i * 3
        const data = petalData[i]
        
        // Sway motion
        petalArr[idx] += Math.sin(t * data.swaySpeed + data.phase) * 0.02 * data.swayAmount
        // Fall
        petalArr[idx + 1] -= data.fallSpeed * (1 + smoothScroll * 0.5)
        // Drift
        petalArr[idx + 2] += Math.cos(t * data.swaySpeed * 0.5 + data.phase) * 0.01
        
        // Reset when below ground
        if (petalArr[idx + 1] < -5) {
          petalArr[idx + 1] = 50 + Math.random() * 10
          petalArr[idx] = (Math.random() - 0.5) * 80
          petalArr[idx + 2] = (Math.random() - 0.5) * 60 - 10
        }
      }
      petalGeo.attributes.position.needsUpdate = true
      petalMat.uniforms.uTime.value = t

      // Sword slash breathing effects
      slashes.forEach((slash, i) => {
        const data = slashData[i]
        const mat = slash.material as THREE.ShaderMaterial
        mat.uniforms.uTime.value = t
        
        // Cooldown and trigger
        data.cooldown -= 0.016
        if (data.cooldown <= 0) {
          data.targetOpacity = 0.8 + Math.random() * 0.2
          data.cooldown = 2 + Math.random() * 4
          
          // Reposition slash
          slash.position.set(
            (Math.random() - 0.5) * 40,
            Math.random() * 15 + 2,
            (Math.random() - 0.5) * 30 - 10
          )
          slash.rotation.y = Math.random() * Math.PI * 2
          slash.rotation.z = (Math.random() - 0.5) * 1.2
        }
        
        // Fade in/out
        data.opacity += (data.targetOpacity - data.opacity) * 0.05
        if (data.targetOpacity > 0.1) {
          data.targetOpacity *= 0.98
        }
        mat.uniforms.uOpacity.value = data.opacity * (0.5 + smoothScroll * 0.5)
        
        // Slight movement
        slash.rotation.z += 0.002 * data.speed
      })

      // Embers floating up
      const emberArr = emberGeo.attributes.position.array as Float32Array
      for (let i = 0; i < emberCount; i++) {
        const idx = i * 3
        emberArr[idx] += emberVel[i].x + Math.sin(t + i) * 0.002
        emberArr[idx + 1] += emberVel[i].y * (1 + phase2 * 0.5)
        emberArr[idx + 2] += emberVel[i].z
        
        if (emberArr[idx + 1] > 35) {
          emberArr[idx + 1] = -2
          emberArr[idx] = (Math.random() - 0.5) * 50
          emberArr[idx + 2] = (Math.random() - 0.5) * 40 - 5
        }
      }
      emberGeo.attributes.position.needsUpdate = true
      emberMat.opacity = 0.4 + smoothScroll * 0.3

      // Mist animation
      mistMat.uniforms.uTime.value = t
      
      // Camera movement
      const camY = 5 + phase1 * 3 + phase2 * 2 - phase4 * 1
      const camZ = 25 - phase1 * 3 - phase2 * 2 + phase4 * 3
      
      camera.position.x += (mouse.x * 3 - camera.position.x) * 0.02
      camera.position.y += (camY + mouse.y * 2 - camera.position.y) * 0.02
      camera.position.z += (camZ - camera.position.z) * 0.02
      
      const lookY = 5 + phase1 * 2 + phase3 * 1
      camera.lookAt(mouse.x * 2, lookY, -5 - smoothScroll * 10)

      renderer.render(scene, camera)
    }
    animate()

    // --- Resize Handler ---
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
      petalGeo.dispose()
      petalMat.dispose()
      emberGeo.dispose()
      emberMat.dispose()
      moonGeo.dispose()
      moonMat.dispose()
      mistGeo.dispose()
      mistMat.dispose()
      slashes.forEach((s) => {
        s.geometry.dispose()
        ;(s.material as THREE.ShaderMaterial).dispose()
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
