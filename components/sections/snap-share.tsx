"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { Instagram, Facebook, Twitter, Share2, Copy, Download, Check } from "lucide-react"
import Image from "next/image"
import { Section } from "@/components/section"
import { QRCodeCanvas } from "qrcode.react"
import { siteConfig } from "@/content/site"
import { Cormorant_Garamond } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

// Vintage palette
const COLORS = {
  deep: "#1C1C1E",
  medium: "rgba(28, 28, 30, 0.68)",
  muted: "rgba(28, 28, 30, 0.42)",
  accent: "#B83232",
  accentHover: "#a32d2d",
  parchmentSoft: "rgba(255, 252, 244, 0.92)",
  parchmentMuted: "rgba(255, 252, 244, 0.55)",
  border: "rgba(160, 122, 68, 0.25)",
  borderStrong: "rgba(160, 122, 68, 0.45)",
  gold: "rgba(140, 94, 4, 0.45)",
} as const

const CARD_STYLE = {
  background: [
    "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255, 252, 244, 0.72) 0%, transparent 70%)",
    COLORS.parchmentSoft,
  ].join(", "),
  border: `1px solid ${COLORS.border}`,
  boxShadow: [
    "0 4px 40px rgba(120, 85, 35, 0.14)",
    "0 1px 0 rgba(255, 248, 230, 0.90) inset",
    "inset 0 0 60px rgba(200, 160, 90, 0.05)",
  ].join(", "),
} as const

const SEPARATOR_GRADIENT = `linear-gradient(to right, transparent, ${COLORS.gold}, transparent)`

export function SnapShare() {
  const [copiedHashtagIndex, setCopiedHashtagIndex] = useState<number | null>(null)
  const [copiedAllHashtags, setCopiedAllHashtags] = useState(false)
  const [copiedDriveLink, setCopiedDriveLink] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const websiteUrl = typeof window !== "undefined" ? window.location.href : "https://example.com"
  // https://drive.google.com/drive/folders/1_40IPBZ0bF26uPV7ngLgjyPnUoN4V07Y?usp=sharing
  const driveLink = siteConfig.snapShare.googleDriveLink
  // const hashtags = [siteConfig.snapShare.hashtag] (multiple hashtags)
  const hashtags = siteConfig.snapShare.hashtag
  const allHashtagsText = hashtags.join(" ")
  const groomNickname = siteConfig.couple.groomNickname
  const brideNickname = siteConfig.couple.brideNickname

  const shareText =`Celebrate ${groomNickname} & ${brideNickname}'s renewal of vows! Share your photos and memories from our celebration: ${websiteUrl} ${allHashtagsText}`

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])


  const shareOnSocial = (platform: "instagram" | "facebook" | "twitter" | "tiktok") => {
    const encodedUrl = encodeURIComponent(websiteUrl)
    const encodedText = encodeURIComponent(shareText)

    const urls: Record<string, string> = {
      instagram: `https://www.instagram.com/`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      tiktok: `https://www.tiktok.com/`,
    }

    const target = urls[platform]
    if (target) {
      window.open(target, "_blank", "width=600,height=400")
    }
  }

  const downloadDriveQRCode = () => {
    const canvas = document.getElementById("drive-qr") as HTMLCanvasElement | null
    if (!canvas) return
    const link = document.createElement("a")
    link.download = "drive-qr.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const copyHashtag = async (hashtag: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hashtag)
      setCopiedHashtagIndex(index)
      setTimeout(() => setCopiedHashtagIndex(null), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const copyAllHashtags = async () => {
    try {
      await navigator.clipboard.writeText(allHashtagsText)
      setCopiedAllHashtags(true)
      setTimeout(() => setCopiedAllHashtags(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const copyDriveLink = async () => {
    if (driveLink) {
      try {
        await navigator.clipboard.writeText(driveLink)
        setCopiedDriveLink(true)
        setTimeout(() => setCopiedDriveLink(false), 2000)
      } catch (err) {
        console.error("Failed to copy: ", err)
      }
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <Section
      id="snap-share"
      className="relative overflow-hidden bg-transparent py-12 md:py-16 lg:py-20"
      style={{ paddingBottom: 0 }}
    >
      {/* Vintage parchment overlay */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255, 252, 244, 0.72) 0%, transparent 70%)",
              "rgba(250, 244, 232, 0.94)",
            ].join(", "),
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 60% 40% at 20% 20%, rgba(210, 168, 110, 0.10) 0%, transparent 70%)",
              "radial-gradient(ellipse 50% 35% at 80% 75%, rgba(170, 130, 80, 0.08) 0%, transparent 65%)",
            ].join(", "),
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
            mixBlendMode: "multiply",
            opacity: 0.55,
          }}
        />
      </div>

      {/* Corner decorations */}
      <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden>
        <Image src="/decoration/left-top-corner.png" alt="" width={320} height={320} className="absolute top-0 left-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
        <Image src="/decoration/right-top-corner.png" alt="" width={320} height={320} className="absolute top-0 right-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
        {/* <Image src="/decoration/left-down-corner.png" alt="" width={320} height={320} className="absolute bottom-0 left-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} />
        <Image src="/decoration/right-down-corner.png" alt="" width={320} height={320} className="absolute bottom-0 right-0 w-auto h-auto max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]" priority={false} /> */}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 md:px-8">
        <motion.div
          className="text-center mb-5 sm:mb-10"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div
            className={`${cormorant.className} parisienne-regular inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] sm:text-xs uppercase`}
            style={{ letterSpacing: "0.3em", borderColor: COLORS.accent, backgroundColor: COLORS.accent, color: "#fff" }}
          >
            Share the celebration
          </div>
          <h2
            className="parisienne-regular text-[34px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] leading-tight mt-2 sm:mt-4"
            style={{ color: COLORS.deep }}
          >
            Capture & Share Our Renewal
          </h2>
          <p
            className="text-xs sm:text-sm md:text-base max-w-2xl mx-auto mt-2 sm:mt-4 leading-relaxed px-2"
            style={{ color: COLORS.medium }}
          >
            Love grows, and so do we. Because you have been part of our journey,{" "}
            <b style={{ color: COLORS.deep }}>{groomNickname} & {brideNickname}</b> invite you to capture and share the
            moments from our vow renewal on{" "}
            <b style={{ color: COLORS.deep }}>
              {siteConfig.ceremony.day}, {siteConfig.ceremony.date}, at {siteConfig.ceremony.location}
            </b>{" "}
            at {siteConfig.ceremony.time}. Your photos and messages help us treasure this next chapter of{" "}
            <b style={{ color: COLORS.deep }}>love, commitment, and togetherness</b>.
          </p>
          <div className="mx-auto mt-3 sm:mt-5 h-px w-20 sm:w-24" style={{ background: SEPARATOR_GRADIENT }} />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 lg:gap-10"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          <motion.div className="lg:col-start-2 lg:row-start-1" variants={fadeInUp}>
            <div className="rounded-xl p-3 sm:p-4 text-center" style={CARD_STYLE}>
              <div className="flex items-center gap-2 mb-2.5 sm:mb-3 text-center">
                <h5
                  className="parisienne-regular text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] leading-tight text-center mx-auto"
                  style={{ color: COLORS.deep }}
                >
                  Celebration Hashtags
                </h5>
              </div>

              <div className="space-y-1.5 mb-2.5 sm:mb-3">
                {hashtags.map((hashtag, index) => (
                  <motion.button
                    key={index}
                    onClick={() => copyHashtag(hashtag, index)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 active:scale-[0.98]"
                    style={{
                      background:
                        copiedHashtagIndex === index
                          ? "rgba(184, 50, 50, 0.10)"
                          : COLORS.parchmentSoft,
                      borderColor:
                        copiedHashtagIndex === index ? COLORS.accent : COLORS.border,
                    }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <span
                      className={`${cormorant.className} font-semibold text-sm sm:text-base text-left truncate flex-1`}
                      style={{
                        color: copiedHashtagIndex === index ? COLORS.accent : COLORS.deep,
                      }}
                    >
                      {hashtag}
                    </span>
                    <span
                      className="flex items-center gap-1 flex-shrink-0 text-[10px] sm:text-xs font-semibold uppercase tracking-wider"
                      style={{
                        color: copiedHashtagIndex === index ? COLORS.accent : COLORS.muted,
                      }}
                    >
                      {copiedHashtagIndex === index ? (
                        <>
                          <Check className="w-3 h-3" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </span>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={copyAllHashtags}
                className="w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: copiedAllHashtags ? "rgba(184, 50, 50, 0.10)" : COLORS.parchmentMuted,
                  borderColor: copiedAllHashtags ? COLORS.accent : COLORS.borderStrong,
                  color: copiedAllHashtags ? COLORS.accent : COLORS.deep,
                }}
              >
                {copiedAllHashtags ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span
                  className={`${cormorant.className} text-xs sm:text-sm font-semibold uppercase`}
                  style={{ letterSpacing: "0.12em" }}
                >
                  {copiedAllHashtags ? "All Copied!" : "Copy All"}
                </span>
              </button>
            </div>
          </motion.div>

          <motion.div className="lg:col-start-2 lg:row-start-2" variants={fadeInUp}>
            <div className="rounded-lg sm:rounded-[20px] p-3 sm:p-5 md:p-7" style={CARD_STYLE}>
              <h5
                className="parisienne-regular text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] leading-tight mb-2 sm:mb-3 text-center"
                style={{ color: COLORS.deep }}
              >
                Share on Social Media
              </h5>
              <p
                className={`${cormorant.className} text-xs sm:text-sm text-center mb-3 sm:mb-4 leading-relaxed`}
                style={{ color: COLORS.medium }}
              >
                Help spread the word about {groomNickname} & {brideNickname}&apos;s renewal of vows. Share the
                celebration across your favorite platforms.
              </p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                {(
                  [
                    { platform: "instagram" as const, icon: Instagram, label: "Instagram" },
                    { platform: "facebook" as const, icon: Facebook, label: "Facebook" },
                    { platform: "tiktok" as const, icon: Share2, label: "TikTok" },
                    { platform: "twitter" as const, icon: Twitter, label: "Twitter" },
                  ] as const
                ).map(({ platform, icon: Icon, label }) => (
                  <button
                    key={platform}
                    onClick={() => shareOnSocial(platform)}
                    className="group flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    style={{
                      background: COLORS.parchmentSoft,
                      border: `1px solid ${COLORS.borderStrong}`,
                      color: COLORS.deep,
                    }}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span
                      className={`${cormorant.className} font-semibold text-xs sm:text-sm uppercase`}
                      style={{ letterSpacing: "0.18em" }}
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {driveLink && (
            <motion.div className="lg:col-start-1 lg:row-start-2" variants={fadeInUp}>
              <div className="rounded-xl sm:rounded-[22px] p-3 sm:p-5 md:p-7 text-center" style={CARD_STYLE}>
                <div
                  className={`${cormorant.className} inline-flex items-center gap-1.5 sm:gap-2 rounded-full border px-2.5 py-1 text-[10px] sm:text-xs uppercase mb-2 sm:mb-3`}
                  style={{
                    letterSpacing: "0.28em",
                    borderColor: COLORS.borderStrong,
                    backgroundColor: COLORS.deep,
                    color: "#fff",
                  }}
                >
                  Upload Your Photos & Videos
                </div>
                <p
                  className={`${cormorant.className} text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 px-1`}
                  style={{ color: COLORS.medium }}
                >
                  Help us capture our vow renewal celebration! Scan the QR or use the actions below to upload your
                  photos and videos to our shared Drive.
                </p>
                <div
                  className="mx-auto inline-flex flex-col items-center p-2.5 sm:p-5 rounded-xl sm:rounded-2xl shadow-md mb-3 sm:mb-4"
                  style={{
                    background: COLORS.parchmentSoft,
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <div
                    className="mb-2 sm:mb-3 p-1.5 sm:p-3 rounded-lg sm:rounded-xl"
                    style={{ background: COLORS.parchmentMuted, border: `1px solid ${COLORS.border}` }}
                  >
                    <div
                      className="p-1.5 sm:p-3 rounded-lg shadow-sm"
                      style={{ background: "#fff", border: `1px solid ${COLORS.border}` }}
                    >
                      <QRCodeCanvas
                        id="drive-qr"
                        value={driveLink}
                        size={isMobile ? 130 : 200}
                        includeMargin
                        className="bg-white"
                        fgColor={COLORS.deep}
                      />
                    </div>
                  </div>
                  <p className={`${cormorant.className} text-xs sm:text-sm`} style={{ color: COLORS.muted }}>
                    Scan with your camera app
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
                  <button
                    onClick={copyDriveLink}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-sm hover:shadow-md text-xs sm:text-sm transition-all"
                    style={{
                      background: copiedDriveLink ? COLORS.accentHover : COLORS.accent,
                      color: "#fff",
                      border: `1px solid ${COLORS.accent}`,
                    }}
                  >
                    {copiedDriveLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span
                          className={`${cormorant.className} uppercase font-semibold`}
                          style={{ letterSpacing: "0.18em" }}
                        >
                          Copied!
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span
                          className={`${cormorant.className} uppercase font-semibold`}
                          style={{ letterSpacing: "0.18em" }}
                        >
                          Copy Link
                        </span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={downloadDriveQRCode}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-sm hover:shadow-md text-xs sm:text-sm transition-all font-semibold"
                    style={{
                      background: COLORS.accent,
                      color: "#fff",
                      border: `1px solid ${COLORS.accent}`,
                    }}
                  >
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span
                      className={`${cormorant.className} uppercase font-semibold`}
                      style={{ letterSpacing: "0.18em" }}
                    >
                      Download QR
                    </span>
                  </button>
                  <a
                    href={driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-sm hover:shadow-md text-xs sm:text-sm transition-all"
                    style={{
                      background: COLORS.parchmentSoft,
                      border: `1px solid ${COLORS.borderStrong}`,
                      color: COLORS.deep,
                    }}
                  >
                    <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span
                      className={`${cormorant.className} tracking-[0.15em] sm:tracking-[0.18em] uppercase font-semibold`}
                    >
                      Open Drive
                    </span>
                  </a>
                </div>
                <p
                  className={`${cormorant.className} text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed`}
                  style={{ color: COLORS.medium }}
                >
                  or tap &quot;Open Google Drive Folder.&quot;
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div className="text-center mt-5 sm:mt-10" variants={fadeInUp}>
          <div className="rounded-xl sm:rounded-[22px] p-4 sm:p-6 md:p-7 max-w-3xl mx-auto" style={CARD_STYLE}>
            <p
              className={`${cormorant.className} text-sm sm:text-base md:text-lg leading-relaxed mb-3 sm:mb-4 px-2`}
              style={{ color: COLORS.medium }}
            >
              Thank you for helping make {groomNickname} & {brideNickname}&apos;s vow renewal celebration memorable.
              Your photos and messages create beautiful memories that we will treasure for a lifetime.
            </p>
            <div
              className={`${cormorant.className} flex items-center justify-center gap-2 text-xs sm:text-sm uppercase`}
              style={{ letterSpacing: "0.25em", color: COLORS.deep }}
            >
              <span>Thank you for sharing the joy</span>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}