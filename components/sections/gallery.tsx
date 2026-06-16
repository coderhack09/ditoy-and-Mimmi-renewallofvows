"use client"

import { useState, useEffect, useCallback } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Cormorant_Garamond } from "next/font/google"
import { Section } from "@/components/section"
import Image from "next/image"
// Removed circular gallery in favor of a responsive masonry layout

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

const COLORS = {
  deep: "#1C1C1E",
  medium: "rgba(28, 28, 30, 0.68)",
  muted: "rgba(28, 28, 30, 0.42)",
  accent: "#B83232",
  gold: "rgba(140, 94, 4, 0.45)",
  parchment: "rgba(250, 244, 232, 1)",
  border: "rgba(160, 122, 68, 0.25)",
  borderHover: "rgba(184, 50, 50, 0.35)",
} as const

const galleryItems = [
  { image: "/couple/couple3.jpg", text: " " },
  { image: "/couple/couple1.webp", text: " " },
  { image: "/couple/couple2.webp", text: " " },
  { image: "/couple/couple4.webp", text: " " },
]

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<(typeof galleryItems)[0] | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  // reserved for potential skeleton tracking; not used after fade-in simplification
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchDeltaX, setTouchDeltaX] = useState(0)
  const [zoomScale, setZoomScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [pinchStartDist, setPinchStartDist] = useState<number | null>(null)
  const [pinchStartScale, setPinchStartScale] = useState(1)
  const [lastTap, setLastTap] = useState(0)
  const [panStart, setPanStart] = useState<{ x: number; y: number; panX: number; panY: number } | null>(null)

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex
      if (direction === 'next') {
        newIndex = (prevIndex + 1) % galleryItems.length
      } else {
        newIndex = (prevIndex - 1 + galleryItems.length) % galleryItems.length
      }
      setSelectedImage(galleryItems[newIndex])
      return newIndex
    })
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedImage) return
      if (e.key === 'ArrowLeft') navigateImage('prev')
      if (e.key === 'ArrowRight') navigateImage('next')
      if (e.key === 'Escape') setSelectedImage(null)
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedImage, currentIndex, navigateImage])

  // Prevent background scroll when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedImage])

  // Preload adjacent images for smoother nav
  useEffect(() => {
    if (selectedImage) {
      const next = new window.Image()
      next.src = galleryItems[(currentIndex + 1) % galleryItems.length].image
      const prev = new window.Image()
      prev.src = galleryItems[(currentIndex - 1 + galleryItems.length) % galleryItems.length].image
    }
  }, [selectedImage, currentIndex])

  const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val))
  const resetZoom = () => {
    setZoomScale(1)
    setPan({ x: 0, y: 0 })
    setPanStart(null)
  }

  return (
    <div className="relative w-full bg-transparent">
      {/* Vintage parchment overlay */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255, 252, 244, 0.72) 0%, transparent 70%)",
              "rgba(250, 244, 232, 0.94)",
            ].join(", "),
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 60% 40% at 20% 20%, rgba(210, 168, 110, 0.10) 0%, transparent 70%)",
              "radial-gradient(ellipse 50% 35% at 80% 75%, rgba(170, 130, 80, 0.08) 0%, transparent 65%)",
            ].join(", "),
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
            mixBlendMode: "multiply",
            opacity: 0.55,
          }}
        />
      </div>

      <Section
        id="gallery"
        className="relative z-10 py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden bg-transparent"
      >
      {/* Corner decorations */}
      <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden>
        <Image src="/decoration/left-top-corner.png" alt="" width={320} height={320} className="absolute top-0 left-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
        <Image src="/decoration/right-top-corner.png" alt="" width={320} height={320} className="absolute top-0 right-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
        <Image src="/decoration/left-down-corner.png" alt="" width={320} height={320} className="absolute bottom-0 left-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
        <Image src="/decoration/right-down-corner.png" alt="" width={320} height={320} className="absolute bottom-0 right-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-12 sm:mb-16 md:mb-20 px-4 sm:px-6">
        <p
          style={{
            fontFamily: '"AgrandirWideBold", sans-serif',
            fontSize: "clamp(0.50rem, 1.1vw, 0.60rem)",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: COLORS.muted,
            marginBottom: "0.75rem",
          }}
        >
          Our Story in Frames
        </p>
        <h2
          className="parisienne-regular leading-tight"
          style={{
            fontSize: "clamp(2.4rem, 7.5vw, 4.2rem)",
            color: COLORS.deep,
            lineHeight: 1.15,
          }}
        >
          Gallery
        </h2>
        <p
          className={`${cormorant.className} max-w-xl mx-auto leading-relaxed px-2 mb-3 sm:mb-4`}
          style={{ fontSize: "clamp(0.90rem, 2.1vw, 1.08rem)", color: COLORS.medium }}
        >
          From our first chapter to this beautiful season of commitment, every moment has been a testament to love, faith, and grace. We share these memories with heartfelt gratitude as we look forward to the lifetime that awaits us.
        </p>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
          <span className="h-px w-10 sm:w-14" style={{ background: COLORS.gold }} />
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full opacity-80" style={{ background: COLORS.accent }} />
            <span className="w-1.5 h-1.5 rounded-full opacity-45" style={{ background: COLORS.accent }} />
            <span className="w-1.5 h-1.5 rounded-full opacity-80" style={{ background: COLORS.accent }} />
          </div>
          <span className="h-px w-10 sm:w-14" style={{ background: COLORS.gold }} />
        </div>
      </div>

      {/* Gallery content */}
      <div className="relative z-10 w-full">
        <div className="flex justify-center px-4 sm:px-6 md:px-8">
          <div className="max-w-6xl w-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-64 sm:h-80 md:h-96">
                <div
                  className="w-12 h-12 border-[3px] rounded-full animate-spin"
                  style={{ borderColor: "rgba(184,50,50,0.25)", borderTopColor: COLORS.accent }}
                />
              </div>
            ) : (
              <>
                {/* Mobile: swipeable sliding gallery (scroll-snap carousel) */}
                <div className="sm:hidden">
                  <div
                    className="flex gap-3 overflow-x-auto px-1 pb-3 snap-x snap-mandatory scroll-px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    aria-label="Gallery carousel"
                  >
                    {galleryItems.map((item, index) => (
                      <button
                        key={item.image + index}
                        type="button"
                        className="group relative snap-center shrink-0 w-[82%] overflow-hidden rounded-lg backdrop-blur-sm transition-all duration-300"
                        style={{ backgroundColor: "rgba(250,244,232,0.92)", border: `1px solid ${COLORS.border}` }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.borderHover }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border }}
                        onClick={() => {
                          setSelectedImage(item)
                          setCurrentIndex(index)
                        }}
                        aria-label={`Open image ${index + 1}`}
                      >
                        {/* Subtle glow on active (mobile) */}
                        <div className="absolute -inset-0.5 rounded-lg opacity-0 group-active:opacity-100 transition-opacity duration-300 blur-sm" style={{ background: "linear-gradient(to bottom right, rgba(184,50,50,0.18), rgba(140,94,4,0.10))" }} />

                        <div className="relative aspect-[3/4] overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.text || `Gallery image ${index + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-500 group-active:scale-[1.02]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-active:opacity-100 transition-opacity duration-300" />
                        </div>

                      </button>
                    ))}
                  </div>
{/* 
                  <p className="mt-2 text-center text-xs font-[family-name:var(--font-crimson)] tracking-wide" style={{ color: 'var(--color-motif-medium)' }}>
                    Swipe to explore
                  </p> */}
                </div>

                {/* Tablet/Desktop: existing grid */}
                <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 lg:gap-6">
                  {galleryItems.map((item, index) => (
                    <button
                      key={item.image + index}
                      type="button"
                      className="group relative w-full overflow-hidden rounded-xl backdrop-blur-sm transition-all duration-300"
                      style={{ backgroundColor: "rgba(250,244,232,0.92)", border: `1px solid ${COLORS.border}` }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.borderHover }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border }}
                      onClick={() => {
                        setSelectedImage(item)
                        setCurrentIndex(index)
                      }}
                      aria-label={`Open image ${index + 1}`}
                    >
                      {/* Subtle glow on hover */}
                      <div className="absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" style={{ background: "linear-gradient(to bottom right, rgba(184,50,50,0.15), rgba(140,94,4,0.08))" }} />

                      <div className="relative aspect-[3/4] md:aspect-square overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.text || `Gallery image ${index + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                    </button>
                  ))}
                </div>
              </>
            )}

            {/* View more */}
            {!isLoading && (
              <div className="mt-10 sm:mt-12 flex justify-center">
                {/* <Link
                  href="/gallery"
                  className={`${cinzel.className} inline-flex items-center justify-center rounded-sm px-8 py-3.5 text-[0.65rem] sm:text-xs uppercase tracking-[0.22em] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-motif-cream focus-visible:ring-motif-deep`}
                  style={{
                    color: 'var(--color-motif-cream)',
                    backgroundColor: 'var(--color-motif-deep)',
                    border: '2px solid var(--color-motif-deep)',
                    boxShadow: '0 4px 14px color-mix(in srgb, var(--color-motif-deep) 13%, transparent)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-motif-accent)'
                    e.currentTarget.style.borderColor = 'var(--color-motif-deep)'
                    e.currentTarget.style.color = 'var(--color-motif-cream)'
                    e.currentTarget.style.boxShadow = '0 6px 20px color-mix(in srgb, var(--color-motif-deep) 19%, transparent)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-motif-accent)'
                    e.currentTarget.style.borderColor = 'var(--color-motif-deep)'
                    e.currentTarget.style.color = 'var(--color-motif-cream)'
                    e.currentTarget.style.boxShadow = '0 4px 14px color-mix(in srgb, var(--color-motif-deep) 13%, transparent)'
                  }}
                >
                  View full gallery
                </Link> */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
          onClick={() => {
            setSelectedImage(null)
            resetZoom()
          }}
        >
            <div
              className="relative max-w-6xl w-full h-full sm:h-auto flex flex-col items-center justify-center"
              onTouchStart={(e) => {
                if (e.touches.length === 1) {
                  const now = Date.now()
                  if (now - lastTap < 300) {
                    setZoomScale((s) => (s > 1 ? 1 : 2))
                    setPan({ x: 0, y: 0 })
                  }
                  setLastTap(now)
                  const t = e.touches[0]
                  setTouchStartX(t.clientX)
                  setTouchDeltaX(0)
                  if (zoomScale > 1) {
                    setPanStart({ x: t.clientX, y: t.clientY, panX: pan.x, panY: pan.y })
                  }
                }
                if (e.touches.length === 2) {
                  const dx = e.touches[0].clientX - e.touches[1].clientX
                  const dy = e.touches[0].clientY - e.touches[1].clientY
                  const dist = Math.hypot(dx, dy)
                  setPinchStartDist(dist)
                  setPinchStartScale(zoomScale)
                }
              }}
              onTouchMove={(e) => {
                if (e.touches.length === 2 && pinchStartDist) {
                  const dx = e.touches[0].clientX - e.touches[1].clientX
                  const dy = e.touches[0].clientY - e.touches[1].clientY
                  const dist = Math.hypot(dx, dy)
                  const scale = clamp((dist / pinchStartDist) * pinchStartScale, 1, 3)
                  setZoomScale(scale)
                } else if (e.touches.length === 1) {
                  const t = e.touches[0]
                  if (zoomScale > 1 && panStart) {
                    const dx = t.clientX - panStart.x
                    const dy = t.clientY - panStart.y
                    setPan({ x: panStart.panX + dx, y: panStart.panY + dy })
                  } else if (touchStartX !== null) {
                    setTouchDeltaX(t.clientX - touchStartX)
                  }
                }
              }}
              onTouchEnd={() => {
                setPinchStartDist(null)
                setPanStart(null)
                if (zoomScale === 1 && Math.abs(touchDeltaX) > 50) {
                  navigateImage(touchDeltaX > 0 ? 'prev' : 'next')
                }
                setTouchStartX(null)
                setTouchDeltaX(0)
              }}
            >
            {/* Top bar with counter and close */}
            <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 sm:p-6">
              {/* Image counter */}
              <div className="backdrop-blur-md rounded-full px-4 py-2 border" style={{ backgroundColor: "rgba(0,0,0,0.4)", borderColor: "rgba(184,50,50,0.35)" }}>
                <span
                  style={{
                    fontFamily: '"AgrandirWideBold", sans-serif',
                    fontSize: "0.75rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#FDFBF8",
                  }}
                >
                  {currentIndex + 1} / {galleryItems.length}
                </span>
              </div>
              
              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImage(null)
                  resetZoom()
                }}
                className="bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full p-2 sm:p-3 transition-all duration-200 border border-white/20 hover:border-white/40"
                aria-label="Close lightbox"
              >
                <X size={20} className="sm:w-6 sm:h-6 text-white" />
              </button>
            </div>

            {/* Navigation buttons */}
            {galleryItems.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateImage('prev')
                    resetZoom()
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full p-3 sm:p-4 transition-all duration-200 border border-white/20 hover:border-white/40"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} className="sm:w-7 sm:h-7 text-white" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateImage('next')
                    resetZoom()
                  }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full p-3 sm:p-4 transition-all duration-200 border border-white/20 hover:border-white/40"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} className="sm:w-7 sm:h-7 text-white" />
                </button>
              </>
            )}

            {/* Image container */}
            <div className="relative w-full h-full flex items-center justify-center pt-16 sm:pt-20 pb-4 sm:pb-6 overflow-hidden">
              <div
                className="relative inline-block max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage.image || "/placeholder.svg"}
                  alt={selectedImage.text || "Gallery image"}
                  style={{ 
                    transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoomScale})`, 
                    transition: pinchStartDist ? 'none' : 'transform 200ms ease-out' 
                  }}
                  className="max-w-full max-h-[75vh] sm:max-h-[85vh] object-contain rounded-lg shadow-2xl will-change-transform"
                />
                
                {/* Zoom reset button */}
                {zoomScale > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      resetZoom()
                    }}
                    className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-full px-3 py-1.5 text-xs font-medium border border-white/20 transition-all duration-200"
                  >
                    Reset Zoom
                  </button>
                )}
              </div>
            </div>

            {/* Bottom hint for mobile */}
            {galleryItems.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 sm:hidden z-20">
                <p className="text-xs text-white/60 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
                  Swipe to navigate
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      </Section>
    </div>
  )
}