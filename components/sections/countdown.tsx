"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Section } from "@/components/section"
import { motion } from "motion/react"
import { Cormorant_Garamond } from "next/font/google"
import { siteConfig } from "@/content/site"
import Counter from "@/components/Counter"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownUnitProps {
  value: number
  label: string
}

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const COLORS = {
  deep: "#1C1C1E",
  medium: "rgba(28, 28, 30, 0.68)",
  muted: "rgba(28, 28, 30, 0.42)",
  accent: "#B83232",
  gold: "rgba(140, 94, 4, 0.45)",
  parchment: "rgba(250, 244, 232, 1)",
  border: "rgba(160, 122, 68, 0.25)",
} as const

const CARD_STYLE = {
  background: [
    "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255, 252, 244, 0.72) 0%, transparent 70%)",
    "rgba(250, 244, 232, 0.94)",
  ].join(", "),
  border: `1px solid ${COLORS.border}`,
  boxShadow: [
    "0 4px 40px rgba(120, 85, 35, 0.14)",
    "0 1px 0 rgba(255, 248, 230, 0.90) inset",
    "inset 0 0 60px rgba(200, 160, 90, 0.05)",
  ].join(", "),
} as const

function CountdownUnit({ value, label }: CountdownUnitProps) {
  const places = value >= 100 ? [100, 10, 1] : [10, 1]

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-2.5">
      <div className="relative w-full max-w-[96px] sm:max-w-[108px] md:max-w-[120px] lg:max-w-[132px]">
        <div
          className="relative rounded-xl sm:rounded-2xl px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5 overflow-hidden"
          style={{
            background: "rgba(255, 252, 244, 0.82)",
            border: `1px solid ${COLORS.border}`,
            boxShadow: "inset 0 1px 0 rgba(255,248,230,0.90), 0 2px 12px rgba(120,85,35,0.06)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: "linear-gradient(to right, transparent, rgba(184,50,50,0.35), transparent)" }}
          />
          <div className="relative z-10 flex items-center justify-center min-h-[2.5rem] sm:min-h-[2.75rem]">
            <Counter
              value={value}
              places={places}
              fontSize={30}
              padding={4}
              gap={2}
              textColor={COLORS.deep}
              fontWeight={700}
              borderRadius={6}
              horizontalPadding={3}
              gradientHeight={0}
              gradientFrom="transparent"
              gradientTo="transparent"
              counterStyle={{ backgroundColor: "transparent" }}
              digitStyle={{
                minWidth: "1.15ch",
                fontFamily: '"LeJourSerif", serif',
                color: COLORS.accent,
              }}
            />
          </div>
        </div>
      </div>

      <span
        style={{
          fontFamily: '"AgrandirWideBold", sans-serif',
          fontSize: "clamp(0.48rem, 1.0vw, 0.56rem)",
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: COLORS.muted,
        }}
      >
        {label}
      </span>
    </div>
  )
}

function VintageTextureLayers() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden
        style={{
          background: [
            "radial-gradient(ellipse 60% 40% at 20% 20%, rgba(210, 168, 110, 0.10) 0%, transparent 70%)",
            "radial-gradient(ellipse 50% 35% at 80% 75%, rgba(170, 130, 80, 0.08) 0%, transparent 65%)",
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(245, 232, 210, 0.18) 0%, transparent 80%)",
          ].join(", "),
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          mixBlendMode: "multiply",
          opacity: 0.55,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-0 rounded-[inherit]"
        aria-hidden
        style={{
          background: [
            "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 50%, rgba(120, 88, 42, 0.07) 100%)",
            "linear-gradient(180deg, rgba(150, 110, 60, 0.04) 0%, transparent 18%, transparent 82%, rgba(130, 95, 48, 0.06) 100%)",
          ].join(", "),
        }}
      />
    </>
  )
}

function CornerDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden>
      <Image src="/decoration/left-top-corner.png" alt="" width={320} height={320} className="absolute top-0 left-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
      <Image src="/decoration/right-top-corner.png" alt="" width={320} height={320} className="absolute top-0 right-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
      <Image src="/decoration/left-down-corner.png" alt="" width={320} height={320} className="absolute bottom-0 left-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
      <Image src="/decoration/right-down-corner.png" alt="" width={320} height={320} className="absolute bottom-0 right-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
    </div>
  )
}

export function Countdown() {
  const ceremonyDate = siteConfig.ceremony.date
  const ceremonyTimeDisplay = siteConfig.ceremony.time
  const [ceremonyMonth = "June", ceremonyDayRaw = "7", ceremonyYear = "2026"] = ceremonyDate.split(" ")
  const ceremonyDayNumber = ceremonyDayRaw.replace(/[^0-9]/g, "") || "7"
  const { brideNickname, groomNickname } = siteConfig.couple
  const timeStr = ceremonyTimeDisplay.split(",")[0].trim()

  const monthMap: { [key: string]: string } = {
    January: "01", February: "02", March: "03", April: "04",
    May: "05", June: "06", July: "07", August: "08",
    September: "09", October: "10", November: "11", December: "12",
  }
  const monthNum = monthMap[ceremonyMonth] || "12"
  const dayNum = ceremonyDayNumber.padStart(2, "0")

  const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
  let hour = 15
  let minutes = 0

  if (timeMatch) {
    hour = parseInt(timeMatch[1])
    minutes = parseInt(timeMatch[2])
    const ampm = timeMatch[3].toUpperCase()
    if (ampm === "PM" && hour !== 12) hour += 12
    if (ampm === "AM" && hour === 12) hour = 0
  }

  const parsedTargetDate = new Date(Date.UTC(
    parseInt(ceremonyYear),
    parseInt(monthNum) - 1,
    parseInt(dayNum),
    hour - 8,
    minutes,
    0,
  ))

  const targetTimestamp = Number.isNaN(parsedTargetDate.getTime())
    ? new Date(Date.UTC(2026, 1, 8, 8, 0, 0)).getTime()
    : parsedTargetDate.getTime()

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 350),
      setTimeout(() => setPhase(3), 580),
      setTimeout(() => setPhase(4), 800),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetTimestamp - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [targetTimestamp])

  const labelStyle = {
    fontFamily: '"AgrandirWideBold", sans-serif',
    fontSize: "clamp(0.50rem, 1.1vw, 0.62rem)",
    letterSpacing: "0.30em",
    textTransform: "uppercase" as const,
    color: COLORS.muted,
  }

  const vis = (min: number) =>
    phase >= min
      ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
      : "opacity-0 translate-y-4 transition-all duration-700 ease-out"

  return (
    <Section
      id="countdown"
      className="relative overflow-hidden bg-transparent pt-4 sm:pt-5 pb-12 sm:pb-16 md:pb-20"
    >
      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-5 md:px-6">
        <div
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[2rem] px-8 sm:px-12 md:px-16 lg:px-20 py-10 sm:py-12 md:py-16"
          style={CARD_STYLE}
        >
          <VintageTextureLayers />
          <CornerDecorations />

          <div className="relative z-10 flex flex-col items-center text-center gap-6 sm:gap-8">
            {/* Monogram */}
            <div className={vis(1)}>
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Image
                  src={siteConfig.couple.monogram}
                  alt={`${groomNickname} & ${brideNickname} Monogram`}
                  width={160}
                  height={160}
                  className="h-14 w-14 sm:h-16 sm:w-16 object-contain object-center mx-auto"
                  style={{
                    filter: "brightness(0) sepia(1) saturate(0.8) hue-rotate(10deg)",
                    opacity: 0.72,
                  }}
                  priority={false}
                />
              </motion.div>
            </div>

            {/* Header */}
            <div className={`w-full ${vis(1)}`}>
              {/* <p style={{ ...labelStyle, marginBottom: "0.5rem", letterSpacing: "0.38em" }}>
                save the date
              </p>
              <div
                className="mx-auto mb-4"
                style={{ width: 60, height: 1, background: "linear-gradient(to right, transparent, rgba(140,94,4,0.45), transparent)" }}
              /> */}

              {/* <p className="parisienne-regular mb-3" style={{
                fontSize: "clamp(1.4rem, 4vw, 2rem)",
                color: COLORS.deep,
                lineHeight: 1.1,
              }}>
                {groomNickname} <span style={{ color: COLORS.accent }}>&amp;</span> {brideNickname}
              </p> */}

              <h2
                className="parisienne-regular leading-tight"
                style={{
                  fontSize: "clamp(2rem, 6.5vw, 3.6rem)",
                  color: COLORS.deep,
                  lineHeight: 1.15,
                }}
              >
                Counting down to our vow renewal
              </h2>

              <p
                className={`${cormorant.className} mt-4 max-w-lg mx-auto`}
                style={{ fontSize: "clamp(0.88rem, 2vw, 1.05rem)", color: COLORS.medium, lineHeight: 1.65 }}
              >
                Every moment brings us closer to the day we renew our promises before God and those we love most.
              </p>

              <div className="flex items-center gap-3 justify-center mt-5 w-full max-w-xs mx-auto">
                <div className="h-px flex-1" style={{ background: "linear-gradient(to left, rgba(140,94,4,0.45), transparent)" }} />
                <span
                  style={{
                    fontFamily: '"AgrandirWideBold", sans-serif',
                    fontSize: "0.50rem",
                    letterSpacing: "0.52em",
                    textTransform: "uppercase",
                    color: COLORS.accent,
                    padding: "3px 10px",
                    border: "1px solid rgba(184,50,50,0.25)",
                    borderRadius: "2px",
                  }}
                >
                  {ceremonyYear}
                </span>
                <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(140,94,4,0.45), transparent)" }} />
              </div>
            </div>

            {/* Countdown grid */}
            <div className={`w-full ${vis(2)}`}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6 w-full max-w-md sm:max-w-lg md:max-w-2xl mx-auto">
                <CountdownUnit value={timeLeft.days} label="Days" />
                <CountdownUnit value={timeLeft.hours} label="Hours" />
                <CountdownUnit value={timeLeft.minutes} label="Minutes" />
                <CountdownUnit value={timeLeft.seconds} label="Seconds" />
              </div>
            </div>

            {/* ── Date Block — matches hero ── */}
            <div className={`flex flex-col items-center gap-1 mt-2 sm:mt-4 ${vis(4)}`}>
              {/* <div
                className="mx-auto mb-6 sm:mb-7"
                style={{
                  width: "100px",
                  height: "1px",
                  background: "linear-gradient(to right, transparent, rgba(140, 94, 4, 0.42), transparent)",
                }}
              /> */}

              <p style={{
                fontFamily: '"AgrandirWideBold", sans-serif',
                fontWeight: 500,
                fontSize: "clamp(0.58rem, 1.4vw, 0.70rem)",
                letterSpacing: "0.30em",
                textTransform: "uppercase",
                color: "rgba(28, 28, 30, 0.55)",
              }}>
                {siteConfig.ceremony.date.split(" ")[0]}
              </p>

              <div className="flex items-center gap-0" style={{ lineHeight: 1 }}>
                <p style={{
                  fontFamily: '"AgrandirWideBold", sans-serif',
                  fontSize: "clamp(0.50rem, 1.2vw, 0.60rem)",
                  letterSpacing: "0.20em",
                  textTransform: "uppercase",
                  color: "rgba(28, 28, 30, 0.48)",
                  paddingRight: "clamp(0.6rem, 2vw, 1rem)",
                }}>
                  {siteConfig.ceremony.day}
                </p>

                <div style={{
                  width: "1px",
                  height: "clamp(2.2rem, 6vw, 3.2rem)",
                  background: "linear-gradient(to bottom, transparent, rgba(28, 28, 30, 0.18), transparent)",
                  flexShrink: 0,
                }} />

                <p style={{
                  fontFamily: '"LeJourSerif", serif',
                  fontSize: "clamp(2.4rem, 8vw, 3.4rem)",
                  letterSpacing: "-0.01em",
                  color: "#B83232",
                  padding: "0 clamp(0.6rem, 2vw, 1rem)",
                  lineHeight: 1,
                }}>
                  {siteConfig.ceremony.date.split(" ")[1]?.replace(",", "")}
                </p>

                <div style={{
                  width: "1px",
                  height: "clamp(2.2rem, 6vw, 3.2rem)",
                  background: "linear-gradient(to bottom, transparent, rgba(28, 28, 30, 0.18), transparent)",
                  flexShrink: 0,
                }} />

                <p style={{
                  fontFamily: '"AgrandirWideBold", sans-serif',
                  fontSize: "clamp(0.50rem, 1.2vw, 0.60rem)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(28, 28, 30, 0.48)",
                  paddingLeft: "clamp(0.6rem, 2vw, 1rem)",
                }}>
                  At {siteConfig.ceremony.time}
                </p>
              </div>

              <p style={{
                fontFamily: '"AgrandirWideBold", sans-serif',
                fontSize: "clamp(0.58rem, 1.4vw, 0.70rem)",
                letterSpacing: "0.30em",
                textTransform: "uppercase",
                color: "rgba(28, 28, 30, 0.42)",
              }}>
                {siteConfig.ceremony.date.split(" ")[2]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
