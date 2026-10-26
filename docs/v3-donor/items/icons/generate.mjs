import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const iconsDir = dirname(fileURLToPath(import.meta.url))
const archiveDir = resolve(iconsDir, '../../../../../_temp/icons/ffffff/transparent/1x1')
const manifest = JSON.parse(await readFile(resolve(iconsDir, 'sources.json'), 'utf8'))

function normalizeFill(svg) {
  return svg.replace(/\bfill=(["'])(?:white|#(?:fff|ffffff))\1/gi, (_match, quote) => `fill=${quote}currentColor${quote}`)
}

for (const entry of manifest) {
  if (!/^[a-z0-9-]+\.svg$/.test(entry.file) || !/^[a-z0-9-]+\/[a-z0-9-]+\.svg$/.test(entry.source)) {
    throw new Error(`Invalid icon manifest row: ${JSON.stringify(entry)}`)
  }
  const svg = await readFile(resolve(archiveDir, entry.source), 'utf8')
  await writeFile(resolve(iconsDir, entry.file), normalizeFill(svg))
}

const rows = manifest.map((entry) => `| \`${entry.file}\` | \`${entry.source}\` | Icons made by ${entry.author} | ${entry.license} |`)
const readme = [
  '# Item icons',
  '',
  'All SVGs are game-icons.net glyphs from the local `_temp/icons/ffffff/transparent/1x1/` archive. White fills were normalized to `currentColor` so UI text colors tint the glyphs. The archive license is CC BY 3.0 unless a row says CC0; see `_temp/icons/license.txt` for the contributor and license notes.',
  '',
  'Regenerate the copied SVGs and this source list with `node src/game/ui/items/icons/generate.mjs` when the local archive is available. Attribution follows the pack request: “Icons made by {author}.”',
  '',
  'The source list is generated from [`sources.json`](./sources.json).',
  '',
  '| Local file | Archive source | Attribution | License |',
  '|---|---|---|---|',
  ...rows,
  '',
].join('\n')
await writeFile(resolve(iconsDir, 'README.md'), readme)
console.log(`Generated ${manifest.length} item icons and attributions`)
