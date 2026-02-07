'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'

type HopsAwayButtonProps = {
  onFinalNo: () => void
}

export default function HopsAwayButton({ onFinalNo }: HopsAwayButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hopCount, setHopCount] = useState(0)
  const MAX_HOPS = 3

  const handleHover = () => {
    if (hopCount >= MAX_HOPS) return

    const button = buttonRef.current
    const container = containerRef.current
    if (!button || !container) return

    // Get container dimensions
    const containerRect = container.getBoundingClientRect()
    const buttonWidth = button.offsetWidth
    const buttonHeight = button.offsetHeight

    // Calculate safe bounds within container
    const padding = 10
    const maxX = containerRect.width - buttonWidth - padding
    const maxY = containerRect.height - buttonHeight - padding

    // Generate random position within container
    const randomX = Math.random() * maxX
    const randomY = Math.random() * maxY

    // Animate to new position (relative to container)
    gsap.to(button, {
      x: randomX,
      y: randomY,
      duration: 0.3,
      ease: 'power2.out',
    })

    setHopCount(hopCount + 1)
  }

  const handleClick = () => {
    if (hopCount >= MAX_HOPS) {
      onFinalNo()
    }
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full md:w-auto md:min-w-[200px] h-[60px] md:h-[80px]"
    >
      <button
        ref={buttonRef}
        onMouseEnter={handleHover}
        onTouchStart={handleHover}
        onClick={handleClick}
        className={`
          bg-chocolate/10 text-chocolate font-display text-xl md:text-2xl 
          py-3 px-8 rounded-chunky border-4 border-chocolate/30 
          ${hopCount >= MAX_HOPS ? 'shadow-hard-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none cursor-pointer' : 'cursor-default'}
          transition-all absolute top-0 left-0
        `}
      >
        {hopCount >= MAX_HOPS ? 'No 😔' : 'No...?'}
      </button>
    </div>
  )
}