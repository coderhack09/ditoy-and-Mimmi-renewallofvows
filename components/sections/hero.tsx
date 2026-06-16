"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { siteConfig } from "@/content/site"

// ── Component ─────────────────────────────────────────────────────────────────

export function Hero() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 380),
      setTimeout(() => setPhase(3), 640),
      setTimeout(() => setPhase(4), 860),
      setTimeout(() => setPhase(5), 1060),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const vis = (minPhase: number) =>
    phase >= minPhase
      ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
      : "opacity-0 translate-y-5 transition-all duration-700 ease-out"

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Content container ── */}
      <div className="relative z-10 w-full flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
        <div
          className={`relative overflow-hidden w-full max-w-md sm:max-w-lg text-center transition-all duration-700 ease-out ${
            phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{
            background: [
              "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255, 252, 244, 0.72) 0%, transparent 70%)",
              "rgba(250, 244, 232, 0.94)",
            ].join(", "),
            border: "1px solid rgba(160, 122, 68, 0.22)",
            borderRadius: "20px",
            padding: "clamp(2.5rem, 6vw, 4rem) clamp(1.75rem, 6vw, 3.5rem)",
            boxShadow: [
              "0 4px 40px rgba(120, 85, 35, 0.14)",
              "0 1px 0 rgba(255, 248, 230, 0.90) inset",
              "inset 0 0 60px rgba(200, 160, 90, 0.05)",
            ].join(", "),
            backdropFilter: "blur(2px)",
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
            className="absolute inset-0 pointer-events-none z-0 rounded-[20px]"
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
            <Image
              src="/decoration/left-top-corner.png"
              alt=""
              width={320}
              height={320}
              className="absolute top-0 left-0 w-auto h-auto max-w-[72px] sm:max-w-[96px] md:max-w-[112px]"
              priority
            />
            <Image
              src="/decoration/right-top-corner.png"
              alt=""
              width={320}
              height={320}
              className="absolute top-0 right-0 w-auto h-auto max-w-[72px] sm:max-w-[96px] md:max-w-[112px]"
              priority
            />
            <Image
              src="/decoration/left-down-corner.png"
              alt=""
              width={320}
              height={320}
              className="absolute bottom-0 left-0 w-auto h-auto max-w-[72px] sm:max-w-[96px] md:max-w-[112px]"
              priority
            />
            <Image
              src="/decoration/right-down-corner.png"
              alt=""
              width={320}
              height={320}
              className="absolute bottom-0 right-0 w-auto h-auto max-w-[72px] sm:max-w-[96px] md:max-w-[112px]"
              priority
            />
          </div>

          <div className="relative z-10">
          {/* ── Monogram — warm ink, matches LoadingScreen ── */}
          <div
            className={`flex justify-center mb-7 ${
              phase >= 1
                ? "opacity-100 scale-100 transition-all duration-700 ease-out"
                : "opacity-0 scale-95 transition-all duration-700 ease-out"
            }`}
          >
            <Image
              src={siteConfig.couple.monogram}
              alt={`${siteConfig.couple.brideNickname} & ${siteConfig.couple.groomNickname} monogram`}
              width={160}
              height={160}
              className="h-16 w-16 sm:h-20 sm:w-20 object-contain object-center"
              style={{
                filter: "brightness(0) sepia(1) saturate(0.8) hue-rotate(10deg)",
                opacity: 0.72,
              }}
              priority
            />
          </div>

          {/* ── Vow renewal invitation line ── */}
          <p
            className={vis(2)}
            style={{
              fontFamily: '"Parisienne", cursive',
              fontSize: "clamp(1.25rem, 3.3vw, 2rem)",
              color: "rgba(28, 28, 30, 0.72)",
              lineHeight: 1.35,
            }}
          >
            Love grows, and so do we. Please join us as we renew our vows and celebrate the next chapter of our journey.
          </p>

          {/* ── Hairline rule + year ── */}
          <div className={`flex items-center gap-3 justify-center mt-5 mb-5 ${vis(2)}`}>
            <div
              className="h-px flex-1"
              style={{ background: "linear-gradient(to left, rgba(140, 94, 4, 0.35), transparent)" }}
            />
            <span
              style={{
                fontFamily: '"AgrandirWideBold", sans-serif',
                fontSize: "0.52rem",
                letterSpacing: "0.55em",
                textTransform: "uppercase",
                color: "#B83232",
              }}
            >
              {new Date(siteConfig.wedding.date).getFullYear()}
            </span>
            <div
              className="h-px flex-1"
              style={{ background: "linear-gradient(to right, rgba(140, 94, 4, 0.35), transparent)" }}
            />
          </div>

          {/* ── Renewal of vows ── */}
          <p
            className={vis(2)}
            style={{
              fontFamily: '"AgrandirWideBold", sans-serif',
              fontSize: "clamp(0.52rem, 1.2vw, 0.62rem)",
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: "rgba(28, 28, 30, 0.42)",
            }}
          >
            renewal of vows between
          </p>

          {/* ── Couple names — Parisienne, matches LoadingScreen ── */}
          <h1
            className={`mt-14 ${vis(3)}`}
            style={{
              transitionDelay: "40ms",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Bride — nudged left */}
            <span
              className="parisienne-regular"
              style={{
                fontSize: "clamp(4rem, 13vw, 6.5rem)",
                color: "#1C1C1E",
                lineHeight: 1.10,
                letterSpacing: "0.02em",
                display: "block",
                alignSelf: "flex-start",
                marginLeft: "clamp(0.5rem, 4vw, 2.5rem)",
              }}
            >
              {siteConfig.couple.groomNickname.trim()}
            </span>

            {/* "and" — red accent, same as LoadingScreen */}
            <span
              className="parisienne-regular"
              style={{
                fontSize: "clamp(1.25rem, 3.3vw, 2rem)",
                color: "#B83232",
                lineHeight: 1,
                letterSpacing: "0.02em",
                display: "block",
                alignSelf: "center",
                marginTop: "clamp(0.4rem, 1.5vw, 0.8rem)",
                marginBottom: "clamp(0.4rem, 1.5vw, 0.8rem)",
              }}
            >
              and
            </span>

            {/* Groom — nudged right */}
            <span
              className="parisienne-regular"
              style={{
                fontSize: "clamp(4rem, 13vw, 6.5rem)",
                color: "#1C1C1E",
                lineHeight: 1.10,
                letterSpacing: "0.02em",
                display: "block",
                alignSelf: "flex-end",
                marginRight: "clamp(0.5rem, 4vw, 2.5rem)",
              }}
            >
              {siteConfig.couple.brideNickname.trim()}
            </span>
          </h1>

          {/* ── Hairline divider ── */}
          <div
            className={`mx-auto mt-9 mb-7 ${vis(4)}`}
            style={{
              width: "100px",
              height: "1px",
              background: "linear-gradient(to right, transparent, rgba(140, 94, 4, 0.42), transparent)",
            }}
          />

          {/* ── Date Block ── */}
          <div className={`flex flex-col items-center gap-1 ${vis(4)}`}>

            {/* Month */}
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

            {/* Row: day · big number · time */}
            <div className="flex items-center gap-0" style={{ lineHeight: 1 }}>

              {/* Day of week */}
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

              {/* Vertical rule */}
              <div style={{
                width: "1px",
                height: "clamp(2.2rem, 6vw, 3.2rem)",
                background: "linear-gradient(to bottom, transparent, rgba(28, 28, 30, 0.18), transparent)",
                flexShrink: 0,
              }} />

              {/* Day number — red accent */}
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

              {/* Vertical rule */}
              <div style={{
                width: "1px",
                height: "clamp(2.2rem, 6vw, 3.2rem)",
                background: "linear-gradient(to bottom, transparent, rgba(28, 28, 30, 0.18), transparent)",
                flexShrink: 0,
              }} />

              {/* Time */}
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

            {/* Year */}
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

          {/* ── Ceremony & Reception ── */}
          <div className={`mt-8 flex flex-col items-center gap-6 ${vis(5)}`}>
            <div className="space-y-2">
              <p
                style={{
                  fontFamily: '"AgrandirWideBold", sans-serif',
                  fontSize: "clamp(0.50rem, 1.2vw, 0.60rem)",
                  letterSpacing: "0.40em",
                  textTransform: "uppercase",
                  color: "#B83232",
                }}
              >
                Renewal of Vows
              </p>
              <p
                style={{
                  fontFamily: '"AgrandirWideBold", sans-serif',
                  fontSize: "clamp(0.54rem, 1.3vw, 0.64rem)",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(28, 28, 30, 0.52)",
                  lineHeight: 1.6,
                }}
              >
                {siteConfig.ceremony.location}
              </p>
            </div>

            {/* thin separator */}
            <div
              style={{
                width: "40px",
                height: "1px",
                background: "rgba(140, 94, 4, 0.28)",
              }}
            />
          </div>

          {/* ── RSVP button ── */}
          <div className={`mt-10 flex justify-center ${vis(5)}`}>
            <a
              href="#guest-list"
              className="inline-flex items-center justify-center px-12 py-3.5 transition-all duration-300 hover:brightness-90 hover:scale-105 active:scale-95"
              style={{
                fontFamily: '"AgrandirWideBold", sans-serif',
                fontSize: "0.58rem",
                letterSpacing: "0.48em",
                textTransform: "uppercase",
                color: "#FDFBF8",
                background: "#B83232",
                border: "1px solid rgba(184, 50, 50, 0.40)",
                borderRadius: "2px",
              }}
            >
              RSVP
            </a>
          </div>

          </div>
        </div>{/* end card */}
      </div>
    </section>
  )
}
