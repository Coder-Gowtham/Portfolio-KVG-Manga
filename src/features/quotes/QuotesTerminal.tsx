import { useMemo, useState } from 'react'
import { CopyButton } from '../../components/ui/CopyButton'
import { quotes as ALL } from '../../data/quotes'
import type { Quote } from '../../types/content'
import { cx } from '../../utils/cx'
import { readJSON, writeJSON } from '../../utils/storage'
import { QUOTE_FILTERS, attribution, filterQuotes, nextRandom, quoteOfTheDay, shareText, toggleFavourite, type QuoteFilter } from './quotes'
import s from './quotes.module.css'

const FAV_KEY = 'quote-favourites'

/** Quote of the day + random pulls, categories and saved favourites. */
export function QuotesTerminal({ today: todayProp, list = ALL }: { today?: Date; list?: Quote[] }) {
  const [today] = useState(() => todayProp ?? new Date())
  const daily = useMemo(() => quoteOfTheDay(list, today), [list, today])
  const [current, setCurrent] = useState<Quote>(daily)
  const [filter, setFilter] = useState<QuoteFilter>('all')
  const [favourites, setFavourites] = useState<string[]>(() => readJSON<string[]>(FAV_KEY, []))

  const pool = filterQuotes(list, filter, favourites)
  const saved = favourites.includes(current.id)
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  const pickFilter = (f: QuoteFilter) => {
    setFilter(f)
    const p = filterQuotes(list, f, favourites)
    if (p.length && !p.some((q) => q.id === current.id)) setCurrent(p[0]!)
  }

  const toggleSave = () => {
    const next = toggleFavourite(favourites, current.id)
    setFavourites(next)
    writeJSON(FAV_KEY, next)
  }

  const share = async () => {
    try {
      await navigator.share({ text: shareText(current) })
    } catch {
      // user cancelled the share sheet
    }
  }

  return (
    <div className={s.terminal}>
      <div className={s.filters} role="group" aria-label="Quote categories">
        {QUOTE_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={cx(s.chip, filter === f.id && s.chipOn)}
            aria-pressed={filter === f.id}
            onClick={() => pickFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className={s.cmd} aria-hidden="true">
        $ fortune --{current.id === daily.id ? 'today' : 'random'}
      </p>

      {filter === 'favourites' && pool.length === 0 ? (
        <p className={s.empty}>Nothing saved yet. Tap ☆ Save on a quote you like; it stays on this device.</p>
      ) : (
        <figure className={s.quote} aria-live="polite">
          {current.id === daily.id && <p className={s.daily}>Quote of the day</p>}
          <blockquote className={s.text}>
            <p>“{current.text}”</p>
          </blockquote>
          <figcaption className={s.caption}>
            {current.original ? attribution(current) : `— ${attribution(current)}`}
            {current.source && <span className={s.source}>{current.source}</span>}
          </figcaption>
        </figure>
      )}

      <div className={s.actions}>
        <button
          type="button"
          className={s.btn}
          onClick={() => {
            const q = nextRandom(pool, current.id)
            if (q) setCurrent(q)
          }}
          disabled={pool.length < 2 && pool[0]?.id === current.id}
        >
          ↻ Another one
        </button>
        <button type="button" className={cx(s.btn, saved && s.btnOn)} aria-pressed={saved} onClick={toggleSave}>
          {saved ? '★ Saved' : '☆ Save'}
        </button>
        <CopyButton value={shareText(current)} label="Copy quote" />
        {canShare && (
          <button type="button" className={s.btn} onClick={share}>
            Share
          </button>
        )}
      </div>
    </div>
  )
}
