/** The "KVG" hex shoulder patch: logo, favicon and secret trigger art. */
/**
 * @param progress Lit edge count (0–6). Omit for a fully lit patch.
 */
export function HexPatch({ className, progress }: { className?: string; progress?: number }) {
  const lit = progress ?? 6
  const segments = [
    'M32 6 L54 19',
    'M54 19 L54 45',
    'M54 45 L32 58',
    'M32 58 L10 45',
    'M10 45 L10 19',
    'M10 19 L32 6',
  ]
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <polygon points="32,6 54,19 54,45 32,58 10,45 10,19" fill="#0A0A0F" stroke="#454558" strokeWidth="4" />
      {segments.map((d, i) => (
        <path key={d} d={d} stroke={i < lit ? '#F5E500' : '#454558'} strokeWidth="4" strokeLinecap="round" />
      ))}
      <text
        x="32"
        y="38"
        textAnchor="middle"
        fontFamily="'Dela Gothic One', 'Arial Black', sans-serif"
        fontSize="14"
        fill="#FF2A6D"
      >
        KVG
      </text>
    </svg>
  )
}
