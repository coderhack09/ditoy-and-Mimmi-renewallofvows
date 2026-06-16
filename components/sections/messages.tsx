"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { MessageCircle, Heart, Sparkles, Send } from "lucide-react"
import Image from "next/image"
import { Section } from "@/components/section"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import MessageWallDisplay from "./message-wall-display"
import { Cormorant_Garamond, Cinzel } from "next/font/google"
import { siteConfig } from "@/content/site"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "400",
})

// Vintage palette — matches guest-list / countdown sections
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

const inputStyle = {
  borderColor: COLORS.borderStrong,
  color: COLORS.deep,
  backgroundColor: COLORS.parchmentSoft,
} as const

interface Message {
  timestamp: string
  name: string
  message: string
}

interface MessageFormProps {
  onSuccess?: () => void
  onMessageSent?: () => void
}

function MessageForm({ onSuccess, onMessageSent }: MessageFormProps) {
  const { brideNickname, groomNickname } = siteConfig.couple
  const coupleDisplayName = `${groomNickname} & ${brideNickname}`

  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [nameValue, setNameValue] = useState("")
  const [messageValue, setMessageValue] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const message = formData.get("message") as string

    const googleFormData = new FormData()
    googleFormData.append("entry.405401269", name)
    googleFormData.append("entry.893740636", message)

    try {
      await fetch(
        siteConfig.googleAPI.messageForm,
        {
          method: "POST",
          mode: "no-cors",
          body: googleFormData,
        }
      )

      toast({
        title: "Message Sent! 💌",
        description: "Your heartfelt wishes have been delivered",
        duration: 3000,
      })

      setIsSubmitted(true)
      setNameValue("")
      setMessageValue("")
      formRef.current?.reset()
      
      // Reset submitted state after animation
      setTimeout(() => setIsSubmitted(false), 1000)
      
      if (onSuccess) onSuccess()
      if (onMessageSent) onMessageSent()
    } catch (error) {
      toast({
        title: "Unable to send message",
        description: "Please try again in a moment",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto px-3 sm:px-0">
      <style>{`
        .message-form-input::placeholder,
        .message-form-textarea::placeholder {
          color: rgba(28, 28, 30, 0.38) !important;
          opacity: 1 !important;
        }
      `}</style>
      
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full blur-sm animate-pulse-slow" style={{ backgroundColor: "rgba(184, 50, 50, 0.12)" }} />
      <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full blur-md animate-pulse-slow" style={{ backgroundColor: "rgba(160, 122, 68, 0.15)" }} />
      
      <Card className={`relative w-full backdrop-blur-md transition-all duration-500 group overflow-hidden rounded-2xl ${
        isFocused ? 'scale-[1.01]' : ''
      } ${isSubmitted ? 'animate-bounce' : ''}`}
        style={{
          ...CARD_STYLE,
          borderColor: isFocused ? COLORS.borderStrong : COLORS.border,
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom right, rgba(184, 50, 50, 0.03), transparent, transparent)" }} />
        
        {isSubmitted && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none" style={{ backgroundColor: "rgba(255, 252, 244, 0.92)" }}>
            <div className="flex flex-col items-center gap-2 animate-pulse">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: COLORS.accent }}>
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <p className="font-semibold text-lg" style={{ color: COLORS.accent }}>Sent!</p>
            </div>
          </div>
        )}
        
        <CardContent className="relative p-3 sm:p-5 md:p-6 lg:p-8 xl:p-10">
          <div className="text-center mb-3 sm:mb-4 md:mb-5 lg:mb-6">
            <div className="relative inline-block mb-2 sm:mb-3 md:mb-4">
              <div className="absolute inset-0 rounded-full blur-lg scale-150" style={{ backgroundColor: "rgba(184, 50, 50, 0.15)" }} />
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ backgroundColor: COLORS.accent }}>
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
              </div>
            </div>
            <h3 className="parisienne-regular text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] leading-tight" style={{ color: COLORS.deep }}>
              Share Your Love
            </h3>
            <p className={`${cormorant.className} text-[10px] sm:text-xs md:text-sm`} style={{ color: COLORS.medium }}>
              Your words will be part of {coupleDisplayName}&apos;s keepsake for years to come.
            </p>
          </div>

          <form 
            ref={formRef} 
            onSubmit={handleSubmit} 
            className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            {/* Name Field */}
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              <label className={`${cormorant.className} block text-xs sm:text-sm md:text-base font-medium flex items-center gap-1.5 sm:gap-2`} style={{ color: COLORS.deep }}>
                <div className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center transition-all duration-300 ${focusedField === 'name' ? 'scale-110' : ''}`} style={{ backgroundColor: "rgba(184, 50, 50, 0.10)" }}>
                  <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" style={{ color: COLORS.accent }} />
                </div>
                Your Name
              </label>
              <div className="relative">
                <Input
                  name="name"
                  required
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Full Name"
                  className={`${cormorant.className} message-form-input w-full border-2 rounded-xl py-2 sm:py-2.5 md:py-3 lg:py-3.5 px-3 sm:px-4 md:px-5 text-xs sm:text-sm md:text-base placeholder:italic transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg ${
                    focusedField === 'name' 
                      ? 'focus:ring-4 focus:ring-[#B83232]/20 shadow-lg' 
                      : ''
                  }`}
                  style={{
                    ...inputStyle,
                    borderColor: focusedField === 'name' ? COLORS.accent : COLORS.borderStrong,
                  }}
                />
                {nameValue && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              <div className="flex items-center justify-between">
                <label className={`${cormorant.className} block text-xs sm:text-sm md:text-base font-medium flex items-center gap-1.5 sm:gap-2`} style={{ color: COLORS.deep }}>
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center transition-all duration-300 ${focusedField === 'message' ? 'scale-110' : ''}`} style={{ backgroundColor: "rgba(184, 50, 50, 0.10)" }}>
                    <MessageCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" style={{ color: COLORS.accent }} />
                  </div>
                  Your Message
                </label>
                {messageValue && (
                  <span className={`${cormorant.className} text-[10px] sm:text-xs transition-colors ${messageValue.length > 500 ? 'text-red-500' : ''}`} style={messageValue.length <= 500 ? { color: COLORS.muted } : undefined}>
                    {messageValue.length}/500
                  </span>
                )}
              </div>
              <div className="relative">
                <Textarea
                  name="message"
                  required
                  value={messageValue}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setMessageValue(e.target.value)
                    }
                  }}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  placeholder={`Write a heartfelt message for ${coupleDisplayName}... share your wishes, memories, or words of love that will be treasured forever 💕`}
                  className={`${cormorant.className} message-form-textarea w-full border-2 rounded-xl min-h-[80px] sm:min-h-[100px] md:min-h-[120px] text-xs sm:text-sm md:text-base placeholder:italic placeholder:leading-relaxed transition-all duration-300 resize-none shadow-sm hover:shadow-md focus:shadow-lg py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-5 ${
                    focusedField === 'message' 
                      ? 'focus:ring-4 focus:ring-[#B83232]/20 shadow-lg' 
                      : ''
                  }`}
                  style={{
                    ...inputStyle,
                    borderColor: focusedField === 'message' ? COLORS.accent : COLORS.borderStrong,
                  }}
                />
                {messageValue && (
                  <div className="absolute right-3 top-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !nameValue.trim() || !messageValue.trim()}
              className={`${cormorant.className} w-full text-white py-2 sm:py-2.5 md:py-3 lg:py-3.5 px-4 sm:px-5 md:px-6 lg:px-7 rounded-xl text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group`}
              style={{ 
                backgroundColor: COLORS.accent,
                boxShadow: "0 6px 20px rgba(184, 50, 50, 0.25), 0 2px 8px rgba(120, 85, 35, 0.12)",
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = COLORS.accentHover
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(184, 50, 50, 0.30), 0 3px 10px rgba(120, 85, 35, 0.15)"
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.accent
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(184, 50, 50, 0.25), 0 2px 8px rgba(120, 85, 35, 0.12)"
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <Send className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  Send Message
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function Messages() {
  const { brideNickname, groomNickname } = siteConfig.couple
  const coupleDisplayName = `${groomNickname} & ${brideNickname}`

  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const fetchMessages = useCallback(() => {
    setLoading(true)
    fetch("/api/messages", {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.warn("Unexpected messages response; expected an array", data)
          setMessages([])
          setLoading(false)
          return
        }
        
        const parsed = data
          .filter((m) => m.name || m.message || m.timestamp)
          .reverse()
        setMessages(parsed)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Failed to fetch messages:", error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  return (
    <Section
      id="messages"
      className="relative overflow-hidden bg-transparent"
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

      {/* Corner floral decoration */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        {/* <CloudinaryImage
          src="/decoration/corner-left-bottom.png"
          alt=""
          width={300}
          height={300}
          className="absolute top-0 left-0 w-auto h-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px]"
          style={{ transform: "scaleY(-1)" }}
          priority={false}
        /> */}
        {/* <CloudinaryImage
          src="/decoration/corner-left-bottom.png"
          alt=""
          width={300}
          height={300}
          className="absolute top-0 right-0 w-auto h-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px]"
          style={{ transform: "scaleX(-1) scaleY(-1)" }}
          priority={false}
        /> */}
        {/* <CloudinaryImage
          src="/decoration/corner-left-bottom.png"
          alt=""
          width={300}
          height={300}
          className="absolute bottom-0 left-0 w-auto h-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px]"
          priority={false}
        /> */}
        {/* <CloudinaryImage
          src="/decoration/corner-left-bottom.png"
          alt=""
          width={300}
          height={300}
          className="absolute bottom-0 right-0 w-auto h-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px]"
          style={{ transform: "scaleX(-1)" }}
          priority={false}
        /> */}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          <div className="space-y-2 sm:space-y-2.5">
            <p className={`${cormorant.className} text-[0.7rem] sm:text-xs md:text-sm uppercase tracking-[0.28em]`} style={{ color: COLORS.deep }}>
              Messages for {coupleDisplayName}
            </p>
            <h2 className="parisienne-regular text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] leading-tight" style={{ color: COLORS.deep }}>
              Love notes &amp; prayers
            </h2>
          </div>
          <p className={`${cormorant.className} text-xs sm:text-sm md:text-base font-light max-w-3xl mx-auto leading-relaxed px-2 sm:px-4 mt-2`} style={{ color: COLORS.medium }}>
            Leave a short note for {coupleDisplayName}. Every wish and prayer becomes part of their forever story.
          </p>
        </div>

        {/* Form Section */}
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          <div className="relative max-w-xl w-full">
            {/* Card halo */}
            {/* <div className="absolute -inset-3 bg-gradient-to-br from-[#B28383]/25 via-[#EDD6AC]/20 to-transparent rounded-3xl blur-2xl opacity-70" />
            <div className="absolute -inset-1 bg-gradient-to-br from-[#A78256]/15 via-transparent to-transparent rounded-3xl blur-md opacity-80" /> */}
            <MessageForm onMessageSent={fetchMessages} />
            {/* Corner sparkles */}
            {/* <div className="pointer-events-none">
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#BB8A3D] rounded-full blur-[2px] opacity-80" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#CDAC77] rounded-full blur-[2px] opacity-80" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#CDAC77] rounded-full blur-[2px] opacity-70" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#BB8A3D] rounded-full blur-[2px] opacity-70" />
            </div> */}
          </div>
        </div>

        {/* Messages Display Section */}
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <div className="relative inline-block mb-3 sm:mb-4 md:mb-6">
              <div className="absolute inset-0 rounded-full blur-xl scale-150 animate-pulse-slow" style={{ background: "radial-gradient(circle, rgba(184, 50, 50, 0.15), rgba(160, 122, 68, 0.08))" }} />
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto shadow-lg hover:scale-110 transition-transform duration-300" style={{ backgroundColor: COLORS.accent }}>
                <MessageCircle className="h-4 w-4 sm:h-6 sm:h-6 md:h-8 md:w-8 text-white" />
              </div>
              <div className="absolute -inset-2 rounded-full blur-md opacity-0 hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "rgba(184, 50, 50, 0.12)" }} />
            </div>
            <h3 className="parisienne-regular text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] leading-tight" style={{ color: COLORS.deep }}>
              Messages from Loved Ones
            </h3>
            <p className={`${cormorant.className} text-xs sm:text-sm md:text-base max-w-2xl mx-auto px-2 sm:px-4`} style={{ color: COLORS.medium }}>
              Read the beautiful messages shared by family and friends
            </p>
          </div>
          
          <MessageWallDisplay messages={messages} loading={loading} />
        </div>

      </div>
    </Section>
  )
}
