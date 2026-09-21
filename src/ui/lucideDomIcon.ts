/**
 * Vanilla-DOM Lucide SVG adapter for CSS2D labels (plan ui-input-035).
 * Builds SVG from `@lucide/vue` `__iconNode` data — no Vue mount per label.
 *
 * @domain ui-input
 */

export type LucideIconNode = readonly (readonly [string, Record<string, string>])[]

const SVG_NS = 'http://www.w3.org/2000/svg'

/**
 * Creates an inline Lucide SVG from raw `__iconNode` path data.
 * Callers should recreate only when icon identity changes; color can be
 * applied via `currentColor` / CSS on the host element.
 *
 * @domain ui-input
 */
export function createLucideDomIcon(
  iconNode: LucideIconNode,
  options: { size?: number, className?: string } = {},
): SVGSVGElement {
  const size = options.size ?? 12
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('xmlns', SVG_NS)
  svg.setAttribute('width', String(size))
  svg.setAttribute('height', String(size))
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('fill', 'none')
  svg.setAttribute('stroke', 'currentColor')
  svg.setAttribute('stroke-width', '2')
  svg.setAttribute('stroke-linecap', 'round')
  svg.setAttribute('stroke-linejoin', 'round')
  svg.setAttribute('aria-hidden', 'true')
  if (options.className) svg.setAttribute('class', options.className)

  for (const [tag, attrs] of iconNode) {
    const el = document.createElementNS(SVG_NS, tag)
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'key') continue
      el.setAttribute(key, value)
    }
    svg.appendChild(el)
  }
  return svg
}
