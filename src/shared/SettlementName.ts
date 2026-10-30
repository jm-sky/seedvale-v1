import type { ResourceType } from '../terrain/naturalResources'
import { SIGNIFICANT_RICHNESS } from '../terrain/naturalResources'
import { createSeededRandom } from '../world/parseSeed'

/** Dominant terrain feature near a settlement — drives which word list
 *  its name is drawn from. See `settlement/settlementTerrain.ts` for how a
 *  point gets classified into one of these. */
export type SettlementTerrain = 'ocean' | 'mountain' | 'swamp' | 'desert' | 'forest'

/** Grammatical gender/number of a place name — drives adjective agreement and
 *  the ordinal suffix ("Osowiec Drugi", "Wola Druga", "Lipowo Drugie",
 *  "Rybaki Drugie"). `pl` = non-virile plural (same endings as neuter). */
export type SettlementNameGender = 'm' | 'f' | 'n' | 'pl'

type Noun = readonly [word: string, gender: SettlementNameGender]

type WordSet = {
  /** Feminine singular forms ending in `-a`; other forms are derived
   *  ({@link agreeAdjective}). */
  adjectives: readonly string[]
  nouns: readonly Noun[]
  /** Single, already-composed place names (no adjective+noun assembly). */
  soloNames: readonly Noun[]
}

const WORDS: Record<SettlementTerrain, WordSet> = {
  forest: {
    adjectives: [
      'Lipowa', 'Zielona', 'Sośnicka', 'Brzozowa', 'Cicha', 'Stara', 'Dębowa', 'Jodłowa', 'Grabowa', 'Bukowa',
      'Olszowa', 'Jaworowa', 'Leszczynowa', 'Wiśniowa', 'Głucha', 'Ciemna', 'Mszysta', 'Jagodowa', 'Borowa',
      'Leśna', 'Gęsta', 'Dzika', 'Modrzewiowa', 'Świerkowa', 'Kalinowa', 'Cienista', 'Paprociowa', 'Jesionowa',
    ],
    nouns: [
      ['Dolina', 'f'], ['Grąd', 'm'], ['Osada', 'f'], ['Polana', 'f'], ['Chatki', 'pl'], ['Puszcza', 'f'],
      ['Wola', 'f'], ['Gaj', 'm'], ['Bór', 'm'], ['Zagajnik', 'm'], ['Knieja', 'f'], ['Uroczysko', 'n'],
      ['Zarośla', 'pl'], ['Wrzosowisko', 'n'], ['Jar', 'm'], ['Parów', 'm'], ['Podlesie', 'n'], ['Kąt', 'm'],
      ['Zakątek', 'm'], ['Poręba', 'f'], ['Siedlisko', 'n'], ['Przysiółek', 'm'], ['Wólka', 'f'], ['Huta', 'f'],
      ['Ostoja', 'f'], ['Budy', 'pl'],
    ],
    soloNames: [
      ['Lipowo', 'n'], ['Zalesie', 'n'], ['Brzezinka', 'f'], ['Dąbrówka', 'f'], ['Leśnica', 'f'], ['Borki', 'pl'],
      ['Grabowiec', 'm'], ['Jodłowo', 'n'], ['Bukowina', 'f'], ['Olszynka', 'f'], ['Jaworze', 'n'],
      ['Kalinówka', 'f'], ['Leszczyny', 'pl'], ['Modrzewie', 'n'], ['Świerczyna', 'f'], ['Gajówka', 'f'],
      ['Borowiec', 'm'], ['Jagodno', 'n'], ['Paprotnia', 'f'], ['Wrzosowo', 'n'], ['Głuchowo', 'n'],
      ['Cisowo', 'n'], ['Jarzębina', 'f'], ['Dębina', 'f'], ['Brzozowiec', 'm'], ['Grądy', 'pl'],
      ['Osowiec', 'm'], ['Olszanka', 'f'], ['Wierzbica', 'f'], ['Buczyna', 'f'], ['Klonowo', 'n'],
      ['Jesionka', 'f'], ['Grabina', 'f'], ['Lipnik', 'm'], ['Dębnik', 'm'], ['Smolnik', 'm'], ['Chojnik', 'm'],
      ['Jodłownik', 'm'], ['Sośnica', 'f'], ['Kalinowo', 'n'], ['Brzeźno', 'n'], ['Dąbrowica', 'f'],
      ['Leszczyniec', 'm'], ['Zagaje', 'pl'], ['Porębka', 'f'], ['Borzęcin', 'm'], ['Jaworek', 'm'],
      ['Wólka Leśna', 'f'], ['Gęstwina', 'f'], ['Mchowo', 'n'],
    ],
  },
  ocean: {
    adjectives: [
      'Nadmorska', 'Słona', 'Rybacka', 'Piaszczysta', 'Mglista', 'Wietrzna', 'Szara', 'Burzowa', 'Bursztynowa',
      'Mewia', 'Falista', 'Morska', 'Sztormowa', 'Jasna', 'Srebrna', 'Daleka',
    ],
    nouns: [
      ['Brzeg', 'm'], ['Zatoka', 'f'], ['Przystań', 'f'], ['Wybrzeże', 'n'], ['Ostrów', 'm'], ['Mierzeja', 'f'],
      ['Cypel', 'm'], ['Plaża', 'f'], ['Zalew', 'm'], ['Łacha', 'f'], ['Nabrzeże', 'n'], ['Ujście', 'n'],
      ['Przesmyk', 'm'], ['Kosa', 'f'], ['Osada', 'f'], ['Sieci', 'pl'],
    ],
    soloNames: [
      ['Rybaki', 'pl'], ['Zatoczka', 'f'], ['Solanka', 'f'], ['Mielizna', 'f'], ['Przymorze', 'n'],
      ['Pomorzany', 'pl'], ['Rewa', 'f'], ['Sieciarze', 'pl'], ['Bursztynowo', 'n'], ['Rybaczówka', 'f'],
      ['Szkuty', 'pl'], ['Mewiec', 'm'], ['Dalmorze', 'n'], ['Zalewo', 'n'], ['Nadbrzeże', 'n'],
      ['Wiatrowo', 'n'], ['Sztormowo', 'n'], ['Cyplewo', 'n'], ['Słonowice', 'pl'], ['Rozewie', 'n'],
      ['Łodzie', 'pl'], ['Przystanek', 'm'], ['Mewia Kępa', 'f'], ['Pławy', 'pl'], ['Wydmiany', 'pl'],
      ['Toń', 'f'], ['Bałtyk', 'm'], ['Kutrowo', 'n'],
    ],
  },
  mountain: {
    adjectives: [
      'Skalista', 'Wysoka', 'Kamienna', 'Górska', 'Strzelista', 'Stroma', 'Mroźna', 'Śnieżna',
      'Krzemienna', 'Granitowa', 'Halna', 'Sina', 'Turnicka', 'Wietrzna', 'Kozia',
    ],
    nouns: [
      ['Wzgórze', 'n'], ['Przełęcz', 'f'], ['Turnia', 'f'], ['Podgórze', 'n'], ['Grań', 'f'], ['Hala', 'f'],
      ['Szczyt', 'm'], ['Żleb', 'm'], ['Kotlina', 'f'], ['Upłaz', 'm'], ['Wierch', 'm'], ['Stok', 'm'],
      ['Urwisko', 'n'], ['Skała', 'f'], ['Perć', 'f'], ['Gronie', 'pl'],
    ],
    soloNames: [
      ['Podgórze', 'n'], ['Skalnik', 'm'], ['Turniów', 'm'], ['Granica', 'f'], ['Zbocze', 'n'],
      ['Kamieniec', 'm'], ['Groń', 'm'], ['Przysłop', 'm'], ['Jaworzyna', 'f'], ['Krzemienica', 'f'],
      ['Wierchy', 'pl'], ['Skałka', 'f'], ['Zawrat', 'm'], ['Orlica', 'f'], ['Śnieżnik', 'm'], ['Halnik', 'm'],
      ['Gronik', 'm'], ['Stromiec', 'm'], ['Zakamienie', 'n'], ['Podskale', 'n'], ['Wierchowo', 'n'],
      ['Kozi Gród', 'm'], ['Siwarna', 'f'], ['Hrube', 'pl'], ['Zadział', 'm'], ['Łysica', 'f'],
      ['Ostrysz', 'm'], ['Skalno', 'n'],
    ],
  },
  swamp: {
    adjectives: [
      'Mokra', 'Bagienna', 'Trzcinowa', 'Głęboka', 'Wilgotna', 'Mglista', 'Torfowa', 'Błotna', 'Grząska',
      'Sitowa', 'Olszowa', 'Żabia', 'Rzęsista', 'Ciemna', 'Zamglona', 'Cicha',
    ],
    nouns: [
      ['Ług', 'm'], ['Rozlewisko', 'n'], ['Moczary', 'pl'], ['Trzęsawa', 'f'], ['Bagno', 'n'],
      ['Torfowisko', 'n'], ['Błota', 'pl'], ['Sitowie', 'n'], ['Grzęzawisko', 'n'], ['Kępa', 'f'], ['Olsy', 'pl'],
      ['Mszar', 'm'], ['Łęg', 'm'], ['Starorzecze', 'n'], ['Topiel', 'f'], ['Grobla', 'f'],
    ],
    soloNames: [
      ['Mokradła', 'pl'], ['Bagnówka', 'f'], ['Trzęsawisko', 'n'], ['Ługowo', 'n'], ['Rozlewiska', 'pl'],
      ['Błonie', 'n'], ['Żabno', 'n'], ['Torfy', 'pl'], ['Sitno', 'n'], ['Olszyna', 'f'], ['Łęgi', 'pl'],
      ['Brodnica', 'f'], ['Topiele', 'pl'], ['Moczydło', 'n'], ['Bielawy', 'pl'], ['Rzęsna', 'f'],
      ['Kaczory', 'pl'], ['Czaplinek', 'm'], ['Trzciniec', 'm'], ['Bagienica', 'f'], ['Podmokle', 'n'],
      ['Ługi', 'pl'], ['Groblice', 'pl'], ['Kępiny', 'pl'], ['Brodowo', 'n'], ['Mszanka', 'f'],
      ['Czaplowo', 'n'], ['Sitówka', 'f'],
    ],
  },
  desert: {
    adjectives: [
      'Sucha', 'Piaskowa', 'Wypalona', 'Jałowa', 'Spękana', 'Złocista', 'Rdzawa', 'Pylista', 'Gorąca',
      'Spalona', 'Żółta', 'Ruda', 'Martwa', 'Wietrzna', 'Kamienista', 'Daleka',
    ],
    nouns: [
      ['Wydma', 'f'], ['Pustkowie', 'n'], ['Ostoja', 'f'], ['Karawana', 'f'], ['Ostęp', 'm'], ['Oaza', 'f'],
      ['Pustynia', 'f'], ['Studnia', 'f'], ['Skwar', 'm'], ['Wąwóz', 'm'], ['Piaski', 'pl'], ['Ugór', 'm'],
      ['Pogorzelisko', 'n'], ['Kamienisko', 'n'], ['Rozdroże', 'n'], ['Stanica', 'f'],
    ],
    soloNames: [
      ['Wydmowo', 'n'], ['Piaskowiec', 'm'], ['Pustkowie', 'n'], ['Susznica', 'f'], ['Karawana', 'f'],
      ['Piaski', 'pl'], ['Suchodoły', 'pl'], ['Wypały', 'pl'], ['Pylnik', 'm'], ['Żarnowiec', 'm'], ['Żary', 'pl'],
      ['Posucha', 'f'], ['Suszec', 'm'], ['Studzianka', 'f'], ['Kamionka', 'f'], ['Rdzawka', 'f'], ['Żarki', 'pl'],
      ['Ugorek', 'm'], ['Pogorzel', 'f'], ['Spalonka', 'f'], ['Wysuszyn', 'm'], ['Skwarzyn', 'm'],
      ['Piaskownica', 'f'], ['Oazowo', 'n'], ['Studzienice', 'pl'], ['Ruda Piaskowa', 'f'], ['Wydmuch', 'm'],
      ['Spieki', 'pl'],
    ],
  },
}

/** Word fragments a significant dominant resource (plan 032 §9) can mix into
 *  the terrain-based name — e.g. a mountain village that also sits on an
 *  iron deposit can become "Żelazna Turnia". Resource types without an entry
 *  never influence the name. No `soloNames` here — those stay purely
 *  terrain-flavored; only the adjective+noun patterns pick up resource flavor. */
const RESOURCE_WORDS: Partial<Record<ResourceType, { adjectives: readonly string[], nouns: readonly Noun[] }>> = {
  iron: { adjectives: ['Żelazna', 'Rudna'], nouns: [['Kuźnia', 'f'], ['Ruda', 'f'], ['Kuźnice', 'pl']] },
  coal: { adjectives: ['Węglowa', 'Czarna'], nouns: [['Kopalnia', 'f'], ['Sztolnia', 'f'], ['Węglisko', 'n']] },
  gold: { adjectives: ['Złota', 'Bogata'], nouns: [['Żyła', 'f'], ['Skarbnica', 'f'], ['Płuczka', 'f']] },
  fish: { adjectives: ['Rybna'], nouns: [['Rybaki', 'pl'], ['Tonie', 'pl']] },
  fertile_soil: { adjectives: ['Żyzna', 'Urodzajna'], nouns: [['Niwa', 'f'], ['Rola', 'f'], ['Łany', 'pl']] },
  salt: { adjectives: ['Słona'], nouns: [['Solanka', 'f'], ['Warzelnia', 'f'], ['Żupa', 'f']] },
  resin: { adjectives: ['Żywiczna'], nouns: [['Smolarnia', 'f'], ['Smolisko', 'n']] },
}

/** Chance a significant resource actually shows up in the name at all —
 *  "Zasób nie powinien zawsze występować w nazwie — tylko gdy jest
 *  wystarczająco znaczący" (§9); significance itself is already gated by
 *  `SIGNIFICANT_RICHNESS`, this is the additional "not every single time" roll. */
const RESOURCE_NAME_CHANCE = 0.5

const SETTLEMENT_NAME_SEED_SALT = 0x5e77e17

/**
 * Adjective form agreeing with `gender`, from its feminine `-a` form:
 * `Lipowa` → `Lipowy`/`Lipowe`, `Głęboka` → `Głęboki`/`Głębokie`, `Mewia` → `Mewi`/`Mewie`.
 *
 * @domain settlements
 */
export function agreeAdjective(feminine: string, gender: SettlementNameGender): string {
  if (gender === 'f') return feminine
  const stem = feminine.slice(0, -1)
  // Soft stems (`Mewia`, `Kozia`, `Żabia`): `Mewi` / `Mewie`.
  if (stem.endsWith('i')) return gender === 'm' ? stem : `${stem}e`
  const softened = /[kg]$/.test(stem)
  if (gender === 'm') return stem + (softened ? 'i' : 'y')
  return stem + (softened ? 'ie' : 'e')
}

/** A generated base name and the gender its ordinal suffix must agree with. */
export type SettlementBaseName = {
  name: string
  gender: SettlementNameGender
}

/** Deterministic base name for a settlement — same `(seed, terrain, dominantResource)`
 *  always produces the same name, so it doesn't need its own save-data slot.
 *  Local uniqueness (ordinal suffixes) is resolved by the caller
 *  (`settlementNameUniqueness.ts`). */
export function generateSettlementBaseName(
  seed: number,
  terrain: SettlementTerrain,
  dominantResource?: { type: ResourceType, richness: number } | null,
): SettlementBaseName {
  const random = createSeededRandom(seed ^ SETTLEMENT_NAME_SEED_SALT)
  const terrainWords = WORDS[terrain]
  const resourceWords =
    dominantResource && dominantResource.richness >= SIGNIFICANT_RICHNESS
      ? RESOURCE_WORDS[dominantResource.type]
      : undefined
  const useResourceFlavor = resourceWords !== undefined && random() < RESOURCE_NAME_CHANCE
  const adjectives = useResourceFlavor ? [...terrainWords.adjectives, ...resourceWords.adjectives] : terrainWords.adjectives
  const nouns = useResourceFlavor ? [...terrainWords.nouns, ...resourceWords.nouns] : terrainWords.nouns
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(random() * arr.length)]!

  const patternRoll = random()
  if (patternRoll < 0.6) {
    const [noun, gender] = pick(nouns)
    const adjective = agreeAdjective(pick(adjectives), gender)
    return patternRoll < 0.3
      ? { name: `${adjective} ${noun}`, gender }
      : { name: `${noun} ${adjective}`, gender }
  }
  const [name, gender] = pick(terrainWords.soloNames)
  return { name, gender }
}

/** Convenience wrapper: the base name string only. */
export function generateSettlementName(
  seed: number,
  terrain: SettlementTerrain,
  dominantResource?: { type: ResourceType, richness: number } | null,
): string {
  return generateSettlementBaseName(seed, terrain, dominantResource).name
}

const ORDINALS: Record<'m' | 'f' | 'n', readonly string[]> = {
  m: ['Drugi', 'Trzeci', 'Czwarty', 'Piąty', 'Szósty', 'Siódmy', 'Ósmy', 'Dziewiąty', 'Dziesiąty'],
  f: ['Druga', 'Trzecia', 'Czwarta', 'Piąta', 'Szósta', 'Siódma', 'Ósma', 'Dziewiąta', 'Dziesiąta'],
  n: ['Drugie', 'Trzecie', 'Czwarte', 'Piąte', 'Szóste', 'Siódme', 'Ósme', 'Dziewiąte', 'Dziesiąte'],
}

/** Highest ordinal with a word form; callers fall back to a cell-identity suffix beyond it. */
export const MAX_SETTLEMENT_NAME_ORDINAL = 10

/**
 * `ordinal` 1 → the base name; 2…10 → base + agreeing ordinal word
 * ("Osowiec Drugi", "Wola Trzecia", "Rybaki Drugie"); `null` beyond
 * {@link MAX_SETTLEMENT_NAME_ORDINAL}.
 *
 * @domain settlements
 */
export function settlementOrdinalName(base: SettlementBaseName, ordinal: number): string | null {
  if (ordinal <= 1) return base.name
  if (ordinal > MAX_SETTLEMENT_NAME_ORDINAL) return null
  const forms = ORDINALS[base.gender === 'pl' ? 'n' : base.gender]
  return `${base.name} ${forms[ordinal - 2]}`
}
