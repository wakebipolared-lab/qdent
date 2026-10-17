"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Star,
  Award,
  Users,
  Stethoscope,
  ScanLine,
  Sparkles,
  Smile,
  Syringe,
  Activity,
  Microscope,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Camera,
  Quote,
  CalendarCheck,
  ClipboardList,
  Stethoscope as StethoscopeIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { localeLabels, locales, useI18n } from "./i18n"

const qdentLogo = "/assets/logo-web.svg"

/* ------------------------------------------------------------------ */
/* Fonts                                                                */
/* ------------------------------------------------------------------ */

function FontLoader() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Work+Sans:wght@400;500;600;700&display=swap');
      .font-heading { font-family: 'Outfit', system-ui, sans-serif; }
      .font-body { font-family: 'Work Sans', system-ui, sans-serif; }
    `}</style>
  )
}

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

interface NavItem {
  label: string
  href: string
}

interface BenefitItem {
  icon: React.ReactNode
  title: string
  description: string
}

interface ServiceItem {
  title: string
  description: string
  image: string
  icon: React.ReactNode
}

interface TechItem {
  icon: React.ReactNode
  title: string
  description: string
}

interface TeamMember {
  name: string
  role: string
  description: string
  image: string
  imagePosition?: string
}

interface ProcessStep {
  icon: React.ReactNode
  title: string
  description: string
}

interface PriceRow {
  service: string
  price: string
}

interface PriceCategory {
  title: string
  rows: PriceRow[]
}

interface Testimonial {
  name: string
  category: string
  rating: number
  quote: string
}

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

const NAV_LINKS: NavItem[] = [
  { label: "Services", href: "#services" },
  { label: "Prices", href: "#prices" },
  { label: "About", href: "#about" },
  { label: "Team", href: "#team" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
]

const CLINIC_ADDRESS = "Gorkého 1, 811 01 Bratislava, Slovakia"
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CLINIC_ADDRESS)}`
const GOOGLE_MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(CLINIC_ADDRESS)}&z=15&output=embed`

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "ggfi6i92"
const cloudinaryImage = (publicId: string, fallback: string) =>
  CLOUDINARY_CLOUD_NAME
    ? `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto:best,dpr_auto,e_sharpen:80/${publicId}.jpg`
    : fallback

const BENEFITS: BenefitItem[] = [
  {
    icon: <Award className="h-5 w-5" />,
    title: "17+ years of experience",
    description: "Established clinical practice with a long record of predictable, lasting results.",
  },
  {
    icon: <ScanLine className="h-5 w-5" />,
    title: "Modern diagnostics",
    description: "3D imaging and digital X-rays for precise, low-radiation examinations.",
  },
  {
    icon: <Stethoscope className="h-5 w-5" />,
    title: "Complete dental care",
    description: "From prevention to prosthetics — every treatment under one calm roof.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Individual approach",
    description: "Treatment plans built around your comfort, timeline and long-term health.",
  },
]

const SERVICES: ServiceItem[] = [
  {
    title: "Prosthetics",
    description: "Crowns, bridges and dentures crafted for natural comfort and a confident bite.",
    image: "/assets/prosthetics-hq.webp",
    icon: <Smile className="h-5 w-5" />,
  },
  {
    title: "Restorative dentistry",
    description: "Precise fillings and repairs that preserve healthy tooth structure.",
    image: "/assets/restorative-hq.webp",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: "Dental surgery",
    description: "Extractions and implant placement performed with gentle, careful technique.",
    image: cloudinaryImage("qdent/services/surgery", "/assets/surgery-clinic-hq.webp"),
    icon: <Syringe className="h-5 w-5" />,
  },
  {
    title: "Endodontics",
    description: "Root canal treatment focused on saving your natural tooth, pain-free.",
    image: "/assets/endodontics-hq.webp",
    icon: <Activity className="h-5 w-5" />,
  },
  {
    title: "Digital diagnostics",
    description: "An intraoral scanner, microscope, 3D CBCT and digital X-rays give us an accurate, complete picture.",
    image: "/assets/digital-diagnostics-hq.webp",
    icon: <Microscope className="h-5 w-5" />,
  },
]

const TECH_ITEMS: TechItem[] = [
  {
    icon: <ScanLine className="h-5 w-5" />,
    title: "Vatech GreenX CBCT",
    description:
      "3D imaging reveals bone structure and root anatomy with remarkable clarity, so your treatment plan is precise from the very first visit.",
  },
  {
    icon: <Microscope className="h-5 w-5" />,
    title: "Dental microscope",
    description:
      "Magnified, illuminated vision helps us detect fine details and work with exceptional precision.",
  },
  {
    icon: <ScanLine className="h-5 w-5" />,
    title: "Intraoral scanner",
    description:
      "Fast digital impressions replace traditional moulds and create an accurate 3D model of your smile.",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Magnification loupes",
    description:
      "Every clinician works with magnification loupes for a clearer view, controlled movements and precise treatment.",
  },
]

const TEAM: TeamMember[] = [
  {
    name: "Владислав Семенченко",
    role: "Ассистент врача и администратор",
    description: "Помогает врачу, координирует работу клиники и остаётся на связи с пациентами 24/7.",
    image: "/assets/vladyslav-semenchenko-hq.webp",
  },
  {
    name: "Виталий",
    role: "Врач-хирург",
    description: "Проводит хирургическое лечение точно, бережно и с вниманием к деталям.",
    image: cloudinaryImage("qdent/team/vitaliy", "/assets/vitalij-centered-hq.webp"),
    imagePosition: "center",
  },
  {
    name: "MDDr. Barbora Prídavková",
    role: "Врач-терапевт",
    description: "Восстанавливает здоровье зубов и составляет понятный план лечения.",
    image: cloudinaryImage("qdent/team/barbora", "/assets/doctor.jpg"),
  },
  {
    name: "Влада",
    role: "Ассистент",
    description: "Помогает врачу и сопровождает пациента на всех этапах лечения.",
    image: cloudinaryImage("qdent/team/vlada", "/assets/assistant.jpg"),
  },
  {
    name: "Тамара",
    role: "Ассистент и специалист по гигиене",
    description: "Ассистирует врачу и проводит профессиональную гигиену полости рта.",
    image: cloudinaryImage("qdent/team/tamara", "/assets/assistant.jpg"),
  },
]

const PROCESS_STEPS: ProcessStep[] = [
  {
    icon: <ClipboardList className="h-5 w-5" />,
    title: "Consultation",
    description: "We listen to your concerns and examine your oral health in a relaxed first visit.",
  },
  {
    icon: <ScanLine className="h-5 w-5" />,
    title: "Diagnostics",
    description: "Digital X-rays and 3D imaging give us a complete, accurate picture.",
  },
  {
    icon: <StethoscopeIcon className="h-5 w-5" />,
    title: "Personal treatment plan",
    description: "We explain every option clearly, with transparent pricing and timelines.",
  },
  {
    icon: <CalendarCheck className="h-5 w-5" />,
    title: "Treatment & follow-up",
    description: "Careful treatment followed by check-ins to make sure results last.",
  },
]

const PRICE_CATEGORIES: PriceCategory[] = [
  { title: "Restorative dentistry", rows: [
    { service: "Injection anesthesia (Septanest)", price: "20 EUR" }, { service: "Kofferdam", price: "25 EUR" },
    { service: "Optragate", price: "25 EUR" }, { service: "Complete dental hygiene", price: "89 EUR" },
    { service: "Single-surface tooth filling (photocomposite)", price: "90 EUR" }, { service: "Two-surface tooth filling (photocomposite)", price: "from 110 EUR" },
    { service: "Three-surface tooth filling (photocomposite)", price: "from 140 EUR" }, { service: "Cement base", price: "30 EUR" },
    { service: "Direct tooth reconstruction", price: "200 EUR" }, { service: "Temporary treatment of deep tooth decay", price: "20 EUR" },
    { service: "Temporary treatment of nerve canal", price: "20 EUR" }, { service: "Temporary filling", price: "50 EUR" },
    { service: "Reconstruction of tooth crown – glass fibers post", price: "150 EUR" },
  ]},
  { title: "Endodontics", rows: [
    { service: "Endodontic treatment of a single-rooted tooth", price: "120 EUR" }, { service: "Endodontic treatment of a multi-rooted tooth", price: "120 EUR/canal" },
    { service: "Calcipast", price: "30 EUR/canal" }, { service: "Re-Endo", price: "120 EUR/canal" },
  ]},
  { title: "Surgery", rows: [
    { service: "Extraction of a single-rooted tooth", price: "from 70 EUR" }, { service: "Extraction of a multi-rooted tooth", price: "from 90 EUR" },
    { service: "Extraction of a temporary tooth or root", price: "from 50 EUR" }, { service: "Hemostatic gelatin sponge", price: "30 EUR" }, { service: "Suturing", price: "20 EUR" },
  ]},
  { title: "Prosthetics", rows: [
    { service: "Inlay indirect - pure ceramic IPS e.max", price: "650 EUR" }, { service: "Aesthetic Veneer", price: "650 EUR" },
    { service: "Temporary crown made by a dentist", price: "30 EUR" }, { service: "Temporary Crown", price: "150 EUR" },
    { service: "Crown / Bridge member veneered Zirconia", price: "650 EUR" }, { service: "Crown / Bridge member veneered IPS e.max", price: "650 EUR" },
    { service: "Partially removable prothesis", price: "730 EUR" }, { service: "Fully removable prothesis", price: "730 EUR" },
    { service: "Skeletonized bugle clasp prosthesis", price: "1000 EUR" }, { service: "Digital impression", price: "100 EUR" },
    { service: "Upper Impression", price: "30 EUR" }, { service: "Lower Impression", price: "30 EUR" },
  ]},
  { title: "Pictures", rows: [
    { service: "Intraoral X-ray", price: "15 EUR" }, { service: "OPG (Orthopantomogram)", price: "40 EUR" },
    { service: "CT (Computed Tomography)", price: "100 EUR" }, { service: "Consultation", price: "50 EUR" }, { service: "Consultation with a specialist", price: "150 EUR" },
  ]},
]

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Martina K.",
    category: "Restorative treatment",
    rating: 5,
    quote:
      "I was nervous about my filling, but the team explained every step. Painless and quick — I finally trust going to the dentist again.",
  },
  {
    name: "Jozef B.",
    category: "Dental implants",
    rating: 5,
    quote:
      "Precise diagnostics and a clear plan from day one. My implant feels completely natural. Genuinely premium care.",
  },
  {
    name: "Lucia S.",
    category: "Teeth whitening",
    rating: 5,
    quote:
      "Clean, modern clinic and a lovely, calm atmosphere. The results exceeded what I expected — highly recommend Qdent.",
  },
  {
    name: "Peter H.",
    category: "Root canal treatment",
    rating: 5,
    quote:
      "Dr. Nemytkin took the time to explain everything. No pain, no stress, and the follow-up care was excellent.",
  },
  {
    name: "Andrea V.",
    category: "Dental prosthetics",
    rating: 4,
    quote:
      "My new crown fits perfectly and looks completely natural. Professional team, transparent pricing, no surprises.",
  },
]

const SERVICE_OPTIONS = [
  "General check-up",
  "Prosthetics",
  "Restorative dentistry",
  "Dental surgery",
  "Endodontics",
  "Digital diagnostics",
  "Teeth whitening",
  "Not sure yet",
]

/* ------------------------------------------------------------------ */
/* Logo                                                                 */
/* ------------------------------------------------------------------ */

function QdentLogo({ className }: { className?: string }) {
  return (
    <a
      href="#home"
      className={cn(
        "flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009182] focus-visible:ring-offset-2 rounded-md",
        className,
      )}
      aria-label="Qdent — Home"
    >
      <span className="flex h-11 items-center rounded-[11px] bg-[#009182] px-3 shadow-sm transition-colors duration-200 hover:bg-[#00786d]">
        <img src={qdentLogo} alt="Qdent" className="h-[32px] w-auto" />
      </span>
    </a>
  )
}

/* ------------------------------------------------------------------ */
/* Header                                                               */
/* ------------------------------------------------------------------ */

function SiteHeader() {
  const { locale, setLocale, t } = useI18n()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <QdentLogo />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-body text-sm font-medium text-[#12253A]/80 transition-colors duration-200 hover:text-[#009182] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009182] focus-visible:ring-offset-2 rounded-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="tel:+421903760901"
            className="flex items-center gap-2 font-body text-sm font-semibold text-[#12253A] transition-colors duration-200 hover:text-[#009182] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009182] rounded-sm"
          >
            <Phone className="h-4 w-4 text-[#009182]" aria-hidden="true" />
            +421 903 760 901
          </a>

          <Separator orientation="vertical" className="h-6" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 gap-1.5 text-[#12253A] hover:bg-[#F2F8F7] hover:text-[#009182]"
                aria-label="Select language"
              >
                <Globe className="h-4 w-4" />
                 {localeLabels[locale]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               {locales.map((l) => (
                 <DropdownMenuItem key={l} onClick={() => setLocale(l)} lang={l === "ukr" ? "uk" : l}>
                   {localeLabels[l]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            asChild
            className="h-11 rounded-[12px] bg-[#009182] px-5 font-body font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#00786d] hover:shadow-md"
          >
            <a href="#appointment">Book an appointment</a>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href="tel:+421903760901"
            aria-label="Call Qdent"
            className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-border text-[#009182]"
          >
            <Phone className="h-5 w-5" />
          </a>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-[12px]"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-white">
              <div className="mt-8 flex flex-col gap-1">
                {NAV_LINKS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-[10px] px-3 py-3 font-body text-base font-medium text-[#12253A] transition-colors duration-200 hover:bg-[#F2F8F7] hover:text-[#009182]"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex items-center gap-2 px-3">
                {locales.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLocale(l)}
                    aria-label={`${t("Switch language to")} ${localeLabels[l]}`}
                    aria-current={locale === l ? "true" : undefined}
                    className={cn(
                      "h-9 min-w-[44px] rounded-[8px] border text-sm font-medium transition-colors duration-200",
                      locale === l
                        ? "border-[#009182] bg-[#F2F8F7] text-[#009182]"
                        : "border-border text-[#5F6F79] hover:bg-[#F2F8F7]",
                    )}
                  >
                    {localeLabels[l]}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 px-3">
                <a
                  href="tel:+421903760901"
                  className="flex items-center gap-2 font-body text-sm font-semibold text-[#12253A]"
                >
                  <Phone className="h-4 w-4 text-[#009182]" />
                  +421 903 760 901
                </a>
                <Button
                  asChild
                  className="h-12 w-full rounded-[12px] bg-[#009182] font-body font-semibold text-white hover:bg-[#00786d]"
                >
                  <a href="#appointment" onClick={() => setMobileOpen(false)}>
                    Book an appointment
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/* Hero                                                                 */
/* ------------------------------------------------------------------ */


function ScrollToothbrush() {
  const brushRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const progress = Math.min(1, Math.max(0, window.scrollY / Math.max(720, window.innerHeight * 1.15)))
      const el = brushRef.current
      if (!el) return
      el.style.setProperty("--brush-progress", progress.toString())
      el.style.setProperty("--brush-turn", `${-18 + progress * 205}deg`)
      el.style.setProperty("--brush-lift", `${progress * -96}px`)
      el.style.setProperty("--brush-scale", `${1 + Math.sin(progress * Math.PI) * 0.09}`)
      el.style.setProperty("--brush-opacity", `${1 - Math.max(0, progress - 0.78) / 0.22}`)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={brushRef} className="scroll-toothbrush" aria-hidden="true">
      <div className="brush-orbit brush-orbit-one" />
      <div className="brush-orbit brush-orbit-two" />
      <div className="brush-product">
        <svg viewBox="0 0 420 820" role="presentation" className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id="handle" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.5" stopColor="#e7f3f2" />
              <stop offset="0.72" stopColor="#ffffff" />
              <stop offset="1" stopColor="#b9cfcd" />
            </linearGradient>
            <linearGradient id="teal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#11b4a3" />
              <stop offset="1" stopColor="#006d65" />
            </linearGradient>
            <filter id="shadow" x="-60%" y="-40%" width="220%" height="210%">
              <feDropShadow dx="0" dy="28" stdDeviation="26" floodColor="#12253A" floodOpacity=".24" />
            </filter>
            <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
          </defs>
          <ellipse cx="210" cy="765" rx="118" ry="28" fill="#0b8177" opacity=".16" filter="url(#glow)" />
          <g filter="url(#shadow)">
            <rect x="172" y="18" width="76" height="166" rx="35" fill="url(#handle)" />
            <rect x="165" y="22" width="9" height="155" rx="4" fill="#009182" opacity=".25" />
            <g fill="#ffffff" stroke="#d8e8e6" strokeWidth="2">
              <rect x="143" y="0" width="12" height="84" rx="6" transform="rotate(-10 143 0)" />
              <rect x="162" y="-6" width="12" height="92" rx="6" transform="rotate(-5 162 -6)" />
              <rect x="181" y="-10" width="12" height="96" rx="6" />
              <rect x="227" y="-10" width="12" height="96" rx="6" />
              <rect x="246" y="-6" width="12" height="92" rx="6" transform="rotate(5 246 -6)" />
              <rect x="265" y="0" width="12" height="84" rx="6" transform="rotate(10 265 0)" />
            </g>
            <rect x="176" y="138" width="68" height="74" rx="30" fill="#12253A" />
            <path d="M155 190 Q210 166 265 190 L286 661 Q289 741 210 759 Q131 741 134 661Z" fill="url(#handle)" stroke="#ffffff" strokeWidth="4" />
            <path d="M155 198 Q210 175 265 198 L272 404 Q210 431 148 404Z" fill="url(#teal)" />
            <rect x="156" y="265" width="108" height="48" rx="12" fill="#00786f" opacity=".88" />
            <image href="/assets/logo-web.svg" x="166" y="272" width="88" height="29" preserveAspectRatio="xMidYMid meet" />
            <circle cx="210" cy="355" r="24" fill="#ffffff" opacity=".95" />
            <circle cx="210" cy="355" r="13" fill="none" stroke="#009182" strokeWidth="4" />
            <path d="M210 347v16M202 355h16" stroke="#009182" strokeWidth="3" strokeLinecap="round" />
            <path d="M158 441 C173 419 247 419 262 441" fill="none" stroke="#009182" strokeWidth="5" strokeLinecap="round" opacity=".35" />
            <rect x="166" y="482" width="88" height="7" rx="3.5" fill="#009182" opacity=".22" />
            <rect x="178" y="506" width="64" height="7" rx="3.5" fill="#009182" opacity=".15" />
            <path d="M158 225 C171 205 185 203 195 198 L175 696 C173 716 183 735 197 746 C159 738 140 708 142 662Z" fill="#ffffff" opacity=".52" />
          </g>
        </svg>
      </div>
      <p className="brush-caption">Scroll to rotate</p>
    </div>
  )
}

function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#F2F8F7] pt-14 pb-20 scroll-mt-24 sm:pt-20 sm:pb-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#009182]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full border border-[#009182]/20"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#009182]/30 bg-white px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-wide text-[#009182]">
            Private Dental Clinic · Bratislava
          </span>

          <h1 className="mt-6 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-[#12253A] sm:text-5xl lg:text-[3.4rem]">
            Modern dentistry with care and precision
          </h1>

          <p className="mt-6 max-w-lg font-body text-base leading-relaxed text-[#5F6F79] sm:text-lg">
            At Qdent we combine advanced diagnostics with a calm, personal
            approach — so every visit feels transparent, comfortable and
            genuinely reassuring.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-[12px] bg-[#009182] px-7 font-body text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#00786d] hover:shadow-md"
            >
              <a href="#appointment">Book an appointment</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 rounded-[12px] border-[#12253A]/20 px-7 font-body text-base font-semibold text-[#12253A] transition-all duration-200 hover:border-[#009182] hover:text-[#009182]"
            >
              <a href="#services">Explore our services</a>
            </Button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2" aria-label="Quick links">
            <a href="#services" className="group rounded-[12px] border border-[#009182]/20 bg-white/85 p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#009182]/50 hover:shadow-md">
              <Stethoscope className="h-5 w-5 text-[#009182]" />
              <span className="mt-2 block font-heading text-sm font-bold text-[#12253A]">Services</span>
              <span className="mt-0.5 hidden font-body text-[11px] text-[#5F6F79] sm:block">See treatments</span>
            </a>
            <a href="#prices" className="group rounded-[12px] border border-[#009182]/20 bg-white/85 p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#009182]/50 hover:shadow-md">
              <ClipboardList className="h-5 w-5 text-[#009182]" />
              <span className="mt-2 block font-heading text-sm font-bold text-[#12253A]">Prices</span>
              <span className="mt-0.5 hidden font-body text-[11px] text-[#5F6F79] sm:block">View price list</span>
            </a>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noreferrer" className="group rounded-[12px] border border-[#009182]/20 bg-white/85 p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#009182]/50 hover:shadow-md">
              <MapPin className="h-5 w-5 text-[#009182]" />
              <span className="mt-2 block font-heading text-sm font-bold text-[#12253A]">Google Maps</span>
              <span className="mt-0.5 hidden font-body text-[11px] text-[#5F6F79] sm:block">Build a route</span>
            </a>
          </div>

          <div className="mt-7 flex items-center gap-6 border-t border-[#12253A]/10 pt-6">
            <div className="flex -space-x-3">
              {[
                "/assets/assistant.jpg",
                "/assets/doctor.jpg",
                "/assets/clinic.jpg",
              ].map((src, i) => (
                <Avatar key={i} className="h-9 w-9 border-2 border-white">
                  <AvatarImage src={src} alt="Happy Qdent patient" />
                  <AvatarFallback>Q</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-[#F5A623]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-0.5 font-body text-sm text-[#5F6F79]">
                4.9 / 5 from 300+ patients
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Trust benefits                                                       */
/* ------------------------------------------------------------------ */

function TrustBenefitsSection() {
  return (
    <section className="border-b border-border/60 bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="rounded-[14px] border border-border/70 bg-[#F2F8F7]/50 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#009182]/40 hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#009182]/10 text-[#009182]">
                {b.icon}
              </span>
              <h3 className="mt-4 font-heading text-base font-semibold text-[#12253A]">
                {b.title}
              </h3>
              <p className="mt-1.5 font-body text-sm leading-relaxed text-[#5F6F79]">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Services                                                             */
/* ------------------------------------------------------------------ */

function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-24 bg-[#F2F8F7] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="font-body text-sm font-semibold uppercase tracking-wide text-[#009182]">
            Our services
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#12253A] sm:text-4xl">
            Complete dental care, under one calm roof
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-[#5F6F79]">
            From preventive check-ups to advanced surgical procedures, every
            treatment at Qdent is guided by precise diagnostics and a
            transparent plan.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <article
              key={s.title}
              className="group flex flex-col overflow-hidden rounded-[16px] border border-border/70 bg-white shadow-sm transition-all duration-200 hover:shadow-lg"
            >
              <div className="relative aspect-[16/11] w-full overflow-hidden">
                <img
                  src={s.image}
                  alt={`${s.title} treatment at Qdent`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[250ms] motion-reduce:transition-none group-hover:scale-[1.04]"
                />
                <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/95 text-[#009182] shadow-sm">
                  {s.icon}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-heading text-lg font-semibold text-[#12253A]">
                  {s.title}
                </h3>
                <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-[#5F6F79]">
                  {s.description}
                </p>
                <a
                  href="#appointment"
                  className="mt-4 inline-flex items-center gap-1.5 font-body text-sm font-semibold text-[#009182] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009182] rounded-sm"
                >
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* About                                                                */
/* ------------------------------------------------------------------ */

function AboutSection() {
  const metrics = [
    { value: "17+", label: "Years in practice" },
    { value: "12,000+", label: "Patients treated" },
    { value: "25,000+", label: "Treatments completed" },
    { value: "98%", label: "Patient satisfaction" },
  ]

  return (
    <section id="about" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[16px] shadow-lg sm:aspect-[5/6]">
              <img
                src="/assets/clinic-hq.webp"
                alt="Dentist explaining treatment plan to a patient at Qdent clinic"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 hidden max-w-[220px] rounded-[14px] border border-border/70 bg-white p-4 shadow-lg sm:block">
              <p className="font-body text-sm leading-relaxed text-[#5F6F79]">
                “We treat people, not just teeth — every plan is explained
                before we begin.”
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="font-body text-sm font-semibold uppercase tracking-wide text-[#009182]">
              About Qdent
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#12253A] sm:text-4xl">
              A personal approach, backed by modern dentistry
            </h2>
            <p className="mt-5 font-body text-base leading-relaxed text-[#5F6F79]">
              Qdent was founded on a simple idea: dental care should feel calm,
              transparent and precise. Every consultation begins with careful
              diagnostics, so treatment decisions are based on evidence — not
              guesswork.
            </p>
            <p className="mt-4 font-body text-base leading-relaxed text-[#5F6F79]">
              Our team takes the time to explain every option clearly,
              respecting your pace and priorities. The result is long-term
              dental health, built on trust rather than rushed appointments.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-[#12253A]/10 pt-8 sm:grid-cols-4">
              {metrics.map((m) => (
                <div key={m.label}>
                  <p className="font-heading text-2xl font-bold text-[#009182] sm:text-3xl">
                    {m.value}
                  </p>
                  <p className="mt-1 font-body text-xs text-[#5F6F79] sm:text-sm">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Technology                                                           */
/* ------------------------------------------------------------------ */

function TechnologySection() {
  const { t } = useI18n()

  return (
    <section className="bg-[#F2F8F7] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[16px] shadow-lg">
            <img
              src="/assets/digital-diagnostics-hq.webp"
              alt="Advanced digital diagnostic equipment used at Qdent"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <span className="font-body text-sm font-semibold uppercase tracking-wide text-[#009182]">
              Technology
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#12253A] sm:text-4xl">
              Precision diagnostics for confident decisions
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-[#5F6F79]">
              We invest in equipment that lets us see more, with less
              discomfort and lower radiation — so every treatment plan is
              built on an accurate, complete picture.
            </p>

            <div className="mt-8 space-y-5">
              {TECH_ITEMS.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-[14px] border border-border/70 bg-white p-5 transition-all duration-200 hover:border-[#009182]/40 hover:shadow-md"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#009182]/10 text-[#009182]">
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="font-heading text-base font-semibold text-[#12253A]">
                      {t(item.title)}
                    </h3>
                    <p className="mt-1 font-body text-sm leading-relaxed text-[#5F6F79]">
                      {t(item.description)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Doctors                                                              */
/* ------------------------------------------------------------------ */

function DoctorsSection() {
  const { t } = useI18n()

  return (
    <section id="team" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="font-body text-sm font-semibold uppercase tracking-wide text-[#009182]">
            Our team
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#12253A] sm:text-4xl">
            The people behind your care
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-[#5F6F79]">
            A small, experienced team focused on precise treatment and a
            genuinely welcoming patient experience.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {TEAM.map((member, index) => (
            <article
              key={`${member.name}-${index}`}
              className="group overflow-hidden rounded-[16px] border border-border/70 bg-white shadow-sm transition-all duration-200 hover:shadow-lg"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <img
                  src={member.image}
                  alt={t("Portrait of {name}, {role} at Qdent", {
                    name: t(member.name),
                    role: t(member.role),
                  })}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[250ms] motion-reduce:transition-none group-hover:scale-[1.03]"
                  style={{ objectPosition: member.imagePosition ?? "center" }}
                />
              </div>
              <div className="p-6">
                <h3 className="font-heading text-lg font-semibold text-[#12253A]">
                  {t(member.name)}
                </h3>
                <p className="mt-1 font-body text-sm font-medium text-[#009182]">
                  {t(member.role)}
                </p>
                <p className="mt-3 font-body text-sm leading-relaxed text-[#5F6F79]">
                  {t(member.description)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Process                                                              */
/* ------------------------------------------------------------------ */

function ProcessSection() {
  return (
    <section className="bg-[#F2F8F7] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="font-body text-sm font-semibold uppercase tracking-wide text-[#009182]">
            How it works
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#12253A] sm:text-4xl">
            Your treatment journey, step by step
          </h2>
        </div>

        <div className="relative mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-6 hidden h-px bg-[#12253A]/10 lg:block"
          />
          {PROCESS_STEPS.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="flex items-center gap-3">
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#009182] font-heading text-base font-bold text-white shadow-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white text-[#009182] shadow-sm">
                  {step.icon}
                </span>
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-[#12253A]">
                {step.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-[#5F6F79]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Prices                                                               */
/* ------------------------------------------------------------------ */

function PricesSection() {
  const { t } = useI18n()
  return (
    <section id="prices" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <span className="font-body text-sm font-semibold uppercase tracking-wide text-[#009182]">
              Prices
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#12253A] sm:text-4xl">
              Services and prices
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-[#5F6F79]">
              We are proud to provide quality dental treatment and an individual approach to each patient. Our main goal is for you to feel comfortable and satisfied when you visit our clinic.
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 whitespace-nowrap font-body text-sm font-semibold text-[#009182] transition-colors duration-200 hover:text-[#00786d]"
          >
            Book a consultation
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <Tabs defaultValue="price-category-0" className="mt-10">
          <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            <TabsList className="h-auto min-w-max justify-start gap-1 rounded-[14px] border border-[#DCE9E7] bg-[#F2F8F7] p-1.5">
              {PRICE_CATEGORIES.map((category, categoryIndex) => (
                <TabsTrigger
                  key={category.title}
                  value={`price-category-${categoryIndex}`}
                  className="rounded-[10px] px-4 py-2.5 font-body text-sm font-semibold text-[#5F6F79] hover:text-[#009182] data-[state=active]:bg-white data-[state=active]:text-[#009182] data-[state=active]:shadow-sm"
                >
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {PRICE_CATEGORIES.map((category, categoryIndex) => (
            <TabsContent key={category.title} value={`price-category-${categoryIndex}`} className="mt-5">
              <section aria-labelledby={`price-category-${categoryIndex}`} className="overflow-hidden rounded-[16px] border border-border/70 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-4 bg-[#F2F8F7] px-5 py-4 sm:px-6">
                <h3 id={`price-category-${categoryIndex}`} className="font-heading text-lg font-semibold text-[#12253A]">{category.title}</h3>
                <span className="rounded-full bg-white px-3 py-1 font-body text-xs font-semibold text-[#009182]">{category.rows.length} {t("services count")}</span>
              </div>
              <Table>
                <TableHeader className="sr-only"><TableRow><TableHead>Service</TableHead><TableHead>Price</TableHead></TableRow></TableHeader>
                <TableBody>
                  {category.rows.map((row) => (
                    <TableRow key={row.service}>
                      <TableCell className="whitespace-normal px-5 py-3.5 font-body text-sm leading-snug text-[#12253A] sm:px-6">{row.service}</TableCell>
                      <TableCell className="w-36 whitespace-nowrap px-5 py-3.5 text-right font-body text-sm font-semibold tabular-nums text-[#009182] sm:w-44 sm:px-6">{row.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </section>
            </TabsContent>
          ))}
        </Tabs>

        <p className="mt-5 font-body text-sm text-[#5F6F79]">
          Final prices depend on individual consultation and diagnosis. Your
          exact quote will be confirmed after examination.
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Clinical cases                                                       */
/* ------------------------------------------------------------------ */

const CLINICAL_CASES = [
  "/assets/patient-case-01-hq.webp",
  "/assets/patient-case-02-hq.webp",
  "/assets/patient-case-03-hq.webp",
]

function ClinicalCasesSection() {
  const { t } = useI18n()

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="font-body text-sm font-semibold uppercase tracking-wide text-[#009182]">
            {t("Clinical cases")}
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#12253A] sm:text-4xl">
            {t("Precision you can see")}
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-[#5F6F79]">
            {t("Selected clinical photographs from treatments performed at Qdent.")}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {CLINICAL_CASES.map((src, index) => (
            <figure
              key={src}
              className="group overflow-hidden rounded-[16px] border border-border/70 bg-[#F2F8F7] shadow-sm"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={src}
                  alt={t("Clinical dental case {number}", { number: index + 1 })}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[250ms] motion-reduce:transition-none group-hover:scale-[1.03]"
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Reviews                                                              */
/* ------------------------------------------------------------------ */

function ReviewsSection() {
  const [index, setIndex] = useState(0)
  const visible = [0, 1, 2].map((i) => TESTIMONIALS[(index + i) % TESTIMONIALS.length])

  const prev = () =>
    setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const next = () => setIndex((i) => (i + 1) % TESTIMONIALS.length)

  return (
    <section id="reviews" className="scroll-mt-24 bg-[#F2F8F7] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <span className="font-body text-sm font-semibold uppercase tracking-wide text-[#009182]">
              Patient reviews
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#12253A] sm:text-4xl">
              What our patients say
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous review"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-white text-[#12253A] transition-colors duration-200 hover:border-[#009182] hover:text-[#009182] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009182]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next review"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-white text-[#12253A] transition-colors duration-200 hover:border-[#009182] hover:text-[#009182] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009182]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((t, i) => (
            <article
              key={`${t.name}-${i}`}
              className="flex flex-col rounded-[16px] border border-border/70 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <Quote className="h-6 w-6 text-[#009182]/40" />
              <p className="mt-4 flex-1 font-body text-sm leading-relaxed text-[#12253A]">
                “{t.quote}”
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-[#12253A]/10 pt-4">
                <div>
                  <p className="font-heading text-sm font-semibold text-[#12253A]">
                    {t.name}
                  </p>
                  <p className="font-body text-xs text-[#5F6F79]">
                    {t.category}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 text-[#F5A623]">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Appointment CTA                                                      */
/* ------------------------------------------------------------------ */

interface AppointmentFormState {
  name: string
  phone: string
  email: string
  date: string
  service: string
  note: string
}

type FormStatus = "idle" | "loading" | "success" | "error"

const APPOINTMENT_ENDPOINT =
  import.meta.env.VITE_APPS_SCRIPT_URL?.trim() ||
  "https://script.google.com/macros/s/AKfycbzpPL5IJbLw9q996Oa_qaOvSsJgE5k4lpXc6ZxW3gKFtA-iXgNqlccxtQKf4H7GjW_W/exec"

function AppointmentSection() {
  const { t } = useI18n()
  const [form, setForm] = useState<AppointmentFormState>({
    name: "",
    phone: "",
    email: "",
    date: "",
    service: "",
    note: "",
  })
  const [errors, setErrors] = useState<Partial<AppointmentFormState>>({})
  const [status, setStatus] = useState<FormStatus>("idle")
  const [submitError, setSubmitError] = useState("")

  const update = (field: keyof AppointmentFormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const validate = (): boolean => {
    const next: Partial<AppointmentFormState> = {}
    if (!form.name.trim()) next.name = "Please enter your full name."
    if (!form.phone.trim()) next.phone = "Please enter a phone number."
    if (!form.email.trim()) next.email = "Please enter an email address."
    if (!form.date) next.date = "Please select a preferred date."
    if (!form.service) next.service = "Please select a service."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      setSubmitError("Please correct the highlighted fields before submitting.")
      setStatus("error")
      return
    }

    setSubmitError("")
    setStatus("loading")

    try {
      const response = await fetch(APPOINTMENT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: new URLSearchParams({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          preferredDate: form.date,
          service: form.service,
          note: form.note.trim(),
          source: "Qdent website",
        }),
      })
      const result = (await response.json()) as { ok?: boolean; error?: string }
      if (!response.ok || result.ok !== true) {
        throw new Error(result.error || `Request failed with status ${response.status}`)
      }
      setStatus("success")
    } catch (error) {
      console.error("Appointment submission failed", error)
      setSubmitError("The request could not be sent. Please try again or contact us by phone.")
      setStatus("error")
    }
  }

  const resetForm = () => {
    setForm({ name: "", phone: "", email: "", date: "", service: "", note: "" })
    setErrors({})
    setSubmitError("")
    setStatus("idle")
  }

  return (
    <section
      id="appointment"
      className="scroll-mt-24 bg-[#009182] py-20 text-white sm:py-28"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8">
        <div>
          <span className="font-body text-sm font-semibold uppercase tracking-wide text-white/80">
            Book your visit
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Ready for a calmer dental experience?
          </h2>
          <p className="mt-4 max-w-md font-body text-base leading-relaxed text-white/85">
            Tell us a little about what you need, and our team will confirm
            your appointment within one business day.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-white/80" />
              <span className="font-body text-sm">+421 903 760 901</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-white/80" />
              <span className="font-body text-sm">ordinacia@qdent.sk</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-white/80" />
              <span className="font-body text-sm">Mon–Fri, 8:00–18:00</span>
            </div>
          </div>
        </div>

        <div className="rounded-[16px] bg-white p-6 shadow-xl sm:p-8">
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#009182]/10 text-[#009182]">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <h3 className="mt-5 font-heading text-xl font-semibold text-[#12253A]">
                Request received
              </h3>
              <p className="mt-2 max-w-sm font-body text-sm leading-relaxed text-[#5F6F79]">
                 {t("Thank you, {name}. Our team will contact you shortly to confirm your appointment.", { name: form.name || t("there") })}
              </p>
              <Button
                onClick={resetForm}
                variant="outline"
                className="mt-6 h-11 rounded-[12px] border-[#12253A]/20 text-[#12253A] hover:border-[#009182] hover:text-[#009182]"
              >
                Book another appointment
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="qdent-name" className="text-[#12253A]">
                    Full name
                  </Label>
                  <Input
                    id="qdent-name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Jana Nováková"
                    aria-invalid={!!errors.name}
                    className="h-11 rounded-[10px] bg-white text-[#12253A] caret-[#009182] placeholder:text-[#7A8891]"
                  />
                  {errors.name && (
                    <p className="font-body text-xs text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="qdent-phone" className="text-[#12253A]">
                    Phone number
                  </Label>
                  <Input
                    id="qdent-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+421 900 000 000"
                    aria-invalid={!!errors.phone}
                    className="h-11 rounded-[10px] bg-white text-[#12253A] caret-[#009182] placeholder:text-[#7A8891]"
                  />
                  {errors.phone && (
                    <p className="font-body text-xs text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="qdent-email" className="text-[#12253A]">
                  Email address
                </Label>
                <Input
                  id="qdent-email"
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="jana@example.com"
                  aria-invalid={!!errors.email}
                  className="h-11 rounded-[10px] bg-white text-[#12253A] caret-[#009182] placeholder:text-[#7A8891]"
                />
                {errors.email && (
                  <p className="font-body text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="qdent-date" className="text-[#12253A]">
                    Preferred date
                  </Label>
                  <Input
                    id="qdent-date"
                    type="date"
                    value={form.date}
                    onChange={(e) => update("date", e.target.value)}
                    aria-invalid={!!errors.date}
                    className="h-11 rounded-[10px] bg-white text-[#12253A] caret-[#009182] placeholder:text-[#7A8891]"
                  />
                  {errors.date && (
                    <p className="font-body text-xs text-red-600">{errors.date}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="qdent-service" className="text-[#12253A]">
                    Service
                  </Label>
                  <Select
                    value={form.service}
                    onValueChange={(v) => update("service", v)}
                  >
                    <SelectTrigger
                      id="qdent-service"
                      className="h-11 rounded-[10px] bg-white text-[#12253A] data-[placeholder]:text-[#7A8891]"
                    >
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.service && (
                    <p className="font-body text-xs text-red-600">{errors.service}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="qdent-note" className="text-[#12253A]">
                  Additional notes (optional)
                </Label>
                <Textarea
                  id="qdent-note"
                  value={form.note}
                  onChange={(e) => update("note", e.target.value)}
                  placeholder="Tell us anything that might help us prepare for your visit."
                  className="min-h-[88px] rounded-[10px] bg-white text-[#12253A] caret-[#009182] placeholder:text-[#7A8891]"
                />
              </div>

              {status === "error" && (
                <p className="font-body text-sm text-red-600">
                  {submitError}
                </p>
              )}

              <Button
                type="submit"
                disabled={status === "loading"}
                className="h-12 w-full rounded-[12px] bg-[#009182] font-body text-base font-semibold text-white hover:bg-[#00786d]"
              >
                {status === "loading" ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending request…
                  </span>
                ) : (
                  "Request appointment"
                )}
              </Button>
              <p className="text-center font-body text-xs leading-relaxed text-[#5F6F79]">
                Odoslaním formulára súhlasíte so spracovaním osobných údajov podľa{" "}
                <a
                  href="/privacy"
                  className="font-semibold text-[#009182] underline-offset-2 hover:underline"
                >
                  zásad ochrany osobných údajov
                </a>
                .
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Contact                                                              */
/* ------------------------------------------------------------------ */

function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="font-body text-sm font-semibold uppercase tracking-wide text-[#009182]">
              Contact
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#12253A] sm:text-4xl">
              Visit our clinic in Bratislava
            </h2>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#009182]" />
                <div>
                  <p className="font-body text-sm font-semibold text-[#12253A]">
                    Address
                  </p>
                  <p className="font-body text-sm text-[#5F6F79]">
                    {CLINIC_ADDRESS}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#009182]" />
                <div>
                  <p className="font-body text-sm font-semibold text-[#12253A]">
                    Phone
                  </p>
                  <a
                    href="tel:+421903760901"
                    className="font-body text-sm text-[#5F6F79] hover:text-[#009182]"
                  >
                    +421 903 760 901
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#009182]" />
                <div>
                  <p className="font-body text-sm font-semibold text-[#12253A]">
                    Email
                  </p>
                  <a
                    href="mailto:ordinacia@qdent.sk"
                    className="font-body text-sm text-[#5F6F79] hover:text-[#009182]"
                  >
                    ordinacia@qdent.sk
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#009182]" />
                <div>
                  <p className="font-body text-sm font-semibold text-[#12253A]">
                    Working hours
                  </p>
                  <p className="font-body text-sm text-[#5F6F79]">
                    Mon–Thu: 8:00–18:00 · Fri: 8:00–14:00
                  </p>
                </div>
              </div>
            </div>

            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-1.5 font-body text-sm font-semibold text-[#009182] transition-colors duration-200 hover:text-[#00786d]"
            >
              Get directions
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[16px] border border-border/70 shadow-sm lg:aspect-auto lg:h-full">
            <iframe
              title="Qdent clinic location map"
              src={GOOGLE_MAPS_EMBED_URL}
              className="h-full min-h-[320px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */

function SiteFooter() {
  const { locale, setLocale, t } = useI18n()
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border/60 bg-[#12253A] py-14 text-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="#home" aria-label="Qdent — Home" className="inline-flex rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58d8cc]">
              <img src={qdentLogo} alt="Qdent" className="h-[40px] w-auto" />
            </a>
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-white/60">
              Modern dental care in Bratislava — precise, transparent and
              genuinely welcoming.
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Qdent on Instagram"
              className="mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors duration-200 hover:border-[#009182] hover:text-[#009182]"
            >
              <Camera className="h-4 w-4" />
            </a>
          </div>

          <div>
            <p className="font-heading text-sm font-semibold text-white">
              Navigation
            </p>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="font-body text-sm text-white/60 transition-colors duration-200 hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-heading text-sm font-semibold text-white">
              Contact
            </p>
            <ul className="mt-4 space-y-3 font-body text-sm text-white/60">
              <li>Gorkého 1, 811 01 Bratislava</li>
              <li>
                <a href="tel:+421903760901" className="hover:text-white">
                  +421 903 760 901
                </a>
              </li>
              <li>
                <a href="mailto:ordinacia@qdent.sk" className="hover:text-white">
                  ordinacia@qdent.sk
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-heading text-sm font-semibold text-white">
              Language
            </p>
            <ul className="mt-4 flex gap-3 font-body text-sm text-white/60">
              {locales.map((l) => (
                <li key={l}>
                  <button onClick={() => setLocale(l)} aria-label={`${t("Switch language to")} ${localeLabels[l]}`} aria-current={locale === l ? "true" : undefined} className="transition-colors duration-200 hover:text-white aria-[current=true]:text-white aria-[current=true]:underline">
                    {localeLabels[l]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="font-body text-xs text-white/50">
             © {year} Qdent. {t("All rights reserved.")}
          </p>
          <a
            href="/privacy"
            className="font-body text-xs text-white/50 transition-colors duration-200 hover:text-white"
          >
            Ochrana osobných údajov
          </a>
        </div>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/* Privacy policy                                                       */
/* ------------------------------------------------------------------ */

function PrivacyPolicyPage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = "Ochrana osobných údajov | Qdent"
    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#F7FAFA] font-body text-[#12253A]">
      <FontLoader />
      <header className="border-b border-[#12253A]/10 bg-[#12253A] text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <a href="/" aria-label="Qdent — domov" className="inline-flex rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58d8cc]">
            <img src={qdentLogo} alt="Qdent" className="h-10 w-auto" />
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-[10px] border border-white/20 px-4 py-2 font-body text-sm font-semibold transition-colors hover:border-[#58d8cc] hover:text-[#58d8cc]"
          >
            <ArrowLeft className="h-4 w-4" />
            Späť na stránku
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <article className="rounded-[20px] border border-[#12253A]/10 bg-white p-6 shadow-sm sm:p-10 lg:p-12">
          <div className="max-w-3xl">
            <Badge className="mb-4 rounded-full bg-[#009182]/10 px-3 py-1 text-[#00786d] hover:bg-[#009182]/10">
              Qdent
            </Badge>
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Ochrana osobných údajov
            </h1>
            <p className="mt-5 text-base leading-7 text-[#5F6F79]">
              Ochranu osobných údajov berieme vážne a je pre nás dôležité, aby vaše osobné údaje boli v bezpečí. Všetky osobné údaje, ktoré sú získavané počas vašej návštevy na našich stránkach sú spracovávané v súlade so zákonom č. 122/2013 Z.z. (ďalej len „zákon o ochrane osobných údajov“). Dobrovoľným vyplnením vašich osobných údajov nám týmto dávate súhlas s ich spracovaním v súlade so zákonom o ochrane osobných údajov.
            </p>
          </div>

          <div className="mt-10 max-w-3xl space-y-10 text-[15px] leading-7 text-[#44545F]">
            <section>
              <h2 className="font-heading text-xl font-semibold text-[#12253A]">Aké údaje uchovávame?</h2>
              <p className="mt-3">Počas vašej návštevy stránok ALICA PLUS, s.r.o. zaznamenávame IP adresu, ktorú vám pridelil váš poskytovateľ internetu, z akých stránok ste navštívili našu stránku, ako dlho ste na našej stránke, ktoré konkrétne podstránky si prezeráte a pod. Tieto informácie nie sú považované za osobné a ani nie sú prepojené s vašimi osobnými údajmi.</p>
              <p className="mt-3">Vaše osobné údaje zadávate dobrovoľne do rôznych formulárov na našich stránkach: registračné formuláre, komentáre, recenzie. Najčastejšie uchovávame tieto osobné údaje: meno, email. Ak chcete vedieť, ktoré konkrétne údaje uchovávame k vašej osobe, radi vám ich na požiadanie poskytneme písomne. Pokiaľ by i napriek našej snahe o aktuálnosť údajov boli niektoré záznamy nesprávne, radi ich opravíme.</p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-[#12253A]">Cookies</h2>
              <p className="mt-3">Používame cookies v spolupráci s našim reklamným partnerom Google Inc. k tomu, aby sme zistili preferencie návštevníkov web stránok a vedeli na základe toho prispôsobiť našu ponuku na mieru konkrétnemu návštevníkovi. Cookies sa môžu používať k tomu, aby sme zistili, či už ste naše stránky z vášho počítača niekedy navštívili. Cookies sú textové súbory, ktoré uloží váš internetový prehliadač na váš disk v počítači. Ak si neprajete cookies ukladať, môžete ich deaktivovať vo vašom internetovom prehliadači.</p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-[#12253A]">Na čo tieto informácie používame?</h2>
              <p className="mt-3">Informácie, ktoré spracovávame môžu byť použité na niektorú z nižšie uvedených činností:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-[#009182]">
                <li><strong className="text-[#12253A]">Personalizovanie reklamy</strong> – vaše informácie nám pomáhajú prispôsobiť reklamy vašim individuálnym potrebám.</li>
                <li><strong className="text-[#12253A]">Zlepšenie web stránky</strong> – pravidelne vylepšujeme našu web stránku na základe informácií a spätnej väzby, ktorú nám dávate.</li>
                <li><strong className="text-[#12253A]">Na odosielanie emailov</strong> – emailová adresa, ktorú ste zadali na našich stránkach môže byť použitá na odosielanie noviniek, rád, tipov a trikov, informácie o pripravovaných akciách, atď. Ak sa budete chcieť kedykoľvek odhlásiť z odoberania emailov, stačí, ak kliknete na odhlasovací odkaz, ktorý je umiestnený v emaily, alebo nám napíšte a my vás odhlásime.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-[#12253A]">Ste v bezpečí</h2>
              <p className="mt-3">Je pre nás prvoradé, aby vaše osobné údaje boli v bezpečí. Implementovali sme rôzne bezpečnostné systémy na ochranu údajov. S vylepšovaním technológií vylepšujeme aj tieto bezpečnostné systémy.</p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-[#12253A]">Odkazy tretích strán</h2>
              <p className="mt-3">Niekedy na našich stránkach odkazujeme na služby a produkty tretích strán. Webstránky týchto tretích strán majú vlastné podmienky ochrany osobných údajov a sú nezávislé na našich. Z toho dôvodu nenesieme žiadnu právnu zodpovednosť za obsah a aktivity týchto tretích strán. I napriek tomu je našou snahou udržať vysokú úroveň bezpečnosti. Preto, ak máte akékoľvek podozrenie na nekalé chovanie týchto tretích strán, kontaktujte nás na e-mailovej adrese <a href="mailto:ordinacia@qdent.sk" className="font-semibold text-[#009182] hover:underline">ordinacia@qdent.sk</a>.</p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-[#12253A]">Neposkytujeme vaše údaje tretím stranám</h2>
              <p className="mt-3">Nepredávame, neobchodujeme ani žiadnym iným spôsobom neposkytujeme vaše osobné údaje tretím stranám. Odovzdanie vašich osobných údajov štátnym organizáciám je len na základe riadne vystavených a právoplatných právnych rozhodnutí v súlade so zákonom Slovenskej republiky.</p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-[#12253A]">Zmeny v podmienkach o ochrane osobných údajov</h2>
              <p className="mt-3">Ak sa rozhodneme zmeniť podmienky o ochrane osobných údajov, uverejníme ich na tejto stránke.</p>
              <p className="mt-3 font-semibold text-[#12253A]">Tieto podmienky sú platné od 01.07.2023.</p>
            </section>

            <section className="rounded-[16px] bg-[#009182]/8 p-5 sm:p-6">
              <h2 className="font-heading text-xl font-semibold text-[#12253A]">Kontaktujte nás</h2>
              <p className="mt-3">Ak máte akékoľvek otázky alebo podnety, napíšte nám.</p>
              <address className="mt-4 not-italic text-[#12253A]">
                <strong>ALICA PLUS, s.r.o.</strong><br />
                Gorkého 1<br />
                811 01 Bratislava – mestská časť Staré Mesto<br />
                Slovenská republika<br />
                <a href="mailto:ordinacia@qdent.sk" className="mt-2 inline-block font-semibold text-[#009182] hover:underline">ordinacia@qdent.sk</a>
              </address>
            </section>
          </div>
        </article>
      </main>

      <footer className="border-t border-white/10 bg-[#12253A] py-8 text-center text-sm text-white/60">
        © {new Date().getFullYear()} Qdent. Všetky práva vyhradené.
      </footer>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Main page                                                            */
/* ------------------------------------------------------------------ */

function QdentHomepage() {
  return (
    <div className="font-body min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      <FontLoader />
      <SiteHeader />
      <main>
        <HeroSection />
        <TrustBenefitsSection />
        <ServicesSection />
        <AboutSection />
        <TechnologySection />
        <DoctorsSection />
        <ProcessSection />
        <PricesSection />
        <ClinicalCasesSection />
        <ReviewsSection />
        <AppointmentSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  )
}

function QdentApp() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/"
  if (path === "/privacy" || path === "/ochrana-osobnych-udajov") {
    return <PrivacyPolicyPage />
  }
  return <QdentHomepage />
}

export default QdentApp



