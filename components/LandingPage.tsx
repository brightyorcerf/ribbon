'use client'

import { useState, useEffect } from 'react'
import { supabase, type Link } from '@/lib/supabase'
import HopsAwayButton from './HopsAwayButton'
import gsap from 'gsap'

type LandingPageProps = {
  link: Link
}

const THEME_COLORS: Record<number, { primary: string; secondary: string; bgClass: string }> = {
  1: { primary: '#E60012', secondary: '#FFB3D9', bgClass: 'bg-sanrio-red' },
  2: { primary: '#FFB3D9', secondary: '#E60012', bgClass: 'bg-sanrio-pink' },
  3: { primary: '#B19CD9', secondary: '#FFB3D9', bgClass: 'bg-sanrio-lavender' },
}

// Generate sparkles data
const generateSparkles = () => {
  return [...Array(20)].map(() => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
  }))
}

export default function LandingPage({ link }: LandingPageProps) {
  const [response, setResponse] = useState<'yes' | 'no' | null>(null)
  const [showIdentity, setShowIdentity] = useState(false)
  const [sparkles, setSparkles] = useState<Array<{left: number, top: number, delay: number, duration: number}>>([])
  const theme = THEME_COLORS[link.theme_id]

  // Generate sparkles only on client side (fixes hydration error)
  useEffect(() => {
    setSparkles(generateSparkles())
  }, [])

  // Handle "Yes" click
  const handleYes = async () => {
    // Update database
    await supabase
      .from('links')
      .update({ response: 'yes' })
      .eq('slug', link.slug)

    setResponse('yes')
    
    // Trigger celebration animation
    createConfetti()
    
    // Reveal identity if anonymous
    if (link.is_anonymous) {
      setTimeout(() => {
        setShowIdentity(true)
      }, 1500)
    }
  }

  // Handle final "No" click
  const handleNo = async () => {
    // Update database
    await supabase
      .from('links')
      .update({ response: 'no' })
      .eq('slug', link.slug)

    setResponse('no')
    
    // Trigger sad animation
    document.body.style.filter = 'grayscale(100%)'
  }

  // Create confetti explosion
  const createConfetti = () => {
    const colors = [theme.primary, theme.secondary, '#FFD700']
    const confettiCount = 50

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti'
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: 50%;
        left: 50%;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0%'};
        z-index: 9999;
      `
      document.body.appendChild(confetti)

      gsap.to(confetti, {
        x: (Math.random() - 0.5) * 1000,
        y: (Math.random() - 0.5) * 1000,
        rotation: Math.random() * 360,
        opacity: 0,
        duration: 2,
        ease: 'power2.out',
        onComplete: () => confetti.remove(),
      })
    }
  }

  // Redirect to generator after "No"
  const handleMakeOwn = () => {
    window.location.href = '/'
  }

  // YES RESPONSE STATE
  if (response === 'yes') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-cream">
        <div className="text-center max-w-2xl w-full">
          <h1 className="text-5xl md:text-8xl font-display mb-6 md:mb-8 animate-bounce">
            🎉 YES! 🎉
          </h1>
          
          {link.is_anonymous && showIdentity && (
            <div className="mb-6 md:mb-8 bg-white p-4 md:p-6 rounded-chunky border-4 border-chocolate shadow-hard-chocolate">
              <p className="font-display text-2xl md:text-3xl text-chocolate mb-2">
                It was...
              </p>
              <p className="font-display text-4xl md:text-5xl break-words" style={{ color: theme.primary }}>
                {link.creator_name}! 💝
              </p>
            </div>
          )}
          
          <p className="text-lg md:text-2xl font-mono text-chocolate/70 mb-6 md:mb-8 px-4">
            {link.is_anonymous && !showIdentity 
              ? 'Your secret admirer is so happy right now! 💖'
              : `${link.creator_name} is over the moon! 💖`
            }
          </p>

          <div className="bg-white p-4 md:p-6 rounded-chunky border-4 border-chocolate shadow-hard inline-block">
            <p className="font-mono text-chocolate/70 text-xs md:text-sm mb-2">
              Screenshot this moment! 📸
            </p>
            <p className="font-display text-lg md:text-xl text-chocolate break-words">
              {link.recipient_name} said YES at
            </p>
            <p className="font-mono text-chocolate/70 text-sm md:text-base">
              {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // NO RESPONSE STATE
  if (response === 'no') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-cream transition-all duration-1000">
        <div className="text-center max-w-2xl w-full">
          <h1 className="text-5xl md:text-8xl font-display mb-6 md:mb-8 text-chocolate/50">
            💔
          </h1>
          
          <p className="text-2xl md:text-3xl font-display text-chocolate/70 mb-3 md:mb-4 px-4">
            Oof, that's cold...
          </p>
          
          <p className="text-lg md:text-xl font-mono text-chocolate/50 mb-8 md:mb-12 px-4">
            {link.is_anonymous 
              ? "Someone's heart just broke a little... 😢"
              : `${link.creator_name} will understand... eventually 😢`
            }
          </p>

          <div className="space-y-4 px-4">
            <p className="font-mono text-chocolate/70 text-sm md:text-base">
              Want to shoot YOUR shot with someone?
            </p>
            <button
              onClick={handleMakeOwn}
              className="bg-sanrio-lavender text-white font-display text-lg md:text-xl py-3 md:py-4 px-6 md:px-8 rounded-chunky border-4 border-chocolate shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              Make My Own Link 💘
            </button>
          </div>
        </div>
      </div>
    )
  }

  // DEFAULT STATE (THE ASK)
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${theme.primary}20 0%, ${theme.secondary}20 100%)` 
      }}
    >
      {/* Floating sparkles background */}
      <div className="absolute inset-0 pointer-events-none">
        {sparkles.map((sparkle, i) => (
          <div
            key={i}
            className="absolute text-2xl md:text-4xl opacity-20 animate-float"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              animationDelay: `${sparkle.delay}s`,
              animationDuration: `${sparkle.duration}s`,
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl w-full px-4">
        
        {/* Profile icon */}
        {link.icon_url && (
          <div className="mb-6 md:mb-8 flex justify-center">
            <img
              src={link.icon_url}
              alt="Profile"
              className="w-24 h-24 md:w-40 md:h-40 rounded-full border-4 md:border-8 border-chocolate shadow-hard-chocolate object-cover animate-float"
            />
          </div>
        )}

        {/* Greeting */}
        <h1 className="text-4xl md:text-7xl font-display mb-4 md:mb-6 break-words leading-tight" style={{ color: theme.primary }}>
          Hey {link.recipient_name}! 👋
        </h1>

        {/* From line (only if not anonymous) */}
        {!link.is_anonymous && (
          <p className="text-lg md:text-2xl font-mono text-chocolate/70 mb-6 md:mb-8 break-words">
            From: {link.creator_name} 💝
          </p>
        )}

        {/* The question */}
        <div className="bg-white p-6 md:p-12 rounded-chunky border-4 border-chocolate shadow-hard-chocolate mb-8 md:mb-12">
          <p className="text-3xl md:text-5xl font-display mb-6 md:mb-8 text-chocolate leading-tight">
            Will you be mine? 💕
          </p>

          {/* Buttons container */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center">
            {/* YES button */}
            <button
              onClick={handleYes}
              className="w-full md:w-auto bg-sanrio-red text-white font-display text-xl md:text-2xl py-3 md:py-4 px-8 md:px-12 rounded-chunky border-4 border-chocolate shadow-hard-chocolate hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all"
            >
              YES! 💝
            </button>

            {/* NO button (hops away) */}
            <HopsAwayButton onFinalNo={handleNo} />
          </div>
        </div>

        {/* Anonymous hint */}
        {link.is_anonymous && (
          <p className="text-xs md:text-sm font-mono text-chocolate/50 px-4">
            🎭 This is from a secret admirer... click "YES" to find out who! 
          </p>
        )}
      </div>
    </div>
  )
}