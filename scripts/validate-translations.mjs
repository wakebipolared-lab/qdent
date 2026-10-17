import { readFileSync } from "node:fs"
const locales = ["sk", "en", "de", "ru", "ukr"]
const dictionaries = Object.fromEntries(locales.map((locale) => [locale, JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"))]))
const reference = Object.keys(dictionaries.sk).sort()
let failed = false
for (const locale of locales.slice(1)) {
  const keys = Object.keys(dictionaries[locale]).sort()
  const missing = reference.filter((key) => !keys.includes(key))
  const extra = keys.filter((key) => !reference.includes(key))
  if (missing.length || extra.length) { failed = true; console.error(`${locale}: missing=${missing.length}, extra=${extra.length}`) }
  else console.log(`${locale}: ${keys.length} keys match sk`)
}
if (failed) process.exit(1)
console.log(`OK: ${reference.length} identical translation keys across ${locales.join(", ")}`)
