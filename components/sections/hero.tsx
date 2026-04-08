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
            background: "linear-gradient(155deg, #092E2F 0%, #0C3B3C 40%, #0F4546 65%, #0A3435 100%)",
            border: "1px solid rgba(190, 132, 0, 0.18)",
            borderRadius: "24px",
            padding: "clamp(2.5rem, 6vw, 4rem) clamp(1.75rem, 6vw, 3.5rem)",
            boxShadow: "0 12px 64px rgba(5, 20, 20, 0.35), inset 0 1px 0 rgba(245, 239, 230, 0.04)",
          }}
        >

          {/* ── Monogram ── */}
          <div
            className={`flex justify-center mb-7 ${
              phase >= 1
                ? "opacity-100 scale-100 transition-all duration-700 ease-out"
                : "opacity-0 scale-95 transition-all duration-700 ease-out"
            }`}
          >
            <CloudinaryImage
              src="/monogram/newMonogram.png"
              alt={`${siteConfig.couple.brideNickname} & ${siteConfig.couple.groomNickname} monogram`}
              width={160}
              height={160}
              className="h-20 w-20 sm:h-24 sm:w-24 object-contain object-center brightness-0 invert"
              style={{ opacity: 0.88 }}
              priority
            />
          </div>

          {/* ── Together with their families ── */}
          <p
            className={vis(2)}
            style={{
              fontFamily: '"BrittanySignature", cursive',
              fontSize: "clamp(1.5rem, 4vw, 2.1rem)",
              color: "rgba(245, 239, 230, 0.72)",
              lineHeight: 1,
            }}
          >
            Together with their families
          </p>

          {/* ── Gold rule + year ── */}
          <div
            className={`flex items-center gap-3 justify-center mt-5 mb-5 ${vis(2)}`}
          >
            <div
              className="h-px flex-1"
              style={{ background: "linear-gradient(to left, rgba(190, 132, 0, 0.50), transparent)" }}
            />
            <span
              style={{
                fontFamily: '"AgrandirWideBold", sans-serif',
                fontSize: "0.44rem",
                letterSpacing: "0.55em",
                textTransform: "uppercase",
                color: "rgba(190, 132, 0, 0.80)",
              }}
            >
              {new Date(siteConfig.wedding.date).getFullYear()}
            </span>
            <div
              className="h-px flex-1"
              style={{ background: "linear-gradient(to right, rgba(190, 132, 0, 0.50), transparent)" }}
            />
          </div>

          {/* ── to celebrate the marriage of ── */}
          <p
            className={vis(2)}
            style={{
              fontFamily: '"AgrandirWideBold", sans-serif',
              fontSize: "clamp(0.44rem, 1.1vw, 0.54rem)",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "rgba(245, 239, 230, 0.45)",
            }}
          >
            to celebrate the marriage of
          </p>

          {/* ── Couple names ── */}
          <h1
            className={`mt-8 ${vis(3)}`}
            style={{ transitionDelay: "40ms" }}
          >
            <span
              className="block"
              style={{
                fontFamily: '"Westonia", cursive',
                fontSize: "clamp(3.6rem, 12vw, 6rem)",
                color: "#F5EFE6",
                lineHeight: 0.88,
                textShadow: "0 4px 40px rgba(190, 132, 0, 0.25)",
              }}
            >
              {siteConfig.couple.brideNickname.trim()}
            </span>

            <span
              className="block"
              style={{
                fontFamily: '"Westonia", cursive',
                fontSize: "clamp(2rem, 6vw, 3.2rem)",
                color: "rgba(183, 110, 121, 0.90)",
                lineHeight: 1.1,
              }}
            >
              +
            </span>

            <span
              className="block"
              style={{
                fontFamily: '"Westonia", cursive',
                fontSize: "clamp(3.6rem, 12vw, 6rem)",
                color: "#F5EFE6",
                lineHeight: 0.88,
                textShadow: "0 4px 40px rgba(190, 132, 0, 0.25)",
              }}
            >
              {siteConfig.couple.groomNickname.trim()}
            </span>
          </h1>

          {/* ── Gold hairline divider ── */}
          <div
            className={`mx-auto mt-9 mb-7 ${vis(4)}`}
            style={{
              width: "100px",
              height: "1px",
              background: "linear-gradient(to right, transparent, rgba(190, 132, 0, 0.55), transparent)",
            }}
          />

          {/* ── Date Block ── */}
          <div className={`flex flex-col items-center gap-1 ${vis(4)}`}>

            {/* Month */}
            <p style={{
              fontFamily: '"Fahkwang", sans-serif',
              fontWeight: 500,
              fontSize: "clamp(0.55rem, 1.4vw, 0.68rem)",
              letterSpacing: "0.30em",
              textTransform: "uppercase",
              color: "rgba(245, 239, 230, 0.75)",
            }}>
              {siteConfig.ceremony.date.split(" ")[0]}
            </p>

            {/* Row: day · big number · time */}
            <div className="flex items-center gap-0" style={{ lineHeight: 1 }}>

              {/* Day of week */}
              <p style={{
                fontFamily: '"Fahkwang", sans-serif',
                fontWeight: 400,
                fontSize: "clamp(0.44rem, 1.1vw, 0.54rem)",
                letterSpacing: "0.20em",
                textTransform: "uppercase",
                color: "rgba(245, 239, 230, 0.60)",
                paddingRight: "clamp(0.6rem, 2vw, 1rem)",
              }}>
                {siteConfig.ceremony.day}
              </p>

              {/* Gold vertical rule */}
              <div style={{
                width: "1px",
                height: "clamp(2.2rem, 6vw, 3.2rem)",
                background: "linear-gradient(to bottom, transparent, rgba(190, 132, 0, 0.70), transparent)",
                flexShrink: 0,
              }} />

              {/* Day number */}
              <p style={{
                fontFamily: '"Fahkwang", sans-serif',
                fontWeight: 700,
                fontSize: "clamp(2.4rem, 8vw, 3.4rem)",
                letterSpacing: "-0.01em",
                color: "#BE8400",
                padding: "0 clamp(0.6rem, 2vw, 1rem)",
                lineHeight: 1,
              }}>
                {siteConfig.ceremony.date.split(" ")[1]?.replace(",", "")}
              </p>

              {/* Gold vertical rule */}
              <div style={{
                width: "1px",
                height: "clamp(2.2rem, 6vw, 3.2rem)",
                background: "linear-gradient(to bottom, transparent, rgba(190, 132, 0, 0.70), transparent)",
                flexShrink: 0,
              }} />

              {/* Time */}
              <p style={{
                fontFamily: '"Fahkwang", sans-serif',
                fontWeight: 400,
                fontSize: "clamp(0.44rem, 1.1vw, 0.54rem)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(245, 239, 230, 0.60)",
                paddingLeft: "clamp(0.6rem, 2vw, 1rem)",
              }}>
                At {siteConfig.ceremony.time}
              </p>
            </div>

            {/* Year */}
            <p style={{
              fontFamily: '"Fahkwang", sans-serif',
              fontWeight: 400,
              fontSize: "clamp(0.55rem, 1.4vw, 0.68rem)",
              letterSpacing: "0.30em",
              textTransform: "uppercase",
              color: "rgba(245, 239, 230, 0.55)",
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
                  fontSize: "clamp(0.42rem, 1.1vw, 0.50rem)",
                  letterSpacing: "0.44em",
                  textTransform: "uppercase",
                  color: "rgba(190, 132, 0, 0.82)",
                }}
              >
                Ceremony and Reception
              </p>
              <p
                style={{
                  fontFamily: '"AgrandirWideBold", sans-serif',
                  fontSize: "clamp(0.50rem, 1.3vw, 0.60rem)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(245, 239, 230, 0.58)",
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
                background: "rgba(190, 132, 0, 0.30)",
              }}
            />

            {/* <div className="space-y-2">
              <p
                style={{
                  fontFamily: '"AgrandirWideBold", sans-serif',
                  fontSize: "clamp(0.42rem, 1.1vw, 0.50rem)",
                  letterSpacing: "0.44em",
                  textTransform: "uppercase",
                  color: "rgba(190, 132, 0, 0.82)",
                }}
              >
                Reception to follow
              </p>
              <p
                style={{
                  fontFamily: '"AgrandirWideBold", sans-serif',
                  fontSize: "clamp(0.50rem, 1.3vw, 0.60rem)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(245, 239, 230, 0.58)",
                  lineHeight: 1.6,
                }}
              >
                {siteConfig.reception.location}
              </p>
            </div> */}
          </div>

          {/* ── RSVP button ── */}
          <div className={`mt-10 flex justify-center ${vis(5)}`}>
            <a
              href="#guest-list"
              className="inline-flex items-center justify-center px-12 py-3.5 transition-all duration-300 hover:brightness-110 hover:scale-105 active:scale-95"
              style={{
                fontFamily: '"AgrandirWideBold", sans-serif',
                fontSize: "0.52rem",
                letterSpacing: "0.52em",
                textTransform: "uppercase",
                color: "#0C3B3C",
                background: "rgba(190, 132, 0, 0.92)",
                border: "1px solid rgba(190, 132, 0, 0.40)",
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
