/**
 * Approved mascot artwork (Phase 1, round 3). Source of truth:
 * docs/mascot-sprite.svg. Rendered once in the app shell; <Mascot>
 * and <Drone> reference these symbols with <use>, so the art ships once.
 */
export function MascotSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <symbol id="kvg-katana-back" viewBox="0 0 120 140" overflow="visible">
          <path d="M22 138 L98 54" stroke="#0A0A0F" strokeWidth="7" strokeLinecap="round" />
          <path d="M22 138 L98 54" stroke="#1D1D27" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M30 128 L94 58" stroke="#00E5FF" strokeWidth="0.8" />
          <ellipse cx="99" cy="52" rx="7" ry="2.6" transform="rotate(-48 99 52)" fill="#F5E500" stroke="#0A0A0F" strokeWidth="1.2" />
          <path d="M100 51 L114 30" stroke="#0A0A0F" strokeWidth="6.5" strokeLinecap="round" />
          <path d="M102 47 L106 44 M104 43 L108 40 M106 39 L110 36 M108 35 L112 32" stroke="#FF2A6D" strokeWidth="1.6" />
          <circle cx="115" cy="28" r="2.8" fill="#FF2A6D" stroke="#0A0A0F" strokeWidth="1" />
        </symbol>

        <symbol id="kvg-body" viewBox="0 0 120 140">
          <path d="M2 140 L10 106 L38 94 L60 108 L82 94 L110 106 L118 140 Z" fill="#0A0A0F" stroke="#00E5FF" strokeWidth="1.4" />
          <path d="M10 106 L38 94 L34 114 L6 120 Z" fill="#1D1D27" stroke="#00E5FF" strokeWidth="1.2" />
          <path d="M110 106 L82 94 L86 114 L114 120 Z" fill="#1D1D27" stroke="#00E5FF" strokeWidth="1.2" />
          <path d="M34 116 L80 140" stroke="#FF2A6D" strokeWidth="4" />
          <polygon points="74,118 80,114 86,118 86,125 80,129 74,125" fill="none" stroke="#F5E500" strokeWidth="1.2" />
          <polygon points="36,96 44,74 60,84 76,74 84,96 60,110" fill="#16161E" stroke="#00E5FF" strokeWidth="1.2" />
          <polygon points="40,40 41,62 49,76 60,80 71,76 79,62 80,40 60,33" fill="#F4F1EA" stroke="#0A0A0F" strokeWidth="2" />
        </symbol>

        <symbol id="kvg-kunai-strap" viewBox="0 0 120 140">
          <g fill="#D8DBE3" stroke="#0A0A0F" strokeWidth="0.7">
            <path d="M45 114 L47.5 121 L45 128 L42.5 121 Z" />
            <path d="M55 119 L57.5 126 L55 133 L52.5 126 Z" />
            <path d="M65 124 L67.5 131 L65 138 L62.5 131 Z" />
          </g>
          <g stroke="#00E5FF" strokeWidth="0.6">
            <line x1="45" y1="115" x2="45" y2="127" />
            <line x1="55" y1="120" x2="55" y2="132" />
            <line x1="65" y1="125" x2="65" y2="137" />
          </g>
        </symbol>

        <symbol id="kvg-mask-up" viewBox="0 0 120 140">
          <path d="M41 61 L49 76 L60 80 L71 76 L79 61 L60 65 Z" fill="#0A0A0F" stroke="#00E5FF" strokeWidth="1" />
          <g stroke="#00E5FF" strokeWidth="1">
            <line x1="54" y1="70" x2="54" y2="75" />
            <line x1="58" y1="70" x2="58" y2="76" />
            <line x1="62" y1="70" x2="62" y2="76" />
            <line x1="66" y1="70" x2="66" y2="75" />
          </g>
        </symbol>

        <symbol id="kvg-mask-down" viewBox="0 0 120 140">
          <path d="M52 68.5 Q59 71.5 66 66.5" stroke="#0A0A0F" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M66 66.5 L68.5 64" stroke="#0A0A0F" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M62 69.6 L64 68.8 L63.4 71.2 Z" fill="#FFFFFF" stroke="#0A0A0F" strokeWidth="0.5" />
          <path d="M42 84 L78 84 L82 94 L60 101 L38 94 Z" fill="#0A0A0F" stroke="#00E5FF" strokeWidth="1" />
          <g stroke="#00E5FF" strokeWidth="1">
            <line x1="54" y1="88" x2="54" y2="93" />
            <line x1="58" y1="88" x2="58" y2="94" />
            <line x1="62" y1="88" x2="62" y2="94" />
            <line x1="66" y1="88" x2="66" y2="93" />
          </g>
        </symbol>

        <symbol id="kvg-head" viewBox="0 0 120 140">
          <polygon
            points="38,54 31,36 22,40 29,26 14,18 34,17 30,4 48,12 56,0 64,11 82,1 80,16 102,10 90,26 106,32 86,36 82,54 78,40 68,32 58,38 48,32 41,42"
            fill="#0A0A0F"
            stroke="#00E5FF"
            strokeWidth="0.8"
          />
          <polygon points="56,0 64,11 60,15 51,7" fill="#FF2A6D" />
          <path d="M44 45 L57 49" stroke="#0A0A0F" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M45 51 L57 53 L56 56 L47 55 Z" fill="#0A0A0F" />
          <circle cx="53" cy="53.6" r="0.9" fill="#FFFFFF" />
          <line x1="47" y1="39" x2="52" y2="50" stroke="#FF2A6D" strokeWidth="1.3" />
          <path d="M63 49 L77 44" stroke="#0A0A0F" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="69" cy="53" r="3.6" fill="#00E5FF" />
          <circle cx="69" cy="53" r="1.3" fill="#0A0A0F" />
          <circle cx="69" cy="53" r="7" fill="none" stroke="#00E5FF" strokeWidth="0.8" strokeDasharray="3 2" />
          <polyline points="75,56 78,60 78,66" fill="none" stroke="#00E5FF" strokeWidth="1" />
          <line x1="76" y1="49" x2="98" y2="42" stroke="#00E5FF" strokeWidth="0.7" />
        </symbol>

        <symbol id="kvg-drone" viewBox="0 0 40 32">
          <line x1="6" y1="5" x2="34" y2="5" stroke="#888888" strokeWidth="2" />
          <line x1="20" y1="5" x2="20" y2="10" stroke="#888888" strokeWidth="1.5" />
          <ellipse cx="20" cy="18" rx="13" ry="9" fill="#0A0A0F" stroke="#00E5FF" strokeWidth="1.2" />
          <circle cx="22" cy="18" r="4" fill="#00E5FF" />
          <circle cx="23" cy="18" r="1.6" fill="#0A0A0F" />
          <line x1="12" y1="26" x2="9" y2="31" stroke="#00E5FF" strokeWidth="1" />
          <line x1="28" y1="26" x2="31" y2="31" stroke="#00E5FF" strokeWidth="1" />
        </symbol>

        <symbol id="kvg-shuriken" viewBox="0 0 60 60">
          <polygon points="30,4 37,23 56,30 37,37 30,56 23,37 4,30 23,23" fill="#D8DBE3" stroke="#0A0A0F" strokeWidth="1.2" />
          <path d="M30 4 L30 56 M4 30 L56 30" stroke="#00E5FF" strokeWidth="0.8" />
          <circle cx="30" cy="30" r="5.5" fill="#0A0A0F" stroke="#FF2A6D" strokeWidth="1.5" />
        </symbol>
      </defs>
    </svg>
  )
}
