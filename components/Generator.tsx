'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { nanoid } from 'nanoid'

type Theme = {
  id: number
  name: string
  primary: string
  secondary: string
  bgClass: string
}

const THEMES: Theme[] = [
  { 
    id: 1, 
    name: 'Classic Red', 
    primary: '#E60012', 
    secondary: '#FFB3D9',
    bgClass: 'bg-sanrio-red'
  },
  { 
    id: 2, 
    name: 'Soft Pink', 
    primary: '#FFB3D9', 
    secondary: '#E60012',
    bgClass: 'bg-sanrio-pink'
  },
  { 
    id: 3, 
    name: 'Cyber Lavender', 
    primary: '#B19CD9', 
    secondary: '#FFB3D9',
    bgClass: 'bg-sanrio-lavender'
  },
]

export default function Generator() {
  const [recipientName, setRecipientName] = useState('')
  const [creatorName, setCreatorName] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<Theme>(THEMES[0])
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB')
      return
    }

    setIconFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setIconPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Resize image on client side
  const resizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')!
          
          // Set to 400x400
          canvas.width = 400
          canvas.height = 400
          
          // Draw image centered and cropped
          const size = Math.min(img.width, img.height)
          const x = (img.width - size) / 2
          const y = (img.height - size) / 2
          
          ctx.drawImage(img, x, y, size, size, 0, 0, 400, 400)
          
          canvas.toBlob((blob) => {
            resolve(blob!)
          }, 'image/jpeg', 0.9)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  // Generate the link
  const handleGenerate = async () => {
    // Validation
    if (!recipientName.trim()) {
      alert('Please enter a recipient name')
      return
    }

    if (!isAnonymous && !creatorName.trim()) {
      alert('Please enter your name or enable anonymous mode')
      return
    }

    if (recipientName.length > 15) {
      alert('Recipient name must be 15 characters or less')
      return
    }

    setIsGenerating(true)

    try {
      // Generate unique slug
      const slug = nanoid(8)
      console.log('Generated slug:', slug)
      
      let iconUrl = null

      // Upload icon if provided
      if (iconFile) {
        console.log('Starting image upload...')
        const resizedBlob = await resizeImage(iconFile)
        const fileName = `${slug}-${Date.now()}.jpg`
        
        console.log('Uploading to Supabase Storage:', fileName)
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('icons')
          .upload(fileName, resizedBlob)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          throw new Error(`Upload failed: ${uploadError.message}`)
        }

        console.log('Upload successful:', uploadData)

        // Get public URL
        const { data } = supabase.storage
          .from('icons')
          .getPublicUrl(fileName)
        
        iconUrl = data.publicUrl
        console.log('Public URL:', iconUrl)
      }

      // Insert into database
      console.log('Inserting into database...')
      const linkData = {
        slug,
        recipient_name: recipientName.trim(),
        creator_name: isAnonymous ? null : creatorName.trim(),
        theme_id: selectedTheme.id,
        icon_url: iconUrl,
        is_anonymous: isAnonymous,
      }
      console.log('Link data:', linkData)

      const { data: insertData, error: dbError } = await supabase
        .from('links')
        .insert(linkData)
        .select()

      if (dbError) {
        console.error('Database error:', dbError)
        throw new Error(`Database insert failed: ${dbError.message}`)
      }

      console.log('Database insert successful:', insertData)

      // Generate URL 
      const url = `${window.location.origin}/be-mine/${slug}`

      // Copy to clipboard with context-aware message
      const shareMessage = isAnonymous
        ? `Someone made you something special 💝\n${url}\n\n(I don't know who sent this, just passing it along!)`
        : `Hey! I made you something 💝\n${url}`

      // Try to copy to clipboard (but don't fail if it doesn't work)
      try {
        await navigator.clipboard.writeText(shareMessage)
        console.log('✅ Copied to clipboard!')
      } catch (clipboardError) {
        console.log('Could not copy to clipboard (you can copy manually)')
      }

      console.log('Success! URL generated:', url)

      // Set the generated URL to show success state
      setGeneratedUrl(url)

    } catch (error) {
      console.error('Error generating link:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Reset form
  const handleReset = () => {
    setRecipientName('')
    setCreatorName('')
    setIsAnonymous(false)
    setSelectedTheme(THEMES[0])
    setIconFile(null)
    setIconPreview(null)
    setGeneratedUrl(null)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-6xl md:text-7xl font-display text-sanrio-red mb-4 animate-float">
          Ribbon 💌
        </h1>
        <p className="text-xl font-mono text-chocolate/70">
          Create a link. Send it. Watch them say yes.
        </p>
      </div>

      {generatedUrl ? (
        // Success State
        <div className="bg-white p-8 rounded-chunky border-4 border-chocolate shadow-hard-chocolate">
          <h2 className="text-3xl font-display text-center mb-6">
            ✨ Your Link is Ready! ✨
          </h2>
          
          <div className="bg-cream p-4 rounded-chunky border-2 border-chocolate/20 mb-6 break-all font-mono text-sm">
            {generatedUrl}
          </div>

          <p className="text-center text-chocolate/70 mb-6 font-mono text-sm">
            📋 Message copied to clipboard!
          </p>

          <button
            onClick={handleReset}
            className="w-full bg-sanrio-lavender text-white font-display text-xl py-4 px-6 rounded-chunky border-4 border-chocolate shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            Make Another One 💌
          </button>
        </div>
      ) : (
        // Form State
        <div className="bg-white p-8 rounded-chunky border-4 border-chocolate shadow-hard-chocolate">
          
          {/* Recipient Name */}
          <div className="mb-6">
            <label className="block font-display text-2xl mb-3 text-chocolate">
              Who's the lucky one? 🤍
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              maxLength={15}
              placeholder="Their name..."
              className="w-full px-4 py-3 font-mono border-4 border-chocolate rounded-chunky focus:outline-none focus:ring-4 focus:ring-sanrio-pink/50 bg-cream"
            />
            <p className="text-sm font-mono text-chocolate/50 mt-2">
              {recipientName.length}/15 characters
            </p>
          </div>

          {/* Anonymous Toggle */}
          <div className="mb-6 bg-cream p-4 rounded-chunky border-2 border-chocolate/20">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-6 h-6 rounded border-2 border-chocolate"
              />
              <span className="font-display text-xl">
                🎭 Send Anonymously (Secret Admirer Mode)
              </span>
            </label>
          </div>

          {/* Creator Name (only if not anonymous) */}
          {!isAnonymous && (
            <div className="mb-6">
              <label className="block font-display text-2xl mb-3 text-chocolate">
                What's your name? ✨
              </label>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="Your name..."
                className="w-full px-4 py-3 font-mono border-4 border-chocolate rounded-chunky focus:outline-none focus:ring-4 focus:ring-sanrio-pink/50 bg-cream"
              />
            </div>
          )}

          {/* Theme Selector */}
          <div className="mb-6">
            <label className="block font-display text-2xl mb-3 text-chocolate">
              Pick a vibe 🎨
            </label>
            <div className="grid grid-cols-3 gap-4">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`p-4 rounded-chunky border-4 transition-all ${
                    selectedTheme.id === theme.id
                      ? 'border-chocolate shadow-hard scale-105'
                      : 'border-chocolate/30 hover:border-chocolate/50'
                  }`}
                >
                  <div className={`w-full h-16 rounded-chunky ${theme.bgClass} mb-2`} />
                  <p className="font-mono text-sm text-chocolate">{theme.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-8">
            <label className="block font-display text-2xl mb-3 text-chocolate">
              Add your face (optional) 📸
            </label>
            
            {iconPreview ? (
              <div className="flex items-center gap-4">
                <img
                  src={iconPreview}
                  alt="Preview"
                  className="w-24 h-24 rounded-full border-4 border-chocolate shadow-hard object-cover"
                />
                <button
                  onClick={() => {
                    setIconFile(null)
                    setIconPreview(null)
                  }}
                  className="font-mono text-sm text-chocolate/70 hover:text-chocolate underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="block w-full p-8 border-4 border-dashed border-chocolate/30 rounded-chunky cursor-pointer hover:border-chocolate/50 transition-colors bg-cream">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="text-center font-mono text-chocolate/70">
                  Click to upload an image
                </p>
              </label>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-sanrio-red text-white font-display text-2xl py-4 px-6 rounded-chunky border-4 border-chocolate shadow-hard-chocolate hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Creating Magic...' : 'Generate My Link 💌'}
          </button>
        </div>
      )}
    </div>
  )
}