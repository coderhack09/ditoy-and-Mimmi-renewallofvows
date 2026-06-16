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

/**
 * Warm-toned particles for multiply blend on cream — they tint the paper
 * with very subtle gold, rose, brown, and sage drifts.
 */
const PARTICLE_COLORS = [
  "152, 98, 5",     // deep gold
  "162, 92, 106",   // muted rose
  "118, 78, 52",    // warm umber
  "82, 104, 88",    // soft sage
]

function createParticles(width: number, height: number): Particle[] {
  const count = Math.min(50, Math.max(24, Math.floor((width * height) / 13000)))
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.22,
    vy: -(Math.random() * 0.15 + 0.05),
    radius: Math.random() * 2.2 + 0.6,
    opacity: Math.random() * 0.22 + 0.08,
    twinklePhase: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.010 + 0.003,
    colorIdx: Math.floor(Math.random() * PARTICLE_COLORS.length),
  }))
}

/** Paints an organic handmade-paper texture once into the given canvas. */
function paintPaperTexture(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const W = canvas.width
  const H = canvas.height

  // 1. Near-white base — very light, barely warm
  ctx.fillStyle = "#FDFBF8"
  ctx.fillRect(0, 0, W, H)

  // 2. Large soft tone patches for natural paper variation
  const patches = 14
  for (let i = 0; i < patches; i++) {
    const cx   = Math.random() * W
    const cy   = Math.random() * H
    const r    = Math.random() * W * 0.50 + W * 0.10
    const g    = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    const warm = Math.random() > 0.40
    g.addColorStop(0, warm
      ? `rgba(210, 168, 110, ${Math.random() * 0.032 + 0.006})`
      : `rgba(170, 150, 118, ${Math.random() * 0.022 + 0.004})`
    )
    g.addColorStop(1, "rgba(250, 246, 239, 0)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  }

  // 3. Pixel-level grain — two-pass for a rough handmade feel
  const imageData = ctx.getImageData(0, 0, W, H)
  const px        = imageData.data
  for (let i = 0; i < px.length; i += 4) {
    const grain  = (Math.random() - 0.5) * 22
    const speck  = Math.random() < 0.012 ? (Math.random() - 0.5) * 14 : 0
    const total  = grain + speck
    px[i]     = Math.max(0, Math.min(255, px[i]     + total))
    px[i + 1] = Math.max(0, Math.min(255, px[i + 1] + total * 0.93))
    px[i + 2] = Math.max(0, Math.min(255, px[i + 2] + total * 0.80))
  }
  ctx.putImageData(imageData, 0, 0)

  // 4. Cotton-paper fibers — thin wavy strokes
  const fiberCount = Math.min(2400, Math.floor((W * H) / 1800))
  for (let i = 0; i < fiberCount; i++) {
    const x     = Math.random() * W
    const y     = Math.random() * H
    const angle = Math.random() * Math.PI
    const len   = Math.random() * 80 + 10
    const alpha = Math.random() * 0.038 + 0.007
    const lw    = Math.random() * 0.60 + 0.12
    const rr    = Math.floor(Math.random() * 50 + 100)
    const gg    = Math.floor(Math.random() * 32 + 65)
    const bb    = Math.floor(Math.random() * 20 + 40)

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(
      len * 0.25, (Math.random() - 0.5) * 3.0,
      len * 0.70, (Math.random() - 0.5) * 3.0,
      len,        (Math.random() - 0.5) * 2.0
    )
    ctx.strokeStyle = `rgba(${rr}, ${gg}, ${bb}, ${alpha})`
    ctx.lineWidth   = lw
    ctx.stroke()
    ctx.restore()
  }

  // 5. Sparse dark micro-specks — compressed plant matter in handmade paper
  const speckCount = Math.floor((W * H) / 9000)
  for (let i = 0; i < speckCount; i++) {
    const x     = Math.random() * W
    const y     = Math.random() * H
    const r     = Math.random() * 0.9 + 0.2
    const alpha = Math.random() * 0.07 + 0.02
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(90, 62, 38, ${alpha})`
    ctx.fill()
  }
}

// ── Component ───────────────────────────────────────────────────────────────

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut]   = useState(false)
  const [progress, setProgress] = useState(0)
  // phase gates: 0=hidden · 1=monogram · 2=names · 3=tagline · 4=date · 5=progress
  const [phase, setPhase]       = useState(0)

  const paperCanvasRef = useRef<HTMLCanvasElement>(null)
  const canvasRef      = useRef<HTMLCanvasElement>(null)
  const animFrameRef   = useRef<number>(0)
  const particlesRef   = useRef<Particle[]>([])

  const TOTAL_LOAD_MS = 12000
  const FADE_MS       = 700

  // ── Paper texture (one-time generation on mount) ─────────────────────────
  useEffect(() => {
    const canvas = paperCanvasRef.current
    if (!canvas) return
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    paintPaperTexture(canvas)
  }, [])

  // ── Animated particle field (multiply blend on cream paper) ──────────────
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
        p.twinklePhase += p.twinkleSpeed
        const twinkle = (Math.sin(p.twinklePhase) + 1) * 0.5
        const alpha   = p.opacity * (0.35 + twinkle * 0.65)
        const color   = PARTICLE_COLORS[p.colorIdx]
        const blurR   = p.radius * 4.5

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, blurR)
        g.addColorStop(0,   `rgba(${color}, ${alpha})`)
        g.addColorStop(0.4, `rgba(${color}, ${alpha * 0.40})`)
        g.addColorStop(1,   `rgba(${color}, 0)`)

        ctx.beginPath()
        ctx.arc(p.x, p.y, blurR, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()

        p.x += p.vx
        p.y += p.vy

        const { width, height } = canvas
        if (p.y < -25)         { p.y = height + 12; p.x = Math.random() * width }
        if (p.x < -25)           p.x = width + 25
        if (p.x > width + 25)    p.x = -25
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
      {/* ── Layer 1: Paper texture canvas (grain + fibers, static) ── */}
      <canvas
        ref={paperCanvasRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      />

      {/* ── Layer 2: Near-white center lift ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 70% 60% at 50% 44%, rgba(255, 255, 255, 0.65) 0%, transparent 70%)",
            "linear-gradient(90deg, rgba(180, 155, 115, 0.04) 0%, transparent 20%, transparent 80%, rgba(180, 155, 115, 0.03) 100%)",
          ].join(", "),
        }}
      />

      {/* ── Layer 3: Particle field — warm drifting tints (multiply) ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: "multiply" }}
        aria-hidden
      />

      {/* ── Layer 4: Soft vignette — very gentle warm darkening at edges ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 42%, rgba(140, 110, 72, 0.13) 100%)",
            "linear-gradient(180deg, rgba(172, 138, 92, 0.06) 0%, transparent 16%, transparent 84%, rgba(150, 118, 76, 0.09) 100%)",
          ].join(", "),
        }}
      />

      {/* ── Layer 5: Corner decorations ── */}
      <div className="absolute inset-0 pointer-events-none z-[5]" aria-hidden>
        <CloudinaryImage
          src="/decoration/left-top-corner.png"
          alt=""
          width={320}
          height={320}
          className="absolute top-0 left-0 w-auto h-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[240px]"
          priority
        />
        <CloudinaryImage
          src="/decoration/right-top-corner.png"
          alt=""
          width={320}
          height={320}
          className="absolute top-0 right-0 w-auto h-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[240px]"
          priority
        />
        <CloudinaryImage
          src="/decoration/left-down-corner.png"
          alt=""
          width={320}
          height={320}
          className="absolute bottom-0 left-0 w-auto h-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[240px]"
          priority
        />
        <CloudinaryImage
          src="/decoration/right-down-corner.png"
          alt=""
          width={320}
          height={320}
          className="absolute bottom-0 right-0 w-auto h-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[240px]"
          priority
        />
      </div>

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
              color: "rgba(28, 28, 30, 0.04)",
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
      <div className="relative z-10 flex flex-col items-center pt-[4vh] sm:pt-[5vh]">

        {/* Monogram */}
        <div
          className={
            phase >= 1
              ? "opacity-100 translate-y-0 scale-100 transition-all duration-700 ease-out"
              : "opacity-0 -translate-y-3 scale-95 transition-all duration-700 ease-out"
          }
        >
          <CloudinaryImage
            src={siteConfig.couple.monogram}
            alt="Monogram"
            width={240}
            height={240}
            className="h-14 w-14 sm:h-16 sm:w-16 object-contain object-center"
            style={{
              filter: "brightness(0) sepia(1) saturate(0.8) hue-rotate(10deg)",
              opacity: 0.72,
            }}
            priority
          />
        </div>

        {/* Save the Date */}
        <p
          className={vis(1)}
          style={{
            fontFamily: '"BrittanySignature", cursive',
            fontSize: "clamp(2.2rem, 5.5vw, 3.2rem)",
            color: "rgba(28, 28, 30, 0.78)",
            lineHeight: 1,
            marginTop: "8px",
          }}
        >
          Save the Date
        </p>

        {/* Days remaining */}
        <p
          className={vis(1)}
          style={{
            fontFamily: '"AgrandirWideBold", sans-serif',
            fontSize: "clamp(0.62rem, 1.6vw, 0.78rem)",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#B83232",
            marginTop: "16px",
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
            background: "linear-gradient(to right, transparent, rgba(140, 94, 4, 0.45), transparent)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════
          CENTER ZONE — Couple Names
      ══════════════════════════════════════════════ */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <h1
          className={`text-center ${vis(2)}`}
          style={{
            transitionDelay: "50ms",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Groom — nudged left */}
          <span
            className="parisienne-regular"
            style={{
              fontSize: "clamp(3.5rem, 11.5vw, 6.5rem)",
              color: "#1C1C1E",
              lineHeight: 1.10,
              letterSpacing: "0.02em",
              display: "block",
              alignSelf: "flex-start",
              marginLeft: "clamp(0.5rem, 4vw, 3rem)",
            }}
          >
            {siteConfig.couple.groomNickname.trim()}
          </span>

          {/* "and" — red accent, centered */}
          <span
            className="parisienne-regular"
            style={{
              fontSize: "clamp(1.25rem, 3.3vw, 2rem)",
              color: "#B83232",
              lineHeight: 1,
              letterSpacing: "0.02em",
              display: "block",
              alignSelf: "center",
              marginTop: "clamp(0.5rem, 2vw, 1rem)",
              marginBottom: "clamp(0.5rem, 2vw, 1rem)",
            }}
          >
            and
          </span>

          {/* Bride — nudged right */}
          <span
            className="parisienne-regular"
            style={{
              fontSize: "clamp(3.5rem, 11.5vw, 6.5rem)",
              color: "#1C1C1E",
              lineHeight: 1.10,
              letterSpacing: "0.02em",
              display: "block",
              alignSelf: "flex-end",
              marginRight: "clamp(0.5rem, 4vw, 3rem)",
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
            background: "linear-gradient(to right, transparent, rgba(140, 94, 4, 0.42), transparent)",
          }}
        />

        {/* Tagline */}
        <p
          className={vis(3)}
          style={{
            fontFamily: '"AgrandirWideBold", sans-serif',
            fontSize: "clamp(0.62rem, 1.5vw, 0.74rem)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(28, 28, 30, 0.50)",
            transitionDelay: "80ms",
          }}
        >
          Together with their families
        </p>

        {/* Date */}
        <p
          className={`mt-4 leading-none ${vis(4)}`}
          style={{
            fontFamily: '"AgrandirWideBold", sans-serif',
            fontSize: "clamp(0.64rem, 1.6vw, 0.78rem)",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "rgba(28, 28, 30, 0.75)",
          }}
          aria-label={`${siteConfig.ceremony.day}, ${siteConfig.wedding.date} · ${siteConfig.ceremony.time}`}
        >
          <span>{siteConfig.ceremony.day}</span>
          <span className="mx-2" style={{ color: "rgba(28, 28, 30, 0.30)" }} aria-hidden>·</span>
          <span className="tabular-nums">{siteConfig.wedding.date}</span>
          <span className="mx-2" style={{ color: "rgba(28, 28, 30, 0.30)" }} aria-hidden>·</span>
          <span className="tabular-nums">{siteConfig.ceremony.time}</span>
        </p>

        {/* Progress */}
        <div className={`mt-7 w-full max-w-[220px] ${vis(5)}`}>
          <p
            style={{
              fontFamily: '"AgrandirWideBold", sans-serif',
              fontSize: "clamp(0.58rem, 1.4vw, 0.68rem)",
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "rgba(28, 28, 30, 0.40)",
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
              style={{ backgroundColor: "rgba(28, 28, 30, 0.12)" }}
            />
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{
                width: `${Math.max(progress, 2)}%`,
                transition: "width 200ms linear",
                background: "linear-gradient(to right, #B83232, rgba(184, 50, 50, 0.55))",
              }}
            >
              <div
                className="absolute inset-y-0 animate-loader-shimmer"
                style={{
                  width: "50px",
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255, 200, 200, 0.55) 50%, transparent 100%)",
                }}
              />
            </div>
          </div>

          <p
            className="tabular-nums mt-3"
            style={{
              fontFamily: '"AgrandirWideBold", sans-serif',
              fontSize: "clamp(0.58rem, 1.4vw, 0.68rem)",
              letterSpacing: "0.28em",
              color: "rgba(28, 28, 30, 0.36)",
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
