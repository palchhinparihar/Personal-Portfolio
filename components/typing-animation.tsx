"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface TypingAnimationProps {
  text: string
  className?: string
  typingSpeed?: number
  startDelay?: number
}

export default function TypingAnimation({
  text,
  className = "",
  typingSpeed = 100,
  startDelay = 500,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsTyping(true)
    }, startDelay)

    return () => clearTimeout(startTimeout)
  }, [startDelay])

  useEffect(() => {
    if (!isTyping) return

    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1))
      }, typingSpeed)

      return () => clearTimeout(timeout)
    } else {
      // Keep cursor blinking after typing is done
      const cursorInterval = setInterval(() => {
        setShowCursor((prev) => !prev)
      }, 530)

      return () => clearInterval(cursorInterval)
    }
  }, [displayedText, isTyping, text, typingSpeed])

  // Parse text to add styling to specific parts
  const renderText = () => {
    const parts = displayedText.split(/(Palchhin|~)/g)
    return parts.map((part, index) => {
      if (part === "Palchhin") {
        return (
          <span key={index} className="text-primary">
            {part}
          </span>
        )
      }
      if (part === "~") {
        return (
          <span key={index} className="text-accent">
            {part}
          </span>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <span className={className}>
      {renderText()}
      <motion.span
        animate={{ opacity: showCursor ? 1 : 0 }}
        transition={{ duration: 0.1 }}
        className="ml-1 inline-block h-[0.9em] w-[3px] translate-y-[0.1em] bg-primary"
      />
    </span>
  )
}
