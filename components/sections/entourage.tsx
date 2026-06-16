"use client"

import React from "react"
import { useState, useEffect, useMemo, useRef } from "react"
import { siteConfig, entourage as staticEntourage, principalSponsors as staticSponsors } from "@/content/site"
import { Loader2, Users } from "lucide-react"
import Image from "next/image"
import { Cormorant_Garamond, Cinzel } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
})

interface EntourageMember {
  Name: string
  RoleCategory: string
  RoleTitle: string
  Email: string
}

interface PrincipalSponsor {
  MalePrincipalSponsor: string
  FemalePrincipalSponsor: string
}

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
const HOVER_HIGHLIGHT = "linear-gradient(to right, transparent, rgba(184, 50, 50, 0.08), transparent)"

function mapStaticEntourage(): EntourageMember[] {
  const roleToCategory: Record<string, string> = {
    "Best Man": "Best Man",
    "Matron of Honor": "Matron of Honor",
    "Maid of Honor": "Maid of Honor",
    "Bridesmaid": "Bridesmaids",
    "Groomsman": "Groomsmen",
    "Father": "Parents of the Bride",
    "Mother": "Parents of the Bride",
    "Brother": "Parents of the Groom",
    "Flower Girl": "Flower Girls",
    "Little Bride": "Little Bride",
    "Little Groom": "Little Groom",
    "Ring Bearer": "Ring Bearer",
    "Coin Bearer": "Coin Bearer",
    "Bible Bearer": "Bible Bearer",
  }
  return staticEntourage.map(({ role, name, group }) => {
    let category = roleToCategory[role] ?? (role.endsWith("s") ? role : role + "s")
    if (group === "kate-family") category = "Parents of the Bride"
    if (group === "christian-family") category = "Parents of the Groom"
    if (group === "candle") category = "Candle Sponsors"
    if (group === "cord") category = "Cord Sponsors"
    return { Name: name, RoleTitle: role, RoleCategory: category, Email: "" }
  })
}

function mapStaticSponsors(): PrincipalSponsor[] {
  return staticSponsors
    .filter((s) => s.name || s.spouse)
    .map(({ name, spouse }) => ({
      MalePrincipalSponsor: name || "",
      FemalePrincipalSponsor: spouse || "",
    }))
}

const ROLE_CATEGORY_ORDER = [
  "OFFICIATING MINISTER",
  "The Couple",
  "Children",
  "Parents of the Groom",
  "Parents of the Bride",
  "Family of the Groom",
  "Family of the Bride",
  "Matron of Honor",
  "Best Man",
  "Maid of Honor",
  "Maids of Honor",
  "Witnesses Male",
  "Witnesses Female",
  "Candle Sponsors",
  "Veil Sponsors",
  "Cord Sponsors",
  "Groomsmen",
  "Bridesmaids",
  "Little Groom",
  "Little Bride",
  "Ring Bearer",
  "Bible Bearer",
  "Coin Bearer",
  "Flower Girls",
  "Bearers of Love",
]

const HIDDEN_ROLE_CATEGORIES = new Set<string>([])

function normalizeRoleCategory(category: string): string {
  const normalized = category.trim()
  if (normalized.toLowerCase() === "officiating minister") {
    return "OFFICIATING MINISTER"
  }
  return normalized
}

export function Entourage() {
  const [entourage, setEntourage] = useState<EntourageMember[]>([])
  const [sponsors, setSponsors] = useState<PrincipalSponsor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const fetchEntourage = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/entourage", { cache: "no-store" })
      if (!response.ok) throw new Error("Failed to fetch entourage")
      const data: EntourageMember[] = await response.json()
      const list = Array.isArray(data) && data.length > 0 ? data : mapStaticEntourage()
      setEntourage(list)
    } catch (err: unknown) {
      console.error("Failed to load entourage:", err)
      setEntourage(mapStaticEntourage())
      setError(null)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSponsors = async () => {
    try {
      const res = await fetch("/api/principal-sponsor", { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load principal sponsors")
      const data: PrincipalSponsor[] = await res.json()
      const list = Array.isArray(data) && data.length > 0
        ? data.filter((s) => s.MalePrincipalSponsor || s.FemalePrincipalSponsor)
        : mapStaticSponsors()
      setSponsors(list)
    } catch (e: unknown) {
      console.error("Failed to load sponsors:", e)
      setSponsors(mapStaticSponsors())
    }
  }

  useEffect(() => {
    fetchEntourage()
    fetchSponsors()

    // Set up auto-refresh listener for dashboard updates
    const handleEntourageUpdate = () => {
      setTimeout(() => {
        fetchEntourage()
        fetchSponsors()
      }, 1000)
    }

    window.addEventListener("entourageUpdated", handleEntourageUpdate)

    return () => {
      window.removeEventListener("entourageUpdated", handleEntourageUpdate)
    }
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Group entourage by role category
  const grouped = useMemo(() => {
    const grouped: Record<string, EntourageMember[]> = {}
    
    entourage.forEach((member) => {
      const category = normalizeRoleCategory(member.RoleCategory)

      // Skip members without a category or in "Other"
      if (!category || category === "Other") {
        return
      }
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(member)
    })
    
    return grouped
  }, [entourage])

  const hasParents =
    (grouped["Parents of the Groom"]?.length ?? 0) > 0 || (grouped["Parents of the Bride"]?.length ?? 0) > 0

  // Helper component for elegant section titles (category labels)
  const SectionTitle = ({
    children,
    align = "center",
    className = "",
  }: {
    children: React.ReactNode
    align?: "left" | "center" | "right"
    className?: string
  }) => {
    const textAlign =
      align === "right" ? "text-right" : align === "left" ? "text-left" : "text-center"
    return (
      <h3
        className={`relative ${cinzel.className} text-[0.7rem] sm:text-[0.85rem] md:text-base lg:text-lg tracking-[0.18em] uppercase mb-1 sm:mb-1.5 md:mb-2 ${textAlign} ${className} transition-all duration-300 whitespace-nowrap`}
        style={{ color: COLORS.deep }}
      >
        {children}
      </h3>
    )
  }

  // Helper component for name items with role title (supports alignment)
  const NameItem = ({
    member,
    align = "center",
    showRole = true,
  }: {
    member: EntourageMember
    align?: "left" | "center" | "right"
    showRole?: boolean
  }) => {
    const containerAlign =
      align === "right" ? "items-end" : align === "left" ? "items-start" : "items-center"
    const textAlign =
      align === "right" ? "text-right" : align === "left" ? "text-left" : "text-center"
    return (
      <div
        className={`relative flex flex-col ${containerAlign} justify-center py-0.5 sm:py-1 md:py-1 leading-snug sm:leading-snug group/item transition-all duration-300 hover:scale-[1.02] sm:hover:scale-[1.03]`}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-md"
          style={{ background: HOVER_HIGHLIGHT }}
        />
        <p
          className={`relative text-[10px] sm:text-[11.5px] md:text-[12.5px] lg:text-[13.5px] font-semibold ${textAlign} transition-all duration-300`}
          style={{ color: COLORS.deep }}
        >
          {member.Name}
        </p>
        {showRole && member.RoleTitle && (
          <p
            className={`relative text-[9px] sm:text-[10px] md:text-[10px] lg:text-xs font-medium mt-0 leading-tight ${textAlign} tracking-wide uppercase transition-colors duration-300 opacity-80`}
            style={{ color: COLORS.medium }}
          >
            {member.RoleTitle}
          </p>
        )}
      </div>
    )
  }

  // Helper component for two-column layout wrapper
  const TwoColumnLayout = ({ 
    children, 
    leftTitle, 
    rightTitle,
    singleTitle,
    centerContent = false 
  }: { 
    children: React.ReactNode
    leftTitle?: string
    rightTitle?: string
    singleTitle?: string
    centerContent?: boolean
  }) => {
    if (singleTitle) {
      return (
        <div className="mb-2 sm:mb-2.5 md:mb-3">
          <SectionTitle>{singleTitle}</SectionTitle>
          <div className={`grid grid-cols-1 min-[350px]:grid-cols-2 gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-0.5 sm:gap-y-1 md:gap-y-1 ${centerContent ? 'max-w-2xl mx-auto' : ''}`}>
            {children}
          </div>
        </div>
      )
    }

    return (
      <div className="mb-2 sm:mb-2.5 md:mb-3">
        <div className="grid grid-cols-1 min-[350px]:grid-cols-2 gap-x-3 sm:gap-x-4 md:gap-x-6 mb-2 sm:mb-2.5 md:mb-3">
          {leftTitle && (
            <SectionTitle align="right" className="pr-1 sm:pr-1.5 md:pr-2">{leftTitle}</SectionTitle>
          )}
          {rightTitle && (
            <SectionTitle align="left" className="pl-1 sm:pl-1.5 md:pl-2">{rightTitle}</SectionTitle>
          )}
        </div>
        <div className={`grid grid-cols-1 min-[350px]:grid-cols-2 gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-0.5 sm:gap-y-1 md:gap-y-1 ${centerContent ? 'max-w-2xl mx-auto' : ''}`}>
          {children}
        </div>
      </div>
    )
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

      <section
        ref={sectionRef}
        id="entourage"
        className="relative z-10 py-8 md:py-10 lg:py-12 overflow-hidden"
      >
      {/* Corner decorations */}
      <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden>
        <Image src="/decoration/left-top-corner.png" alt="" width={320} height={320} className="absolute top-0 left-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
        <Image src="/decoration/right-top-corner.png" alt="" width={320} height={320} className="absolute top-0 right-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
        <Image src="/decoration/left-down-corner.png" alt="" width={320} height={320} className="absolute bottom-0 left-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
        <Image src="/decoration/right-down-corner.png" alt="" width={320} height={320} className="absolute bottom-0 right-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
      </div>

      {/* Section Header */}
      <div className={`relative z-30 text-center mb-4 sm:mb-5 md:mb-6 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>
        <p
          className={`${cormorant.className} text-[0.7rem] sm:text-xs md:text-sm uppercase tracking-[0.28em] mb-2 mx-auto max-w-xs sm:max-w-sm md:max-w-md px-10 sm:px-14 md:px-0`}
          style={{ color: COLORS.medium }}
        >
          Those who stand with {siteConfig.couple.groomNickname} &amp; {siteConfig.couple.brideNickname}
        </p>

        <h2
          className="parisienne-regular text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] leading-tight mb-1 sm:mb-2 md:mb-2.5"
          style={{ color: COLORS.deep }}
        >
          Wedding Entourage
        </h2>

        <p
          className={`${cormorant.className} text-xs sm:text-sm md:text-base mb-2 sm:mb-2.5 md:mb-3 italic px-24 sm:px-36 md:px-48`}
          style={{ color: COLORS.medium }}
        >
          Honoring those who share in our joy
        </p>

        <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
          <div className="h-px w-10 sm:w-14 md:w-20" style={{ background: SEPARATOR_GRADIENT }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.accent }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.borderStrong }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.accent }} />
          <div className="h-px w-10 sm:w-14 md:w-20" style={{ background: SEPARATOR_GRADIENT }} />
        </div>
      </div>

      {/* Central Card Container */}
      <div
        className={`relative z-30 max-w-4xl mx-auto px-3 sm:px-5 transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div
          className="relative backdrop-blur-lg rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500 group"
          style={CARD_STYLE}
        >
          {/* Card content */}
          <div className="relative p-3 sm:p-4 md:p-5 z-10">
            {isLoading ? (
              <div className="flex items-center justify-center py-24 sm:py-28 md:py-32">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin opacity-70" style={{ color: COLORS.accent }} />
                  <span className="font-serif text-base sm:text-lg opacity-80" style={{ color: COLORS.deep }}>Loading entourage...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-24 sm:py-28 md:py-32">
                <div className="text-center">
                  <p className="font-serif text-base sm:text-lg mb-3" style={{ color: COLORS.deep }}>{error}</p>
                  <button
                    onClick={fetchEntourage}
                    className="font-serif underline transition-colors duration-200 opacity-90 hover:opacity-100"
                    style={{ color: COLORS.deep }}
                  >
                    Try again
                  </button>
                </div>
              </div>
            ) : entourage.length === 0 ? (
              <div className="text-center py-24 sm:py-28 md:py-32">
                <Users className="h-14 w-14 sm:h-16 sm:w-16 mx-auto mb-4 opacity-30" style={{ color: COLORS.deep }} />
                <p className="font-serif text-base sm:text-lg opacity-60" style={{ color: COLORS.deep }}>No entourage members yet</p>
              </div>
            ) : (
            <>
              {ROLE_CATEGORY_ORDER.map((category, categoryIndex) => {
                const members = grouped[category] || []
                
                if (members.length === 0) return null
                if (HIDDEN_ROLE_CATEGORIES.has(category)) return null

                // Render OFFICIATING MINISTER directly above Principal Sponsors (in Parents block)
                if (category === "OFFICIATING MINISTER" && hasParents) return null

                // Special handling for The Couple - display Bride and Groom side by side
                if (category === "The Couple") {
                   const groom = members.find(m => m.RoleTitle?.toLowerCase().includes('groom'))
                  const bride = members.find(m => m.RoleTitle?.toLowerCase().includes('bride'))
                  
                  return (
                    <div key={category}>
                      {categoryIndex > 0 && (
                        <div className="flex justify-center py-2 sm:py-2.5 md:py-3 mb-2 sm:mb-2.5 md:mb-3">
                          <div className="w-full max-w-md h-px" style={{ background: SEPARATOR_GRADIENT }}></div>
                        </div>
                      )}
                      <TwoColumnLayout singleTitle="The Couple" centerContent={true}>
                        <div className="px-1.5 sm:px-2 md:px-2.5">
                          {groom && <NameItem member={groom} align="right" />}
                        </div>
                        <div className="px-1.5 sm:px-2 md:px-2.5">
                          {bride && <NameItem member={bride} align="left" />}
                        </div>
                      </TwoColumnLayout>
                    </div>
                  )
                }

                // Special handling for Parents sections - combine into single two-column layout
                if (category === "Parents of the Bride" || category === "Parents of the Groom") {
                  // Get both parent groups
                  const parentsBride = grouped["Parents of the Bride"] || []
                  const parentsGroom = grouped["Parents of the Groom"] || []
                  
                  // Helper function to sort parents: father first, then mother
                  const sortParents = (members: EntourageMember[]) => {
                    return [...members].sort((a, b) => {
                      const aIsFather = a.RoleTitle?.toLowerCase().includes('father') ?? false
                      const bIsFather = b.RoleTitle?.toLowerCase().includes('father') ?? false
                      
                      // Father comes first
                      if (aIsFather && !bIsFather) return -1
                      if (!aIsFather && bIsFather) return 1
                      return 0
                    })
                  }
                  
                  // Only render once (when processing "Parents of the Groom")
                  if (category === "Parents of the Groom") {
                    return (
                      <div key="Parents">
                        {categoryIndex > 0 && (
                          <div className="flex justify-center py-2 sm:py-2.5 md:py-3 mb-2 sm:mb-2.5 md:mb-3">
                            <div className="w-full max-w-md h-px" style={{ background: SEPARATOR_GRADIENT }}></div>
                          </div>
                        )}
                        <TwoColumnLayout leftTitle="Groom’s Parents" rightTitle="Bride’s Parents">
                          {(() => {
                            const leftArr = sortParents(parentsGroom)
                            const rightArr = sortParents(parentsBride)
                            const maxLen = Math.max(leftArr.length, rightArr.length)
                            const rows = []
                            for (let i = 0; i < maxLen; i++) {
                              const left = leftArr[i]
                              const right = rightArr[i]
                              rows.push(
                                <React.Fragment key={`parents-row-${i}`}>
                                  <div key={`parent-groom-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {left ? <NameItem member={left} align="right" /> : <div className="py-0.5" />}
                                  </div>
                                  <div key={`parent-bride-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {right ? <NameItem member={right} align="left" /> : <div className="py-0.5" />}
                                  </div>
                                </React.Fragment>
                              )
                            }
                            return rows
                          })()}
                        </TwoColumnLayout>
                        
                        {/* Officiating Minister section - displayed above Principal Sponsors */}
                        {(() => {
                          const officiating = grouped["OFFICIATING MINISTER"] || []
                          if (officiating.length === 0) return null
                          return (
                            <div key="OfficiatingMinisterBeforeSponsors" className="mt-4 sm:mt-5 md:mt-6">
                              <TwoColumnLayout singleTitle="OFFICIATING MINISTER" centerContent={true}>
                                {officiating.map((member, idx) => (
                                  <div
                                    key={`officiating-${idx}-${member.Name}`}
                                    className="px-1.5 sm:px-2 md:px-2.5 min-[350px]:col-span-2 flex justify-center"
                                  >
                                    <NameItem member={member} align="center" showRole={false} />
                                  </div>
                                ))}
                              </TwoColumnLayout>
                            </div>
                          )
                        })()}

                        {/* Principal Sponsors section - displayed after Parents */}
                        {sponsors.length > 0 && (
                          <div key="SponsorsAfterParents">
                            <div className="flex justify-center py-1.5 sm:py-2 md:py-2.5 mb-2 sm:mb-2.5 md:mb-3">
                            </div>
                            <TwoColumnLayout singleTitle="Principal Sponsors" centerContent={true}>
                              {sponsors.map((sponsor, idx) => (
                                <React.Fragment key={`sponsor-row-${idx}`}>
                                  <div key={`sponsor-male-${idx}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {sponsor.MalePrincipalSponsor ? (
                                      <NameItem 
                                        member={{
                                          Name: sponsor.MalePrincipalSponsor,
                                          RoleCategory: "",
                                          RoleTitle: "",
                                          Email: ""
                                        }} 
                                        align="right" 
                                        showRole={false}
                                      />
                                    ) : (
                                      <div className="py-0.5 sm:py-1 md:py-1.5" />
                                    )}
                                  </div>
                                  <div key={`sponsor-female-${idx}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {sponsor.FemalePrincipalSponsor ? (
                                      <NameItem 
                                        member={{
                                          Name: sponsor.FemalePrincipalSponsor,
                                          RoleCategory: "",
                                          RoleTitle: "",
                                          Email: ""
                                        }} 
                                        align="left" 
                                        showRole={false}
                                      />
                                    ) : (
                                      <div className="py-0.5 sm:py-1 md:py-1.5" />
                                    )}
                                  </div>
                                </React.Fragment>
                              ))}
                            </TwoColumnLayout>
                          </div>
                        )}
                      </div>
                    )
                  }
                  // Skip rendering for "Parents of the Bride" since it's already rendered above
                  return null
                }

                // Special handling for Family of the Groom/Bride - combine into single two-column layout
                if (category === "Family of the Groom" || category === "Family of the Bride") {
                  const familyGroom = grouped["Family of the Groom"] || []
                  const familyBride = grouped["Family of the Bride"] || []

                  if (category === "Family of the Groom") {
                    return (
                      <div key="Family">
                        {categoryIndex > 0 && (
                          <div className="flex justify-center py-2 sm:py-2.5 md:py-3 mb-2 sm:mb-2.5 md:mb-3">
                            <div className="w-full max-w-md h-px" style={{ background: SEPARATOR_GRADIENT }}></div>
                          </div>
                        )}
                        <TwoColumnLayout leftTitle="Family of the Groom" rightTitle="Family of the Bride">
                          {(() => {
                            const maxLen = Math.max(familyGroom.length, familyBride.length)
                            const rows = []
                            for (let i = 0; i < maxLen; i++) {
                              const left = familyGroom[i]
                              const right = familyBride[i]
                              rows.push(
                                <React.Fragment key={`family-row-${i}`}>
                                  <div key={`family-groom-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {left ? <NameItem member={left} align="right" /> : <div className="py-0.5" />}
                                  </div>
                                  <div key={`family-bride-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {right ? <NameItem member={right} align="left" /> : <div className="py-0.5" />}
                                  </div>
                                </React.Fragment>
                              )
                            }
                            return rows
                          })()}
                        </TwoColumnLayout>
                      </div>
                    )
                  }

                  return null
                }

                // Special handling for Maid/Matron of Honor and Best Man - combine into single two-column layout
                if (category === "Matron of Honor" || category === "Maid of Honor" || category === "Best Man") {
                  // Get both honor attendant groups - combine Maid and Matron of Honor
                  const maidOfHonor = [...(grouped["Maid of Honor"] || []), ...(grouped["Matron of Honor"] || [])]
                  const bestMan = grouped["Best Man"] || []
                  
                  // Only render once (when processing "Best Man")
                  if (category === "Best Man") {
                    return (
                      <div key="HonorAttendants">
                        {categoryIndex > 0 && (
                          <div className="flex justify-center py-2 sm:py-2.5 md:py-3 mb-2 sm:mb-2.5 md:mb-3">
                            <div className="w-full max-w-md h-px" style={{ background: SEPARATOR_GRADIENT }}></div>
                          </div>
                        )}
                        <TwoColumnLayout leftTitle="Best Man" rightTitle="Maid of Honor">
                          {(() => {
                            const maxLen = Math.max(bestMan.length, maidOfHonor.length)
                            const rows = []
                            for (let i = 0; i < maxLen; i++) {
                              const left = bestMan[i]
                              const right = maidOfHonor[i]
                              rows.push(
                                <React.Fragment key={`honor-row-${i}`}>
                                  <div key={`maid-cell-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {left ? <NameItem member={left} align="right" /> : <div className="py-0.5" />}
                                  </div>
                                  <div key={`bestman-cell-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {right ? <NameItem member={right} align="left" /> : <div className="py-0.5" />}
                                  </div>
                                </React.Fragment>
                              )
                            }
                            return rows
                          })()}
                        </TwoColumnLayout>
                      </div>
                    )
                  }
                  // Skip rendering for "Matron of Honor" and "Maid of Honor" since they're already rendered above
                  return null
                }

                // Special handling for Maids of Honor - two column layout
                if (category === "Maids of Honor") {
                  return (
                    <div key="MaidsOfHonor">
                      {categoryIndex > 0 && (
                        <div className="flex justify-center py-2 sm:py-2.5 md:py-3 mb-2 sm:mb-2.5 md:mb-3">
                          <div className="w-full max-w-md h-px" style={{ background: SEPARATOR_GRADIENT }}></div>
                        </div>
                      )}
                      <TwoColumnLayout singleTitle="Maids of Honor" centerContent={true}>
                        {(() => {
                          if (members.length === 2) {
                            return (
                              <>
                                <div className="px-1.5 sm:px-2 md:px-2.5">
                                  <NameItem member={members[0]} align="right" />
                                </div>
                                <div className="px-1.5 sm:px-2 md:px-2.5">
                                  <NameItem member={members[1]} align="left" />
                                </div>
                              </>
                            )
                          }
                          const half = Math.ceil(members.length / 2)
                          const left = members.slice(0, half)
                          const right = members.slice(half)
                          const maxLen = Math.max(left.length, right.length)
                          const rows = []
                          for (let i = 0; i < maxLen; i++) {
                            const l = left[i]
                            const r = right[i]
                            rows.push(
                              <React.Fragment key={`maids-row-${i}`}>
                                <div className="px-1.5 sm:px-2 md:px-2.5">
                                  {l ? <NameItem member={l} align="right" /> : <div className="py-0.5" />}
                                </div>
                                <div className="px-1.5 sm:px-2 md:px-2.5">
                                  {r ? <NameItem member={r} align="left" /> : <div className="py-0.5" />}
                                </div>
                              </React.Fragment>
                            )
                          }
                          return rows
                        })()}
                      </TwoColumnLayout>
                    </div>
                  )
                }

                // Special handling for Witnesses Male and Witnesses Female - two columns, male left / female right
                if (category === "Witnesses Male" || category === "Witnesses Female") {
                  const witnessesMale = grouped["Witnesses Male"] || []
                  const witnessesFemale = grouped["Witnesses Female"] || []

                  if (category === "Witnesses Male") {
                    if (witnessesMale.length === 0 && witnessesFemale.length === 0) return null

                    return (
                      <div key="Witnesses">
                        {categoryIndex > 0 && (
                          <div className="flex justify-center py-2 sm:py-2.5 md:py-3 mb-2 sm:mb-2.5 md:mb-3">
                            <div className="w-full max-w-md h-px" style={{ background: SEPARATOR_GRADIENT }}></div>
                          </div>
                        )}
                        <TwoColumnLayout singleTitle="Witnesses">
                          {(() => {
                            const maxLen = Math.max(witnessesMale.length, witnessesFemale.length)
                            const rows = []
                            for (let i = 0; i < maxLen; i++) {
                              const left = witnessesMale[i]
                              const right = witnessesFemale[i]
                              rows.push(
                                <React.Fragment key={`witness-row-${i}`}>
                                  <div key={`witness-male-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {left ? <NameItem member={left} align="right" /> : <div className="py-0.5" />}
                                  </div>
                                  <div key={`witness-female-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {right ? <NameItem member={right} align="left" /> : <div className="py-0.5" />}
                                  </div>
                                </React.Fragment>
                              )
                            }
                            return rows
                          })()}
                        </TwoColumnLayout>
                      </div>
                    )
                  }

                  return null
                }

                // Special handling for Little Groom and Little Bride - combine into single two-column layout
                if (category === "Little Groom" || category === "Little Bride") {
                  // Get both little ones groups
                  const littleGroom = grouped["Little Groom"] || []
                  const littleBride = grouped["Little Bride"] || []
                  
                  // Only render once (when processing "Little Groom")
                  if (category === "Little Groom") {
                    return (
                      <div key="LittleOnes">
                        {categoryIndex > 0 && (
                          <div className="flex justify-center py-2 sm:py-2.5 md:py-3 mb-2 sm:mb-2.5 md:mb-3">
                            <div className="w-full max-w-md h-px" style={{ background: SEPARATOR_GRADIENT }}></div>
                          </div>
                        )}
                        <TwoColumnLayout leftTitle="Little Groom" rightTitle="Little Bride">
                          {(() => {
                            const maxLen = Math.max(littleGroom.length, littleBride.length)
                            const rows = []
                            for (let i = 0; i < maxLen; i++) {
                              const left = littleGroom[i]
                              const right = littleBride[i]
                              rows.push(
                                <React.Fragment key={`little-row-${i}`}>
                                  <div key={`littlegroom-cell-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {left ? <NameItem member={left} align="right" /> : <div className="py-0.5" />}
                                  </div>
                                  <div key={`littlebride-cell-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                    {right ? <NameItem member={right} align="left" /> : <div className="py-0.5" />}
                                  </div>
                                </React.Fragment>
                              )
                            }
                            return rows
                          })()}
                        </TwoColumnLayout>
                      </div>
                    )
                  }
                  // Skip rendering for "Little Bride" since it's already rendered above
                  return null
                }

                // Special handling for Bridesmaids and Groomsmen - combine into single two-column layout
                if (category === "Bridesmaids" || category === "Groomsmen") {
                  // Get both bridal party groups
                  const bridesmaids = grouped["Bridesmaids"] || []
                  const groomsmen = grouped["Groomsmen"] || []
                  
                  // Only render once (when processing "Bridesmaids")
                  if (category === "Bridesmaids") {
                    return (
                      <React.Fragment key="BridalPartySection">
                        {/* Groomsmen/Bridesmaids section */}
                        <div key="BridalParty">
                          {categoryIndex > 0 && (
                            <div className="flex justify-center py-2 sm:py-2.5 md:py-3 mb-2 sm:mb-2.5 md:mb-3">
                              <div className="w-full max-w-md h-px" style={{ background: SEPARATOR_GRADIENT }}></div>
                            </div>
                          )}
                          <TwoColumnLayout leftTitle="Groomsmen" rightTitle="Bridesmaids">
                            {(() => {
                              const maxLen = Math.max(bridesmaids.length, groomsmen.length)
                              const rows = []
                              for (let i = 0; i < maxLen; i++) {
                                const groomsman = groomsmen[i]
                                const bridesmaid = bridesmaids[i]
                                rows.push(
                                  <React.Fragment key={`bridal-row-${i}`}>
                                    <div key={`groomsman-cell-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                      {groomsman ? <NameItem member={groomsman} align="right" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                                    </div>
                                    <div key={`bridesmaid-cell-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                      {bridesmaid ? <NameItem member={bridesmaid} align="left" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                                    </div>
                                  </React.Fragment>
                                )
                              }
                              return rows
                            })()}
                          </TwoColumnLayout>
                        </div>
                      </React.Fragment>
                    )
                  }
                  // Skip rendering for "Groomsmen" since it's already rendered above
                  return null
                }

                // Secondary Sponsors block: render all three groups under one heading
                if (category === "Candle Sponsors" || category === "Veil Sponsors" || category === "Cord Sponsors") {
                  // Only render the full block once — when processing the first one that exists in order
                  const secondarySponsorGroups = ["Candle Sponsors", "Veil Sponsors", "Cord Sponsors"] as const
                  const firstPresentGroup = secondarySponsorGroups.find((g) => (grouped[g]?.length ?? 0) > 0)
                  if (category !== firstPresentGroup) return null

                  const renderPairedGroup = (groupName: string) => {
                    const grpMembers = grouped[groupName] || []
                    if (grpMembers.length === 0) return null
                    return (
                      <div key={groupName} className="mb-2 sm:mb-2.5 md:mb-3">
                        <TwoColumnLayout singleTitle={groupName} centerContent={true}>
                          {grpMembers.length === 2 ? (
                            <>
                              <div className="px-1.5 sm:px-2 md:px-2.5">
                                <NameItem member={grpMembers[0]} align="right" />
                              </div>
                              <div className="px-1.5 sm:px-2 md:px-2.5">
                                <NameItem member={grpMembers[1]} align="left" />
                              </div>
                            </>
                          ) : (
                            <div className="col-span-full">
                              <div className="max-w-sm mx-auto flex flex-col items-center gap-0.5 sm:gap-1 md:gap-1">
                                {grpMembers.map((member, idx) => (
                                  <NameItem key={`${groupName}-${idx}-${member.Name}`} member={member} align="center" />
                                ))}
                              </div>
                            </div>
                          )}
                        </TwoColumnLayout>
                      </div>
                    )
                  }

                  return (
                    <div key="SecondarySponsorBlock">
                      {categoryIndex > 0 && (
                        <div className="flex justify-center py-2 sm:py-2.5 md:py-3 mb-2 sm:mb-2.5 md:mb-3">
                          <div className="w-full max-w-md h-px" style={{ background: SEPARATOR_GRADIENT }}></div>
                        </div>
                      )}
                      {/* Parent heading */}
                      <div className="mb-2 sm:mb-2.5 md:mb-3">
                        <SectionTitle>Secondary Sponsors</SectionTitle>
                      </div>
                      {secondarySponsorGroups.map(renderPairedGroup)}
                    </div>
                  )
                }

                // Default: single title, centered content
                return (
                  <div key={category}>
                    {categoryIndex > 0 && (
                      <div className="flex justify-center py-2 sm:py-2.5 md:py-3 mb-2 sm:mb-2.5 md:mb-3">
                        <div className="w-full max-w-md h-px" style={{ background: SEPARATOR_GRADIENT }}></div>
                      </div>
                    )}
                    <TwoColumnLayout singleTitle={category} centerContent={true}>
                      {(() => {
                        const SINGLE_COLUMN_SECTIONS = new Set([
                          "Best Man",
                          "Maid of Honor",
                          "Ring Bearer",
                          "Coin Bearer",
                          "Bible Bearer",
                          "Flower Girls",
                          "Presider",
                        ])
                        // Special rule: paired sponsor roles with exactly 2 names should meet at center
                        const PAIRED_SECTIONS = new Set(["Candle Sponsors", "Cord Sponsors", "Veil Sponsors"])
                        if (PAIRED_SECTIONS.has(category) && members.length === 2) {
                          const left = members[0]
                          const right = members[1]
                          return (
                            <>
                              <div className="px-1.5 sm:px-2 md:px-2.5">
                                <NameItem member={left} align="right" />
                              </div>
                              <div className="px-1.5 sm:px-2 md:px-2.5">
                                <NameItem member={right} align="left" />
                              </div>
                            </>
                          )
                        }
                        if (SINGLE_COLUMN_SECTIONS.has(category) || members.length <= 2) {
                          return (
                            <div className="col-span-full">
                              <div className="max-w-sm mx-auto flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2">
                                {members.map((member, idx) => (
                                  <NameItem key={`${category}-${idx}-${member.Name}`} member={member} align="center" />
                                ))}
                              </div>
                            </div>
                          )
                        }
                        // Default two-column sections: render row-by-row pairs to keep alignment on small screens
                        const half = Math.ceil(members.length / 2)
                        const left = members.slice(0, half)
                        const right = members.slice(half)
                        const maxLen = Math.max(left.length, right.length)
                        const rows = []
                        for (let i = 0; i < maxLen; i++) {
                          const l = left[i]
                          const r = right[i]
                          rows.push(
                            <React.Fragment key={`${category}-row-${i}`}>
                              <div key={`${category}-cell-left-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                {l ? <NameItem member={l} align="right" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                              </div>
                              <div key={`${category}-cell-right-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                {r ? <NameItem member={r} align="left" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                              </div>
                            </React.Fragment>
                          )
                        }
                        return rows
                      })()}
                    </TwoColumnLayout>
                  </div>
                )
              })}
              
              {/* Display any other categories not in the ordered list */}
              {Object.keys(grouped).filter(cat => !ROLE_CATEGORY_ORDER.includes(cat) && cat !== "Other").map((category) => {
                const members = grouped[category]
                return (
                  <div key={category}>
                    <div className="flex justify-center py-3 sm:py-4 md:py-5 mb-5 sm:mb-6 md:mb-8">

                    </div>
                    <TwoColumnLayout singleTitle={category} centerContent={true}>
                      {(() => {
                        if (members.length <= 2) {
                          return (
                            <div className="col-span-full">
                              <div className="max-w-sm mx-auto flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2">
                                {members.map((member, idx) => (
                                  <NameItem key={`${category}-${idx}-${member.Name}`} member={member} align="center" />
                                ))}
                              </div>
                            </div>
                          )
                        }
                        // Pair row-by-row for other categories as well
                        const half = Math.ceil(members.length / 2)
                        const left = members.slice(0, half)
                        const right = members.slice(half)
                        const maxLen = Math.max(left.length, right.length)
                        const rows = []
                        for (let i = 0; i < maxLen; i++) {
                          const l = left[i]
                          const r = right[i]
                          rows.push(
                            <React.Fragment key={`${category}-row-${i}`}>
                              <div key={`${category}-cell-left-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                {l ? <NameItem member={l} align="right" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                              </div>
                              <div key={`${category}-cell-right-${i}`} className="px-1.5 sm:px-2 md:px-2.5">
                                {r ? <NameItem member={r} align="left" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                              </div>
                            </React.Fragment>
                          )
                        }
                        return rows
                      })()}
                    </TwoColumnLayout>
                  </div>
                )
              })}
            </>
            )}
          </div>
        </div>
      </div>
      </section>
    </div>
  )
}