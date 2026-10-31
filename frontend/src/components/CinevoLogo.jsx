import React from 'react';

function CinevoLogo({ size = 36, showText = true, className = '' }) {
  return (
    <div className={`d-inline-flex align-items-center gap-2 ${className}`}>
      {/* Custom Designed Cinevo Cinema Reel Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shadow-sm"
        style={{ borderRadius: `${Math.round(size * 0.28)}px` }}
      >
        <defs>
          <linearGradient id="cinevoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="innerGlow" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
          </linearGradient>
          <filter id="badgeShadow" x="-2" y="-2" width="52" height="52" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#e11d48" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Outer squircle */}
        <rect width="48" height="48" rx="14" fill="url(#cinevoGrad)" filter="url(#badgeShadow)" />

        {/* Outer Cinema Film Reel Ring with subtle sprockets */}
        <circle cx="24" cy="24" r="16" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeDasharray="3 3" />

        {/* Aperture Triangles / Blades */}
        <path
          d="M24 10 L28 18 L20 18 Z"
          fill="rgba(255,255,255,0.3)"
        />
        <path
          d="M38 24 L30 28 L30 20 Z"
          fill="rgba(255,255,255,0.3)"
        />

        {/* Main Central Play Triangle (Stylized Cinema Action) */}
        <path
          d="M19 14.5 C19 13.2 20.4 12.4 21.5 13.1 L33.2 20.6 C34.3 21.3 34.3 22.9 33.2 23.6 L21.5 31.1 C20.4 31.8 19 31.0 19 29.7 Z"
          fill="#ffffff"
        />

        {/* Dynamic Lens Flare / Star Accent */}
        <circle cx="24" cy="22" r="3.5" fill="url(#innerGlow)" />
        <circle cx="34" cy="14" r="1.5" fill="#ffffff" opacity="0.9" />
      </svg>

      {showText && (
        <span
          className="brand-font fw-black tracking-tight"
          style={{
            fontSize: `${Math.round(size * 0.65)}px`,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: '#0f172a',
          }}
        >
          CINE<span style={{ color: '#e11d48' }}>VO</span>
        </span>
      )}
    </div>
  );
}

export default CinevoLogo;
