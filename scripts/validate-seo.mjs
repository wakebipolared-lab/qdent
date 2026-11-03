import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const seo = JSON.parse(fs.readFileSync(path.join(root, "src", "seo-content.json"), "utf8"))
const failures = []
const titles = new Set()
const descriptions = new Set()
const redirects = fs.readFileSync(path.join(root, "dist", "_redirects"), "utf8")

for (const page of seo.pages) {
  if (!page.path.startsWith(`/${page.locale}`)) failures.push(`${page.path}: locale prefix mismatch`)
  if (titles.has(page.title)) failures.push(`${page.path}: duplicate title`)
  if (descriptions.has(page.description)) failures.push(`${page.path}: duplicate description`)
  titles.add(page.title)
  descriptions.add(page.description)
  for (const locale of ["sk", "en", "de", "ru", "ukr"]) {
    if (!seo.pages.some((candidate) => candidate.locale === locale && candidate.kind === page.kind && candidate.key === page.key)) failures.push(`${page.path}: missing ${locale} equivalent`)
  }
  const built = path.join(root, "dist", page.path.slice(1), "index.html")
  if (!fs.existsSync(built)) failures.push(`${page.path}: missing prerendered HTML`)
  else {
    const html = fs.readFileSync(built, "utf8")
    for (const needle of [`<title>${page.title}</title>`, `rel="canonical" href="${seo.siteUrl}${page.path}"`, `<h1>${page.h1}</h1>`, "application/ld+json", 'hreflang="x-default"']) {
      if (!html.includes(needle)) failures.push(`${page.path}: missing ${needle}`)
    }
  }
  if (!redirects.includes(`${page.path} ${page.path}/index.html 200`)) failures.push(`${page.path}: missing direct prerender rewrite`)
  if (!redirects.includes(`${page.path}/ ${page.path}/index.html 200`)) failures.push(`${page.path}: missing trailing-slash prerender rewrite`)
  if (redirects.includes(`${page.path} /index.html 200`)) failures.push(`${page.path}: prerender shadowed by generic SPA rewrite`)
}
const sitemap = fs.readFileSync(path.join(root, "dist", "sitemap.xml"), "utf8")
for (const page of seo.pages) if (!sitemap.includes(`<loc>${seo.siteUrl}${page.path}</loc>`)) failures.push(`${page.path}: absent from sitemap`)
if (failures.length) {
  console.error(failures.join("\n"))
  process.exit(1)
}
const htmlCount = fs.readdirSync(path.join(root, "dist"), { recursive: true }).filter((entry) => String(entry).endsWith("index.html")).length
if (htmlCount !== seo.pages.length + 1) {
  console.error(`Expected ${seo.pages.length + 1} HTML documents, found ${htmlCount}`)
  process.exit(1)
}
console.log(`SEO_CHECK_OK pages=${seo.pages.length} languages=5 unique_titles=${titles.size} unique_descriptions=${descriptions.size} canonicals=${seo.pages.length} sitemap_urls=${seo.pages.length} html_documents=${htmlCount} direct_route_rewrites=${seo.pages.length * 2}`)
