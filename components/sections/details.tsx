"use client"

import { Section } from "@/components/section"
import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { siteConfig } from "@/content/site"
import Image from "next/image"
import { Cinzel, Cormorant_Garamond } from "next/font/google"
import {
  Shirt,
  Clock,
  Utensils,
  Copy,
  Check,
  Navigation,
  Heart,
  Camera,
  X,
  MapPin,
} from "lucide-react"


const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
})

// Vintage palette — matches guest-list / countdown sections
const COLORS = {
  deep: "#1C1C1E",
  medium: "rgba(28, 28, 30, 0.68)",
  muted: "rgba(28, 28, 30, 0.42)",
  accent: "#B83232",
  accentHover: "#a32d2d",
  light: "#FDFBF8",
  parchment: "rgba(250, 244, 232, 1)",
  parchmentSoft: "rgba(255, 252, 244, 0.92)",
  parchmentMuted: "rgba(255, 252, 244, 0.55)",
  border: "rgba(160, 122, 68, 0.25)",
  borderStrong: "rgba(160, 122, 68, 0.45)",
  gold: "rgba(140, 94, 4, 0.45)",
} as const

const CARD_STYLE = {
  background: [
    "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255, 252, 244, 0.72) 0%, transparent 70%)",
    COLORS.parchmentSoft,
  ].join(", "),
  border: `1px solid ${COLORS.border}`,
  boxShadow: [
    "0 4px 40px rgba(120, 85, 35, 0.14)",
    "0 1px 0 rgba(255, 248, 230, 0.90) inset",
    "inset 0 0 60px rgba(200, 160, 90, 0.05)",
  ].join(", "),
} as const

const INNER_BOX_STYLE = {
  background: COLORS.parchmentMuted,
  border: `1px solid ${COLORS.border}`,
} as const

const MODAL_STYLE = {
  background: COLORS.parchmentSoft,
  border: `1px solid ${COLORS.borderStrong}`,
  boxShadow: "0 8px 48px rgba(120, 85, 35, 0.22)",
} as const

const CARD_SHADOW = "0 16px 40px rgba(120, 85, 35, 0.16)"
const CARD_SHADOW_HOVER = "0 20px 48px rgba(120, 85, 35, 0.22)"

export function Details() {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const [currentReceptionImageIndex, setCurrentReceptionImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [rotationOffset, setRotationOffset] = useState(0)
  
  const coupleImages = [
    "/mobile-background/couple (1).jpg",
    "/mobile-background/couple (2).jpg",
    "/mobile-background/couple (3).jpg",
    "/mobile-background/couple (4).jpg",
  ]

  const receptionImages = siteConfig.reception.image

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReceptionImageIndex((prev) => (prev + 1) % receptionImages.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  // Gentle reminders couple photos — subtle carousel + wobble animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % coupleImages.length)
      setRotationOffset((prev) => (prev + 10) % 360)
    }, 2600)

    return () => clearInterval(interval)
  }, [coupleImages.length])

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems(prev => new Set(prev).add(itemId))
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Venue information from site config
  const ceremonyVenueName = siteConfig.ceremony.location
  const ceremonyAddress = siteConfig.ceremony.venue
  const ceremonyVenue = `${ceremonyVenueName}, ${ceremonyAddress}`
  const ceremonyMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ceremonyVenue)}`

  const receptionVenueName = siteConfig.reception.location
  const receptionAddress = siteConfig.reception.venue
  const receptionVenue = `${receptionVenueName}, ${receptionAddress}`
  const receptionMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(receptionVenue)}`

  const ceremonyLocation = ceremonyVenue
  const receptionLocation = receptionVenue
  const formattedCeremonyDate = siteConfig.ceremony.date
  const formattedReceptionDate = siteConfig.ceremony.date // reception follows ceremony on same day

  const openInMaps = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer')
  }


  return (
    <Section
      id="details"
      className="relative py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden bg-transparent"
    >
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

      {/* Corner decorations */}
      <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden>
        <Image src="/decoration/left-top-corner.png" alt="" width={320} height={320} className="absolute top-0 left-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
        <Image src="/decoration/right-top-corner.png" alt="" width={320} height={320} className="absolute top-0 right-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
        <Image src="/decoration/left-down-corner.png" alt="" width={320} height={320} className="absolute bottom-0 left-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
        <Image src="/decoration/right-down-corner.png" alt="" width={320} height={320} className="absolute bottom-0 right-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-12 sm:mb-16 md:mb-20 px-4 sm:px-6">
        <div className="flex items-center justify-center gap-2 mb-4 sm:mb-5">
          <div className="h-px w-16 sm:w-24" style={{ background: `linear-gradient(to right, transparent, ${COLORS.gold}, transparent)` }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.accent }} />
          <div className="h-px w-16 sm:w-24" style={{ background: `linear-gradient(to left, transparent, ${COLORS.gold}, transparent)` }} />
        </div>
        <h2
         className="parisienne-regular text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] leading-tight"
         style={{ color: COLORS.deep }}
        >
          Event Details
        </h2>
        <p
          className="text-xs sm:text-sm md:text-base font-normal max-w-xl mx-auto leading-relaxed tracking-[0.14em] px-4"
          style={{ color: COLORS.medium }}
        >
          Everything you need to know about our special day.
        </p>
      </div>

      {/* Venue and Event Information */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12 md:mb-16 space-y-6 sm:space-y-10 md:space-y-14">
        
        {/* Ceremony Card */}
        <div className="relative group">
          {/* Subtle champagne glow on hover */}
          <div className="absolute -inset-1 bg-gradient-to-br from-[rgba(184,50,50,0.10)] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />
          
          {/* Main card */}
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300" style={{ ...CARD_STYLE, boxShadow: CARD_SHADOW }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = CARD_SHADOW_HOVER }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = CARD_SHADOW }}>
            {/* Venue Image */}
            <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[30rem] overflow-hidden">
              <Image
                src={siteConfig.ceremony.image}
                alt={siteConfig.ceremony.location}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Venue name overlay with warm gold accent */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6 right-3 sm:right-4 md:right-6">
                {/* <p className="text-sm sm:text-base md:text-lg font-[family-name:var(--font-ephesis)] text-[#FFF7F6] mb-1 sm:mb-2 drop-shadow-lg">
                  Ceremony
                </p> */}
                <h3 className="parisienne-regular text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] leading-tight" style={{ color: COLORS.parchmentSoft }}>
                  {siteConfig.ceremony.location}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-white/95 tracking-wide" style={{ color: COLORS.parchmentSoft }}>
                  {siteConfig.ceremony.venue}
                </p>
              </div>
            </div>

            {/* Event Details Content */}
            <div className="p-3 sm:p-5 md:p-7 lg:p-9">
              {/* Date Section */}
              <div className="text-center mb-5 sm:mb-8 md:mb-10">
                {/* Day name */}
                <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-[rgba(28,28,30,0.68)] uppercase tracking-[0.2em] mb-2 sm:mb-3">
                  {siteConfig.ceremony.day}
                </p>
                
                {/* Month - Script style with warm gold */}
                <div className="mb-2 sm:mb-4">
                  <p className="parisienne-regular text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] leading-tight" style={{ color: COLORS.medium }}>
                  {new Date(siteConfig.ceremony.date).toLocaleString('default', { month: 'long' })}
                  </p>
                </div>
                
                {/* Day and Year */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-7">
                  <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-[#1C1C1E] leading-none">
                  {new Date(siteConfig.ceremony.date).getDate()}
                  </p>
                  <div className="h-10 sm:h-12 md:h-16 lg:h-20 w-[2px]" style={{ background: `linear-gradient(to bottom, ${COLORS.gold}, ${COLORS.accent}, ${COLORS.gold})` }} />
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-[#1C1C1E] leading-none">
                  {new Date(siteConfig.ceremony.date).getFullYear()}
                  </p>
                </div>

                {/* Decorative line */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="h-[1px] w-8 sm:w-10 md:w-14" style={{ background: `linear-gradient(to right, transparent, ${COLORS.gold}, ${COLORS.gold})` }} />
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: COLORS.accent }} />
                  <div className="h-[1px] w-8 sm:w-10 md:w-14" style={{ background: `linear-gradient(to left, transparent, ${COLORS.gold}, ${COLORS.gold})` }} />
                </div>

                {/* Time */}
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-[#1C1C1E] tracking-wide">
                  {siteConfig.ceremony.time}
                </p>
              </div>

              {/* Location Details */}
              <div className="bg-gradient-to-br from-[rgba(255,252,244,0.55)] to-[rgba(255,252,244,0.92)] rounded-xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-6 border border-[rgba(160,122,68,0.25)]">
                <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#1C1C1E] mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm md:text-base font-[family-name:var(--font-crimson)] font-semibold text-[#1C1C1E] mb-1.5 sm:mb-2 uppercase tracking-wide">
                      Location
                    </p>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg font-[family-name:var(--font-crimson)] text-[#1C1C1E] leading-relaxed">
                      {ceremonyVenueName}
                    </p>
                    <p className="text-[10px] sm:text-xs md:text-sm font-[family-name:var(--font-crimson)] text-[rgba(28,28,30,0.68)] leading-relaxed">
                      {ceremonyAddress}
                    </p>
                  </div>
                  {/* QR Code for Ceremony - Right side */}
                  <div className="flex flex-col items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <div className="bg-[rgba(255,252,244,0.92)] p-1.5 sm:p-2 md:p-2.5 rounded-lg border border-[rgba(160,122,68,0.25)] shadow-sm">
                      <QRCodeSVG
                        value={ceremonyMapsLink}
                        size={80}
                        level="M"
                        includeMargin={false}
                        fgColor={COLORS.deep}
                        bgColor={COLORS.parchmentSoft}
                      />
                    </div>
                    <p className="text-[9px] sm:text-[10px] md:text-xs font-[family-name:var(--font-crimson)] text-[rgba(28,28,30,0.42)] italic text-center max-w-[80px]">
                      Scan for directions
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={() => openInMaps(ceremonyMapsLink)}
                  className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 md:py-3 bg-[#B83232] hover:bg-[#a32d2d] text-white rounded-lg font-[family-name:var(--font-crimson)] font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] premium-shadow"
                  aria-label="Get directions to ceremony venue"
                >
                  <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span>Get Directions</span>
                </button>
                <button
                  onClick={() => copyToClipboard(ceremonyVenue, 'ceremony')}
                  className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 md:py-3 bg-[rgba(255,252,244,0.92)] border-2 border-[rgba(160,122,68,0.45)] hover:border-[rgba(160,122,68,0.45)] hover:bg-[rgba(210,168,110,0.12)] text-[#1C1C1E] rounded-lg font-[family-name:var(--font-crimson)] font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  aria-label="Copy ceremony venue address"
                >
                  {copiedItems.has('ceremony') ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 text-[#1C1C1E]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                  )}
                  <span>{copiedItems.has('ceremony') ? 'Copied!' : 'Copy Address'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reception Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-br from-[rgba(184,50,50,0.10)] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />

          <div className="relative elegant-card rounded-xl sm:rounded-2xl overflow-hidden premium-shadow transition-all duration-300" style={{ ...CARD_STYLE, boxShadow: CARD_SHADOW }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = CARD_SHADOW_HOVER }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = CARD_SHADOW }}>
       
            <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[30rem] overflow-hidden">
              {receptionImages.map((src, index) => (
                <div
                  key={src}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentReceptionImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={src}
                    alt={siteConfig.reception.venue}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
                    priority={index === 0}
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
              
          
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6 right-3 sm:right-4 md:right-6 z-20">
                <p className="text-sm sm:text-base md:text-lg font-[family-name:var(--font-ephesis)] text-[#FFF7F6] mb-1 sm:mb-2 drop-shadow-lg">
                  Reception
                </p>
                <h3 className="parisienne-regular text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] leading-tight" style={{ color: COLORS.parchmentSoft }}>
                  {siteConfig.reception.location}
                </h3>
                <p className="text-xs sm:text-sm md:text-base font-[family-name:var(--font-crimson)] text-white/95 drop-shadow-md tracking-wide">
                  {siteConfig.reception.venue}
                </p>
              </div>
            </div>

            <div className="p-3 sm:p-5 md:p-7 lg:p-9">
         
              <div className="text-center mb-5 sm:mb-8">
                {siteConfig.reception.time === "To follow after the ceremony" ? (
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl font-[family-name:var(--font-crimson)]  font-semibold text-[#1C1C1E] tracking-wide">
                    To follow after the ceremony
                  </p>
                ) : (
                  <>
                    <p className="text-[10px] sm:text-xs md:text-sm font-[family-name:var(--font-crimson)] font-semibold text-[rgba(28,28,30,0.68)] uppercase tracking-[0.2em] mb-2 sm:mb-3">
                      {siteConfig.reception.time === "After ceremony" ? "Starts" : "Starts at"}
                    </p>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl font-[family-name:var(--font-crimson)] font-semibold text-[#1C1C1E] tracking-wide">
                      {siteConfig.reception.time}
                    </p>
                  </>
                )}
              </div>

        
              <div className="bg-gradient-to-br from-[rgba(255,252,244,0.55)] to-[rgba(255,252,244,0.92)] rounded-xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-6 border border-[rgba(160,122,68,0.25)]">
                <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#1C1C1E] mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm md:text-base font-[family-name:var(--font-crimson)] font-semibold text-[#1C1C1E] mb-1.5 sm:mb-2 uppercase tracking-wide">
                      Location
                    </p>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg font-[family-name:var(--font-crimson)] text-[#1C1C1E] leading-relaxed">
                      {receptionVenueName}
                    </p>
                    <p className="text-[10px] sm:text-xs md:text-sm font-[family-name:var(--font-crimson)] text-[rgba(28,28,30,0.68)] leading-relaxed">
                      {receptionAddress}
                    </p>
                  </div>
              
                  <div className="flex flex-col items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  <div className="bg-[rgba(255,252,244,0.92)] p-1.5 sm:p-2 md:p-2.5 rounded-lg border border-[rgba(160,122,68,0.25)] shadow-sm">
                      <QRCodeSVG
                        value={receptionMapsLink}
                        size={80}
                        level="M"
                        includeMargin={false}
                        fgColor={COLORS.deep}
                        bgColor={COLORS.parchmentSoft}
                      />
                    </div>
                    <p className="text-[9px] sm:text-[10px] md:text-xs font-[family-name:var(--font-crimson)] text-[rgba(28,28,30,0.42)] italic text-center max-w-[80px]">
                      Scan for directions
                    </p>
                  </div>
                </div>
              </div>

     
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={() => openInMaps(receptionMapsLink)}
                  className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 md:py-3 bg-[#B83232] hover:bg-[#a32d2d] text-white rounded-lg font-[family-name:var(--font-crimson)] font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] premium-shadow"
                  aria-label="Get directions to reception venue"
                >
                  <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span>Get Directions</span>
                </button>
                <button
                  onClick={() => copyToClipboard(receptionVenue, 'reception')}
                  className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 md:py-3 bg-[rgba(255,252,244,0.92)] border-2 border-[rgba(160,122,68,0.45)] hover:border-[rgba(160,122,68,0.45)] hover:bg-[rgba(210,168,110,0.12)] text-[#1C1C1E] rounded-lg font-[family-name:var(--font-crimson)] font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  aria-label="Copy reception venue address"
                >
                  {copiedItems.has('reception') ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 text-[#1C1C1E]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                  )}
                  <span>{copiedItems.has('reception') ? 'Copied!' : 'Copy Address'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dress Code Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-5">
            <div className="h-px w-10 sm:w-14 md:w-20 bg-[rgba(140,94,4,0.45)]" />
            <Shirt className="w-5 h-5 sm:w-6 sm:h-6 text-[rgba(140,94,4,0.65)]" />
            <div className="h-px w-10 sm:w-14 md:w-20 bg-[rgba(140,94,4,0.45)]" />
          </div>
          <h3
            className="parisienne-regular text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] leading-tight"
            style={{ color: COLORS.deep }}
          >
            Dress Code
          </h3> 
          <p className="text-sm sm:text-base md:text-lg text-[rgba(28,28,30,0.68)] font-normal">
            Please dress according to the guidelines below.
          </p>
        </div>

        {/* Dress Code Cards */}
        <div className="space-y-5 sm:space-y-6 md:space-y-8 mb-4">

          {/* Principal Sponsors Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-br from-[rgba(184,50,50,0.10)] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />
            <div className="relative backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300" style={{ ...CARD_STYLE, boxShadow: CARD_SHADOW }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = CARD_SHADOW_HOVER }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = CARD_SHADOW }}>

              {/* Card header */}
              <div className="px-5 sm:px-7 md:px-9 pt-6 sm:pt-8 md:pt-10 pb-5 sm:pb-6 text-center">
                {/* <h4
                  className="lighten-regular text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] leading-tight"
                  style={{ color: COLORS.deep }}
                >
                  For Principal Sponsors
                </h4> */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className="h-px flex-1 max-w-[60px] bg-[rgba(140,94,4,0.35)]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[rgba(140,94,4,0.45)]" />
                  <div className="h-px flex-1 max-w-[60px] bg-[rgba(140,94,4,0.35)]" />
                </div>
              </div>

              {/* Gentlemen + Ladies — side-by-side on sm+, stacked on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[rgba(140,94,4,0.35)]">

                {/* Gentlemen column */}
                <div className="flex flex-col">
                  {/* Image at the top, full bleed */}
                  <Image
                    src="/Details/mens.png"
                    alt="Gentlemen Principal Sponsors — White Barong Tagalog reference"
                    width={0}
                    height={0}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="w-full h-auto"
                  />
                  {/* Text below image */}
                  <div className="px-5 sm:px-6 md:px-8 py-5 sm:py-6 text-center flex-1 flex flex-col justify-center">
                    <p className={`${cinzel.className} text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold text-[rgba(28,28,30,0.68)] mb-2`}>
                    Gentlemen
                    </p>
                    <p className={`${cormorant.className} text-base sm:text-lg md:text-xl text-[rgba(28,28,30,0.68)] leading-relaxed`}>
                    Barong or smart polo
                    </p>
                  </div>
                </div>

                {/* Ladies column */}
                <div className="flex flex-col">
                  {/* Image at the top, full bleed */}
                  <Image
                    src="/Details/ladies.png"
                    alt="Ladies Principal Sponsors — Filipiniana-inspired attire reference"
                    width={0}
                    height={0}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="w-full h-auto"
                  />
                  {/* Text below image */}
                  <div className="px-5 sm:px-6 md:px-8 py-5 sm:py-6 text-center flex-1 flex flex-col justify-center">
                    <p className={`${cinzel.className} text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold text-[rgba(28,28,30,0.68)] mb-2`}>
                      Ladies
                    </p>
                    <p className={`${cormorant.className} text-base sm:text-lg md:text-xl text-[rgba(28,28,30,0.68)] leading-relaxed`}>
                    Formal attire in pastel colors
                    </p>
                  </div>
                </div>

              </div>

              {/* Closing note */}
              <div className="border-t border-[rgba(140,94,4,0.35)] mx-5 sm:mx-7 md:mx-9 mt-1 mb-5 sm:mb-7 md:mb-9" />
              {/* <div className="px-5 sm:px-7 md:px-9 pb-6 sm:pb-8 md:pb-10 text-center">
                <p className={`${cormorant.className} text-base sm:text-lg md:text-xl font-semibold text-[#1C1C1E] leading-snug mb-1`}>
                  Come in your best <span className="uppercase tracking-wide">Formal Attire.</span>
                </p>
                <p className={`${cormorant.className} text-sm sm:text-base md:text-lg text-[rgba(28,28,30,0.68)] leading-relaxed italic`}>
                  Let's create a timeless and elegant atmosphere together.
                </p>
              </div> */}

            </div>
          </div>

          {/* Guests Card */}
          {/* <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-br from-[rgba(184,50,50,0.10)] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />
            <div className="relative backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300" style={{ ...CARD_STYLE, boxShadow: CARD_SHADOW }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = CARD_SHADOW_HOVER }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = CARD_SHADOW }}>
              
                <h4
                  className="lighten-regular text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] leading-tight text-center mb-4 mt-4"
                  style={{ color: COLORS.deep }}
                >
                  For Guests
                </h4>
                <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
                  <div className="h-px flex-1 max-w-[60px] bg-[rgba(140,94,4,0.35)]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[rgba(140,94,4,0.45)]" />
                  <div className="h-px flex-1 max-w-[60px] bg-[rgba(140,94,4,0.35)]" />
                </div>
              <Image
                src="/Details/guest_attire.jpg"
                alt="Guest Attire Reference — Elegant white formal wear"
                width={0}
                height={0}
                sizes="(max-width: 1024px) 100vw, 1280px"
                className="w-full h-auto"
              />

              <div className="px-5 sm:px-7 md:px-9 pt-6 sm:pt-8 pb-6 sm:pb-8 md:pb-10">



       
                <div className="mb-6 sm:mb-8">
                  <p className={`${cinzel.className} text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold text-[rgba(28,28,30,0.68)] text-center mb-3`}>
                    Gentlemen
                  </p>
                  <p className={`${cormorant.className} text-base sm:text-lg md:text-xl text-[rgba(28,28,30,0.68)] leading-relaxed text-center`}>
                    Please come in your best{" "}
                    <span className="font-semibold italic">white formal attire /</span>
                    <br />
                    <span className="italic">white polo / white long-sleeved shirt.</span>
                  </p>
                </div>

        
                <div className="border-t border-[rgba(140,94,4,0.35)] mb-6 sm:mb-8" />

            
                <div>
                  <p className={`${cinzel.className} text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold text-[rgba(28,28,30,0.68)] text-center mb-3`}>
                    Ladies
                  </p>
                  <p className={`${cormorant.className} text-base sm:text-lg md:text-xl text-[rgba(28,28,30,0.68)] leading-relaxed text-center`}>
                    We invite you to wear an{" "}
                    <span className="font-semibold italic">elegant white long dress.</span>
                    <br />
                    Kindly avoid cocktail dresses.
                  </p>
                </div>

              </div>
            </div>
          </div> */}

        </div>

     {/* Gentle Reminders Container */}
   

      {/* Enhanced Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-500"
          onClick={() => setShowImageModal(null)}
          style={{ backgroundColor: "rgba(28, 28, 30, 0.92)" }}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
              style={{ backgroundColor: COLORS.parchmentSoft, opacity: 0.12 }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
              style={{ backgroundColor: COLORS.accent, opacity: 0.08, animationDelay: "1s" }}
            />
          </div>

          <div
            className="relative max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border animate-in zoom-in-95 duration-500 group"
            onClick={(e) => e.stopPropagation()}
            style={{ ...MODAL_STYLE, borderWidth: "1px" }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: `linear-gradient(to right, ${COLORS.gold}, ${COLORS.accent}, ${COLORS.gold})` }}
            />

            <button
              onClick={() => setShowImageModal(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 md:top-6 md:right-6 z-20 backdrop-blur-sm p-2.5 sm:p-3 rounded-xl shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 border group/close text-white"
              title="Close (ESC)"
              style={{ backgroundColor: COLORS.accent, borderColor: "rgba(255, 252, 244, 0.4)" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = COLORS.accentHover }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = COLORS.accent }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-colors" />
            </button>

            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 md:top-6 md:left-6 z-20">
              <div
                className="flex items-center gap-2 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border text-white"
                style={{ backgroundColor: COLORS.accent, borderColor: "rgba(255, 252, 244, 0.35)" }}
              >
                {showImageModal === "ceremony" ? (
                  <>
                    <Heart className="w-4 h-4" fill="white" />
                    <span className="text-xs sm:text-sm font-bold">Ceremony Venue</span>
                  </>
                ) : (
                  <>
                    <Utensils className="w-4 h-4" />
                    <span className="text-xs sm:text-sm font-bold">Reception Venue</span>
                  </>
                )}
              </div>
            </div>

            <div
              className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden"
              style={{ backgroundColor: COLORS.deep }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0" />

              <Image
                src={showImageModal === "ceremony" ? siteConfig.ceremony.image : siteConfig.reception.image[0]}
                alt={showImageModal === "ceremony" ? ceremonyVenueName : receptionVenueName}
                fill
                className="object-contain p-6 sm:p-8 md:p-10 transition-transform duration-700 group-hover:scale-105 z-10"
                sizes="95vw"
                priority
              />
            </div>

            <div
              className={`${cormorant.className} p-5 sm:p-6 md:p-8 backdrop-blur-sm border-t relative`}
              style={{ backgroundColor: COLORS.parchmentSoft, borderColor: COLORS.border }}
            >
              <div className="absolute top-0 left-8 right-8 h-px" style={{ background: `linear-gradient(to right, transparent, ${COLORS.gold}, transparent)` }} />

              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <h3
                      className={`${cinzel.className} text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-3`}
                      style={{ color: COLORS.deep }}
                    >
                      {showImageModal === "ceremony" ? (
                        <Heart className="w-6 h-6" style={{ color: COLORS.accent }} fill={COLORS.accent} />
                      ) : (
                        <Utensils className="w-6 h-6" style={{ color: COLORS.accent }} />
                      )}
                      {showImageModal === "ceremony" ? ceremonyVenueName : receptionVenueName}
                    </h3>
                    <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.medium }}>
                      <MapPin className="w-4 h-4" style={{ color: COLORS.accent }} />
                      <span>
                        {showImageModal === "ceremony" ? ceremonyAddress : receptionAddress}
                      </span>
                    </div>

                    {showImageModal === "ceremony" && (
                      <div
                        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border"
                        style={{
                          color: COLORS.deep,
                          backgroundColor: COLORS.parchmentMuted,
                          borderColor: COLORS.border,
                        }}
                      >
                        <Clock className="w-4 h-4" style={{ color: COLORS.accent }} />
                        <span>
                          {formattedCeremonyDate} at {siteConfig.ceremony.time}
                        </span>
                      </div>
                    )}
                    {showImageModal === "reception" && (
                      <div
                        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border"
                        style={{
                          color: COLORS.deep,
                          backgroundColor: COLORS.parchmentMuted,
                          borderColor: COLORS.border,
                        }}
                      >
                        <Clock className="w-4 h-4" style={{ color: COLORS.accent }} />
                        <span>
                          {formattedReceptionDate} - {siteConfig.reception.time}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          showImageModal === "ceremony"
                            ? ceremonyLocation
                            : receptionLocation,
                          `modal-${showImageModal}`,
                        )
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 border-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 shadow-md whitespace-nowrap text-white"
                      title="Copy address"
                      style={{ backgroundColor: COLORS.accent, borderColor: "rgba(255, 252, 244, 0.35)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = COLORS.accentHover }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = COLORS.accent }}
                    >
                      {copiedItems.has(`modal-${showImageModal}`) ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        openInMaps(showImageModal === "ceremony" ? ceremonyMapsLink : receptionMapsLink)
                      }
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg whitespace-nowrap"
                      style={{ backgroundColor: COLORS.parchmentSoft, color: COLORS.deep, border: `1px solid ${COLORS.borderStrong}` }}
                    >
                      <Navigation className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.accent }} />
                      <span>Get Directions</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs" style={{ color: COLORS.muted }}>
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3 h-3" />
                    Click outside to close
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline-flex items-center gap-1.5">Press ESC to close</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
     
      </div>
    </Section>
  )
}