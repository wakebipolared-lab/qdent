import * as React from "react"
import en from "../messages/en.json"
import sk from "../messages/sk.json"
import de from "../messages/de.json"
import ru from "../messages/ru.json"
import ukr from "../messages/ukr.json"

export const locales = ["sk", "en", "de", "ru", "ukr"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "sk"
export const htmlLanguage: Record<Locale, string> = { sk: "sk", en: "en", de: "de", ru: "ru", ukr: "uk" }
export const localeLabels: Record<Locale, string> = { sk: "SK", en: "EN", de: "DE", ru: "RU", ukr: "UKR" }

type Dictionary = Record<string, string>
const dictionaries: Record<Locale, Dictionary> = { sk, en, de, ru, ukr }
const isLocale = (value: string | undefined): value is Locale => locales.includes(value as Locale)

function localeFromPath(): Locale {
  const segment = window.location.pathname.split("/").filter(Boolean)[0]
  if (isLocale(segment)) return segment
  const saved = document.cookie.match(/(?:^|; )qdent_locale=([^;]+)/)?.[1]
  return isLocale(saved) ? saved : defaultLocale
}

function localizedPath(locale: Locale): string {
  const parts = window.location.pathname.split("/").filter(Boolean)
  if (isLocale(parts[0])) parts[0] = locale
  else parts.unshift(locale)
  return `/${parts.join("/")}${window.location.search}${window.location.hash}`
}

interface I18nValue {
  locale: Locale
  t: (source: string, values?: Record<string, string | number>) => string
  setLocale: (locale: Locale) => void
}

const I18nContext = React.createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, updateLocale] = React.useState<Locale>(localeFromPath)
  const originals = React.useRef(new WeakMap<Node, string>())
  const attributeOriginals = React.useRef(new WeakMap<Element, Map<string, string>>())

  const t = React.useCallback((source: string, values: Record<string, string | number> = {}) => {
    let result = dictionaries[locale][source] ?? dictionaries[defaultLocale][source] ?? source
    Object.entries(values).forEach(([key, value]) => { result = result.replaceAll(`{${key}}`, String(value)) })
    return result
  }, [locale])

  const setLocale = React.useCallback((next: Locale) => {
    document.cookie = `qdent_locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax`
    window.history.pushState({}, "", localizedPath(next))
    updateLocale(next)
    window.scrollTo({ top: window.scrollY })
  }, [])

  React.useEffect(() => {
    const pathLocale = localeFromPath()
    if (!isLocale(window.location.pathname.split("/").filter(Boolean)[0])) {
      window.history.replaceState({}, "", localizedPath(locale))
    } else if (pathLocale !== locale) updateLocale(pathLocale)
    const onPopState = () => updateLocale(localeFromPath())
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  React.useEffect(() => {
    document.documentElement.lang = htmlLanguage[locale]
    document.documentElement.dataset.locale = locale
    const title = t("Qdent | Modern dental clinic in Bratislava")
    const description = t("Modern dental care in Bratislava with precise diagnostics, transparent treatment and a personal approach.")
    document.title = title
    const setMeta = (selector: string, attribute: string, value: string) => {
      let element = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null
      if (!element) {
        element = document.createElement(selector.startsWith("link") ? "link" : "meta")
        const match = selector.match(/\[([^=]+)="([^"]+)"\]/)
        if (match) element.setAttribute(match[1], match[2])
        document.head.appendChild(element)
      }
      element.setAttribute(attribute, value)
    }
    setMeta('meta[name="description"]', "content", description)
    setMeta('meta[property="og:title"]', "content", title)
    setMeta('meta[property="og:description"]', "content", description)
    setMeta('meta[property="og:locale"]', "content", htmlLanguage[locale])
    setMeta('link[rel="canonical"]', "href", `${window.location.origin}${window.location.pathname}`)
    document.head.querySelectorAll('link[rel="alternate"][data-qdent-i18n]').forEach((node) => node.remove())
    locales.forEach((alternate) => {
      const link = document.createElement("link")
      link.rel = "alternate"
      link.hreflang = htmlLanguage[alternate]
      link.href = `${window.location.origin}${localizedPath(alternate).split(/[?#]/)[0]}`
      link.dataset.qdentI18n = "true"
      document.head.appendChild(link)
    })

    const translateTree = (root: Node) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      const nodes: Text[] = []
      while (walker.nextNode()) nodes.push(walker.currentNode as Text)
      nodes.forEach((node) => {
        const current = node.nodeValue ?? ""
        if (!current.trim()) return
        if (!originals.current.has(node)) originals.current.set(node, current)
        const original = originals.current.get(node) ?? current
        const normalized = original.replace(/\s+/g, " ").trim()
        const translated = t(normalized)
        if (translated !== normalized) node.nodeValue = original.replace(normalized, translated)
      })
      const elements = root instanceof Element ? [root, ...root.querySelectorAll("*")] : [...document.body.querySelectorAll("*")]
      elements.forEach((element) => {
        const attrs = ["aria-label", "alt", "title", "placeholder"]
        let saved = attributeOriginals.current.get(element)
        if (!saved) { saved = new Map(); attributeOriginals.current.set(element, saved) }
        attrs.forEach((attr) => {
          const value = element.getAttribute(attr)
          if (!value) return
          if (!saved!.has(attr)) saved!.set(attr, value)
          element.setAttribute(attr, t(saved!.get(attr)!))
        })
      })
    }
    translateTree(document.body)
    const observer = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => translateTree(node)))
    })
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [locale, t])

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const value = React.useContext(I18nContext)
  if (!value) throw new Error("useI18n must be used inside I18nProvider")
  return value
}
