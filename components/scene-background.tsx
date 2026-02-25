"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useMemo } from "react"
import * as THREE from "three"

function FloatingParticles({ count = 200 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null)
  const light = useRef<THREE.PointLight>(null)

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
      sizes[i] = Math.random() * 0.03 + 0.01
    }
    return { positions, sizes }
  }, [count])

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.02
      mesh.current.rotation.y = state.clock.elapsedTime * 0.03
    }
    if (light.current) {
      light.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 5
      light.current.position.y = Math.cos(state.clock.elapsedTime * 0.3) * 5
    }
  })

  return (
    <>
      <pointLight ref={light} color="#4a7cff" intensity={2} distance={15} />
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={count}
            array={particles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#4a7cff"
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  )
}

function FloatingGeometry() {
  const groupRef = useRef<THREE.Group>(null)
  const icosaRef = useRef<THREE.Mesh>(null)
  const torusRef = useRef<THREE.Mesh>(null)
  const octaRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05
    }
    if (icosaRef.current) {
      icosaRef.current.rotation.x = t * 0.3
      icosaRef.current.rotation.z = t * 0.2
      icosaRef.current.position.y = Math.sin(t * 0.5) * 0.5
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.4
      torusRef.current.rotation.y = t * 0.2
      torusRef.current.position.y = Math.cos(t * 0.6) * 0.4
    }
    if (octaRef.current) {
      octaRef.current.rotation.y = t * 0.35
      octaRef.current.rotation.z = t * 0.15
      octaRef.current.position.y = Math.sin(t * 0.4 + 1) * 0.3
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={icosaRef} position={[3, 1, -2]}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial
          color="#2a4fff"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>
      <mesh ref={torusRef} position={[-3.5, -1, -1]}>
        <torusGeometry args={[0.7, 0.2, 16, 32]} />
        <meshStandardMaterial
          color="#1e90ff"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
      <mesh ref={octaRef} position={[0, -2.5, -3]}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color="#5b8cff"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  )
}

function GridFloor() {
  const gridRef = useRef<THREE.GridHelper>(null)

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z =
        ((state.clock.elapsedTime * 0.3) % 1) * -1
    }
  })

  return (
    <gridHelper
      ref={gridRef}
      args={[30, 30, "#1a3a6a", "#0d1f3c"]}
      position={[0, -4, 0]}
      rotation={[0, 0, 0]}
    />
  )
}

export default function SceneBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={["#060b18"]} />
        <fog attach="fog" args={["#060b18", 5, 25]} />
        <ambientLight intensity={0.15} />
        <pointLight position={[5, 5, 5]} color="#4a7cff" intensity={0.5} />
        <pointLight position={[-5, -3, 3]} color="#1e4fff" intensity={0.3} />
        <FloatingParticles count={300} />
        <FloatingGeometry />
        <GridFloor />
      </Canvas>
    </div>
  )
}
