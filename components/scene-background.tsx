"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

const auroraVertex = `
  uniform float uTime;
  uniform float uScroll;
  varying vec2 vUv;
  varying float vElevation;

  // Simplex noise (compact)
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
      +i.y+vec4(0.0,i1.y,i2.y,1.0))
      +i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main(){
    vUv = uv;
    vec3 pos = position;
    float slow = uTime * 0.06;
    float n = snoise(vec3(pos.x * 0.6, pos.y * 0.3 + slow, slow * 0.5)) * (0.4 + uScroll * 0.2);
    pos.z += n;
    pos.y += sin(pos.x * 1.5 + uTime * 0.12 + uScroll * 0.5) * 0.15;
    vElevation = n;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const auroraFragment = `
  uniform float uTime;
  uniform float uScroll;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  varying vec2 vUv;
  varying float vElevation;

  void main(){
    float blend = smoothstep(-0.3, 0.3, vElevation);
    vec3 color = mix(uColor1, uColor2, blend);

    // Soft vertical & horizontal fade
    float fade = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.75, vUv.y);
    fade *= smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);

    // Very gentle pulse
    float pulse = 0.12 + 0.04 * sin(uTime * 0.3 + vUv.x * 3.0);

    float alpha = fade * (pulse + uScroll * 0.06);
    gl_FragColor = vec4(color, alpha);
  }
`

export default function SceneBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color("#050a18")

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      80
    )
    camera.position.set(0, 0, 5)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.appendChild(renderer.domElement)

    // --- 3 soft aurora ribbons ---
    const ribbonConfigs = [
      { c1: "#0a2a6e", c2: "#1560b5", y: 1.2, z: -4, rx: -0.15 },
      { c1: "#0c1f5e", c2: "#0e4a8a", y: -0.3, z: -5, rx: -0.1 },
      { c1: "#081a50", c2: "#1e5fa0", y: -1.8, z: -6, rx: -0.05 },
    ]

    const materials: THREE.ShaderMaterial[] = []
    const ribbons: THREE.Mesh[] = []

    ribbonConfigs.forEach((cfg) => {
      const geo = new THREE.PlaneGeometry(16, 3.5, 80, 20)
      const mat = new THREE.ShaderMaterial({
        vertexShader: auroraVertex,
        fragmentShader: auroraFragment,
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uColor1: { value: new THREE.Color(cfg.c1) },
          uColor2: { value: new THREE.Color(cfg.c2) },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(0, cfg.y, cfg.z)
      mesh.rotation.x = cfg.rx
      scene.add(mesh)
      ribbons.push(mesh)
      materials.push(mat)
    })

    // --- Sparse background stars ---
    const starCount = 80
    const starGeo = new THREE.BufferGeometry()
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 30
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 18
      starPos[i * 3 + 2] = -8 - Math.random() * 12
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({
      size: 0.025,
      color: 0x6688cc,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

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

    // --- Loop ---
    const clock = new THREE.Clock()
    let frameId: number

    function animate() {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      smoothScroll += (scrollProgress - smoothScroll) * 0.035

      // Update ribbon shaders
      materials.forEach((mat, i) => {
        mat.uniforms.uTime.value = t + i * 3
        mat.uniforms.uScroll.value = smoothScroll
      })

      // Gentle ribbon drift on scroll
      ribbons.forEach((r, i) => {
        const dir = i % 2 === 0 ? 1 : -1
        r.position.y += Math.sin(t * 0.08 + i * 1.5) * 0.0008
        r.position.x += (Math.sin(t * 0.05 + i) * 0.15 * dir + smoothScroll * dir * 0.6 - r.position.x) * 0.005
      })

      // Stars subtle drift
      stars.rotation.y = t * 0.003 + smoothScroll * 0.04
      starMat.opacity = 0.35 + smoothScroll * 0.15

      // Camera: soft parallax + gentle scroll pull
      camera.position.x += (mouse.x * 0.25 - camera.position.x) * 0.015
      camera.position.y += (mouse.y * 0.15 - smoothScroll * 0.3 - camera.position.y) * 0.015
      camera.position.z += (5 - smoothScroll * 0.8 - camera.position.z) * 0.02
      camera.lookAt(0, 0, -3)

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
      materials.forEach((m) => m.dispose())
      ribbons.forEach((r) => r.geometry.dispose())
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
