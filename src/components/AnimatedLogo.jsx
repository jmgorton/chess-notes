import React, { useEffect, useRef } from 'react';

import '../styles/AnimatedLogo.css';

const AnimatedLogo = ({ size = 160 }) => {
  const viewSize = 200;
  const center = viewSize / 2;
  // durations should match the CSS animation durations for each orbit-dot
  const dur1 = 4000; // ms
  const dur2 = 5500; // ms
  const dur3 = 7000; // ms

  const dot1Ref = useRef(null);
  const dot2Ref = useRef(null);
  const dot3Ref = useRef(null);

  useEffect(() => {
    // wait until refs are attached
    if (!dot1Ref.current || !dot2Ref.current || !dot3Ref.current) return;

    // const randomColor = () => `hsl(${Math.floor(Math.random() * 360)} 85% 60%)`;
    // softer, more neutral palette (muted pastels / warm neutrals)
    const palette = [
      '#D8CEC0', // warm tan
      '#CFC6BA', // muted beige
      '#BFB7A8', // gray-beige
      '#D9E6DF', // pale sage
      '#CFE6E1', // pale aqua
      '#E6E9F0', // soft steel blue
      '#EDE3DB', // light warm cream
      '#D9C7B0', // pale brown
      '#BFAAA0', // muted brown
      '#C9D6C8', // soft green
      '#E7E3DA', // sand
      '#DAD7D1', // cool gray
      '#CFC8BF', // taupe
      '#EDE7D8', // light tan
      '#D8E6EA', // pale blue
      // additional slightly more colorful, lower-lightness earth tones:
      '#A67C52', // warm brown
      '#8C6B4A', // deeper brown
      '#7F6A55', // muted umber
      '#6E8B6E', // muted olive-green
      '#6A8493', // desaturated teal-blue
      '#9A8F7F'  // dusty khaki
    ];
    const randomColor = () => palette[Math.floor(Math.random() * palette.length)];

    // set initial colors safely
    dot1Ref.current && dot1Ref.current.setAttribute('fill', randomColor());
    dot2Ref.current && dot2Ref.current.setAttribute('fill', randomColor());
    dot3Ref.current && dot3Ref.current.setAttribute('fill', randomColor());

    const i1 = setInterval(() => {
      dot1Ref.current && dot1Ref.current.setAttribute('fill', randomColor());
    }, dur1);
    const i2 = setInterval(() => {
      dot2Ref.current && dot2Ref.current.setAttribute('fill', randomColor());
    }, dur2);
    const i3 = setInterval(() => {
      dot3Ref.current && dot3Ref.current.setAttribute('fill', randomColor());
    }, dur3);

    return () => { clearInterval(i1); clearInterval(i2); clearInterval(i3); };
  }, []);

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
            {/* base radii set to the largest size; CSS will scale the whole group from ~45 -> 80 */}
            <circle className="orbit orbit1" r="80" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
            <circle className="orbit orbit2" r="60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.2" />

            <g className="orbit-dots">
              <circle ref={dot1Ref} className="orbit-dot dot1" r="6" cx="80" cy="0" />
              <circle ref={dot2Ref} className="orbit-dot dot2" r="5" cx="0" cy="-60" />
              <circle ref={dot3Ref} className="orbit-dot dot3" r="4" cx="-80" cy="0" />
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
