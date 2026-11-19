/**
 * Living jungle around the expedition: creatures drawn in SVG and animated with CSS.
 * Purely decorative (aria-hidden, no pointer events) and never shown while a child is answering.
 */

function Monkey() {
  return (
    <svg viewBox="0 0 60 74" className="jl-monkey-svg">
      <path d="M30 0v15" stroke="#6b3f1d" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M38 52c10 2 14 10 9 16-3 4-8 2-7-2" fill="none" stroke="#7a4a24" strokeWidth="3.2" strokeLinecap="round" className="jl-tail" />
      <ellipse cx="30" cy="45" rx="10" ry="12" fill="#7a4a24" />
      <ellipse cx="30" cy="47" rx="6" ry="8" fill="#e8c39a" />
      <path d="M22 54c-3 6-2 10 1 12M38 54c3 6 2 10-1 12" stroke="#7a4a24" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M22 38c-6 4-8 9-6 13" stroke="#7a4a24" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="18.5" cy="23" r="4.6" fill="#7a4a24" />
      <circle cx="41.5" cy="23" r="4.6" fill="#7a4a24" />
      <circle cx="18.5" cy="23" r="2.3" fill="#e8c39a" />
      <circle cx="41.5" cy="23" r="2.3" fill="#e8c39a" />
      <circle cx="30" cy="24" r="11" fill="#7a4a24" />
      <path d="M22 26c0-5 4-7 8-5 4-2 8 0 8 5 0 5-4 8-8 8s-8-3-8-8z" fill="#e8c39a" />
      <g className="jl-blink">
        <circle cx="26.6" cy="24.5" r="1.6" fill="#24160b" />
        <circle cx="33.4" cy="24.5" r="1.6" fill="#24160b" />
      </g>
      <path d="M27 29.5c1.8 1.6 4.2 1.6 6 0" stroke="#24160b" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Parrot() {
  return (
    <svg viewBox="0 0 60 36" className="jl-parrot-svg">
      <path d="M8 22c-6 4-8 10-6 13 4-3 8-7 12-9z" fill="#2b6fd6" />
      <ellipse cx="26" cy="20" rx="14" ry="8" fill="#e23b2e" />
      <circle cx="40" cy="15" r="7" fill="#e23b2e" />
      <path d="M46 13c5 0 7 3 6 6-2-1-4-2-6-1z" fill="#f6c453" />
      <circle cx="41.5" cy="13.5" r="1.4" fill="#1b1206" />
      <path className="jl-wing" d="M22 18c2-12 12-17 20-15-6 3-10 9-12 16z" fill="#f6c453" />
      <path className="jl-wing" d="M22 18c2-9 9-13 16-12-5 3-8 8-10 13z" fill="#2fa84f" />
    </svg>
  );
}

function Elephant() {
  return (
    <svg viewBox="0 0 90 56" className="jl-elephant-svg">
      <path d="M14 22c0-12 12-18 30-18s30 6 30 18v10H14z" fill="currentColor" />
      <path d="M70 14c10 0 16 6 16 14 0 6-2 12-4 18-1 3-4 3-4 0 0-5 2-10 0-14-2-3-6-2-8-1z" fill="currentColor" />
      <path d="M62 10c-8 0-12 6-10 14 2 6 8 6 12 2z" fill="currentColor" opacity=".75" />
      <g className="jl-legs">
        <rect x="18" y="30" width="8" height="20" rx="3" fill="currentColor" />
        <rect x="30" y="30" width="8" height="20" rx="3" fill="currentColor" />
        <rect x="50" y="30" width="8" height="20" rx="3" fill="currentColor" />
        <rect x="62" y="30" width="8" height="20" rx="3" fill="currentColor" />
      </g>
      <path d="M14 20c-4 2-6 6-5 10" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Bat() {
  return (
    <svg viewBox="0 0 60 30" className="jl-bat-svg">
      <path className="jl-batwing left" d="M30 14C24 4 12 2 2 8c6 1 8 5 7 9 4-3 8-2 10 1 2-3 6-4 11-4z" fill="#2a2140" />
      <path className="jl-batwing right" d="M30 14c6-10 18-12 28-6-6 1-8 5-7 9-4-3-8-2-10 1-2-3-6-4-11-4z" fill="#2a2140" />
      <ellipse cx="30" cy="15" rx="4.5" ry="6" fill="#2a2140" />
      <path d="M27 9l1-4 2 3 2-3 1 4z" fill="#2a2140" />
      <circle cx="28.4" cy="13.5" r="0.9" fill="#ffd34d" />
      <circle cx="31.6" cy="13.5" r="0.9" fill="#ffd34d" />
    </svg>
  );
}

/** A dark bush with eyes that blink. Spooky, never scary. */
function EyesBush({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 64" className={`jl-bush-svg ${className}`}>
      <path d="M4 64c-4-18 8-30 22-28 2-16 22-24 34-12 10-12 32-8 36 8 14-2 26 12 20 32z" fill="#173a24" />
      <path d="M14 64c0-10 8-16 16-14M58 30c8-6 18-4 22 4M92 40c8 0 14 6 14 14" stroke="#24563a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <g className="jl-eyes e1">
        <ellipse cx="40" cy="44" rx="4.2" ry="3.2" fill="#ffd84a" />
        <ellipse cx="54" cy="44" rx="4.2" ry="3.2" fill="#ffd84a" />
        <ellipse cx="40.6" cy="44" rx="1.3" ry="2.4" fill="#1a1205" />
        <ellipse cx="54.6" cy="44" rx="1.3" ry="2.4" fill="#1a1205" />
      </g>
      <g className="jl-eyes e2">
        <ellipse cx="80" cy="50" rx="3.2" ry="2.5" fill="#9ef06b" />
        <ellipse cx="91" cy="50" rx="3.2" ry="2.5" fill="#9ef06b" />
        <circle cx="80.4" cy="50" r="1.1" fill="#0d1a08" />
        <circle cx="91.4" cy="50" r="1.1" fill="#0d1a08" />
      </g>
    </svg>
  );
}

function LionCub() {
  return (
    <svg viewBox="0 0 70 60" className="jl-lion-svg">
      <circle cx="35" cy="30" r="24" fill="#c9701e" />
      <g fill="#b05a12">
        <circle cx="14" cy="22" r="7" /><circle cx="56" cy="22" r="7" /><circle cx="20" cy="10" r="7" /><circle cx="50" cy="10" r="7" /><circle cx="35" cy="6" r="7" />
      </g>
      <circle cx="35" cy="32" r="16" fill="#f0b45c" />
      <circle cx="23" cy="19" r="4" fill="#f0b45c" /><circle cx="47" cy="19" r="4" fill="#f0b45c" />
      <g className="jl-blink">
        <circle cx="29" cy="30" r="2.2" fill="#2a1a08" /><circle cx="41" cy="30" r="2.2" fill="#2a1a08" />
        <circle cx="29.7" cy="29.3" r="0.7" fill="#fff" /><circle cx="41.7" cy="29.3" r="0.7" fill="#fff" />
      </g>
      <path d="M32 36h6l-3 3z" fill="#6b3a12" />
      <path d="M35 39c-1 3-4 4-6 3M35 39c1 3 4 4 6 3" stroke="#6b3a12" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Ìjàpá the tortoise, star of Nigerian folk tales, taking his time across the jungle floor. */
function Tortoise() {
  return (
    <svg viewBox="0 0 80 40" className="jl-tortoise-svg">
      <g className="jl-tlegs">
        <rect x="16" y="26" width="7" height="10" rx="3" fill="#7c9a3c" />
        <rect x="50" y="26" width="7" height="10" rx="3" fill="#7c9a3c" />
      </g>
      <g className="jl-tlegs alt">
        <rect x="26" y="27" width="6" height="9" rx="3" fill="#6b8a33" />
        <rect x="42" y="27" width="6" height="9" rx="3" fill="#6b8a33" />
      </g>
      <g className="jl-thead">
        <ellipse cx="66" cy="22" rx="8" ry="6" fill="#86a845" />
        <circle cx="69" cy="20.5" r="1.3" fill="#1d2a0a" />
        <path d="M68 25c2 0 4-1 5-2" stroke="#3d5218" strokeWidth="1" fill="none" strokeLinecap="round" />
      </g>
      <path d="M8 28c0-14 12-24 28-24s28 10 28 24z" fill="#8a5a24" />
      <path d="M18 27c2-8 8-14 18-14s16 6 18 14M36 5v8M24 9l5 7M48 9l-5 7" stroke="#5e3b14" strokeWidth="2" fill="none" />
      <path d="M8 28h56" stroke="#5e3b14" strokeWidth="2.4" />
    </svg>
  );
}

function Owl() {
  return (
    <svg viewBox="0 0 60 80" className="jl-owl-svg">
      <path d="M2 70h56" stroke="#5a3a1a" strokeWidth="5" strokeLinecap="round" />
      <path d="M10 30c0-14 9-22 20-22s20 8 20 22v26c0 8-9 14-20 14s-20-6-20-14z" fill="#6e5236" />
      <path d="M12 12l7 8M48 12l-7 8" stroke="#6e5236" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="30" cy="54" rx="12" ry="13" fill="#c9a97a" />
      <circle cx="21" cy="32" r="8" fill="#f5ead2" /><circle cx="39" cy="32" r="8" fill="#f5ead2" />
      <g className="jl-owleyes">
        <circle cx="21" cy="32" r="4.4" fill="#f2a516" /><circle cx="39" cy="32" r="4.4" fill="#f2a516" />
        <circle cx="21" cy="32" r="2.2" fill="#1a1205" /><circle cx="39" cy="32" r="2.2" fill="#1a1205" />
      </g>
      <path d="M27 38l3 5 3-5z" fill="#e08a1a" />
      <path d="M22 68l-2 4M30 69v4M38 68l2 4" stroke="#e08a1a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Fern({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 60 70" className={`jl-fern${flip ? " flip" : ""}`}>
      <path d="M30 70C28 46 20 26 6 10" stroke="#1f5c34" strokeWidth="3" fill="none" strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${27 - i * 4} ${58 - i * 10}c-8-2-14-8-14-14 6 2 12 6 14 14zm1 0c4-8 10-11 16-11-2 6-8 10-16 11z`} fill={i % 2 ? "#2f7a43" : "#3c9150"} />
      ))}
    </svg>
  );
}

/** Creatures for the scenic banner at Camp (daytime savanna) and on the Trail (dusk, a little spooky). */
export function BannerCreatures({ scene }: { scene: "camp" | "trail" }) {
  if (scene === "camp") {
    return (
      <div className="jl-banner" aria-hidden="true">
        <span className="jl-elephant"><Elephant /></span>
        <span className="jl-parrot"><span className="jl-parrot-bob"><Parrot /></span></span>
        <span className="jl-vine-swing right"><span className="jl-vine" /><Monkey /></span>
      </div>
    );
  }
  return (
    <div className="jl-banner is-dusk" aria-hidden="true">
      <span className="jl-bat"><span className="jl-bat-bob"><Bat /></span></span>
      <span className="jl-banner-bush"><EyesBush /></span>
      <span className="jl-vine-swing left slow"><span className="jl-vine" /><Monkey /></span>
    </div>
  );
}

/** Jungle floor along the bottom of the screen, plus canopy creatures at the sides on wide screens. */
export function JungleLife() {
  return (
    <div className="jungle-life" aria-hidden="true">
      <div className="jl-side left">
        <span className="jl-owl"><Owl /></span>
      </div>
      <div className="jl-side right">
        <span className="jl-vine-swing tall"><span className="jl-vine" /><Monkey /></span>
      </div>
      <div className="jl-floor">
        <span className="jl-fireflies"><i /><i /><i /><i /><i /><i /></span>
        <span className="jl-ferns l"><Fern /><Fern flip /></span>
        <span className="jl-lion"><LionCub /></span>
        <span className="jl-tortoise"><Tortoise /></span>
        <span className="jl-floor-bush"><EyesBush /></span>
        <span className="jl-ferns r"><Fern /><Fern flip /></span>
        <span className="jl-grass" />
      </div>
    </div>
  );
}

/** Opening act: a night-time jungle that presents PROMISEVISUALS before the Quizy card. */
export function JungleIntro() {
  return (
    <span className="jl-intro" aria-hidden="true">
      <span className="jl-intro-moon" />
      <span className="jl-vine-swing jl-i1"><span className="jl-vine" /><Monkey /></span>
      <span className="jl-vine-swing jl-i2"><span className="jl-vine" /><Monkey /></span>
      <span className="jl-intro-owl"><Owl /></span>
      <span className="jl-fireflies jl-intro-flies"><i /><i /><i /><i /><i /><i /></span>
      <span className="jl-intro-bush l"><EyesBush /></span>
      <span className="jl-intro-bush r"><EyesBush /></span>
      <span className="jl-intro-ferns"><Fern /><Fern flip /><Fern /><Fern flip /></span>
      <span className="jl-intro-title">
        <small>a product of</small>
        <strong>PROMISEVISUALS</strong>
        <em><span className="pv-flag"><i /><i /><i /></span> Made in Nigeria</em>
      </span>
    </span>
  );
}
