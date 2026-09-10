/**
 * LookBy wordmark — Pinyon Script + rose-gold metallic SVG treatment.
 * Three stacked text passes: base metal, specular highlight, edge gloss.
 * All colour values calibrated for studio-light from upper-left at ~135°.
 */

type LogoProps = {
  /** Height in px — width scales automatically via viewBox aspect ratio */
  height?: number;
  /** "dark" shows a subtle ambient glow; "light" omits it for white grounds */
  ground?: "dark" | "light";
};

export default function Logo({ height = 44, ground = "dark" }: LogoProps) {
  // viewBox is 340 × 90 — matches the natural em-box of Pinyon Script at 80px
  const vw = 340;
  const vh = 90;

  return (
    <svg
      viewBox={`0 0 ${vw} ${vh}`}
      height={height}
      width={(height * vw) / vh}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="LookBy"
      className="lookby-logo"
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        {/* ── Rose-gold metallic base gradient ── */}
        <linearGradient id="lb-rg-base" x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%"   stopColor="#6B2D1A" />
          <stop offset="8%"   stopColor="#A85030" />
          <stop offset="20%"  stopColor="#C87848" />
          <stop offset="32%"  stopColor="#E4A870" />
          <stop offset="44%"  stopColor="#F8D8A8" /> {/* primary highlight peak */}
          <stop offset="52%"  stopColor="#FDECD4" /> {/* specular hot-spot */}
          <stop offset="60%"  stopColor="#E8B880" />
          <stop offset="72%"  stopColor="#C88050" />
          <stop offset="84%"  stopColor="#A05838" />
          <stop offset="100%" stopColor="#6B2D1A" />
        </linearGradient>

        {/* ── Specular diagonal shine ── */}
        <linearGradient id="lb-rg-shine" x1="5%" y1="0%" x2="95%" y2="100%">
          <stop offset="0%"   stopColor="rgba(255,240,220,0)"   />
          <stop offset="30%"  stopColor="rgba(255,240,220,0)"   />
          <stop offset="42%"  stopColor="rgba(255,248,235,0.28)"/>
          <stop offset="50%"  stopColor="rgba(255,252,245,0.52)"/>  {/* hot-spot */}
          <stop offset="58%"  stopColor="rgba(255,248,235,0.20)"/>
          <stop offset="70%"  stopColor="rgba(255,240,220,0)"   />
          <stop offset="100%" stopColor="rgba(255,240,220,0)"   />
        </linearGradient>

        {/* ── Bottom-edge gloss (reflected light) ── */}
        <linearGradient id="lb-rg-gloss" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="rgba(240,200,160,0)"   />
          <stop offset="60%"  stopColor="rgba(240,200,160,0)"   />
          <stop offset="78%"  stopColor="rgba(240,200,160,0.18)"/>
          <stop offset="92%"  stopColor="rgba(255,220,180,0.32)"/>
          <stop offset="100%" stopColor="rgba(255,220,180,0.18)"/>
        </linearGradient>

        {/* ── Drop shadow filter ── */}
        <filter id="lb-shadow" x="-8%" y="-15%" width="116%" height="145%">
          <feDropShadow
            dx="0"
            dy="2.5"
            stdDeviation="4"
            floodColor="#5A1A0A"
            floodOpacity={ground === "dark" ? 0.55 : 0.2}
          />
        </filter>

        {/* ── Ambient glow (dark ground only) ── */}
        {ground === "dark" && (
          <filter id="lb-glow" x="-12%" y="-20%" width="124%" height="155%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}

        {/* ── Clip: keep shine inside letter shapes ── */}
        <clipPath id="lb-clip">
          <text
            x="50%"
            y="76"
            textAnchor="middle"
            fontFamily="'Pinyon Script', cursive"
            fontSize="82"
          >
            LookBy
          </text>
        </clipPath>
      </defs>

      {/* ── Layer 0: ambient glow halo (dark ground only) ── */}
      {ground === "dark" && (
        <text
          x="50%"
          y="76"
          textAnchor="middle"
          fontFamily="'Pinyon Script', cursive"
          fontSize="82"
          fill="rgba(200,100,60,0.18)"
          filter="url(#lb-glow)"
          aria-hidden="true"
        >
          LookBy
        </text>
      )}

      {/* ── Layer 1: base metallic rose-gold ── */}
      <text
        x="50%"
        y="76"
        textAnchor="middle"
        fontFamily="'Pinyon Script', cursive"
        fontSize="82"
        fill="url(#lb-rg-base)"
        filter="url(#lb-shadow)"
      >
        LookBy
      </text>

      {/* ── Layer 2: specular diagonal shine (clipped to letters) ── */}
      <rect
        x="0" y="0"
        width={vw} height={vh}
        fill="url(#lb-rg-shine)"
        clipPath="url(#lb-clip)"
      />

      {/* ── Layer 3: bottom reflected gloss ── */}
      <rect
        x="0" y="0"
        width={vw} height={vh}
        fill="url(#lb-rg-gloss)"
        clipPath="url(#lb-clip)"
      />
    </svg>
  );
}
