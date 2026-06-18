"use client"

import { useState, useEffect } from "react"
import { Heart, RefreshCw, TrendingUp, Mail, Users, MapPin, Calendar, Crown } from "lucide-react"
import { Cormorant_Garamond, Cinzel } from "next/font/google"
import Image from "next/image"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400"],
})

interface Guest {
  id: string | number
  name: string
  role: string
  email?: string
  contact?: string
  message?: string
  allowedGuests: number
  companions: { name: string; relationship: string }[]
  tableNumber: string
  isVip: boolean
  status: 'pending' | 'confirmed' | 'declined' | 'request'
  addedBy?: string
  createdAt?: string
  updatedAt?: string
}

// Vintage palette — matches guest-list / entourage sections
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

const INNER_BOX_STYLE = {
  background: COLORS.parchmentMuted,
  border: `1px solid ${COLORS.border}`,
} as const

const SEPARATOR_GRADIENT = `linear-gradient(to right, transparent, ${COLORS.gold}, transparent)`

export function BookOfGuests() {
  const [totalGuests, setTotalGuests] = useState(0)
  const [rsvpCount, setRsvpCount] = useState(0)
  const [confirmedGuests, setConfirmedGuests] = useState<Guest[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [previousTotal, setPreviousTotal] = useState(0)
  const [showIncrease, setShowIncrease] = useState(false)

  // Helper function to get initials from name
  const getInitials = (name: string): string => {
    const words = name.trim().split(' ')
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Helper function to format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Recently'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const fetchGuests = async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true)
    
    try {
      // Fetch from local API route which connects to Google Sheets
      const response = await fetch("/api/guests", {
        cache: "no-store"
      })

      if (!response.ok) {
        throw new Error("Failed to fetch guest list")
      }

      const data: Guest[] = await response.json()

      // Filter only confirmed/attending guests
      const attendingGuests = data.filter((guest) => guest.status === "confirmed")
      
      // Sort guests: VIPs first, then by updatedAt (most recent first)
      const sortedGuests = attendingGuests.sort((a, b) => {
        // VIPs come first
        if (a.isVip && !b.isVip) return -1
        if (!a.isVip && b.isVip) return 1
        
        // Then sort by most recent update
        const dateA = new Date(a.updatedAt || 0).getTime()
        const dateB = new Date(b.updatedAt || 0).getTime()
        return dateB - dateA
      })
      
      // Calculate total guests by summing allowedGuests for each confirmed guest
      const totalGuestCount = attendingGuests.reduce((sum, guest) => {
        return sum + (guest.allowedGuests || 1)
      }, 0)
      
      // Show increase animation if count went up
      if (totalGuestCount > totalGuests && totalGuests > 0) {
        setPreviousTotal(totalGuests)
        setShowIncrease(true)
        setTimeout(() => setShowIncrease(false), 2000)
      }
      
      setTotalGuests(totalGuestCount)
      setRsvpCount(attendingGuests.length)
      setConfirmedGuests(sortedGuests)
      setLastUpdate(new Date())
    } catch (error: any) {
      console.error("Failed to load guests:", error)
    } finally {
      if (showLoading) {
        setTimeout(() => setIsRefreshing(false), 500)
      }
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchGuests()

    // Set up automatic polling every 30 seconds for real-time updates
    const pollInterval = setInterval(() => {
      fetchGuests()
    }, 30000) // 30 seconds

    // Set up event listener for RSVP updates
    const handleRsvpUpdate = () => {
      // Add a small delay to allow Google Sheets to update
      setTimeout(() => {
        fetchGuests(true)
      }, 2000)
    }

    window.addEventListener("rsvpUpdated", handleRsvpUpdate)

    return () => {
      clearInterval(pollInterval)
      window.removeEventListener("rsvpUpdated", handleRsvpUpdate)
    }
  }, [totalGuests])

  return (
    <div
      id="guests"
      className="relative z-10 py-4 sm:py-8 md:py-12 lg:py-16 overflow-hidden isolate"
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
      {/* <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden>
        <Image src="/decoration/left-top-corner.png" alt="" width={320} height={320} className="absolute top-0 left-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
        <Image src="/decoration/right-top-corner.png" alt="" width={320} height={320} className="absolute top-0 right-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
        <Image src="/decoration/left-down-corner.png" alt="" width={320} height={320} className="absolute bottom-0 left-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
        <Image src="/decoration/right-down-corner.png" alt="" width={320} height={320} className="absolute bottom-0 right-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
      </div> */}

      {/* Section Header */}
      <div className="relative z-10 text-center mb-3 sm:mb-4 md:mb-6 px-2 sm:px-3 md:px-4">
        <p
          className={`${cormorant.className} text-[0.6rem] sm:text-[0.7rem] md:text-xs uppercase tracking-[0.25em] mb-1 sm:mb-1.5 mt-4 sm:mt-6 md:mt-8`}
          style={{ color: COLORS.deep }}
        >
          Our Cherished Guests
        </p>
        <h2
          className="parisienne-regular text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] leading-tight mb-1 sm:mb-2 md:mb-3"
          style={{ color: COLORS.deep }}
        >
          Book of Guests
        </h2>
        <p
          className={`${cormorant.className} text-[10px] sm:text-xs md:text-sm font-light max-w-lg mx-auto leading-relaxed px-2`}
          style={{ color: COLORS.medium }}
        >
          Meet the cherished souls joining us in celebration — your presence makes our day truly special
        </p>
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2.5 md:mt-3">
          <div className="h-px w-10 sm:w-14 md:w-20" style={{ background: SEPARATOR_GRADIENT }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.accent }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.borderStrong }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.accent }} />
          <div className="h-px w-10 sm:w-14 md:w-20" style={{ background: SEPARATOR_GRADIENT }} />
        </div>
      </div>

      {/* Guests content */}
      <div className="relative z-10">
        {/* Stats card */}
        <div className="text-center mb-2.5 sm:mb-4 md:mb-6 px-2 sm:px-4 md:px-6">
          <div className="relative max-w-3xl mx-auto">
            <div
              className="relative backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 transition-all duration-300"
              style={CARD_STYLE}
            >
              <button
                onClick={() => fetchGuests(true)}
                disabled={isRefreshing}
                className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1.5 sm:p-2 rounded-full transition-all duration-300 disabled:opacity-50 group z-10 hover:scale-110"
                style={{ backgroundColor: "rgba(184, 50, 50, 0.08)" }}
                title="Refresh counts"
              >
                <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-500 ${isRefreshing ? "animate-spin" : "group-hover:rotate-180"}`} style={{ color: COLORS.accent }} />
              </button>

              <div className="mb-1.5 sm:mb-2.5">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                  <h3 className={`${cinzel.className} text-xl sm:text-3xl md:text-4xl font-bold transition-all duration-500 ${showIncrease ? "scale-110" : ""}`} style={{ color: COLORS.deep }}>
                    {totalGuests}
                  </h3>
                  {showIncrease && (
                    <TrendingUp className="h-3.5 w-3.5 sm:h-5 sm:w-5 animate-bounce" style={{ color: COLORS.accent }} />
                  )}
                  <p className={`${cormorant.className} text-sm sm:text-lg md:text-xl font-medium leading-tight`} style={{ color: COLORS.deep }}>
                    {totalGuests === 1 ? "Guest" : "Guests"} Celebrating With Us
                  </p>
                </div>
              </div>

              <p className={`${cormorant.className} text-xs sm:text-base mb-2 sm:mb-3`} style={{ color: COLORS.medium, opacity: 0.9 }}>
                {rsvpCount} {rsvpCount === 1 ? "RSVP entry" : "RSVP entries"}
              </p>
              <p className={`${cormorant.className} text-[10px] sm:text-xs md:text-sm leading-tight`} style={{ color: COLORS.medium, opacity: 0.85 }}>
                Thank you for confirming your RSVP! Your presence means the world to us.
              </p>
            </div>
          </div>
        </div>

        {/* Guest List Display */}
        {confirmedGuests.length > 0 && (
          <div className="max-w-5xl mx-auto px-2 sm:px-4 md:px-6">
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {confirmedGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="relative group rounded-xl sm:rounded-2xl p-2.5 sm:p-4 md:p-6 transition-all duration-300 hover:shadow-xl"
                  style={CARD_STYLE}
                >
                  <div className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-2.5 md:mb-3">
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-md ring-2 ring-white/60"
                        style={{ backgroundColor: COLORS.accent }}
                      >
                        <span className="text-white font-semibold text-xs sm:text-base md:text-lg">
                          {getInitials(guest.name)}
                        </span>
                      </div>
                      {guest.isVip && (
                        <div className="absolute -top-0.5 -right-0.5">
                          <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full shadow-md border-2 border-white">
                            <Crown className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3.5 md:w-3.5 text-white fill-current" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="mb-1 sm:mb-1.5">
                        <h3 className={`${cinzel.className} text-xs sm:text-base md:text-lg font-semibold sm:font-bold leading-tight mb-0.5`} style={{ color: COLORS.deep }}>
                          {guest.name}
                        </h3>
                        {guest.role && (
                          <p className={`${cormorant.className} text-[9px] sm:text-[10px] md:text-xs font-medium opacity-80`} style={{ color: COLORS.deep }}>
                            {guest.role}
                          </p>
                        )}
                      </div>

                      {guest.email && (
                        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] md:text-xs mb-1.5 sm:mb-2 md:mb-3 opacity-75" style={{ color: COLORS.medium }}>
                          <Mail className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" style={{ color: COLORS.deep }} />
                          <span className="truncate">{guest.email}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 md:gap-2 mb-1.5 sm:mb-2 md:mb-3">
                        <div
                          className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-lg border"
                          style={{ ...INNER_BOX_STYLE, backgroundColor: "rgba(184, 50, 50, 0.06)" }}
                        >
                          <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 flex-shrink-0" style={{ color: COLORS.accent }} />
                          <span className={`${cormorant.className} text-[9px] sm:text-[10px] md:text-xs font-semibold`} style={{ color: COLORS.deep }}>
                            {guest.allowedGuests} {guest.allowedGuests === 1 ? "Guest" : "Guests"}
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-lg border"
                          style={{ ...INNER_BOX_STYLE, backgroundColor: "rgba(184, 50, 50, 0.06)" }}
                        >
                          <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 flex-shrink-0" style={{ color: COLORS.accent }} />
                          <span className={`${cormorant.className} text-[9px] sm:text-[10px] md:text-xs font-semibold`} style={{ color: COLORS.deep }}>
                            {guest.tableNumber && guest.tableNumber.trim() !== "" ? (
                              <>Table {guest.tableNumber}</>
                            ) : (
                              <span className="opacity-65">Not Assigned</span>
                            )}
                          </span>
                        </div>
                      </div>

                      {guest.message && guest.message.trim() !== "" && (
                        <div
                          className="relative mb-1.5 sm:mb-2.5 md:mb-3 p-2 sm:p-3 md:p-5 rounded-lg md:rounded-xl border overflow-hidden"
                          style={INNER_BOX_STYLE}
                        >
                          <div className="absolute top-0 left-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 opacity-[0.06]" style={{ color: COLORS.accent }}>
                            <svg viewBox="0 0 100 100" fill="currentColor"><path d="M0,0 L100,0 L0,100 Z" /></svg>
                          </div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 opacity-[0.06]" style={{ color: COLORS.accent }}>
                            <svg viewBox="0 0 100 100" fill="currentColor"><path d="M100,100 L0,100 L100,0 Z" /></svg>
                          </div>
                          <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 md:top-2 md:left-2 opacity-20" style={{ color: COLORS.accent }}>
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" /></svg>
                          </div>
                          <div className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 md:bottom-2 md:right-2 opacity-20" style={{ color: COLORS.accent }}>
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 7h-3l-2 4v6h6v-6h-3zm-8 0H7l-2 4v6h6v-6h-3z" /></svg>
                          </div>
                          <div className="relative px-0.5 sm:px-1">
                            <p className={`${cormorant.className} text-[10px] sm:text-xs md:text-base leading-tight sm:leading-relaxed italic font-medium`} style={{ color: COLORS.medium }}>
                              {guest.message}
                            </p>
                          </div>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 sm:w-1 h-8 sm:h-12 md:h-16 rounded-r-full opacity-40" style={{ background: `linear-gradient(to bottom, transparent, ${COLORS.accent}, transparent)` }} />
                        </div>
                      )}

                      {guest.companions && guest.companions.length > 0 && (
                        <div className="pt-1.5 sm:pt-2 md:pt-2.5 border-t" style={{ borderColor: COLORS.border }}>
                          <div className="flex items-center gap-1 mb-1 sm:mb-1.5">
                            <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" style={{ color: COLORS.accent }} />
                            <span className={`${cormorant.className} text-[9px] sm:text-[10px] md:text-xs font-semibold`} style={{ color: COLORS.deep }}>Companions</span>
                          </div>
                          <div className="flex flex-wrap gap-1 sm:gap-1.5">
                            {guest.companions.map((companion, idx) => (
                              <div
                                key={idx}
                                className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-lg border transition-colors hover:border-opacity-60"
                                style={INNER_BOX_STYLE}
                              >
                                <span className={`${cormorant.className} text-[9px] sm:text-[10px] md:text-xs font-medium whitespace-nowrap`} style={{ color: COLORS.deep }}>{companion.name}</span>
                                {companion.relationship && companion.relationship.trim() !== "" && (
                                  <span className={`${cormorant.className} text-[8px] sm:text-[9px] md:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-full border whitespace-nowrap`} style={{ color: COLORS.deep, backgroundColor: "rgba(184, 50, 50, 0.08)", borderColor: COLORS.border }}>
                                    {companion.relationship}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-1 pt-1.5 sm:pt-2 md:pt-2.5 mt-1.5 sm:mt-2 md:mt-2.5 border-t" style={{ borderColor: COLORS.border }}>
                        <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-70" style={{ color: COLORS.accent }} />
                        <span className={`${cormorant.className} text-[8px] sm:text-[9px] md:text-[10px] opacity-80`} style={{ color: COLORS.medium }}>
                          Confirmed {formatDate(guest.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
