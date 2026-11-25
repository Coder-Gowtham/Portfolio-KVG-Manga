import type { Quote } from '../../types/content'
import { dayKey, hashString } from '../../utils/storage'

export type QuoteFilter = Quote['category'] | 'all' | 'favourites'

export const QUOTE_FILTERS: { id: QuoteFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'craft', label: 'Craft' },
  { id: 'mindset', label: 'Mindset' },
  { id: 'original', label: 'Originals' },
  { id: 'favourites', label: '★ Favourites' },
]

export function quoteOfTheDay(list: Quote[], date: Date): Quote {
  return list[hashString(`qotd|${dayKey(date)}`) % list.length]!
}

export function filterQuotes(list: Quote[], filter: QuoteFilter, favourites: string[]): Quote[] {
  if (filter === 'all') return list
  if (filter === 'favourites') return list.filter((q) => favourites.includes(q.id))
  return list.filter((q) => q.category === filter)
}

/** A different quote from the pool than the current one (when possible). */
export function nextRandom(pool: Quote[], currentId: string | undefined, random: () => number = Math.random): Quote | undefined {
  if (pool.length === 0) return undefined
  const others = pool.length > 1 ? pool.filter((q) => q.id !== currentId) : pool
  return others[Math.floor(random() * others.length)]
}

export const attribution = (q: Quote) => (q.original ? 'Original — KVG' : q.author)

export const shareText = (q: Quote) => `“${q.text}” — ${attribution(q)}`

export function toggleFavourite(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
}
