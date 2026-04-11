"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import { siteConfig } from "@/content/site"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import StaggeredMenu from "./StaggeredMenu"
import { Cormorant_Garamond } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

// Palette lives in globals.css → @theme inline → --color-motif-*
// Edit there once to update every component.


const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#countdown", label: "Countdown" },
  { href: "#gallery", label: "Gallery" },
  { href: "#messages", label: "Messages" },
  { href: "#details", label: "Details" },
  { href: "#entourage", label: "Entourage" },
  { href: "#sponsors", label: "Sponsors" },
  { href: "#guest-list", label: "RSVP" },
  { href: "#registry", label: "Registry" },
  { href: "#faq", label: "FAQ" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("#home")

  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    const onScroll = () => {
      if (rafIdRef.current != null) return
      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null
        setIsScrolled(window.scrollY > 50)
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current)
      window.removeEventListener("scroll", onScroll as EventListener)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const sectionIds = navLinks.map(l => l.href.substring(1))
    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio - a.intersectionRatio))
        if (visible.length > 0) {
          const topMost = visible[0]
          if (topMost.target && topMost.target.id) {
            const newActive = `#${topMost.target.id}`
            setActiveSection(prev => (prev === newActive ? prev : newActive))
          }
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
      }
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const menuItems = useMemo(() => navLinks.map((l) => ({ label: l.label, ariaLabel: `Go to ${l.label}`, link: l.href })), [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        isScrolled
          ? "backdrop-blur-xl"
          : "backdrop-blur-md"
      }`}
      style={{
        background: isScrolled
          ? "rgba(253, 251, 248, 0.97)"
          : "rgba(253, 251, 248, 0.92)",
        borderBottom: "1px solid rgba(140, 110, 72, 0.14)",
        boxShadow: isScrolled
          ? "0 4px 24px rgba(140, 110, 72, 0.10)"
          : "none",
      }}
    >
      {/* Subtle warm center lift — matches LoadingScreen layer 2 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.40) 0%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 relative">
        <div className="flex justify-between items-center h-12 sm:h-14 md:h-16">

          {/* Monogram — warm ink sepia, matches LoadingScreen */}
          <Link href="#home" className="flex-shrink-0 group relative z-10">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12">
              <CloudinaryImage
                src={siteConfig.couple.monogram}
                alt={`${siteConfig.couple.groomNickname} & ${siteConfig.couple.brideNickname} Monogram`}
                fill
                className="object-contain group-hover:scale-110 group-active:scale-105 transition-all duration-500"
                style={{
                  filter: "brightness(0) sepia(1) saturate(0.8) hue-rotate(10deg)",
                  opacity: 0.75,
                }}
              />
            </div>
          </Link>

          {/* Desktop nav links — ink on paper */}
          <div className="hidden md:flex gap-1 items-center">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 lg:px-4 py-2 text-xs lg:text-sm ${cormorant.className} font-medium rounded-md transition-all duration-300 relative group`}
                  style={{
                    color: isActive ? "#B83232" : "rgba(28, 28, 30, 0.65)",
                    background: isActive ? "rgba(184, 50, 50, 0.06)" : "transparent",
                    border: isActive
                      ? "1px solid rgba(184, 50, 50, 0.18)"
                      : "1px solid transparent",
                  }}
                >
                  {link.label}
                  {/* Red underline for active */}
                  <span
                    className="absolute bottom-0 left-0 h-[1.5px] transition-all duration-400 rounded-full"
                    style={{
                      width: isActive ? "100%" : "0%",
                      background: "#B83232",
                      opacity: 0.70,
                    }}
                  />
                  {/* Hover underline */}
                  <span
                    className="absolute bottom-0 left-0 h-[1.5px] w-0 group-hover:w-full transition-all duration-300 rounded-full"
                    style={{ background: "rgba(28, 28, 30, 0.25)" }}
                  />
                </Link>
              )
            })}
          </div>

          {/* Mobile — StaggeredMenu with paper theme */}
          <div className="md:hidden flex items-center h-full">
            <div className="relative">
              <StaggeredMenu
                position="left"
                items={menuItems}
                socialItems={[]}
                displaySocials={false}
                displayItemNumbering={true}
                menuButtonColor="#1C1C1E"
                openMenuButtonColor="#1C1C1E"
                changeMenuColorOnOpen={false}
                colors={["#FDFBF8", "#FAF6EF", "#F5EFE6"]}
                accentColor="#B83232"
                isFixed={true}
                onMenuOpen={() => {}}
                onMenuClose={() => {}}
              />
            </div>
          </div>

        </div>
      </div>
    </nav>
  )
}
