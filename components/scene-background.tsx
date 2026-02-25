"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

// Custom shader for aurora ribbons
const auroraVertexShader = `
  uniform float uTime;
  uniform float uScroll;
  varying vec2 vUv;
  varying float vElevation;
  varying float vDistort;

  // Simplex-style noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    float scrollWave = uScroll * 1.5;
    float noiseFreq = 1.2 + uScroll * 0.8;
    float noiseAmp = 0.8 + uScroll * 0.6;

    float noise1 = snoise(vec3(pos.x * noiseFreq, pos.y * 0.5 + uTime * 0.15, uTime * 0.1)) * noiseAmp;
    float noise2 = snoise(vec3(pos.x * 0.5, pos.y * noiseFreq + uTime * 0.1, uTime * 0.08 + 10.0)) * noiseAmp * 0.5;

    pos.z += noise1 + noise2;
    pos.y += sin(pos.x * 2.0 + uTime * 0.3 + scrollWave) * 0.3;

    vElevation = noise1;
    vDistort = noise2;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const auroraFragmentShader = `
  uniform float uTime;
  uniform float uScroll;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  varying vec2 vUv;
  varying float vElevation;
  varying float vDistort;

  void main() {
    float mixStrength = (vElevation + 0.5) * 0.5 + vDistort * 0.3;
    mixStrength = clamp(mixStrength, 0.0, 1.0);

    // Blend between three colors based on elevation and scroll
    vec3 color = mix(uColor1, uColor2, mixStrength);
    color = mix(color, uColor3, smoothstep(0.3, 0.8, mixStrength + uScroll * 0.3));

    // Edge fade for ribbon look
    float edgeFade = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
    float sideFade = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);

    // Glow intensity pulses
    float glow = 0.4 + 0.3 * sin(uTime * 0.5 + vUv.x * 6.0) + uScroll * 0.2;

    float alpha = edgeFade * sideFade * glow;
    alpha *= (0.35 + uScroll * 0.25);

    gl_FragColor = vec4(color, alpha);
  }
`

export default function SceneBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // --- Scene setup ---
    const scene = new THREE.Scene()
    scene.background = new THREE.Color("#050a18")

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0, 5)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.appendChild(renderer.domElement)

    // --- Aurora ribbons ---
    const ribbonCount = 5
    const ribbons: THREE.Mesh[] = []
    const materials: THREE.ShaderMaterial[] = []

    const colorSets = [
      { c1: new THREE.Color("#1a3aff"), c2: new THREE.Color("#00d4ff"), c3: new THREE.Color("#0066ff") },
      { c1: new THREE.Color("#0044cc"), c2: new THREE.Color("#22ccff"), c3: new THREE.Color("#4488ff") },
      { c1: new THREE.Color("#003399"), c2: new THREE.Color("#00aaff"), c3: new THREE.Color("#0077cc") },
      { c1: new THREE.Color("#1155cc"), c2: new THREE.Color("#33ddff"), c3: new THREE.Color("#2266dd") },
      { c1: new THREE.Color("#0022aa"), c2: new THREE.Color("#00bbee"), c3: new THREE.Color("#3399ff") },
    ]

    for (let i = 0; i < ribbonCount; i++) {
      const geo = new THREE.PlaneGeometry(14, 2.5, 128, 32)
      const mat = new THREE.ShaderMaterial({
        vertexShader: auroraVertexShader,
        fragmentShader: auroraFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uColor1: { value: colorSets[i].c1 },
          uColor2: { value: colorSets[i].c2 },
          uColor3: { value: colorSets[i].c3 },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })

      const ribbon = new THREE.Mesh(geo, mat)
      ribbon.position.set(
        (Math.random() - 0.5) * 3,
        (i - ribbonCount / 2) * 1.2 + (Math.random() - 0.5) * 0.5,
        -2 - i * 0.5
      )
      ribbon.rotation.x = -0.2 + Math.random() * 0.15
      ribbon.rotation.z = (Math.random() - 0.5) * 0.1

      scene.add(ribbon)
      ribbons.push(ribbon)
      materials.push(mat)
    }

    // --- Subtle star particles ---
    const starCount = 150
    const starGeo = new THREE.BufferGeometry()
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 25
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 15
      starPositions[i * 3 + 2] = -5 - Math.random() * 10
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3))
    const starMat = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x88aaff,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // --- Floating glow orbs ---
    const orbCount = 8
    const orbs: THREE.Mesh[] = []
    const orbMat = new THREE.MeshBasicMaterial({
      color: 0x2266ff,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    })

    for (let i = 0; i < orbCount; i++) {
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.15 + Math.random() * 0.3, 16, 16),
        orbMat.clone()
      )
      orb.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        -1 - Math.random() * 5
      )
      scene.add(orb)
      orbs.push(orb)
    }

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
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      scrollProgress =
        maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    // --- Animation loop ---
    const clock = new THREE.Clock()
    let frameId: number

    function animate() {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Smooth scroll lerp
      smoothScroll += (scrollProgress - smoothScroll) * 0.04

      // Update aurora ribbon uniforms
      materials.forEach((mat, i) => {
        mat.uniforms.uTime.value = t + i * 2.5
        mat.uniforms.uScroll.value = smoothScroll
      })

      // Ribbons sway with scroll
      ribbons.forEach((ribbon, i) => {
        const dir = i % 2 === 0 ? 1 : -1
        ribbon.position.x +=
          (Math.sin(t * 0.15 + i) * 0.3 * dir +
            smoothScroll * dir * 1.5 -
            ribbon.position.x) * 0.01
        ribbon.rotation.z =
          (Math.random() - 0.5) * 0.005 +
          ribbon.rotation.z +
          Math.sin(t * 0.1 + i) * 0.0005
        ribbon.position.y +=
          Math.sin(t * 0.2 + i * 1.3) * 0.001 +
          smoothScroll * (i % 2 === 0 ? 0.002 : -0.002)
      })

      // Stars gentle drift
      stars.rotation.y = t * 0.005 + smoothScroll * 0.1
      stars.rotation.x = smoothScroll * 0.05
      starMat.opacity = 0.5 + smoothScroll * 0.3

      // Orbs float and pulse
      orbs.forEach((orb, i) => {
        orb.position.y += Math.sin(t * 0.3 + i * 1.5) * 0.003
        orb.position.x += Math.cos(t * 0.2 + i * 2.0) * 0.002
        const scale = 1 + Math.sin(t * 0.5 + i) * 0.2 + smoothScroll * 0.5
        orb.scale.setScalar(scale)
        const m = orb.material as THREE.MeshBasicMaterial
        m.opacity = 0.08 + Math.sin(t * 0.4 + i) * 0.04 + smoothScroll * 0.1
      })

      // Camera parallax from mouse + scroll
      const camZ = 5 - smoothScroll * 1.5
      camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.02
      camera.position.y +=
        (mouse.y * 0.2 + smoothScroll * -0.5 - camera.position.y) * 0.02
      camera.position.z += (camZ - camera.position.z) * 0.03
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

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      starGeo.dispose()
      starMat.dispose()
      orbMat.dispose()
      materials.forEach((m) => m.dispose())
      ribbons.forEach((r) => r.geometry.dispose())
      orbs.forEach((o) => {
        o.geometry.dispose()
        ;(o.material as THREE.Material).dispose()
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
