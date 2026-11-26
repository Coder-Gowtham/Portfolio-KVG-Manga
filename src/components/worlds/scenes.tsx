/**
 * Project worlds: one illustrated scene per project, drawn in a shared visual
 * language (dark scene, neon line art, mono labels, the site's four accents).
 * These are ILLUSTRATIONS of what each project is about, not product screenshots.
 * Each scene uses an 800×450 canvas. `p` prefixes gradient ids so several worlds
 * can sit on one page.
 */
import type { ReactNode } from 'react'

const CYAN = '#00e5ff'
const MAGENTA = '#ff2a6d'
const YELLOW = '#f5e500'
const VIOLET = '#7c5cfc'
const PAPER = '#edebe4'
const INK = '#0a0a0f'

const mono = { fontFamily: "'Share Tech Mono', ui-monospace, monospace" } as const

function Label({ x, y, children, fill = CYAN, anchor = 'middle', size = 11 }: { x: number; y: number; children: ReactNode; fill?: string; anchor?: 'start' | 'middle' | 'end'; size?: number }) {
  return (
    <text x={x} y={y} fill={fill} fontSize={size} letterSpacing="1.5" textAnchor={anchor} style={mono}>
      {children}
    </text>
  )
}

/** Shared backdrop: tinted gradient, a soft key light and a floor glow. */
function Stage({ p, top, glow }: { p: string; top: string; glow: string }) {
  return (
    <g data-w-layer="bg">
      <defs>
        <linearGradient id={`${p}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={INK} />
        </linearGradient>
        <radialGradient id={`${p}-glow`} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor={glow} stopOpacity="0.32" />
          <stop offset="1" stopColor={glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="450" fill={`url(#${p}-bg)`} />
      <rect width="800" height="450" fill={`url(#${p}-glow)`} />
    </g>
  )
}

/* ---------------- Times Black · NEXUS ---------------- */
const NEXUS_NODES = [
  { x: 150, y: 110, label: 'API GATEWAY' },
  { x: 650, y: 110, label: 'PARTNER APIS' },
  { x: 130, y: 320, label: 'VALIDATION' },
  { x: 670, y: 320, label: 'NOTIFY' },
  { x: 400, y: 392, label: 'AUTH · JWT' },
]

export function NexusScene({ p }: { p: string }) {
  const hub = { x: 400, y: 210 }
  return (
    <>
      <Stage p={p} top="#0b1a3a" glow={CYAN} />
      {/* perspective floor */}
      <g data-w-layer="far" stroke={CYAN} strokeOpacity="0.12" strokeWidth="1">
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1="400" y1="200" x2={-200 + i * 100} y2="450" />
        ))}
        {[260, 300, 350, 410].map((y) => (
          <line key={y} x1="0" y1={y} x2="800" y2={y} />
        ))}
      </g>
      <g data-w-layer="mid">
        {NEXUS_NODES.map((n) => (
          <g key={n.label}>
            <line x1={hub.x} y1={hub.y} x2={n.x} y2={n.y} stroke={CYAN} strokeOpacity="0.25" strokeWidth="2" />
            <line className="w-flow" x1={hub.x} y1={hub.y} x2={n.x} y2={n.y} stroke={CYAN} strokeWidth="3" strokeDasharray="3 16" strokeLinecap="round" />
          </g>
        ))}
      </g>
      <g data-w-layer="near">
        {NEXUS_NODES.map((n) => (
          <g key={n.label}>
            <rect x={n.x - 62} y={n.y - 18} width="124" height="36" fill="#0a1530" stroke={CYAN} strokeWidth="1.5" />
            <circle cx={n.x - 48} cy={n.y} r="4" fill={n.label === 'PARTNER APIS' ? YELLOW : CYAN} className="w-pulse" />
            <Label x={n.x + 6} y={n.y + 4}>
              {n.label}
            </Label>
          </g>
        ))}
        {/* retry loop on the partner call */}
        <g transform="translate(36 -22)">
          <path d="M700 84 a16 16 0 1 1 -14 -10" fill="none" stroke={YELLOW} strokeWidth="2" />
          <path d="M684 68 l4 8 l-9 1 z" fill={YELLOW} />
          <Label x={700} y={120} fill={YELLOW} anchor="middle" size={10}>
            RETRY
          </Label>
        </g>
        {/* orchestrator hub */}
        <polygon
          points={`${hub.x},${hub.y - 66} ${hub.x + 62},${hub.y - 33} ${hub.x + 62},${hub.y + 33} ${hub.x},${hub.y + 66} ${hub.x - 62},${hub.y + 33} ${hub.x - 62},${hub.y - 33}`}
          fill="#0d1d40"
          stroke={CYAN}
          strokeWidth="2.5"
        />
        <polygon
          className="w-pulse"
          points={`${hub.x},${hub.y - 80} ${hub.x + 74},${hub.y - 40} ${hub.x + 74},${hub.y + 40} ${hub.x},${hub.y + 80} ${hub.x - 74},${hub.y + 40} ${hub.x - 74},${hub.y - 40}`}
          fill="none"
          stroke={MAGENTA}
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
        <Label x={hub.x} y={hub.y - 4} fill={PAPER} size={12}>
          ORCHESTRATOR
        </Label>
        <Label x={hub.x} y={hub.y + 14} fill={MAGENTA} size={10}>
          ONBOARDING FLOW
        </Label>
      </g>
    </>
  )
}

/* ---------------- Clusterix · INTERFACE ---------------- */
export function InterfaceScene({ p }: { p: string }) {
  return (
    <>
      <Stage p={p} top="#1a1238" glow={VIOLET} />
      <g data-w-layer="far">
        <g fill={VIOLET} opacity="0.18">
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x={40 + i * 96} y={30 + (i % 3) * 14} width="70" height="6" />
          ))}
        </g>
      </g>
      {/* editor window */}
      <g data-w-layer="mid">
        <rect x="110" y="56" width="560" height="330" fill="#120f22" stroke={VIOLET} strokeWidth="2" />
        <rect x="110" y="56" width="560" height="26" fill="#1c1636" />
        {[126, 142, 158].map((cx, i) => (
          <circle key={cx} cx={cx} cy="69" r="4.5" fill={[MAGENTA, YELLOW, CYAN][i]} />
        ))}
        {/* toolbar of modules */}
        <rect x="110" y="82" width="560" height="34" fill="#17122c" />
        {Array.from({ length: 14 }, (_, i) => (
          <rect key={i} x={124 + i * 30} y="91" width="20" height="16" fill={i === 3 || i === 9 ? CYAN : '#2c2450'} />
        ))}
        {/* ruler */}
        <rect x="110" y="116" width="26" height="270" fill="#17122c" />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="128" y1={130 + i * 21} x2="136" y2={130 + i * 21} stroke={VIOLET} strokeOpacity="0.6" />
        ))}
        {/* document page */}
        <rect x="190" y="132" width="330" height="236" fill={PAPER} />
        <rect x="214" y="152" width="180" height="12" fill={INK} />
        {[180, 198, 216, 234, 252, 270, 288, 306, 324].map((y, i) => (
          <rect key={y} x="214" y={y} width={i % 4 === 3 ? 170 : 282} height="7" fill="#9b98a6" />
        ))}
        <rect x="214" y="214" width="150" height="11" fill={VIOLET} opacity="0.35" />
        <rect className="w-blink" x="366" y="212" width="2.5" height="15" fill={MAGENTA} />
      </g>
      {/* floating modules */}
      <g data-w-layer="near">
        <rect x="560" y="120" width="190" height="150" fill="#100c1f" stroke={CYAN} strokeWidth="1.5" />
        <Label x={576} y={142} anchor="start" size={10}>
          PLUGIN PANEL
        </Label>
        {[160, 196, 232].map((y, i) => (
          <g key={y}>
            <circle cx="584" cy={y + 8} r="8" fill={[VIOLET, MAGENTA, CYAN][i]} opacity="0.85" />
            <rect x="600" y={y + 2} width="120" height="6" fill="#3a3358" />
            <rect x="600" y={y + 12} width="80" height="6" fill="#3a3358" />
          </g>
        ))}
        <rect x="52" y="300" width="170" height="104" fill="#100c1f" stroke={YELLOW} strokeWidth="1.5" />
        <Label x={66} y={320} anchor="start" fill={YELLOW} size={10}>
          CELLS MODULE
        </Label>
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={66 + (i % 4) * 36} y={330 + Math.floor(i / 4) * 22} width="32" height="18" fill={i === 5 ? YELLOW : 'none'} fillOpacity="0.35" stroke={YELLOW} strokeOpacity="0.5" />
        ))}
      </g>
    </>
  )
}

/* ---------------- LogLens AI · INTELLIGENCE ---------------- */
const LOG_ROWS = Array.from({ length: 14 }, (_, i) => ({
  level: i % 7 === 3 ? 'ERROR' : i % 5 === 1 ? 'WARN' : 'INFO',
  w: 120 + ((i * 53) % 160),
}))
const LEVEL_COLOUR: Record<string, string> = { ERROR: MAGENTA, WARN: YELLOW, INFO: CYAN }

export function IntelligenceScene({ p }: { p: string }) {
  const rows = [...LOG_ROWS, ...LOG_ROWS]
  return (
    <>
      <Stage p={p} top="#06222a" glow={CYAN} />
      <defs>
        <clipPath id={`${p}-logs`}>
          <rect x="40" y="78" width="410" height="320" />
        </clipPath>
      </defs>
      {/* log stream */}
      <g data-w-layer="mid">
        <rect x="40" y="48" width="410" height="350" fill="#071417" stroke={CYAN} strokeWidth="1.5" />
        <Label x={56} y={68} anchor="start" size={10}>
          LOG STREAM · LIVE
        </Label>
        <circle className="w-pulse" cx="438" cy="64" r="4" fill={MAGENTA} />
        <g clipPath={`url(#${p}-logs)`}>
          <g className="w-scroll">
            {rows.map((r, i) => (
              <g key={i} transform={`translate(0 ${86 + i * 23})`}>
                <rect x="56" y="0" width="44" height="12" fill="#12343a" />
                <rect x="108" y="0" width="46" height="12" fill={LEVEL_COLOUR[r.level]} opacity="0.9" />
                <text x="131" y="10" fill={INK} fontSize="9" textAnchor="middle" style={mono}>
                  {r.level}
                </text>
                <rect x="164" y="2" width={r.w} height="8" fill={r.level === 'ERROR' ? MAGENTA : '#2b5a61'} opacity={r.level === 'ERROR' ? 0.55 : 1} />
              </g>
            ))}
          </g>
        </g>
      </g>
      {/* AI analysis */}
      <g data-w-layer="near">
        <rect x="480" y="48" width="280" height="200" fill="#071417" stroke={MAGENTA} strokeWidth="1.5" />
        <Label x={496} y={68} anchor="start" fill={MAGENTA} size={10}>
          AI · ANALYSIS
        </Label>
        <circle cx="560" cy="156" r="58" fill="none" stroke={CYAN} strokeOpacity="0.25" />
        <circle cx="560" cy="156" r="36" fill="none" stroke={CYAN} strokeOpacity="0.25" />
        <g className="w-spin" style={{ transformOrigin: '560px 156px' }}>
          <path d="M560 156 L560 98 A58 58 0 0 1 610 127 Z" fill={CYAN} opacity="0.28" />
        </g>
        <circle cx="586" cy="130" r="5" fill={MAGENTA} />
        <circle cx="540" cy="178" r="3.5" fill={YELLOW} />
        <rect x="636" y="104" width="108" height="8" fill={MAGENTA} opacity="0.8" />
        <rect x="636" y="122" width="84" height="8" fill="#2b5a61" />
        <rect x="636" y="140" width="96" height="8" fill="#2b5a61" />
        <Label x={636} y={176} anchor="start" fill={PAPER} size={10}>
          LIKELY CAUSE
        </Label>
        <rect x="636" y="186" width="104" height="22" fill="none" stroke={YELLOW} strokeWidth="1.5" />
        <Label x={688} y={201} fill={YELLOW} size={10}>
          REVIEW
        </Label>
        {/* severity histogram */}
        <rect x="480" y="270" width="280" height="128" fill="#071417" stroke={CYAN} strokeWidth="1.5" />
        <Label x={496} y={290} anchor="start" size={10}>
          SEVERITY
        </Label>
        {[38, 52, 30, 64, 90, 46, 34, 58, 72, 40].map((h, i) => (
          <rect key={i} x={500 + i * 25} y={386 - h} width="16" height={h} fill={h > 80 ? MAGENTA : h > 55 ? YELLOW : CYAN} opacity="0.85" />
        ))}
      </g>
    </>
  )
}

/* ---------------- Roshan Tiwari Consultants · PRESENCE ---------------- */
export function PresenceScene({ p }: { p: string }) {
  return (
    <>
      <Stage p={p} top="#2a0f2a" glow={MAGENTA} />
      <g data-w-layer="far">
        <polygon points="520,0 600,0 470,450 300,450" fill={MAGENTA} opacity="0.12" />
      </g>
      {/* desktop site */}
      <g data-w-layer="mid">
        <rect x="70" y="58" width="480" height="320" fill="#141019" stroke={PAPER} strokeOpacity="0.7" strokeWidth="1.5" />
        <rect x="70" y="58" width="480" height="24" fill="#201a27" />
        <rect x="150" y="65" width="300" height="10" fill="#332a3c" />
        <rect x="90" y="96" width="70" height="10" fill={PAPER} />
        {[330, 380, 430, 480].map((x) => (
          <rect key={x} x={x} y="98" width="38" height="6" fill="#6b6377" />
        ))}
        <rect x="90" y="128" width="440" height="116" fill="#221a2c" />
        <rect x="110" y="150" width="230" height="18" fill={PAPER} />
        <rect x="110" y="176" width="190" height="18" fill={PAPER} />
        <rect x="110" y="204" width="160" height="7" fill="#8a8296" />
        <rect x="110" y="220" width="96" height="16" rx="8" fill={MAGENTA} />
        <circle cx="440" cy="186" r="40" fill="none" stroke={YELLOW} strokeOpacity="0.6" strokeWidth="2" />
        {[90, 238, 386].map((x) => (
          <g key={x}>
            <rect x={x} y="260" width="136" height="100" fill="#1b1522" stroke="#3a3044" />
            <rect x={x + 14} y="276" width="26" height="26" fill={x === 238 ? CYAN : '#3a3044'} />
            <rect x={x + 14} y="314" width="96" height="7" fill="#8a8296" />
            <rect x={x + 14} y="330" width="70" height="7" fill="#5a5266" />
          </g>
        ))}
      </g>
      {/* phone: the same site, responsive */}
      <g data-w-layer="near">
        <rect x="596" y="96" width="140" height="270" rx="16" fill="#0d0b11" stroke={CYAN} strokeWidth="2" />
        <rect x="608" y="120" width="116" height="226" fill="#141019" />
        <rect x="618" y="132" width="40" height="8" fill={PAPER} />
        <rect x="618" y="154" width="96" height="70" fill="#221a2c" />
        <rect x="626" y="166" width="70" height="10" fill={PAPER} />
        <rect x="626" y="182" width="56" height="10" fill={PAPER} />
        <rect x="626" y="204" width="44" height="10" rx="5" fill={MAGENTA} />
        {[236, 280].map((y) => (
          <rect key={y} x="618" y={y} width="96" height="36" fill="#1b1522" stroke="#3a3044" />
        ))}
        <Label x={666} y={392} size={10}>
          RESPONSIVE
        </Label>
      </g>
    </>
  )
}

/* ---------------- VSCC ERP · FOUNDATION ---------------- */
export function FoundationScene({ p }: { p: string }) {
  return (
    <>
      <Stage p={p} top="#0a1a30" glow={CYAN} />
      {/* blueprint grid */}
      <g data-w-layer="far" stroke={CYAN} strokeOpacity="0.1">
        {Array.from({ length: 21 }, (_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="450" />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="800" y2={i * 40} />
        ))}
      </g>
      {/* tower crane */}
      <g data-w-layer="far">
      <g stroke={YELLOW} strokeWidth="2" fill="none" opacity="0.85">
        <path d="M96 420 V96 M120 420 V96 M96 96 H120" />
        {Array.from({ length: 13 }, (_, i) => (
          <path key={i} d={`M96 ${420 - i * 25} L120 ${395 - i * 25}`} strokeWidth="1.2" />
        ))}
        <path d="M60 96 H300 M60 82 L108 60 L300 92" />
        <line x1="250" y1="96" x2="250" y2="170" strokeWidth="1.5" />
        <rect x="236" y="170" width="28" height="18" fill={YELLOW} fillOpacity="0.25" />
      </g>
      </g>
      {/* ERP dashboard */}
      <g data-w-layer="mid">
        <rect x="300" y="64" width="450" height="290" fill="#0b1422" stroke={CYAN} strokeWidth="1.5" />
        <rect x="300" y="64" width="80" height="290" fill="#0f1c2e" />
        {[90, 116, 142, 168, 194, 220].map((y, i) => (
          <rect key={y} x="314" y={y} width={i === 1 ? 52 : 44} height="8" fill={i === 1 ? CYAN : '#2b4056'} />
        ))}
        <Label x={398} y={92} anchor="start" size={10}>
          ATTENDANCE
        </Label>
        {Array.from({ length: 28 }, (_, i) => (
          <rect key={i} x={398 + (i % 14) * 16} y={102 + Math.floor(i / 14) * 16} width="12" height="12" fill={(i * 7) % 9 === 0 ? MAGENTA : CYAN} opacity={(i * 7) % 9 === 0 ? 0.8 : 0.45} />
        ))}
        <Label x={398} y={162} anchor="start" size={10}>
          PAYROLL
        </Label>
        {[44, 62, 38, 70, 56, 80, 64].map((h, i) => (
          <rect key={i} x={400 + i * 30} y={250 - h} width="18" height={h} fill={CYAN} opacity="0.7" />
        ))}
        <rect x="636" y="94" width="100" height="160" fill="#0f1c2e" />
        <Label x={646} y={112} anchor="start" fill={YELLOW} size={10}>
          APPROVALS
        </Label>
        {[124, 156, 188, 220].map((y, i) => (
          <g key={y}>
            <rect x="646" y={y} width="80" height="22" fill="none" stroke={i === 0 ? YELLOW : '#2b4056'} />
            <rect x="652" y={y + 8} width="44" height="6" fill="#2b4056" />
            <circle cx="716" cy={y + 11} r="4" fill={i === 0 ? YELLOW : CYAN} className={i === 0 ? 'w-pulse' : undefined} />
          </g>
        ))}
        <rect x="398" y="276" width="338" height="62" fill="#0f1c2e" />
        <Label x={410} y={296} anchor="start" size={10}>
          CLIENT BILLING
        </Label>
        <rect x="410" y="308" width="200" height="8" fill="#2b4056" />
        <rect x="410" y="322" width="140" height="8" fill="#2b4056" />
      </g>
      {/* site app on a phone */}
      <g data-w-layer="near">
        <rect x="218" y="196" width="112" height="220" rx="14" fill="#08101b" stroke={MAGENTA} strokeWidth="2" />
        <rect x="228" y="216" width="92" height="180" fill="#0b1422" />
        <Label x={274} y={234} fill={MAGENTA} size={9}>
          SITE REPORT
        </Label>
        <rect x="238" y="244" width="72" height="44" fill="#1a2a3e" />
        <circle cx="274" cy="266" r="10" fill="none" stroke={PAPER} strokeOpacity="0.7" strokeWidth="2" />
        {[298, 312, 326, 340].map((y) => (
          <rect key={y} x="238" y={y} width="72" height="6" fill="#2b4056" />
        ))}
        <rect x="238" y="358" width="72" height="16" fill={MAGENTA} opacity="0.85" />
      </g>
    </>
  )
}
