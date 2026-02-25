"use client"

import dynamic from "next/dynamic"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"

const SceneBackground = dynamic(
  () => import("@/components/scene-background"),
  { ssr: false }
)

export default function Home() {
  return (
    <main>
      <SceneBackground />
      <Navbar />
      <HeroSection />
    </main>
  )
}
