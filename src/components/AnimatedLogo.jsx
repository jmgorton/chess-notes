import React from 'react';

const AnimatedLogo = ({ size = 160 }) => {
  const viewSize = 200;
  const center = viewSize / 2;
  return (
    <div className="animated-logo-wrapper" aria-hidden>
      <svg
        className="animated-logo"
        width={size}
        height={size}
        viewBox={`0 0 ${viewSize} ${viewSize}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <defs>
          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0b1220" floodOpacity="0.6" />
          </filter>
          <radialGradient id="glow" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.00" />
          </radialGradient>
        </defs>

        <g transform={`translate(${center} ${center})`}>
          <circle className="logo-glow" r="86" fill="url(#glow)" />

          <g className="orbits" transform="translate(0 0)">
            <circle className="orbit orbit1" r="76" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
            <circle className="orbit orbit2" r="56" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.2" />

            <g className="orbit-dots">
              <circle className="orbit-dot dot1" r="6" cx="76" cy="0" fill="#4C9AFF" />
              <circle className="orbit-dot dot2" r="5" cx="0" cy="-56" fill="#FFD54F" />
              <circle className="orbit-dot dot3" r="4" cx="-76" cy="0" fill="#FF6B6B" />
            </g>
          </g>

          <g className="logo-image-group">
            <image
              className="logo-image"
              href="/logo192.png"
              x={-44}
              y={-44}
              width="88"
              height="88"
              style={{ filter: 'url(#softShadow)' }}
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default AnimatedLogo;
