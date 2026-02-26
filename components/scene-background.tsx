"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

const vertexShader = `
  uniform float uTime;
  uniform float uScroll;
  varying vec2 vUv;
  varying float vDistort;

  // Simplex-style noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
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

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vUv = uv;
    float speed = 0.25;
    float distortAmount = 0.35 + uScroll * 0.5;

    float noise = snoise(normal * 1.5 + uTime * speed);
    float noise2 = snoise(normal * 3.0 + uTime * speed * 0.7) * 0.5;
    float combined = noise + noise2;

    vDistort = combined;

    vec3 newPosition = position + normal * combined * distortAmount;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform float uScroll;
  varying vec2 vUv;
  varying float vDistort;

  void main() {
    // Deep purple base
    vec3 color1 = vec3(0.36, 0.07, 0.60);  // #5c1299
    vec3 color2 = vec3(0.58, 0.17, 0.86);  // #942bdb
    vec3 color3 = vec3(0.75, 0.35, 1.0);   // bright violet

    float mixFactor = (vDistort + 1.0) * 0.5;
    vec3 color = mix(color1, color2, mixFactor);
    color = mix(color, color3, pow(mixFactor, 2.0) * (0.4 + uScroll * 0.3));

    // Fresnel-like glow at edges
    float alpha = 0.18 + mixFactor * 0.15 + uScroll * 0.1;
    gl_FragColor = vec4(color, alpha);
  }
`

export default function SceneBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color("#0a0710")

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0, 5)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.appendChild(renderer.domElement)

    // --- Morphing blob ---
    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
    }
    const blobGeo = new THREE.IcosahedronGeometry(1.8, 64)
    const blobMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      wireframe: false,
    })
    const blob = new THREE.Mesh(blobGeo, blobMat)
    blob.position.set(0, 0, -1)
    scene.add(blob)

    // --- Wireframe overlay for the blob ---
    const wireMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: `
        uniform float uTime;
        uniform float uScroll;
        varying float vDistort;
        varying vec2 vUv;
        void main() {
          vec3 color = vec3(0.58, 0.17, 0.86);
          float alpha = 0.06 + abs(vDistort) * 0.04;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      uniforms,
      transparent: true,
      depthWrite: false,
      wireframe: true,
    })
    const wireBlob = new THREE.Mesh(blobGeo, wireMat)
    wireBlob.position.copy(blob.position)
    scene.add(wireBlob)

    // --- Floating particles ---
    const pCount = 80
    const pGeo = new THREE.BufferGeometry()
    const pPos = new Float32Array(pCount * 3)
    const pSpeeds: { x: number; y: number; z: number }[] = []

    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 16
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3
      pSpeeds.push({
        x: (Math.random() - 0.5) * 0.003,
        y: (Math.random() - 0.5) * 0.003,
        z: (Math.random() - 0.5) * 0.001,
      })
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3))

    const pMat = new THREE.PointsMaterial({
      size: 0.02,
      color: new THREE.Color("#c084fc"),
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // --- Subtle ring ---
    const ringGeo = new THREE.TorusGeometry(3, 0.008, 16, 128)
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#7c3aed"),
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.position.z = -2
    ring.rotation.x = Math.PI / 2.5
    scene.add(ring)

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

      // Update shader uniforms
      uniforms.uTime.value = t
      uniforms.uScroll.value = smoothScroll

      // Blob rotation reacts to scroll
      blob.rotation.y = t * 0.12 + smoothScroll * 1.5
      blob.rotation.x = Math.sin(t * 0.08) * 0.3 + smoothScroll * 0.5
      wireBlob.rotation.copy(blob.rotation)

      // Blob scale pulses slightly
      const s = 1 + Math.sin(t * 0.5) * 0.03 + smoothScroll * 0.15
      blob.scale.setScalar(s)
      wireBlob.scale.setScalar(s)

      // Particles drift
      const posArr = pGeo.attributes.position.array as Float32Array
      for (let i = 0; i < pCount; i++) {
        const idx = i * 3
        posArr[idx] += pSpeeds[i].x * (1 + smoothScroll * 2)
        posArr[idx + 1] += pSpeeds[i].y * (1 + smoothScroll * 2)
        posArr[idx + 2] += pSpeeds[i].z
        if (posArr[idx] > 8) posArr[idx] = -8
        if (posArr[idx] < -8) posArr[idx] = 8
        if (posArr[idx + 1] > 6) posArr[idx + 1] = -6
        if (posArr[idx + 1] < -6) posArr[idx + 1] = 6
      }
      pGeo.attributes.position.needsUpdate = true
      pMat.opacity = 0.5 + smoothScroll * 0.25

      // Ring rotates
      ring.rotation.z = t * 0.06 + smoothScroll * 0.8
      ringMat.opacity = 0.1 + smoothScroll * 0.08

      // Camera follows mouse subtly
      camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.015
      camera.position.y += (mouse.y * 0.25 - camera.position.y) * 0.015
      camera.lookAt(blob.position)

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
      blobGeo.dispose()
      blobMat.dispose()
      wireMat.dispose()
      pGeo.dispose()
      pMat.dispose()
      ringGeo.dispose()
      ringMat.dispose()
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
