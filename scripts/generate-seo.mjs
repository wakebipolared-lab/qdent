import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const seo = JSON.parse(fs.readFileSync(path.join(root, "src", "seo-content.json"), "utf8"))
const xmlEscape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;")
const htmlEscape = xmlEscape

const alternatesFor = (page) => seo.pages
  .filter((candidate) => candidate.kind === page.kind && candidate.key === page.key)
  .map((candidate) => `<xhtml:link rel="alternate" hreflang="${candidate.locale === "ukr" ? "uk" : candidate.locale}" href="${seo.siteUrl}${candidate.path}" />`)
  .join("")

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${seo.pages.map((page) => `<url><loc>${seo.siteUrl}${page.path}</loc>${alternatesFor(page)}<changefreq>${page.kind === "home" ? "weekly" : "monthly"}</changefreq><priority>${page.kind === "home" ? "1.0" : page.kind === "service" ? "0.8" : "0.7"}</priority></url>`).join("\n")}
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
  "/* /index.html 200",
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
  const alternates = equivalents.map((candidate) => `<link rel="alternate" hreflang="${candidate.locale === "ukr" ? "uk" : candidate.locale}" href="${seo.siteUrl}${candidate.path}">`).join("")
  const defaultPage = equivalents.find((candidate) => candidate.locale === "sk")
  const schema = page.kind === "profile"
    ? { "@context": "https://schema.org", "@type": "Person", name: page.h1, description: page.intro, url: `${seo.siteUrl}${page.path}`, image: page.image ? `${seo.siteUrl}${page.image}` : undefined, worksFor: { "@type": "Dentist", name: "Q-Dent", url: seo.siteUrl } }
    : { "@context": "https://schema.org", "@type": page.kind === "home" ? "Dentist" : "MedicalWebPage", name: page.h1, description: page.description, url: `${seo.siteUrl}${page.path}`, provider: { "@type": "Dentist", name: "Q-Dent", telephone: "+421903760901", address: { "@type": "PostalAddress", streetAddress: "Gorkého 1", postalCode: "811 01", addressLocality: "Bratislava", addressRegion: "Staré Mesto", addressCountry: "SK" } } }
  const content = `<main data-prerendered-seo="true"><article><p>Bratislava · Staré Mesto</p><h1>${htmlEscape(page.h1)}</h1><p>${htmlEscape(page.intro)}</p>${page.items.length ? `<h2>${htmlEscape(seo.languages[page.locale].servicesLabel)}</h2><ul>${page.items.map((item) => `<li>${htmlEscape(item)}</li>`).join("")}</ul>` : ""}<address>Q-Dent, Gorkého 1, 811 01 Staré Mesto, Bratislava · +421 903 760 901</address></article></main>`
  let html = shell
    .replace(/<html lang="[^"]*">/, `<html lang="${page.locale === "ukr" ? "uk" : page.locale}">`)
    .replace(/<title>.*?<\/title>/, `<title>${htmlEscape(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${htmlEscape(page.description)}">`)
    .replace("</head>", `<link rel="canonical" href="${seo.siteUrl}${page.path}">${alternates}<link rel="alternate" hreflang="x-default" href="${seo.siteUrl}${defaultPage?.path ?? "/sk"}"><meta property="og:title" content="${htmlEscape(page.title)}"><meta property="og:description" content="${htmlEscape(page.description)}"><meta property="og:url" content="${seo.siteUrl}${page.path}"><meta property="og:type" content="${page.kind === "profile" ? "profile" : "website"}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${htmlEscape(page.title)}"><meta name="twitter:description" content="${htmlEscape(page.description)}"><script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script></head>`)
    .replace('<div id="root"></div>', `<div id="root">${content}</div>`)
  const target = path.join(dist, page.path.slice(1), "index.html")
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, html)
}
fs.copyFileSync(path.join(root, "public", "sitemap.xml"), path.join(dist, "sitemap.xml"))
fs.copyFileSync(path.join(root, "public", "robots.txt"), path.join(dist, "robots.txt"))
fs.copyFileSync(path.join(root, "public", "_redirects"), path.join(dist, "_redirects"))
console.log(`SEO_PRERENDER_OK pages=${seo.pages.length} sitemap=dist/sitemap.xml`)
