"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Instagram, Twitter, Facebook, MapPin, Calendar, Clock, Heart, Music2 } from "lucide-react"
import Image from "next/image"
import { siteConfig } from "@/content/site"
import { Cormorant_Garamond, Cinzel } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
})

// Vintage palette — matches guest-list / details sections
const COLORS = {
  deep: "#1C1C1E",
  medium: "rgba(28, 28, 30, 0.68)",
  muted: "rgba(28, 28, 30, 0.42)",
  accent: "#B83232",
  accentHover: "#a32d2d",
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

const SEPARATOR_GRADIENT = `linear-gradient(to right, transparent, ${COLORS.gold}, transparent)`

const FOOTER_QUOTES = [
  `"I have found the one whom my soul loves." – Song of Solomon 3:4`,
  "Love grows, and so do we. Welcome to our renewal celebration — thank you for being part of the beautiful story of our journey together.",
  "Thank you for your love, prayers, and support. We can't wait to celebrate this next chapter with you!",
] as const

// Helper function to convert text to title case (first letter of each word uppercase)
const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function Footer() {
  const year = new Date().getFullYear()
  const ceremonyDate = siteConfig.ceremony.date
  const ceremonyTime = siteConfig.ceremony.time
  const receptionTime = siteConfig.reception.time
  const ceremonyVenue = siteConfig.ceremony.venue
  const receptionVenue = siteConfig.reception.venue
  // Combined venue when same for both (e.g. Altamers Mountain Resort)
  const isSameVenue = ceremonyVenue === receptionVenue

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false)
      }, 3000)
      return () => clearTimeout(pauseTimeout)
    }

    if (isDeleting) {
      if (displayedText.length > 0) {
        const deleteTimeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1))
        }, 30)
        return () => clearTimeout(deleteTimeout)
      } else {
        setIsDeleting(false)
        setCurrentQuoteIndex((prev) => (prev + 1) % FOOTER_QUOTES.length)
      }
    } else {
      const currentQuote = FOOTER_QUOTES[currentQuoteIndex]
      if (displayedText.length < currentQuote.length) {
        const typeTimeout = setTimeout(() => {
          setDisplayedText(currentQuote.slice(0, displayedText.length + 1))
        }, 50)
        return () => clearTimeout(typeTimeout)
      } else {
        setIsPaused(true)
        setIsDeleting(true)
      }
    }
  }, [displayedText, isDeleting, isPaused, currentQuoteIndex])

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  }

  const staggerChildren = {
    animate: {
      transition: { staggerChildren: 0.2 },
    },
  }

  const nav = [
    { label: "Home", href: "#home" },
    { label: "Events", href: "#details" },
    { label: "Gallery", href: "#gallery" },
    { label: "RSVP", href: "#guest-list" },
  ] as const

  const brideNickname = siteConfig.couple.brideNickname
  const groomNickname = siteConfig.couple.groomNickname

  return (
    <div className="relative w-full overflow-hidden">
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

      <footer className="relative z-10 mt-12 sm:mt-16 overflow-hidden">
      {/* Corner decorations */}
      <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden>
        {/* <Image src="/decoration/left-top-corner.png" alt="" width={320} height={320} className="absolute top-0 left-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
        <Image src="/decoration/right-top-corner.png" alt="" width={320} height={320} className="absolute top-0 right-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} /> */}
        <Image src="/decoration/left-down-corner.png" alt="" width={320} height={320} className="absolute bottom-0 left-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
        <Image src="/decoration/right-down-corner.png" alt="" width={320} height={320} className="absolute bottom-0 right-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
      </div>
      
      {/* Monogram / Couple Illustration - centered at top */}
      <div className="relative z-10 flex flex-col items-center pt-6 sm:pt-8 md:pt-10 mb-5 sm:mb-6 md:mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 opacity-95">
            <Image
              src={siteConfig.couple.monogram}
              alt={`${groomNickname} & ${brideNickname} monogram`}
              fill
              className="object-contain"
              priority={false}
            />
          </div>
        </motion.div>

        {/* Names & Date below illustration */}
        <div className="mt-3 sm:mt-4 md:mt-5 text-center">
          <p
            className={`${cormorant.className} tracking-[0.25em] sm:tracking-[0.3em] text-xs sm:text-sm md:text-base uppercase`}
            style={{ color: COLORS.deep }}
          >
            {groomNickname} & {brideNickname}
          </p>
          <p
            className={`${cormorant.className} text-[10px] sm:text-xs uppercase tracking-[0.28em] mt-1 sm:mt-2`}
            style={{ color: COLORS.accent }}
          >
            Renewal of Vows
          </p>
          <p className={`${cormorant.className} text-sm sm:text-base md:text-lg mt-1 sm:mt-2`} style={{ color: COLORS.medium }}>
            {ceremonyDate}
          </p>
          <p className={`${cormorant.className} text-xs sm:text-sm md:text-base mt-1 sm:mt-2`} style={{ color: COLORS.medium }}>
            {siteConfig.ceremony.location || siteConfig.reception.location}
          </p>
          <div className="mx-auto mt-3 h-px w-16 sm:w-20" style={{ background: SEPARATOR_GRADIENT }} />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-8 pb-6 sm:pb-8 md:pb-10">
        <motion.div className="grid grid-cols-1 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-10" variants={staggerChildren} initial="initial" animate="animate">
          {/* Couple Info */}
          <motion.div className="lg:col-span-2" variants={fadeInUp}>
            <div className="mb-5 sm:mb-6 md:mb-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-5">
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
                  style={{ backgroundColor: "rgba(184, 50, 50, 0.10)" }}
                >
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6 flex-shrink-0" style={{ color: COLORS.accent }} fill={COLORS.accent} />
                </div>
                <h3 className={`${cinzel.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal`} style={{ color: COLORS.deep }}>
                  {groomNickname} & {brideNickname}
                </h3>
              </div>
              <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                <div className={`flex items-center gap-2 sm:gap-2.5 md:gap-3 ${cormorant.className}`} style={{ color: COLORS.medium }}>
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 flex-shrink-0" style={{ color: COLORS.accent }} />
                  <span className="text-sm sm:text-base md:text-lg font-medium" style={{ color: COLORS.deep }}>{ceremonyDate}</span>
                </div>
                <div className={`flex items-center gap-2 sm:gap-2.5 md:gap-3 ${cormorant.className}`} style={{ color: COLORS.medium }}>
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 flex-shrink-0" style={{ color: COLORS.accent }} />
                  <span className="text-xs sm:text-sm md:text-base leading-relaxed" style={{ color: COLORS.deep }}>{toTitleCase(ceremonyVenue)}</span>
                </div>
              </div>
            </div>

            <motion.div
              className="rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6"
              style={CARD_STYLE}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <blockquote
                className={`${cormorant.className} italic text-sm sm:text-base md:text-lg leading-relaxed min-h-[60px] sm:min-h-[70px] md:min-h-[80px]`}
                style={{ color: COLORS.deep }}
              >
                &quot;{displayedText}
                <span className="inline-block w-0.5 h-4 sm:h-5 md:h-6 ml-1 animate-pulse" style={{ backgroundColor: COLORS.accent }}>|</span>&quot;
              </blockquote>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: COLORS.accent }} />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full opacity-60" style={{ backgroundColor: COLORS.borderStrong }} />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: COLORS.accent }} />
              </div>
            </motion.div>
          </motion.div>

          {/* Event Details quick tiles */}
          <motion.div className="space-y-3 sm:space-y-4 md:space-y-5" variants={fadeInUp}>
            {isSameVenue ? (
              <motion.div
                className="rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 transition-all duration-300"
                style={CARD_STYLE}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-2.5 sm:mb-3 md:mb-4">
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: COLORS.accent }}
                  >
                    <MapPin className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 flex-shrink-0" style={{ color: "#fff" }} />
                  </div>
                  <h4 className={`${cinzel.className} font-semibold text-base sm:text-lg md:text-xl`} style={{ color: COLORS.deep }}>
                    Vow Renewal & Reception
                  </h4>
                </div>
                <div className={`space-y-2 sm:space-y-2.5 md:space-y-3 ${cormorant.className} text-xs sm:text-sm leading-relaxed`} style={{ color: COLORS.medium }}>
                  <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" style={{ color: COLORS.accent }} />
                    <span style={{ color: COLORS.deep }}>{toTitleCase(siteConfig.ceremony.location || siteConfig.reception.location)}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: COLORS.accent }} />
                    <span style={{ color: COLORS.deep }}>Ceremony {ceremonyTime} · Reception {receptionTime}</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                <motion.div
                  className="rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 transition-all duration-300"
                  style={CARD_STYLE}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-2.5 sm:mb-3 md:mb-4">
                    <div
                      className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(184, 50, 50, 0.10)" }}
                    >
                      <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 flex-shrink-0" style={{ color: COLORS.accent }} />
                    </div>
                    <h4 className={`${cinzel.className} font-semibold text-base sm:text-lg md:text-xl`} style={{ color: COLORS.deep }}>
                      Vow Renewal
                    </h4>
                  </div>
                  <div className={`space-y-2 sm:space-y-2.5 md:space-y-3 ${cormorant.className} text-xs sm:text-sm leading-relaxed`} style={{ color: COLORS.medium }}>
                    <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" style={{ color: COLORS.accent }} />
                      <span style={{ color: COLORS.deep }}>{toTitleCase(siteConfig.ceremony.location)}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: COLORS.accent }} />
                      <span>{ceremonyTime}</span>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 transition-all duration-300"
                  style={CARD_STYLE}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-2.5 sm:mb-3 md:mb-4">
                    <div
                      className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(184, 50, 50, 0.10)" }}
                    >
                      <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 flex-shrink-0" style={{ color: COLORS.accent }} fill="rgba(184, 50, 50, 0.25)" />
                    </div>
                    <h4 className={`${cinzel.className} font-semibold text-base sm:text-lg md:text-xl`} style={{ color: COLORS.deep }}>
                      Reception
                    </h4>
                  </div>
                  <div className={`space-y-2 sm:space-y-2.5 md:space-y-3 ${cormorant.className} text-xs sm:text-sm leading-relaxed`} style={{ color: COLORS.medium }}>
                    <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" style={{ color: COLORS.accent }} />
                      <span>{toTitleCase(siteConfig.reception.location)}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: COLORS.accent }} />
                      <span>{receptionTime}</span>
                    </div>
                  </div>
                </motion.div>
              </>
            )}

            <motion.div
              className="rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 transition-all duration-300"
              style={CARD_STYLE}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-2.5 sm:mb-3 md:mb-4">
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: COLORS.accent }}
                >
                  <Calendar className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 flex-shrink-0" style={{ color: "#fff" }} />
                </div>
                <h4 className={`${cinzel.className} font-semibold text-base sm:text-lg md:text-xl`} style={{ color: COLORS.deep }}>
                  RSVP Deadline
                </h4>
              </div>
              <div className={`space-y-2 sm:space-y-2.5 md:space-y-3 ${cormorant.className} text-xs sm:text-sm leading-relaxed`} style={{ color: COLORS.medium }}>
                <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: COLORS.accent }} />
                  <span style={{ color: COLORS.deep }}>{siteConfig.details.rsvp.deadline}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                  <span className="text-xs sm:text-sm leading-relaxed opacity-90" style={{ color: COLORS.deep }}>
                    Please confirm your attendance by this date.
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact + Quick Links */}
          <motion.div className="space-y-5 sm:space-y-6 md:space-y-7" variants={fadeInUp}>
            <div>
              <h4
                className={`${cinzel.className} font-semibold text-base sm:text-lg md:text-xl mb-3 sm:mb-4 md:mb-5 flex items-center gap-2 sm:gap-2.5 md:gap-3`}
                style={{ color: COLORS.deep }}
              >
                <div className="w-1.5 sm:w-2 h-6 sm:h-7 md:h-8 rounded-full" style={{ backgroundColor: COLORS.accent }} />
                <span>Follow Us</span>
              </h4>
              <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 flex-wrap">
                {(
                  [
                    { href: "https://www.facebook.com", label: "Facebook", Icon: Facebook },
                    { href: "https://www.instagram.com/", label: "Instagram", Icon: Instagram },
                    { href: "https://www.youtube.com", label: "YouTube", Icon: Music2 },
                    { href: "https://x.com/", label: "Twitter", Icon: Twitter },
                  ] as const
                ).map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor: COLORS.parchmentMuted,
                      border: `1px solid ${COLORS.border}`,
                      color: COLORS.deep,
                    }}
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h5 className={`${cinzel.className} font-semibold text-sm sm:text-base md:text-lg mb-2.5 sm:mb-3 md:mb-4`} style={{ color: COLORS.deep }}>
                Quick Links
              </h5>
              <div className="space-y-1.5 sm:space-y-2">
                {nav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`block transition-colors duration-200 ${cormorant.className} text-xs sm:text-sm leading-relaxed hover:opacity-80`}
                    style={{ color: COLORS.medium }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Row */}
        <motion.div className="pt-5 sm:pt-6 md:pt-7 border-t" style={{ borderColor: COLORS.border }} variants={fadeInUp}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 md:gap-5">
            <div className="text-center md:text-left">
              <p className={`${cormorant.className} text-xs sm:text-sm leading-relaxed`} style={{ color: COLORS.deep }}>
                © {year} {groomNickname} & {brideNickname} — crafted with love, prayers, and gratitude.
              </p>
              <p className={`${cormorant.className} text-xs sm:text-sm mt-1 leading-relaxed`} style={{ color: COLORS.medium }}>
                This site was created to share our renewal story and joy with you.
              </p>
            </div>
            <div className="text-center md:text-right space-y-1">
              <p className={`${cormorant.className} text-xs sm:text-sm`} style={{ color: COLORS.muted }}>
                Developed by{" "}
                <a
                  href="https://lance28-beep.github.io/portfolio-website/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline transition-colors duration-200 hover:opacity-80"
                  style={{ color: COLORS.deep }}
                >
                  Lance Valle
                </a>
              </p>
              <p className={`${cormorant.className} text-xs sm:text-sm`} style={{ color: COLORS.muted }}>
                Want a website like this? Visit{" "}
                <a
                  href="https://www.facebook.com/WeddingInvitationNaga"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline transition-colors duration-200 hover:opacity-80"
                  style={{ color: COLORS.deep }}
                >
                  Wedding Invitation Naga
                </a>
              </p>
            </div>
          </div>
        </motion.div>

      </div>
      </footer>
    </div>
  )
}
