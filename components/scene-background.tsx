"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function SceneBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color("#0a0710")
    scene.fog = new THREE.FogExp2("#0a0710", 0.035)

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    )
    camera.position.set(0, 12, 30)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.appendChild(renderer.domElement)

    // --- Ocean plane ---
    const planeSize = 120
    const segments = 200
    const geometry = new THREE.PlaneGeometry(planeSize, planeSize, segments, segments)
    geometry.rotateX(-Math.PI / 2)

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uColorDeep: { value: new THREE.Color("#1a0533") },
        uColorMid: { value: new THREE.Color("#3b1578") },
        uColorPeak: { value: new THREE.Color("#7c3aed") },
        uColorFoam: { value: new THREE.Color("#c084fc") },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uScroll;
        varying float vElevation;
        varying vec3 vWorldPos;

        // Simplex 3D noise
        vec3 mod289(vec3 x) { return x - floor(x*(1.0/289.0))*289.0; }
        vec4 mod289(vec4 x) { return x - floor(x*(1.0/289.0))*289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159-0.85373472095314*r; }
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0,0.5,1.0,2.0);
          vec3 i = floor(v+dot(v,C.yyy));
          vec3 x0 = v-i+dot(i,C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0-g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0-i1+C.xxx;
          vec3 x2 = x0-i2+C.yyy;
          vec3 x3 = x0-D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
            i.z+vec4(0.0,i1.z,i2.z,1.0))
            +i.y+vec4(0.0,i1.y,i2.y,1.0))
            +i.x+vec4(0.0,i1.x,i2.x,1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_*D.wyz-D.xzx;
          vec4 j = p-49.0*floor(p*ns.z*ns.z);
          vec4 x_ = floor(j*ns.z);
          vec4 y_ = floor(j-7.0*x_);
          vec4 x2_ = x_*ns.x+ns.yyyy;
          vec4 y2_ = y_*ns.x+ns.yyyy;
          vec4 h = 1.0-abs(x2_)-abs(y2_);
          vec4 b0 = vec4(x2_.xy, y2_.xy);
          vec4 b1 = vec4(x2_.zw, y2_.zw);
          vec4 s0 = floor(b0)*2.0+1.0;
          vec4 s1 = floor(b1)*2.0+1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw+s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw+s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
          p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
          vec4 m = max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
          m = m*m;
          return 42.0*dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
        }

        void main() {
          vec3 pos = position;
          float scrollAmp = 1.0 + uScroll * 2.0;
          float speed = uTime * 0.4;

          // Layer 1: large rolling waves
          float wave1 = snoise(vec3(pos.x * 0.04, pos.z * 0.04, speed * 0.5)) * 3.5 * scrollAmp;
          // Layer 2: medium waves
          float wave2 = snoise(vec3(pos.x * 0.1, pos.z * 0.08, speed * 0.8)) * 1.2 * scrollAmp;
          // Layer 3: small ripples
          float wave3 = snoise(vec3(pos.x * 0.25, pos.z * 0.25, speed * 1.2)) * 0.3;
          // Layer 4: micro detail
          float wave4 = snoise(vec3(pos.x * 0.6, pos.z * 0.5, speed * 1.5)) * 0.1;

          float elevation = wave1 + wave2 + wave3 + wave4;
          pos.y += elevation;

          vElevation = elevation;
          vWorldPos = pos;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uScroll;
        uniform vec3 uColorDeep;
        uniform vec3 uColorMid;
        uniform vec3 uColorPeak;
        uniform vec3 uColorFoam;
        varying float vElevation;
        varying vec3 vWorldPos;

        void main() {
          // Normalize elevation for color mapping
          float h = (vElevation + 4.0) / 8.0;
          h = clamp(h, 0.0, 1.0);

          // Color gradient based on wave height
          vec3 color = mix(uColorDeep, uColorMid, smoothstep(0.0, 0.4, h));
          color = mix(color, uColorPeak, smoothstep(0.4, 0.7, h));
          color = mix(color, uColorFoam, smoothstep(0.75, 1.0, h));

          // Subtle shimmer on peaks
          float shimmer = sin(vWorldPos.x * 2.0 + uTime * 2.0) *
                          sin(vWorldPos.z * 2.5 + uTime * 1.5) * 0.5 + 0.5;
          color += uColorFoam * shimmer * smoothstep(0.6, 1.0, h) * 0.15;

          // Distance fade into fog
          float dist = length(vWorldPos.xz) / 60.0;
          float fogFactor = 1.0 - smoothstep(0.3, 1.0, dist);

          gl_FragColor = vec4(color, fogFactor * (0.7 + h * 0.3));
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    })

    const ocean = new THREE.Mesh(geometry, material)
    scene.add(ocean)

    // --- Wireframe overlay (subtle grid on waves) ---
    const wireMat = new THREE.ShaderMaterial({
      uniforms: material.uniforms,
      vertexShader: material.vertexShader,
      fragmentShader: `
        varying float vElevation;
        varying vec3 vWorldPos;
        void main() {
          float h = (vElevation + 4.0) / 8.0;
          h = clamp(h, 0.0, 1.0);
          vec3 color = vec3(0.486, 0.228, 0.929);
          float dist = length(vWorldPos.xz) / 60.0;
          float fogFactor = 1.0 - smoothstep(0.2, 0.8, dist);
          gl_FragColor = vec4(color, h * 0.08 * fogFactor);
        }
      `,
      transparent: true,
      wireframe: true,
      depthWrite: false,
    })
    const wireOcean = new THREE.Mesh(geometry, wireMat)
    wireOcean.position.y = 0.01
    scene.add(wireOcean)

    // --- Floating mist particles above waves ---
    const pCount = 150
    const pGeo = new THREE.BufferGeometry()
    const pPositions = new Float32Array(pCount * 3)
    const pVelocities: { x: number; y: number; z: number }[] = []

    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 80
      pPositions[i * 3 + 1] = Math.random() * 8 + 1
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 80
      pVelocities.push({
        x: (Math.random() - 0.5) * 0.015,
        y: (Math.random() - 0.5) * 0.005,
        z: (Math.random() - 0.5) * 0.01,
      })
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3))

    const pMat = new THREE.PointsMaterial({
      size: 0.08,
      color: new THREE.Color("#c084fc"),
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
    const mist = new THREE.Points(pGeo, pMat)
    scene.add(mist)

    // --- Ambient glow orbs floating above the water ---
    const orbCount = 5
    const orbs: THREE.Mesh[] = []
    const orbData: { baseY: number; speed: number; radius: number; phase: number }[] = []

    for (let i = 0; i < orbCount; i++) {
      const orbGeo = new THREE.SphereGeometry(0.15 + Math.random() * 0.2, 16, 16)
      const orbMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().lerpColors(
          new THREE.Color("#7c3aed"),
          new THREE.Color("#c084fc"),
          Math.random()
        ),
        transparent: true,
        opacity: 0.12 + Math.random() * 0.08,
        depthWrite: false,
      })
      const orb = new THREE.Mesh(orbGeo, orbMat)
      const angle = (i / orbCount) * Math.PI * 2
      const r = 10 + Math.random() * 15
      orb.position.set(Math.cos(angle) * r, 3 + Math.random() * 4, Math.sin(angle) * r)
      scene.add(orb)
      orbs.push(orb)
      orbData.push({
        baseY: orb.position.y,
        speed: 0.3 + Math.random() * 0.4,
        radius: r,
        phase: angle,
      })
    }

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

    // --- Animate ---
    const clock = new THREE.Clock()
    let frameId: number

    function animate() {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      smoothScroll += (scrollTarget - smoothScroll) * 0.04

      // Update uniforms
      material.uniforms.uTime.value = t
      material.uniforms.uScroll.value = smoothScroll

      // Camera: gentle sway + scroll-driven tilt closer to waves
      const camY = 12 - smoothScroll * 5
      const camZ = 30 - smoothScroll * 8
      const lookY = -2 - smoothScroll * 3
      camera.position.x += (mouse.x * 2 - camera.position.x) * 0.01
      camera.position.y += (camY + mouse.y * 1.5 - camera.position.y) * 0.015
      camera.position.z += (camZ - camera.position.z) * 0.015
      camera.lookAt(0, lookY, 0)

      // Mist particles drift
      const posArr = pGeo.attributes.position.array as Float32Array
      for (let i = 0; i < pCount; i++) {
        const idx = i * 3
        posArr[idx] += pVelocities[i].x * (1 + smoothScroll)
        posArr[idx + 1] += pVelocities[i].y
        posArr[idx + 2] += pVelocities[i].z * (1 + smoothScroll)
        // Wrap around
        if (posArr[idx] > 40) posArr[idx] = -40
        if (posArr[idx] < -40) posArr[idx] = 40
        if (posArr[idx + 2] > 40) posArr[idx + 2] = -40
        if (posArr[idx + 2] < -40) posArr[idx + 2] = 40
        if (posArr[idx + 1] > 10) posArr[idx + 1] = 1
        if (posArr[idx + 1] < 0.5) posArr[idx + 1] = 8
      }
      pGeo.attributes.position.needsUpdate = true
      pMat.opacity = 0.35 + smoothScroll * 0.2

      // Floating orbs bob and orbit slowly
      for (let i = 0; i < orbCount; i++) {
        const d = orbData[i]
        const angle = d.phase + t * 0.05
        orbs[i].position.x = Math.cos(angle) * d.radius
        orbs[i].position.z = Math.sin(angle) * d.radius
        orbs[i].position.y = d.baseY + Math.sin(t * d.speed + d.phase) * 1.5
      }

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
      geometry.dispose()
      material.dispose()
      wireMat.dispose()
      pGeo.dispose()
      pMat.dispose()
      orbs.forEach((o) => {
        o.geometry.dispose()
        ;(o.material as THREE.MeshBasicMaterial).dispose()
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
