/**
 * Hero backdrop: a night-city establishing shot in three depth layers
 * (far towers, mid towers, rooftop foreground) with horizon glow, haze bands
 * and a searchlight beam. Pure SVG, decorative, deterministic.
 */

const W = 1440
const H = 900

interface Tower {
  x: number
  w: number
  h: number
}

/* Deterministic pseudo-random so every render draws the same skyline. */
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function skyline(count: number, minH: number, maxH: number, seed: number, gap = 6): Tower[] {
  const towers: Tower[] = []
  let x = -20
  for (let i = 0; x < W + 20 && i < count; i++) {
    const w = 46 + Math.round(rand(seed + i) * 70)
    const h = minH + Math.round(rand(seed * 3 + i * 7) * (maxH - minH))
    towers.push({ x, w, h })
    x += w + gap + Math.round(rand(seed + i * 13) * 14)
  }
  return towers
}

const FAR = skyline(40, 200, 430, 11, 2)
const MID = skyline(30, 120, 330, 29, 10)

/* Window lights: a few lit cells per tower, in columns. */
function windows(t: Tower, base: number, seed: number, density: number) {
  const cells: { x: number; y: number }[] = []
  const cols = Math.max(2, Math.floor(t.w / 12))
  const rows = Math.floor(t.h / 16)
  for (let c = 0; c < cols; c++) {
    for (let r = 1; r < rows; r++) {
      if (rand(seed + c * 31 + r * 7 + t.x) < density) {
        cells.push({ x: t.x + 5 + c * 12, y: base - t.h + r * 16 })
      }
    }
  }
  return cells
}

const FAR_BASE = 760
const MID_BASE = 840

export function HeroScene({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="hs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a0a0f" stopOpacity="0" />
          <stop offset="0.55" stopColor="#1a1030" stopOpacity="0.55" />
          <stop offset="0.8" stopColor="#3a1240" stopOpacity="0.7" />
          <stop offset="1" stopColor="#0a0a0f" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="hs-horizon" cx="0.68" cy="0.82" r="0.5">
          <stop offset="0" stopColor="#ff2a6d" stopOpacity="0.38" />
          <stop offset="0.45" stopColor="#7c5cfc" stopOpacity="0.16" />
          <stop offset="1" stopColor="#7c5cfc" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hs-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9b8ff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#c9b8ff" stopOpacity="0.09" />
          <stop offset="1" stopColor="#c9b8ff" stopOpacity="0" />
        </linearGradient>
        {/* Searchlight: soft across its width, fading toward the ground */}

        <linearGradient id="hs-beam-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="hs-beam-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <rect width={W} height={H} fill="url(#hs-beam-fade)" />
        </mask>
        <linearGradient id="hs-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#221a3a" />
          <stop offset="1" stopColor="#140f22" />
        </linearGradient>
        <linearGradient id="hs-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14131d" />
          <stop offset="1" stopColor="#0c0b12" />
        </linearGradient>
        {/* Readability: darken behind the copy column on wide screens */}
        <linearGradient id="hs-scrim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0a0a0f" stopOpacity="0.82" />
          <stop offset="0.45" stopColor="#0a0a0f" stopOpacity="0.45" />
          <stop offset="0.7" stopColor="#0a0a0f" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g data-layer="sky">
        <rect width={W} height={H} fill="url(#hs-sky)" />
        <rect width={W} height={H} fill="url(#hs-horizon)" />
      </g>

      <g data-scroll="far">
      <g data-layer="far">
        {FAR.map((t) => (
          <rect key={t.x} x={t.x} y={FAR_BASE - t.h} width={t.w} height={t.h + 140} fill="url(#hs-far)" />
        ))}
        <g fill="#7c5cfc" opacity="0.45">
          {FAR.flatMap((t, i) =>
            windows(t, FAR_BASE, i + 3, 0.07).map((c) => (
              <rect key={`${c.x}-${c.y}`} x={c.x} y={c.y} width="4" height="6" />
            )),
          )}
        </g>
      </g>
      </g>

      <rect data-layer="haze" x="0" y="520" width={W} height="260" fill="url(#hs-haze)" />

      <g data-scroll="mid">
      <g data-layer="mid">
        {MID.map((t) => (
          <rect key={t.x} x={t.x} y={MID_BASE - t.h} width={t.w} height={t.h + 80} fill="url(#hs-mid)" />
        ))}
        <g fill="#00e5ff" opacity="0.5">
          {MID.flatMap((t, i) =>
            windows(t, MID_BASE, i + 41, 0.05).map((c) => (
              <rect key={`${c.x}-${c.y}`} x={c.x} y={c.y} width="5" height="7" />
            )),
          )}
        </g>
        {/* rooftop beacons and two vertical neon signs */}
        {MID.filter((_, i) => i % 5 === 2).map((t) => (
          <circle key={`b${t.x}`} cx={t.x + t.w / 2} cy={MID_BASE - t.h - 6} r="2.5" fill="#ff2a6d" />
        ))}
        <rect x={W * 0.58} y={MID_BASE - 300} width="16" height="120" fill="#ff2a6d" opacity="0.55" />
        <rect x={W * 0.86} y={MID_BASE - 260} width="12" height="90" fill="#00e5ff" opacity="0.45" />
      </g>
      </g>

      <g data-scroll="beam">
        <g data-layer="beam" fill="#00e5ff" mask="url(#hs-beam-mask)">
          {/* halo, body and core stacked: reads as a soft-edged beam without a blur filter */}
          <polygon points="1150,0 1330,0 1120,900 460,900" opacity="0.035" />
          <polygon points="1185,0 1295,0 1040,900 560,900" opacity="0.05" />
          <polygon points="1215,0 1265,0 960,900 660,900" opacity="0.06" />
        </g>
      </g>

      <g data-layer="near">
        <rect x="0" y="862" width={W} height="40" fill="#07070b" />
        <rect x="0" y="858" width={W} height="4" fill="#00e5ff" opacity="0.35" />
        {/* railing */}
        <rect x="0" y="826" width={W} height="2" fill="#2a2a38" />
        {Array.from({ length: 25 }, (_, i) => (
          <rect key={i} x={i * 60} y="826" width="3" height="36" fill="#2a2a38" />
        ))}
        {/* antenna mast on the left */}
        <rect x="64" y="700" width="4" height="162" fill="#1d1d27" />
        <rect x="52" y="728" width="28" height="3" fill="#1d1d27" />
        <circle cx="66" cy="698" r="3.5" fill="#ff2a6d" />
      </g>

      <rect data-layer="scrim" width={W} height={H} fill="url(#hs-scrim)" />
    </svg>
  )
}
