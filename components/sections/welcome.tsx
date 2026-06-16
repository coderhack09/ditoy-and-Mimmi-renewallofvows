"use client"

import { useEffect, useState } from "react"
import { Section } from "@/components/section"
import { siteConfig } from "@/content/site"
import { Cormorant_Garamond } from "next/font/google"
import Image from "next/image"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

export function Welcome() {
  const brideName = siteConfig.couple.brideNickname || siteConfig.couple.bride
  const groomName = siteConfig.couple.groomNickname || siteConfig.couple.groom
  const year = new Date(siteConfig.wedding.date).getFullYear()

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

  const vis = (min: number) =>
    phase >= min
      ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
      : "opacity-0 translate-y-4 transition-all duration-700 ease-out"

  return (
    <Section
      id="welcome"
      className="relative overflow-hidden bg-transparent -mt-2 sm:-mt-3 pt-4 sm:pt-5 pb-12 sm:pb-16 md:pb-20"
    >
      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-5 md:px-6">
        <div
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[2rem] px-8 sm:px-12 md:px-16 lg:px-20 py-10 sm:py-12 md:py-16"
          style={{
            background: [
              "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255, 252, 244, 0.72) 0%, transparent 70%)",
              "rgba(250, 244, 232, 0.94)",
            ].join(", "),
            border: "1px solid rgba(160, 122, 68, 0.22)",
            boxShadow: [
              "0 4px 40px rgba(120, 85, 35, 0.14)",
              "0 1px 0 rgba(255, 248, 230, 0.90) inset",
              "inset 0 0 60px rgba(200, 160, 90, 0.05)",
            ].join(", "),
          }}
        >
          {/* ── Vintage texture — Layer 1: warm parchment tone patches ── */}
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
          {/* ── Vintage texture — Layer 2: CSS grain / noise ── */}
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
          {/* ── Vintage texture — Layer 3: inner vignette ── */}
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
          {/* ── Corner decorations ── */}
          <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden>
            <Image src="/decoration/left-top-corner.png" alt="" width={320} height={320} className="absolute top-0 left-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
            <Image src="/decoration/right-top-corner.png" alt="" width={320} height={320} className="absolute top-0 right-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
            <Image src="/decoration/left-down-corner.png" alt="" width={320} height={320} className="absolute bottom-0 left-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
            <Image src="/decoration/right-down-corner.png" alt="" width={320} height={320} className="absolute bottom-0 right-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
          </div>

          {/* ══ Content ══ */}
          <div className="relative z-10 flex flex-col items-center text-center gap-6 sm:gap-7">

            {/* ── Monogram ── */}
            {/* <div className={vis(1)}>
              <Image
                src={siteConfig.couple.monogram}
                alt={`${groomName} & ${brideName}`}
                width={120}
                height={120}
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
                style={{ filter: "brightness(0) sepia(1) saturate(0.8) hue-rotate(10deg)", opacity: 0.68 }}
                priority={false}
              />
            </div> */}

            {/* ── Eyebrow ── */}
            {/* <div className={`flex flex-col items-center gap-2 ${vis(1)}`}>
              <p style={{
                fontFamily: '"AgrandirWideBold", sans-serif',
                fontSize: "clamp(0.50rem, 1.1vw, 0.60rem)",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "rgba(28, 28, 30, 0.40)",
              }}>
                a celebration of love renewed
              </p>
            
              <div style={{ width: 60, height: 1, background: "linear-gradient(to right, transparent, rgba(140,94,4,0.45), transparent)" }} />
            </div> */}

            {/* ── Couple names badge ── */}
            {/* <div className={vis(2)}>
              <p className="parisienne-regular" style={{
                fontSize: "clamp(1.5rem, 4.5vw, 2.4rem)",
                color: "#1C1C1E",
                lineHeight: 1.1,
              }}>
                {groomName} <span style={{ color: "#B83232" }}>&amp;</span> {brideName}
              </p>
            </div> */}

            {/* ── Main heading ── */}
            <div className={vis(2)}>
              <h2 className="parisienne-regular" style={{
                fontSize: "clamp(1.5rem, 4.5vw, 2.4rem)",
                color: "#1C1C1E",
                lineHeight: 1.15,
              }}>
                Welcome to our Page
              </h2>
            </div>

            {/* ── Gold rule + year badge ── */}
            {/* <div className={`flex items-center gap-3 w-full max-w-sm mx-auto ${vis(2)}`}>
              <div className="h-px flex-1" style={{ background: "linear-gradient(to left, rgba(140,94,4,0.45), transparent)" }} />
              <span
                style={{
                  fontFamily: '"AgrandirWideBold", sans-serif',
                  fontSize: "0.50rem",
                  letterSpacing: "0.52em",
                  textTransform: "uppercase",
                  color: "#B83232",
                  padding: "3px 10px",
                  border: "1px solid rgba(184,50,50,0.25)",
                  borderRadius: "2px",
                }}
              >
                {year}
              </span>
              <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(140,94,4,0.45), transparent)" }} />
            </div> */}

            {/* ── Verse blockquote ── */}
            <div className={`w-full max-w-md mx-auto ${vis(3)}`}>
              <div
                className="px-5 py-4 rounded-lg"
                style={{
                  background: "rgba(140, 94, 4, 0.04)",
                  borderLeft: "2px solid rgba(184, 50, 50, 0.30)",
                }}
              >
                <p
                  className={`${cormorant.className} italic`}
                  style={{ fontSize: "clamp(0.88rem, 2.1vw, 1.08rem)", color: "rgba(28,28,30,0.72)", lineHeight: 1.65 }}
                >
                  &ldquo;And over all these virtues put on love, which binds them all together in perfect unity.&rdquo;
                </p>
                <p
                  className="mt-2"
                  style={{
                    fontFamily: '"AgrandirWideBold", sans-serif',
                    fontSize: "clamp(0.48rem, 1.0vw, 0.56rem)",
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    color: "#B83232",
                  }}
                >
                  Colossians 3:14
                </p>
              </div>
            </div>

            {/* ── Ornamental divider ── */}
            <div className={`flex items-center justify-center gap-2 ${vis(3)}`} aria-hidden>
              <span style={{ display: "block", width: 32, height: 1, background: "rgba(140,94,4,0.32)" }} />
              <span style={{ display: "block", width: 5, height: 5, borderRadius: "50%", background: "rgba(184,50,50,0.45)" }} />
              <span style={{ display: "block", width: 8, height: 8, borderRadius: "50%", background: "rgba(184,50,50,0.22)", outline: "1px solid rgba(184,50,50,0.30)" }} />
              <span style={{ display: "block", width: 5, height: 5, borderRadius: "50%", background: "rgba(184,50,50,0.45)" }} />
              <span style={{ display: "block", width: 32, height: 1, background: "rgba(140,94,4,0.32)" }} />
            </div>

            {/* ── Body ── */}
            <div className={`w-full ${vis(4)}`}>
              <div
                className={`${cormorant.className} leading-7 space-y-4`}
                style={{ fontSize: "clamp(0.90rem, 2.1vw, 1.08rem)", color: "rgba(28,28,30,0.68)" }}
              >
                <p>
                  Years have passed, and our love has only grown deeper. We are grateful to God for every season of our journey — the joys, the challenges, and all the quiet moments in between that have shaped us into who we are today.
                </p>
                <p>
                  We have chosen to come before Him once more, surrounded by the people closest to our hearts, to renew the promises we made to each other. Your presence on this day means everything to us — thank you for being part of our story.
                </p>
              </div>
            </div>

            {/* ── Bottom rule ── */}
            <div className={vis(4)} style={{ width: 80, height: 1, background: "linear-gradient(to right, transparent, rgba(140,94,4,0.38), transparent)" }} />

          </div>
        </div>
      </div>
    </Section>
  )
}
