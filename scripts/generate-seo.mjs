import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const seo = JSON.parse(fs.readFileSync(path.join(root, "src", "seo-content.json"), "utf8"))
const richContent = JSON.parse(fs.readFileSync(path.join(root, "src", "seo-rich-content.json"), "utf8"))
const xmlEscape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;")
const htmlEscape = xmlEscape
const publicPath = (pagePath) => `${pagePath}/`
const prerenderGuard = `<style id="qdent-prerender-guard">html,body{margin:0;min-height:100%;background:#f7faf9}[data-prerendered-seo]{visibility:hidden}</style><noscript><style>[data-prerendered-seo]{visibility:visible!important}</style></noscript>`

const alternatesFor = (page) => seo.pages
  .filter((candidate) => candidate.kind === page.kind && candidate.key === page.key)
  .map((candidate) => `<xhtml:link rel="alternate" hreflang="${candidate.locale === "ukr" ? "uk" : candidate.locale}" href="${seo.siteUrl}${publicPath(candidate.path)}" />`)
  .join("")

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${seo.pages.map((page) => `<url><loc>${seo.siteUrl}${publicPath(page.path)}</loc>${alternatesFor(page)}<changefreq>${page.kind === "home" ? "weekly" : "monthly"}</changefreq><priority>${page.kind === "home" ? "1.0" : page.kind === "service" ? "0.8" : "0.7"}</priority></url>`).join("\n")}
</urlset>
`
fs.writeFileSync(path.join(root, "public", "sitemap.xml"), sitemap)
fs.writeFileSync(path.join(root, "public", "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${seo.siteUrl}/sitemap.xml\n`)
const redirects = [
  "/ /sk 301!",
  ...seo.pages.flatMap((page) => [
    `${page.path} ${page.path}/index.html 200`,
    `${page.path}/ ${page.path}/index.html 200`,
  ]),
  "/privacy /index.html 200",
  "/ochrana-osobnych-udajov /index.html 200",
  "/* /404.html 404",
  "",
].join("\n")
fs.writeFileSync(path.join(root, "public", "_redirects"), redirects)

if (!process.argv.includes("--dist")) {
  console.log(`SEO_SOURCE_OK pages=${seo.pages.length} sitemap=public/sitemap.xml`)
  process.exit(0)
}

const dist = path.join(root, "dist")
const shell = fs.readFileSync(path.join(dist, "index.html"), "utf8")
for (const page of seo.pages) {
  const equivalents = seo.pages.filter((candidate) => candidate.kind === page.kind && candidate.key === page.key)
  const alternates = equivalents.map((candidate) => `<link rel="alternate" hreflang="${candidate.locale === "ukr" ? "uk" : candidate.locale}" href="${seo.siteUrl}${publicPath(candidate.path)}">`).join("")
  const defaultPage = equivalents.find((candidate) => candidate.locale === "sk")
  const rich = richContent[page.locale]
  const fill = (value) => value.replace("{title}", page.h1)
  const primarySchema = page.kind === "profile"
    ? { "@type": "Person", name: page.h1, description: page.intro, url: `${seo.siteUrl}${publicPath(page.path)}`, image: page.image ? `${seo.siteUrl}${page.image}` : undefined, worksFor: { "@type": "Dentist", name: "Q-Dent", url: seo.siteUrl } }
    : { "@type": page.kind === "home" ? "Dentist" : "MedicalWebPage", name: page.h1, description: page.description, url: `${seo.siteUrl}${publicPath(page.path)}`, provider: { "@type": "Dentist", name: "Q-Dent", telephone: "+421903760901", address: { "@type": "PostalAddress", streetAddress: "Gorkého 1", postalCode: "811 01", addressLocality: "Bratislava", addressRegion: "Staré Mesto", addressCountry: "SK" } } }
  const schema = { "@context": "https://schema.org", "@graph": [primarySchema, { "@type": "FAQPage", mainEntity: rich.faq.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Q-Dent", item: `${seo.siteUrl}/${page.locale}/` }, { "@type": "ListItem", position: 2, name: page.h1, item: `${seo.siteUrl}${publicPath(page.path)}` }] }] }
  const richSections = `<section><h2>${htmlEscape(page.kind === "profile" ? rich.profileTitle : rich.overviewTitle)}</h2><p>${htmlEscape(fill(page.kind === "profile" ? rich.profileText : rich.overview))}</p><h2>${htmlEscape(rich.processTitle)}</h2><p>${htmlEscape(rich.process)}</p><h2>${htmlEscape(rich.locationTitle)}</h2><p>${htmlEscape(rich.location)}</p><a href="https://www.google.com/maps/search/?api=1&amp;query=Q-Dent%2C%20Gork%C3%A9ho%201%2C%20Bratislava">Google Maps</a><h2>${htmlEscape(rich.faqTitle)}</h2>${rich.faq.map(([question, answer]) => `<h3>${htmlEscape(question)}</h3><p>${htmlEscape(answer)}</p>`).join("")}</section>`
  const content = `<main data-prerendered-seo="true"><article><p>Bratislava · Staré Mesto</p><h1>${htmlEscape(page.h1)}</h1><p>${htmlEscape(page.intro)}</p>${page.items.length ? `<h2>${htmlEscape(seo.languages[page.locale].servicesLabel)}</h2><ul>${page.items.map((item) => `<li>${htmlEscape(item)}</li>`).join("")}</ul>` : ""}${richSections}<address>Q-Dent, Gorkého 1, 811 01 Staré Mesto, Bratislava · +421 903 760 901</address></article></main>`
  let html = shell
    .replace(/<html lang="[^"]*">/, `<html lang="${page.locale === "ukr" ? "uk" : page.locale}">`)
    .replace(/<title>.*?<\/title>/, `<title>${htmlEscape(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${htmlEscape(page.description)}">`)
    .replace("</head>", `${prerenderGuard}<link rel="canonical" href="${seo.siteUrl}${publicPath(page.path)}">${alternates}<link rel="alternate" hreflang="x-default" href="${seo.siteUrl}${publicPath(defaultPage?.path ?? "/sk")}"><meta property="og:title" content="${htmlEscape(page.title)}"><meta property="og:description" content="${htmlEscape(page.description)}"><meta property="og:url" content="${seo.siteUrl}${publicPath(page.path)}"><meta property="og:type" content="${page.kind === "profile" ? "profile" : "website"}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${htmlEscape(page.title)}"><meta name="twitter:description" content="${htmlEscape(page.description)}"><script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script></head>`)
    .replace('<div id="root"></div>', `<div id="root">${content}</div>`)
  const target = path.join(dist, page.path.slice(1), "index.html")
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, html)
}
fs.writeFileSync(path.join(dist, "404.html"), shell.replace(/<title>.*?<\/title>/, "<title>Page not found | Q-Dent</title>").replace('<div id="root"></div>', '<div id="root"><main><h1>404</h1><p>Page not found.</p><a href="/sk/">Q-Dent</a></main></div>'))
fs.copyFileSync(path.join(root, "public", "sitemap.xml"), path.join(dist, "sitemap.xml"))
fs.copyFileSync(path.join(root, "public", "robots.txt"), path.join(dist, "robots.txt"))
fs.copyFileSync(path.join(root, "public", "_redirects"), path.join(dist, "_redirects"))
console.log(`SEO_PRERENDER_OK pages=${seo.pages.length} sitemap=dist/sitemap.xml`)
