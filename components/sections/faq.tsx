"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { Section } from "@/components/section"
import { Cormorant_Garamond, Cinzel } from "next/font/google"
import { siteConfig } from "@/content/site"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
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

const ITEM_STYLE = {
  background: COLORS.parchmentSoft,
  border: `1px solid ${COLORS.border}`,
  boxShadow: "0 2px 16px rgba(120, 85, 35, 0.10)",
} as const

const SEPARATOR_GRADIENT = `linear-gradient(to right, transparent, ${COLORS.gold}, transparent)`

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: "When is the wedding?",
    answer:
    `Our wedding will be held on ${siteConfig.ceremony.date} (${siteConfig.ceremony.day})`
  },
  {
    question: "What time should I arrive for the ceremony?",
    answer:
      `Our ceremony will begin promptly at ${siteConfig.ceremony.time}. We kindly ask guests to arrive 30–45 minutes earlier to allow enough time for parking, walking to the ceremony area, and finding your seats so we can begin on time.`,
  },
  {
    question: "Where will the ceremony and reception take place?",
    answer:
    `The ceremony will be held at ${siteConfig.ceremony.location}, ${siteConfig.ceremony.venue}. You can find detailed directions, addresses, and maps in the Details Section above. The reception will be held at ${siteConfig.reception.location}, ${siteConfig.reception.venue}, 30 minute drive from the ceremony. You can find detailed directions, addresses, and maps in the Details Section above.`
  },
  {
    question: "Is there an entourage call time?",
    answer:
    `Yes. We request our Principal Sponsors to arrive at ${siteConfig.ceremony.entourageTime} so we can prepapre and settle before the ceremony begins`
  },
  {
    question: "How do I RSVP?",
    answer:
    `Please RSVP through the RSVP section on this invitation. Simply search for your name in the guest list and confirm your attendance. Due Date of final RSVP is on ${siteConfig.details.rsvp.deadline}. For any questions, please contact ${siteConfig.details.rsvp.contact} via Messenger`
  },
  {
    question: "Are children allowed?",
    answer:
    "While we love your little ones, in the spirit of celebration and intimacy, we kindly request that this special day occasion be reserved for adults only. Our nieces and nephews from our immediate family will be the only little ones joining us."
  },
  {
    question: "Can I sit anywhere at the reception?",
    answer:
      "Please don't. We kindly ask our guests to follow the seating arrangement prepared for the reception.\n\nA great deal of thought and care went into planning the seating so that everyone will feel comfortable and be seated with friends, family, or guests who share similar connections. Each seat was thoughtfully arranged with every guest in mind. Our reception team will gladly assist you in finding your assigned table.",
  },
  {
    question: "Is there parking available?",
    answer:
      "Yes, parking is available at the venue, and parking attendants, along with our coordinators, will assist you on the day",
  },
  {
    question: "Will there be a wedding gift registry?",
    answer:
      "With all that we have, we are truly blessed. Your presence and prayers are what we request most. However, if you desire to give nonetheless, a monetary gift to help us begin our new life together would be humbly appreciated. You can find our gift registry information in the Gift Guide section.",
  },
  {
    question: "Unplugged Ceremony",
    answer:
      "EYES UP, PHONES DOWN, HEARTS OPEN.\n\nThe greatest gift you can give us during our ceremony is your presence. We respectfully request that guests refrain from taking photos or videos during the ceremony so our official photographers can capture every moment without distraction. We promise to share the beautiful photos with you afterward!\n\nOur professional photographers will be capturing every beautiful memory, and we promise to share the photos with everyone afterwards.",
  },
  {
    question: "Can I take photos or videos during the reception?",
    answer:
      "Yes! While our I DO’s will be unplugged, our reception will not be. As a couple who loves photos and memories, we would love for you to capture the fun moments throughout the evening. We prepared this celebration wholeheartedly and we want everyone to enjoy it fully.",
  },
  {
    question: "What should I do if I can’t make it?",
    answer:
      "Your presence will truly be missed, but we completely understand.\n\nPlease kindly let us know through RSVP as soon as possible so we may adjust arrangements accordingly.",
  },
  {
    question: "I said “No” to RSVP but my plans changed. Can I still attend?",
    answer:
      "Please check with us first before making arrangements. Due to limited seating and a carefully planned guest list, attendance cannot be guaranteed without prior confirmation.",
  },
  {
    question: "When is the appropriate time to leave?",
    answer:
      "It took us some time to plan for a heartfelt wedding that everyone would hopefully enjoy. We humbly request that you celebrate with us until the program ends. Please don't eat and run! Let's laugh, take pictures, sing, and have fun!",
  },
  {
    question: "What if I have dietary restrictions or allergies?",
    answer:
      "Please let us know about any dietary restrictions or allergies when you RSVP. We want to ensure everyone can enjoy the celebration comfortably.",
  },
  {
    question: "How can I help the couple have a great time during their wedding?",
    answer:
      "• Pray with us for favorable weather and the continuous blessings of our Lord as we enter this new chapter of our lives as husband and wife.\n\n• RSVP as soon as your schedule is cleared.\n\n• Dress appropriately and follow our wedding motif.\n\n• Be on time.\n\n• Follow the seating arrangement in the reception.\n\n• Stay until the end of the program.\n\n• Join the activities and enjoy!",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
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

      <Section id="faq" className="relative z-10 py-12 md:py-16 lg:py-20 overflow-hidden bg-transparent">
      {/* Corner decorations */}
      <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden>
        <Image src="/decoration/left-top-corner.png" alt="" width={320} height={320} className="absolute top-0 left-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
        <Image src="/decoration/right-top-corner.png" alt="" width={320} height={320} className="absolute top-0 right-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
        <Image src="/decoration/left-down-corner.png" alt="" width={320} height={320} className="absolute bottom-0 left-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
        <Image src="/decoration/right-down-corner.png" alt="" width={320} height={320} className="absolute bottom-0 right-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
      </div>

      {/* Section Header */}
      <div className="relative z-30 text-center mb-6 sm:mb-9 md:mb-12">
        <p className={`${cormorant.className} text-[0.7rem] sm:text-xs md:text-sm uppercase tracking-[0.28em] mb-2 mx-auto max-w-xs sm:max-w-sm md:max-w-md px-10 sm:px-14 md:px-0`} style={{ color: COLORS.medium }}>
          Answers for our celebration day
        </p>
        <h2 
                className="parisienne-regular text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] leading-tight"
                style={{ color: COLORS.deep }}
                >
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed px-10 sm:px-14 md:px-2 mb-2 sm:mb-3" style={{ color: COLORS.medium }}>
          Helpful notes so you can simply arrive, celebrate, and enjoy this new chapter with us.
        </p>
        <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
          <span className="h-px w-10 sm:w-14 md:w-20" style={{ background: SEPARATOR_GRADIENT }} />
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.accent }} />
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.borderStrong }} />
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.accent }} />
          </div>
          <span className="h-px w-10 sm:w-14 md:w-20" style={{ background: SEPARATOR_GRADIENT }} />
        </div>
      </div>

      {/* FAQ content */}
      <div className="relative z-30 max-w-4xl mx-auto px-3 sm:px-5">
        <div
          className="relative backdrop-blur-md rounded-xl sm:rounded-2xl overflow-hidden"
          style={CARD_STYLE}
        >
          <div className="relative p-2.5 sm:p-4 md:p-5 lg:p-6">
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              {faqItems.map((item, index) => {
                const isOpen = openIndex === index
                const contentId = `faq-item-${index}`
                return (
                  <div
                    key={index}
                    className="rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md"
                    style={ITEM_STYLE}
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="group w-full px-2.5 sm:px-3 md:px-4 lg:px-5 py-2 sm:py-2.5 md:py-3 lg:py-4 flex items-center justify-between text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors"
                      style={{ ["--tw-ring-color" as string]: COLORS.accent }}
                      aria-expanded={isOpen}
                      aria-controls={contentId}
                    >
                      <span
                        className="font-semibold pr-2 sm:pr-3 md:pr-4 text-xs sm:text-sm md:text-base lg:text-lg leading-snug sm:leading-relaxed transition-colors duration-200"
                        style={{ color: isOpen ? COLORS.accent : COLORS.deep }}
                      >
                        {item.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`flex-shrink-0 transition-transform duration-300 w-4 h-4 sm:w-5 sm:h-5 ${isOpen ? "rotate-180" : ""}`}
                        style={{ color: isOpen ? COLORS.accent : COLORS.medium }}
                        aria-hidden
                      />
                    </button>

                    <div
                      id={contentId}
                      role="region"
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div
                          className="px-2.5 sm:px-3 md:px-4 lg:px-5 py-2 sm:py-2.5 md:py-3 lg:py-4 border-t"
                          style={{ backgroundColor: COLORS.parchmentMuted, borderColor: COLORS.border }}
                        >
                          {item.answer.includes("[RSVP_LINK]") ? (
                            <p className={`${cormorant.className} font-medium leading-relaxed sm:leading-loose text-xs sm:text-sm md:text-base lg:text-lg whitespace-pre-line tracking-wide`} style={{ color: COLORS.deep }}>
                              {item.answer.split("[RSVP_LINK]")[0]}
                              <a
                                href="#guest-list"
                                className="underline font-bold transition-colors hover:opacity-80"
                                style={{ color: COLORS.accent }}
                                onClick={(e) => {
                                  e.preventDefault()
                                  document.getElementById("guest-list")?.scrollIntoView({ behavior: "smooth" })
                                }}
                              >
                                {item.answer.match(/\[RSVP_LINK\](.*?)\[\/RSVP_LINK\]/)?.[1]}
                              </a>
                              {item.answer.split("[/RSVP_LINK]")[1]}
                            </p>
                          ) : (
                            <p className={`${cormorant.className} font-medium leading-relaxed sm:leading-loose text-xs sm:text-sm md:text-base lg:text-lg whitespace-pre-line tracking-wide`} style={{ color: COLORS.deep }}>
                              {item.answer}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      </Section>
    </div>
  )
}
