"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function GiyuCharacter() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2, duration: 0.8, ease: "easeOut" }}
      className="fixed bottom-4 right-4 z-40  sm:block md:bottom-6 md:right-6"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="relative"
      >
        {/* Speech bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3, duration: 0.4 }}
          className="absolute -top-16 right-0 w-max max-w-[140px] rounded-xl border border-accent/30 bg-card/90 px-3 py-2 text-xs text-muted-foreground backdrop-blur-sm"
        >
          <span className="text-accent">Water Breathing...</span>
          <div className="absolute -bottom-2 right-6 h-3 w-3 rotate-45 border-b border-r border-accent/30 bg-card/90" />
        </motion.div>

        {/* Giyu image */}
        <div className="relative cursor-pointer transition-transform hover:scale-110">
          <Image
            src="/giyu.webp"
            alt="Giyu Tomioka"
            width={112}
            height={112}
            className="object-contain drop-shadow-lg"
          />
        </div>

        {/* Water effect around Giyu */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute -bottom-2 left-1/2 h-6 w-16 -translate-x-1/2 rounded-full bg-gradient-to-t from-accent/40 to-transparent blur-md"
        />
      </motion.div>
    </motion.div>
  )
}
