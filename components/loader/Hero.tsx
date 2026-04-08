"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface HeroProps {
  onOpen: () => void
  visible: boolean
}

const BACKGROUND_VIDEO_SRC =
  "/background_music/Emerald Green Falling Bokeh 4k HD  Background Loop  Motion  Effects - CheizMe (720p, h264).mp4"

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
        {/* Theme overlay for readability (matches motif colors) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              // Subtle center vignette
              "radial-gradient(ellipse at center, transparent 0%, color-mix(in srgb, var(--color-motif-deep) 45%, transparent) 100%)",
              // Bottom-heavy wash to anchor CTA
              "linear-gradient(to bottom, color-mix(in srgb, var(--color-motif-deep) 25%, transparent), color-mix(in srgb, var(--color-motif-deep) 70%, transparent))",
            ].join(", "),
          }}
        />
      </div>

      {/* Content — aligned with sections/hero typography */}
      <div className="relative z-10 flex flex-col items-center text-center p-6 w-full max-w-md mx-auto h-full">
        {/* Monogram — same asset and style as sections/hero */}
        <div
          className={`mb-auto mt-8 transition-all duration-1000 ease-out ${
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          }`}
        >
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center">
            <Image
              src="/monogram/newMonogram.png"
              alt="Monogram"
              width={192}
              height={192}
              className="h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-44 object-contain brightness-0 invert drop-shadow-lg"
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
              color: "#ffffff",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
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
              color: "#ffffff",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
              letterSpacing: "0.05em",
            }}
          >
            Invited!
          </h1>

          <button
            type="button"
            onClick={onOpen}
            className={`px-10 py-4 text-sm scope-one-regular tracking-[0.2em] uppercase rounded-sm border border-zinc-500 bg-motif-accent text-zinc-100 transition-all duration-500 delay-500 hover:bg-zinc-700 hover:border-zinc-400 active:scale-[0.98] ${
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Open Invitation
          </button>
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}