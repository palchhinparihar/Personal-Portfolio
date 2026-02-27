"use client"

import { motion } from "framer-motion"

export default function GiyuCharacter() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2, duration: 0.8, ease: "easeOut" }}
      className="fixed bottom-4 right-4 z-40 hidden sm:block md:bottom-6 md:right-6"
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

        {/* Giyu chibi illustration using CSS art */}
        <div className="relative h-24 w-20 cursor-pointer transition-transform hover:scale-110 md:h-28 md:w-24">
          {/* Haori (jacket) - split design */}
          <div className="absolute bottom-0 left-0 h-16 w-10 rounded-bl-lg rounded-tl-2xl bg-gradient-to-b from-[#8b2942] to-[#6b1d32] md:h-20 md:w-12" />
          <div className="absolute bottom-0 right-0 h-16 w-10 rounded-br-lg rounded-tr-2xl bg-gradient-to-b from-[#2d5a4a] to-[#1d4035] md:h-20 md:w-12" />
          
          {/* Geometric pattern on haori */}
          <div className="absolute bottom-2 left-1 grid grid-cols-3 gap-[2px] md:left-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-2 w-2 rounded-sm bg-[#c44569]/60 md:h-2.5 md:w-2.5" />
            ))}
          </div>
          <div className="absolute bottom-2 right-1 grid grid-cols-3 gap-[2px] md:right-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-2 w-2 rounded-sm bg-[#4a9a7a]/60 md:h-2.5 md:w-2.5" />
            ))}
          </div>

          {/* Head */}
          <div className="absolute left-1/2 top-0 h-12 w-12 -translate-x-1/2 rounded-full bg-[#fce4d6] md:h-14 md:w-14" />
          
          {/* Hair */}
          <div className="absolute left-1/2 top-0 h-8 w-14 -translate-x-1/2 rounded-t-full bg-[#1a1a2e] md:h-9 md:w-16" />
          <div className="absolute left-1 top-3 h-6 w-3 rounded-full bg-[#1a1a2e] md:left-0 md:h-7 md:w-4" />
          <div className="absolute right-1 top-3 h-6 w-3 rounded-full bg-[#1a1a2e] md:right-0 md:h-7 md:w-4" />
          
          {/* Bangs */}
          <div className="absolute left-1/2 top-2 h-4 w-10 -translate-x-1/2 rounded-b-full bg-[#1a1a2e] md:h-5 md:w-12" />

          {/* Eyes */}
          <div className="absolute left-[22px] top-6 h-2.5 w-2 rounded-full bg-[#4a90a4] md:left-[26px] md:top-7 md:h-3 md:w-2.5" />
          <div className="absolute right-[22px] top-6 h-2.5 w-2 rounded-full bg-[#4a90a4] md:right-[26px] md:top-7 md:h-3 md:w-2.5" />
          
          {/* Eye highlights */}
          <div className="absolute left-[24px] top-[26px] h-1 w-1 rounded-full bg-white md:left-[29px] md:top-[30px]" />
          <div className="absolute right-[24px] top-[26px] h-1 w-1 rounded-full bg-white md:right-[29px] md:top-[30px]" />

          {/* Mouth - neutral expression */}
          <div className="absolute left-1/2 top-10 h-[2px] w-3 -translate-x-1/2 rounded-full bg-[#c4a08a] md:top-12" />

          {/* Katana handle visible */}
          <div className="absolute -left-1 bottom-8 h-8 w-1.5 rotate-12 rounded-full bg-[#4a3728] md:bottom-10 md:h-10" />
          <div className="absolute -left-1 bottom-[60px] h-2 w-2 rotate-12 rounded-sm bg-[#d4af37] md:bottom-[76px]" />
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
