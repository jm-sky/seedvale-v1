import { createReadStream, existsSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { extname, join, normalize, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ASSET_BROWSER_MODEL_MANIFEST } from './src/tools/assetBrowser/modelManifest'
import type { Connect, Plugin, ViteDevServer } from 'vite'

const MODEL_ROOT = 'public/models'
const MODEL_URL_PREFIX = '/models/'

const LEGACY_ROOT = fileURLToPath(new URL('.', import.meta.url))
/** v2 Quaternius characters (legacy/SeedVales). */
export const COMPARE_V2_ROOT = resolve(LEGACY_ROOT, '../SeedVales/public/assets/characters')
/** v3 Quaternius characters (repo public/assets/characters). */
export const COMPARE_V3_ROOT = resolve(LEGACY_ROOT, '../../public/assets/characters')

export const COMPARE_MOUNTS = [
  { prefix: '/compare/v2/', root: COMPARE_V2_ROOT },
  { prefix: '/compare/v3/', root: COMPARE_V3_ROOT },
] as const

const MIME: Record<string, string> = {
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.bin': 'application/octet-stream',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
}

export function listGlbModelUrls(dir: string, base = dir): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) {
      out.push(...listGlbModelUrls(full, base))
    } else if (name.endsWith('.glb')) {
      const rel = relative(base, full).replace(/\\/g, '/')
      out.push(`${MODEL_URL_PREFIX}${rel}`)
    }
  }
  return out.sort()
}

function manifestBody(): string {
  return JSON.stringify({ files: listGlbModelUrls(MODEL_ROOT) })
}

function notifyModelChange(server: ViteDevServer, file: string): void {
  if (!file.includes('/models/') && !file.includes('\\models\\')) return
  if (!file.endsWith('.glb')) return
  const idx = file.indexOf('models')
  if (idx < 0) return
  const rel = file.slice(idx).replace(/\\/g, '/')
  const url = `/${rel}`
  server.ws.send({ type: 'custom', event: 'asset-browser:model-changed', data: { url } })
}

/** Resolve a `/compare/v{2|3}/…` URL to an absolute file path, or null if unsafe/missing. */
export function resolveComparePath(urlPath: string): string | null {
  const pathOnly = urlPath.split('?')[0] ?? urlPath
  for (const { prefix, root } of COMPARE_MOUNTS) {
    if (!pathOnly.startsWith(prefix)) continue
    const rel = decodeURIComponent(pathOnly.slice(prefix.length))
    if (!rel || rel.includes('\0') || rel.includes('..')) return null
    const full = normalize(resolve(root, rel))
    const rootNorm = normalize(root)
    if (full !== rootNorm && !full.startsWith(rootNorm + sep)) return null
    if (!existsSync(full) || !statSync(full).isFile()) return null
    return full
  }
  return null
}

function compareStaticMiddleware(): Connect.NextHandleFunction {
  return (req, res, next) => {
    const raw = req.url ?? ''
    if (!raw.startsWith('/compare/')) return next()
    const file = resolveComparePath(raw)
    if (!file) {
      res.statusCode = 404
      res.end('Not found')
      return
    }
    const type = MIME[extname(file).toLowerCase()] ?? 'application/octet-stream'
    res.setHeader('Content-Type', type)
    res.setHeader('Cache-Control', 'no-cache')
    createReadStream(file).pipe(res)
  }
}

/**
 * Asset alignment browser support:
 * - dev: serves model manifest + HMR when GLBs change
 * - serves `/compare/v2|v3/` from SeedVales / v3 character roots (read-only)
 * - build: writes static manifest into dist for production
 */
export function assetBrowserPlugin(): Plugin {
  let outDir = 'dist'

  return {
    name: 'seedvale-asset-browser',
    config() {
      return {
        server: {
          fs: {
            allow: [LEGACY_ROOT, COMPARE_V2_ROOT, COMPARE_V3_ROOT],
          },
        },
      }
    },
    configResolved(config) {
      outDir = config.build.outDir
    },
    configureServer(server) {
      server.middlewares.use(compareStaticMiddleware())
      server.middlewares.use(ASSET_BROWSER_MODEL_MANIFEST, (_req, res) => {
        try {
          res.setHeader('Content-Type', 'application/json')
          res.end(manifestBody())
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: String(err) }))
        }
      })

      server.watcher.add(join(MODEL_ROOT, '**/*.glb'))
      server.watcher.on('change', (file) => notifyModelChange(server, file))
      server.watcher.on('add', (file) => notifyModelChange(server, file))
    },
    closeBundle() {
      writeFileSync(join(outDir, 'asset-browser-models.json'), manifestBody())
    },
  }
}
