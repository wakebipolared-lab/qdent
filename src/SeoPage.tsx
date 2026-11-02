import * as React from "react"
import { ArrowLeft, ArrowRight, MapPin, Phone } from "lucide-react"
import seo from "./seo-content.json"
import { type Locale, useI18n } from "./i18n"

type SeoPageRecord = (typeof seo.pages)[number]

export function findSeoPage(pathname: string): SeoPageRecord | undefined {
  const path = pathname.replace(/\/+$/, "") || "/"
  return seo.pages.find((page) => page.path === path)
}

export function SeoPage({ page }: { page: SeoPageRecord }) {
  const { locale, setLocale } = useI18n()
  const labels = seo.languages[page.locale as Locale]
  const related = seo.pages.filter((candidate) =>
    candidate.locale === page.locale && candidate.kind === (page.kind === "profile" ? "profile" : "service"),
  )

  React.useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": page.kind === "profile" ? "Person" : page.kind === "service" ? "MedicalWebPage" : "Dentist",
      name: page.h1,
      description: page.description,
      url: `${seo.siteUrl}${page.path}`,
      ...(page.kind === "profile" ? {
        image: page.image ? `${seo.siteUrl}${page.image}` : undefined,
        worksFor: { "@type": "Dentist", name: "Q-Dent", url: seo.siteUrl },
      } : {
        provider: {
          "@type": "Dentist",
          name: "Q-Dent",
          telephone: "+421903760901",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Gorkého 1",
            postalCode: "811 01",
            addressLocality: "Bratislava",
            addressRegion: "Staré Mesto",
            addressCountry: "SK",
          },
        },
      }),
    }
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.dataset.qdentSeo = "true"
    script.textContent = JSON.stringify(schema)
    document.head.querySelectorAll('script[data-qdent-seo="true"]').forEach((node) => node.remove())
    document.head.appendChild(script)
    return () => script.remove()
  }, [page])

  const switchLanguage = (next: Locale) => {
    const equivalent = seo.pages.find((candidate) => candidate.locale === next && candidate.kind === page.kind && candidate.key === page.key)
    if (equivalent) window.history.pushState({}, "", equivalent.path)
    setLocale(next)
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-[#F7FAF9] text-[#12253A]">
      <header className="border-b border-[#DDE8E6] bg-[#009182]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href={`/${page.locale}`} aria-label="Q-Dent homepage">
            <img src="/assets/logo-web.svg" alt="Q-Dent" className="h-10 w-auto" />
          </a>
          <div className="flex items-center gap-2" aria-label="Language versions">
            {(["sk", "en", "de", "ru", "ukr"] as Locale[]).map((code) => (
              <button key={code} onClick={() => switchLanguage(code)} className={`rounded-md px-2 py-1 text-xs font-semibold ${locale === code ? "bg-white text-[#009182]" : "text-white/85 hover:bg-white/10"}`}>
                {code === "ukr" ? "UKR" : code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-[#DDE8E6] bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[#5F6F79]">
              <a href={`/${page.locale}`} className="hover:text-[#009182]">Q-Dent</a>
              <span aria-hidden="true"> / </span><span>{page.h1}</span>
            </nav>
            <div className="grid items-center gap-10 md:grid-cols-[1fr_auto]">
              <div className="max-w-3xl">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#009182]">Bratislava · Staré Mesto</p>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{page.h1}</h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5F6F79]">{page.intro}</p>
              </div>
              {page.image && <img src={page.image} alt={page.h1} className="h-56 w-44 rounded-2xl object-cover shadow-md" />}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          {page.items.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold">{labels.servicesLabel}</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {page.items.map((item) => <li key={item} className="rounded-xl border border-[#DDE8E6] bg-white p-4 text-[#40535E]">{item}</li>)}
              </ul>
              <p className="mt-6 text-sm leading-6 text-[#5F6F79]">{labels.notice}</p>
            </div>
          )}

          <div className="mt-14 rounded-2xl bg-[#12253A] p-7 text-white sm:p-9">
            <h2 className="text-2xl font-bold">Q-Dent · Gorkého 1</h2>
            <p className="mt-3 flex items-center gap-2 text-white/75"><MapPin className="h-4 w-4" />811 01 Staré Mesto, Bratislava</p>
            <a href="tel:+421903760901" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#009182] px-5 py-3 font-semibold hover:bg-[#00786d]"><Phone className="h-4 w-4" />{labels.contact}</a>
          </div>

          {related.length > 1 && (
            <div className="mt-14">
              <h2 className="text-2xl font-bold">{page.kind === "profile" ? labels.teamLabel : labels.servicesLabel}</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {related.filter((item) => item.path !== page.path).map((item) => (
                  <a key={item.path} href={item.path} className="group flex items-center justify-between rounded-xl border border-[#DDE8E6] bg-white p-5 font-semibold hover:border-[#009182] hover:text-[#009182]">
                    {item.h1}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                ))}
              </div>
            </div>
          )}
          <a href={`/${page.locale}`} className="mt-12 inline-flex items-center gap-2 font-semibold text-[#009182]"><ArrowLeft className="h-4 w-4" />{labels.back}</a>
        </section>
      </main>
    </div>
  )
}
