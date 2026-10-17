import { createHash } from "node:crypto"
import { readFile, writeFile } from "node:fs/promises"
import { basename } from "node:path"

const cloudinaryUrl = process.env.CLOUDINARY_URL
if (!cloudinaryUrl) throw new Error("CLOUDINARY_URL is required")

const credentials = new URL(cloudinaryUrl)
const cloudName = credentials.hostname
const apiKey = decodeURIComponent(credentials.username)
const apiSecret = decodeURIComponent(credentials.password)

const assets = [
  ["C:/Users/wake/Downloads/Telegram Desktop/DSC06691.jpg", "qdent/team/vitaliy"],
  ["C:/Users/wake/Downloads/Telegram Desktop/барбора.jpg", "qdent/team/barbora"],
  ["C:/Users/wake/Downloads/Telegram Desktop/влада ассистент.jpg", "qdent/team/vlada"],
  ["C:/Users/wake/Downloads/Telegram Desktop/тамара.jpg", "qdent/team/tamara"],
  ["C:/Users/wake/Downloads/Telegram Desktop/хирургия.jpg", "qdent/services/surgery"],
  ["C:/Users/wake/Downloads/photo_2026-10-05_22-54-29.jpg", "qdent/services/prosthetics"],
  ["C:/Users/wake/Downloads/photo_2026-10-05_22-55-12.jpg", "qdent/services/digital-diagnostics"],
]

const uploaded = {}
for (const [path, publicId] of assets) {
  const timestamp = Math.floor(Date.now() / 1000)
  const signature = createHash("sha1")
    .update(`overwrite=true&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex")
  const form = new FormData()
  form.append("file", new Blob([await readFile(path)]), basename(path))
  form.append("api_key", apiKey)
  form.append("timestamp", String(timestamp))
  form.append("public_id", publicId)
  form.append("overwrite", "true")
  form.append("signature", signature)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form,
  })
  const result = await response.json()
  if (!response.ok) throw new Error(`${publicId}: ${result.error?.message ?? response.statusText}`)
  uploaded[publicId] = result.secure_url
  console.log(`${publicId} -> ${result.secure_url}`)
}

await writeFile("cloudinary-assets.json", `${JSON.stringify({ cloudName, assets: uploaded }, null, 2)}\n`)
