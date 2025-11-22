/**
 * Scraper pour importer les templates depuis scrnshts.club
 * Usage: node scripts/scrape-templates.js
 */

import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_URL = 'https://scrnshts.club'
const OUTPUT_DIR = path.join(__dirname, '../public/templates')
const DATA_DIR = path.join(__dirname, '../src/data/templates')

// Créer les dossiers si nécessaires
await fs.mkdir(OUTPUT_DIR, { recursive: true })
await fs.mkdir(DATA_DIR, { recursive: true })

/**
 * Scrape une page de galerie
 */
async function scrapePage(pageNum) {
  const url = pageNum === 1 ? BASE_URL : `${BASE_URL}/page/${pageNum}/`
  console.log(`📥 Scraping ${url}...`)
  
  const response = await fetch(url)
  const html = await response.text()
  const dom = new JSDOM(html)
  const doc = dom.window.document

  const packs = []
  const galleries = doc.querySelectorAll('.gallery-item')

  for (const gallery of galleries) {
    const linkEl = gallery.querySelector('a')
    const titleEl = gallery.querySelector('.gallery-title')
    const descEl = gallery.querySelector('.gallery-description')
    const statsEl = gallery.querySelector('.gallery-stats')
    
    if (!linkEl || !titleEl) continue

    const packUrl = linkEl.href
    const packId = packUrl.split('/').filter(Boolean).pop()
    const title = titleEl.textContent.trim()
    const description = descEl?.textContent.trim() || ''
    const screenshotCount = parseInt(statsEl?.textContent.match(/(\d+)/)?.[1] || '0')

    // Récupérer l'image de preview
    const imgEl = gallery.querySelector('img')
    const previewImage = imgEl?.src || ''

    packs.push({
      id: packId,
      title,
      description,
      screenshotCount,
      previewImage,
      sourceUrl: packUrl
    })
  }

  return packs
}

/**
 * Scrape les détails d'un pack (tous les écrans)
 */
async function scrapePackDetails(pack) {
  console.log(`  📱 Scraping pack: ${pack.title}`)
  
  const response = await fetch(pack.sourceUrl)
  const html = await response.text()
  const dom = new JSDOM(html)
  const doc = dom.window.document

  const screens = []
  const screenEls = doc.querySelectorAll('.screenshot-item')

  screenEls.forEach((screenEl, index) => {
    const imgEl = screenEl.querySelector('img')
    const captionEl = screenEl.querySelector('.screenshot-caption')
    
    const imageUrl = imgEl?.src || imgEl?.dataset.src || ''
    const caption = captionEl?.textContent.trim() || ''

    screens.push({
      id: `${pack.id}-screen-${index + 1}`,
      order: index + 1,
      imageUrl,
      caption,
      title: caption || `Screen ${index + 1}`,
      // Structure compatible avec votre format actuel
      media: {
        type: 'image',
        src: imageUrl
      },
      background: {
        type: 'solid',
        style: '#ffffff'
      },
      overlay: null,
      logo: { visible: false },
      editor: {
        fields: {
          media: true,
          title: true,
          subtitle: true,
          overlay: true,
          background: true,
          logo: true,
          mockup: false
        }
      }
    })
  })

  return {
    ...pack,
    screens
  }
}

/**
 * Télécharger une image
 */
async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()
    await fs.writeFile(filepath, Buffer.from(buffer))
    return true
  } catch (error) {
    console.error(`  ❌ Erreur téléchargement ${url}:`, error.message)
    return false
  }
}

/**
 * Convertir un pack en format compatible avec votre app
 */
function convertToAppFormat(pack) {
  return {
    packId: pack.id,
    name: pack.title,
    description: pack.description,
    previewImage: `/templates/${pack.id}/preview.jpg`,
    sourceUrl: pack.sourceUrl,
    screens: pack.screens.map(screen => ({
      id: screen.id,
      title: screen.title,
      subtitle: null,
      copy: null,
      media: {
        type: 'image',
        src: `/templates/${pack.id}/${screen.order}.jpg`
      },
      overlay: screen.overlay,
      logo: screen.logo,
      background: screen.background,
      editor: screen.editor
    }))
  }
}

/**
 * Main
 */
async function main() {
  console.log('🚀 Démarrage du scraping...\n')

  // Scraper les 3 premières pages (ajuste selon tes besoins)
  const allPacks = []
  for (let page = 1; page <= 3; page++) {
    const packs = await scrapePage(page)
    allPacks.push(...packs)
    console.log(`  ✅ Page ${page}: ${packs.length} packs trouvés\n`)
  }

  console.log(`\n📊 Total: ${allPacks.length} packs trouvés\n`)

  // Scraper les détails de chaque pack (limité à 5 pour le test)
  const detailedPacks = []
  for (const pack of allPacks.slice(0, 5)) {
    try {
      const detailed = await scrapePackDetails(pack)
      detailedPacks.push(detailed)
      
      // Créer le dossier pour ce pack
      const packDir = path.join(OUTPUT_DIR, pack.id)
      await fs.mkdir(packDir, { recursive: true })

      // Télécharger les images
      if (detailed.previewImage) {
        await downloadImage(detailed.previewImage, path.join(packDir, 'preview.jpg'))
      }

      for (const screen of detailed.screens) {
        if (screen.imageUrl) {
          await downloadImage(screen.imageUrl, path.join(packDir, `${screen.order}.jpg`))
        }
      }

      // Générer le JSON
      const appFormat = convertToAppFormat(detailed)
      const jsonPath = path.join(DATA_DIR, `${pack.id}.json`)
      await fs.writeFile(jsonPath, JSON.stringify(appFormat, null, 2))
      
      console.log(`  ✅ Pack "${pack.title}" exporté\n`)
    } catch (error) {
      console.error(`  ❌ Erreur pour "${pack.title}":`, error.message, '\n')
    }
  }

  // Créer l'index de tous les packs
  const index = {
    version: '1.0.0',
    lastUpdate: new Date().toISOString(),
    packs: detailedPacks.map(p => ({
      id: p.id,
      name: p.title,
      description: p.description,
      screenshotCount: p.screens.length,
      previewImage: `/templates/${p.id}/preview.jpg`,
      dataFile: `/data/templates/${p.id}.json`
    }))
  }

  const indexPath = path.join(DATA_DIR, 'index.json')
  await fs.writeFile(indexPath, JSON.stringify(index, null, 2))

  console.log(`\n✨ Terminé! ${detailedPacks.length} packs exportés`)
  console.log(`📁 Données: ${DATA_DIR}`)
  console.log(`🖼️  Images: ${OUTPUT_DIR}`)
}

main().catch(console.error)
