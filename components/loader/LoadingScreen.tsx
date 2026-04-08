"use client"

import React, { useEffect, useState, useRef } from "react"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import { siteConfig } from "@/content/site"

interface LoadingScreenProps {
  onComplete: () => void
}

/** Splits a date string like "May 8, 2026" into ["05", "08", "26"] */
function getDateSegments(dateStr: string): string[] {
  const d = new Date(dateStr)
  return [
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
    String(d.getFullYear()).slice(-2),
  ]
}

/** Returns calendar days remaining until the wedding date (0 if already past) */
function getDaysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.max(0, Math.round((target.getTime() - today.getTime()) / 86_400_000))
}

const GHOST_NUMBERS  = getDateSegments(siteConfig.wedding.date)
const DAYS_REMAINING = getDaysUntil(siteConfig.wedding.date)

// ── Canvas particle system ──────────────────────────────────────────────────

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  twinklePhase: number
  twinkleSpeed: number
  colorIdx: number
}

/** Motif palette particles — gold, cream, rose, silver (screen blend on emerald bg) */
const PARTICLE_COLORS = [
  "190, 132, 0",    // gold   #BE8400
  "245, 239, 230",  // cream  #F5EFE6
  "183, 110, 121",  // rose   #B76E79
  "214, 214, 214",  // silver #D6D6D6
]

function createParticles(width: number, height: number): Particle[] {
  const count = Math.min(45, Math.max(20, Math.floor((width * height) / 15000)))
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.25,
    vy: -(Math.random() * 0.18 + 0.06),   // slow upward drift
    radius: Math.random() * 1.8 + 0.4,
    opacity: Math.random() * 0.4 + 0.15,
    twinklePhase: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.012 + 0.004,
    colorIdx: Math.floor(Math.random() * PARTICLE_COLORS.length),
  }))
}

// ── Component ───────────────────────────────────────────────────────────────

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut]           = useState(false)
  const [progress, setProgress]         = useState(0)
  // phase gates: 0=hidden · 1=monogram · 2=names · 3=tagline · 4=date · 5=progress
  const [phase, setPhase]               = useState(0)

  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const animFrameRef  = useRef<number>(0)
  const particlesRef  = useRef<Particle[]>([])

  const TOTAL_LOAD_MS = 12000
  const FADE_MS       = 700

  // ── Canvas particle animation ────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      particlesRef.current = createParticles(canvas.width, canvas.height)
    }
    resize()
    window.addEventListener("resize", resize)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let running = true

    const draw = () => {
      if (!running) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p) => {
        // Gentle twinkle
        p.twinklePhase += p.twinkleSpeed
        const twinkle   = (Math.sin(p.twinklePhase) + 1) * 0.5
        const alpha     = p.opacity * (0.3 + twinkle * 0.7)
        const color     = PARTICLE_COLORS[p.colorIdx]
        const blurR     = p.radius * 3.5

        // Soft glow circle via radial gradient
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, blurR)
        g.addColorStop(0,   `rgba(${color}, ${alpha})`)
        g.addColorStop(0.4, `rgba(${color}, ${alpha * 0.45})`)
        g.addColorStop(1,   `rgba(${color}, 0)`)

        ctx.beginPath()
        ctx.arc(p.x, p.y, blurR, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()

        // Drift
        p.x += p.vx
        p.y += p.vy

        // Wrap
        const { width, height } = canvas
        if (p.y < -20)          { p.y = height + 10; p.x = Math.random() * width }
        if (p.x < -20)            p.x = width + 20
        if (p.x > width + 20)     p.x = -20
      })

      animFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      running = false
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [])

  // ── Staggered content reveal ─────────────────────────────────────────────
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 150),
      setTimeout(() => setPhase(2), 460),
      setTimeout(() => setPhase(3), 760),
      setTimeout(() => setPhase(4), 990),
      setTimeout(() => setPhase(5), 1220),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  // ── Progress counter ─────────────────────────────────────────────────────
  useEffect(() => {
    let rafId = 0
    const start        = performance.now()
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const tick = (now: number) => {
      const t    = Math.min(1, (now - start) / TOTAL_LOAD_MS)
      const next = Math.round(easeOutCubic(t) * 100)
      setProgress((prev) => (next > prev ? next : prev))
      if (t < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const fadeTimer = setTimeout(() => setFadeOut(true), TOTAL_LOAD_MS - FADE_MS)
    const doneTimer = setTimeout(() => { setProgress(100); onComplete() }, TOTAL_LOAD_MS)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  // Helper: CSS transition classes based on phase gate
  const vis = (minPhase: number) =>
    phase >= minPhase
      ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
      : "opacity-0 translate-y-5 transition-all duration-700 ease-out"

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col overflow-hidden transition-opacity duration-700 ease-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading invitation"
    >
      {/* ── Layer 1: True emerald base ── */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(155deg, #092E2F 0%, #0C3B3C 40%, #0F4546 65%, #0A3435 100%)",
        }}
      />

      {/* ── Layer 2: Warm gold radial at center ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 45%, rgba(190, 132, 0, 0.10) 0%, transparent 70%)",
        }}
      />

      {/* ── Layer 3: Canvas particle field ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: "screen" }}
        aria-hidden
      />

      {/* ── Layer 4: Edge vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 80% at 50% 50%, transparent 35%, rgba(5, 20, 20, 0.75) 100%)",
        }}
      />

      {/* ── Ghost date watermark (right) ── */}
      <div
        className="absolute inset-0 pointer-events-none flex flex-col items-end justify-center pr-4 sm:pr-10 md:pr-16 select-none"
        aria-hidden
      >
        {GHOST_NUMBERS.map((num, i) => (
          <span
            key={`ghost-${num}-${i}`}
            className="font-bold leading-[0.82]"
            style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(5rem, 14vw, 12rem)",
              color: "rgba(245, 239, 230, 0.05)",
              letterSpacing: "-0.04em",
              opacity: phase >= 2 ? 1 : 0,
              transition: `opacity 1.6s ease-out ${i * 150}ms`,
            }}
          >
            {num}
          </span>
        ))}
      </div>

      {/* ══════════════════════════════════════════════
          TOP ZONE — Monogram · Save the Date · Days
      ══════════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col items-center pt-[8vh] sm:pt-[10vh]">

        {/* Monogram */}
        <div
          className={
            phase >= 1
              ? "opacity-100 translate-y-0 scale-100 transition-all duration-700 ease-out"
              : "opacity-0 -translate-y-3 scale-95 transition-all duration-700 ease-out"
          }
        >
          <CloudinaryImage
            src="/monogram/newMonogram.png"
            alt="Monogram"
            width={240}
            height={240}
            className="h-20 w-20 sm:h-24 sm:w-24 object-contain object-center brightness-0 invert"
            style={{ opacity: 0.88 }}
            priority
          />
        </div>

        {/* Save the Date */}
        <p
          className={vis(1)}
          style={{
            fontFamily: '"BrittanySignature", cursive',
            fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
            color: "rgba(245, 239, 230, 0.75)",
            lineHeight: 1,
            marginTop: "10px",
          }}
        >
          Save the Date
        </p>

        {/* Days remaining */}
        <p
          className={vis(1)}
          style={{
            fontFamily: '"AgrandirWideBold", sans-serif',
            fontSize: "clamp(0.44rem, 1.1vw, 0.54rem)",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "rgba(190, 132, 0, 0.80)",
            marginTop: "6px",
          }}
        >
          {DAYS_REMAINING} more days to go
        </p>

        {/* Short gold rule */}
        <div
          className={vis(1)}
          style={{
            width: "80px",
            height: "1px",
            marginTop: "12px",
            background: "linear-gradient(to right, transparent, rgba(190, 132, 0, 0.55), transparent)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════
          CENTER ZONE — Couple Names
      ══════════════════════════════════════════════ */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">

        {/* Couple names */}
        <h1
          className={`text-center ${vis(2)}`}
          style={{ transitionDelay: "50ms" }}
        >
          <span
            className="block"
            style={{
              fontFamily: '"Westonia", cursive',
              fontSize: "clamp(4rem, 13vw, 7rem)",
              color: "#F5EFE6",
              lineHeight: 0.88,
              textShadow: "0 4px 40px rgba(190, 132, 0, 0.22)",
            }}
          >
            {siteConfig.couple.groomNickname.trim()}
          </span>

          <span
            className="block"
            style={{
              fontFamily: '"Westonia", cursive',
              fontSize: "clamp(2.2rem, 6.5vw, 3.5rem)",
              color: "rgba(183, 110, 121, 0.90)",
              lineHeight: 1,
            }}
          >
            +
          </span>

          <span
            className="block"
            style={{
              fontFamily: '"Westonia", cursive',
              fontSize: "clamp(4rem, 13vw, 7rem)",
              color: "#F5EFE6",
              lineHeight: 0.88,
              textShadow: "0 4px 40px rgba(190, 132, 0, 0.22)",
            }}
          >
            {siteConfig.couple.brideNickname.trim()}
          </span>
        </h1>
      </div>

      {/* ══════════════════════════════════════════════
          BOTTOM ZONE — Tagline · Date · Progress
      ══════════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col items-center pb-[8vh] sm:pb-[10vh] px-6 text-center">

        {/* Gold hairline divider */}
        <div
          className={vis(3)}
          style={{
            width: "120px",
            height: "1px",
            marginBottom: "14px",
            background: "linear-gradient(to right, transparent, rgba(190, 132, 0, 0.55), transparent)",
          }}
        />

        {/* Tagline */}
        <p
          className={vis(3)}
          style={{
            fontFamily: '"AgrandirWideBold", sans-serif',
            fontSize: "clamp(0.44rem, 1.1vw, 0.52rem)",
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "rgba(245, 239, 230, 0.52)",
            transitionDelay: "80ms",
          }}
        >
          Together with their families
        </p>

        {/* Date */}
        <p
          className={`mt-3 leading-none ${vis(4)}`}
          style={{
            fontFamily: '"AgrandirWideBold", sans-serif',
            fontSize: "clamp(0.46rem, 1.2vw, 0.56rem)",
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: "rgba(245, 239, 230, 0.72)",
          }}
          aria-label={`${siteConfig.ceremony.day}, ${siteConfig.wedding.date} · ${siteConfig.ceremony.time}`}
        >
          <span>{siteConfig.ceremony.day}</span>
          <span className="mx-2" style={{ color: "rgba(190, 132, 0, 0.65)" }} aria-hidden>·</span>
          <span className="tabular-nums">{siteConfig.wedding.date}</span>
          <span className="mx-2" style={{ color: "rgba(190, 132, 0, 0.65)" }} aria-hidden>·</span>
          <span className="tabular-nums">{siteConfig.ceremony.time}</span>
        </p>

        {/* Progress */}
        <div className={`mt-6 w-full max-w-[200px] ${vis(5)}`}>
          <p
            style={{
              fontFamily: '"AgrandirWideBold", sans-serif',
              fontSize: "clamp(0.40rem, 1vw, 0.48rem)",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(245, 239, 230, 0.40)",
              marginBottom: "10px",
            }}
          >
            Preparing your invitation
          </p>

          {/* Hairline progress bar */}
          <div
            className="w-full relative mx-auto"
            style={{ height: "1px" }}
            role="presentation"
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(245, 239, 230, 0.14)" }}
            />
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{
                width: `${Math.max(progress, 2)}%`,
                transition: "width 200ms linear",
                background: "linear-gradient(to right, rgba(190, 132, 0, 0.70), rgba(245, 239, 230, 0.90))",
              }}
            >
              <div
                className="absolute inset-y-0 animate-loader-shimmer"
                style={{
                  width: "50px",
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(245, 239, 230, 0.65) 50%, transparent 100%)",
                }}
              />
            </div>
          </div>

          <p
            className="tabular-nums mt-3"
            style={{
              fontFamily: '"AgrandirWideBold", sans-serif',
              fontSize: "clamp(0.40rem, 1vw, 0.48rem)",
              letterSpacing: "0.35em",
              color: "rgba(245, 239, 230, 0.35)",
            }}
            aria-live="polite"
          >
            {progress}%
          </p>
        </div>
      </div>
    </div>
  )
}