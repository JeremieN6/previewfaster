import catalogIndex from './index.json'
import premierLeague from './premier-league.json'

const registry = {
  'premier-league-manual': premierLeague
}

export const templateCatalog = catalogIndex.packs.map((pack) => ({
  ...pack,
  data: registry[pack.id] || null
}))

export const getTemplatePack = (packId) => registry[packId] || null

export const catalogMeta = {
  version: catalogIndex.version,
  lastUpdate: catalogIndex.lastUpdate
}
