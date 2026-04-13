"use client"

import { useEffect, useState } from "react"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
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
          className={`w-full max-w-md sm:max-w-lg text-center transition-all duration-700 ease-out ${
            phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{
            background: [
              "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255, 255, 255, 0.70) 0%, transparent 70%)",
              "rgba(253, 251, 248, 0.92)",
            ].join(", "),
            border: "1px solid rgba(140, 110, 72, 0.14)",
            borderRadius: "20px",
            padding: "clamp(2.5rem, 6vw, 4rem) clamp(1.75rem, 6vw, 3.5rem)",
            boxShadow: [
              "0 4px 32px rgba(140, 110, 72, 0.10)",
              "0 1px 0 rgba(255, 255, 255, 0.80) inset",
            ].join(", "),
            backdropFilter: "blur(2px)",
          }}
        >

          {/* ── Monogram — warm ink, matches LoadingScreen ── */}
          <div
            className={`flex justify-center mb-7 ${
              phase >= 1
                ? "opacity-100 scale-100 transition-all duration-700 ease-out"
                : "opacity-0 scale-95 transition-all duration-700 ease-out"
            }`}
          >
            <CloudinaryImage
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

          {/* ── Together with their families ── */}
          <p
            className={vis(2)}
            style={{
              fontFamily: '"BrittanySignature", cursive',
              fontSize: "clamp(1.5rem, 4vw, 2.1rem)",
              color: "rgba(28, 28, 30, 0.72)",
              lineHeight: 1,
            }}
          >
            Together with their families
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

          {/* ── to celebrate the marriage of ── */}
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
            to celebrate the marriage of
          </p>

          {/* ── Couple names — LeJourScript, matches LoadingScreen ── */}
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
              style={{
                fontFamily: '"LeJourScript", cursive',
                fontSize: "clamp(3.6rem, 12vw, 6rem)",
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
              style={{
                fontFamily: '"LeJourScript", cursive',
                fontSize: "clamp(1.1rem, 3vw, 1.8rem)",
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
              style={{
                fontFamily: '"LeJourScript", cursive',
                fontSize: "clamp(3.6rem, 12vw, 6rem)",
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
                Ceremony
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

        </div>{/* end card */}
      </div>
    </section>
  )
}
