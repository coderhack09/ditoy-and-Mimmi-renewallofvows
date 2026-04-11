"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { siteConfig } from "@/content/site"

interface HeroProps {
  onOpen: () => void
  visible: boolean
}

const BACKGROUND_VIDEO_SRC =
  "/background_music/newVideoBackground.mp4"

export function Hero({ onOpen, visible }: HeroProps) {
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setContentVisible(true), 300)
      return () => clearTimeout(t)
    }
    setContentVisible(false)
  }, [visible])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-opacity duration-500 ${
        visible ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
      aria-hidden={!visible}
    >
      {/* Background video — loop, muted for autoplay */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden
        >
          <source src={encodeURI(BACKGROUND_VIDEO_SRC)} type="video/mp4" />
        </video>

        {/* Paper-cream base wash — same palette as LoadingScreen */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "rgba(253, 251, 248, 0.72)" }}
        />

        {/* Center lift — bright focal point, matches LoadingScreen layer 2 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              "radial-gradient(ellipse 70% 60% at 50% 44%, rgba(255, 255, 255, 0.65) 0%, transparent 70%)",
              "linear-gradient(90deg, rgba(180, 155, 115, 0.04) 0%, transparent 20%, transparent 80%, rgba(180, 155, 115, 0.03) 100%)",
            ].join(", "),
          }}
        />

        {/* Soft warm vignette — matches LoadingScreen layer 4 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 42%, rgba(140, 110, 72, 0.13) 100%)",
              "linear-gradient(180deg, rgba(172, 138, 92, 0.06) 0%, transparent 16%, transparent 84%, rgba(150, 118, 76, 0.09) 100%)",
            ].join(", "),
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center p-6 w-full max-w-md mx-auto h-full">
        {/* Monogram — warm ink filter, matches LoadingScreen */}
        <div
          className={`mb-auto mt-8 transition-all duration-1000 ease-out ${
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          }`}
        >
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center">
            <Image
              src={siteConfig.couple.monogram}
              alt="Monogram"
              width={192}
              height={192}
              className="h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-44 object-contain"
              style={{
                filter: "brightness(0) sepia(1) saturate(0.8) hue-rotate(10deg)",
                opacity: 0.72,
              }}
              priority
            />
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex flex-col items-center justify-end w-full gap-5 sm:gap-6 pb-14 sm:pb-16 md:pb-20">
          <h2
            className={`text-6xl md:text-8xl transform -rotate-6 transition-all duration-1000 ease-out delay-200 ${
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              fontFamily: '"Great Vibes", cursive',
              fontWeight: 400,
              color: "rgba(28, 28, 30, 0.78)",
            }}
          >
            You are
          </h2>

          <h1
            className={`text-5xl md:text-7xl font-bold tracking-wider uppercase transition-all duration-1000 ease-out delay-300 ${
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              fontFamily: '"Cinzel", serif',
              fontWeight: 700,
              color: "#1C1C1E",
              letterSpacing: "0.05em",
            }}
          >
            Invited!
          </h1>

          <button
            type="button"
            onClick={onOpen}
            className={`px-10 py-4 text-sm tracking-[0.2em] uppercase transition-all duration-500 delay-500 active:scale-[0.98] ${
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              fontFamily: '"AgrandirWideBold", sans-serif',
              background: "#B83232",
              color: "#FDFBF8",
              border: "1px solid rgba(184, 50, 50, 0.40)",
              letterSpacing: "0.18em",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#982828")}
            onMouseLeave={e => (e.currentTarget.style.background = "#B83232")}
          >
            Open Invitation
          </button>
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}