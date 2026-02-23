'use client'

import styles from './SpaceScene.module.css'

/*
  Saturn-like ring system using explicit top/bottom arc halves.
  Top arcs are drawn behind the planet, bottom arcs in front.
  Each ring: [rx, ry, color, strokeWidth]
*/
const CX = 130
const CY = 110
const TILT = -15 // degrees

const ringDefs: [number, number, string, number][] = [
  /* Inner cluster */
  [92, 18, 'rgba(139, 92, 246, 0.08)', 1],
  [94, 18.5, 'rgba(180, 200, 255, 0.1)', 1.5],
  [97, 19.2, 'rgba(34, 211, 238, 0.07)', 1],
  [99, 19.7, 'rgba(200, 210, 255, 0.09)', 1.2],
  /* Cassini gap */
  /* Main cluster */
  [104, 20.8, 'rgba(180, 200, 255, 0.11)', 1.5],
  [107, 21.4, 'rgba(34, 211, 238, 0.09)', 1],
  [109, 21.8, 'rgba(255, 255, 255, 0.08)', 1.2],
  [111, 22.2, 'rgba(139, 92, 246, 0.07)', 1],
  [113, 22.6, 'rgba(180, 200, 255, 0.1)', 1.5],
  [116, 23.2, 'rgba(34, 211, 238, 0.08)', 1],
  [118, 23.6, 'rgba(200, 220, 255, 0.09)', 1.2],
  /* Outer cluster */
  [121, 24.2, 'rgba(180, 200, 255, 0.08)', 1],
  [123, 24.6, 'rgba(34, 211, 238, 0.07)', 1.5],
  [126, 25.2, 'rgba(139, 92, 246, 0.06)', 1],
  [128, 25.6, 'rgba(255, 255, 255, 0.07)', 1.2],
]

/* SVG arc path for the top half of an ellipse (from right to left) */
function topArc(rx: number, ry: number) {
  return `M${CX + rx},${CY} A${rx},${ry} 0 0,0 ${CX - rx},${CY}`
}

/* SVG arc path for the bottom half of an ellipse (from left to right) */
function bottomArc(rx: number, ry: number) {
  return `M${CX - rx},${CY} A${rx},${ry} 0 0,0 ${CX + rx},${CY}`
}

function RingHalves({ half }: { half: 'top' | 'bottom' }) {
  const arcFn = half === 'top' ? topArc : bottomArc
  return (
    <>
      {ringDefs.map(([rx, ry, color, sw], i) => (
        <path
          key={i}
          d={arcFn(rx, ry)}
          fill="none"
          stroke={color}
          strokeWidth={sw}
        />
      ))}
    </>
  )
}

export function SpaceScene() {
  return (
    <div className={styles.sceneContainer} aria-hidden>
      <svg
        className={styles.planet}
        viewBox="0 0 260 220"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="planetGrad" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#3adcf0" />
            <stop offset="30%" stopColor="#22a8c8" />
            <stop offset="55%" stopColor="#4a5ab0" />
            <stop offset="80%" stopColor="#1a2850" />
            <stop offset="100%" stopColor="#0e1630" />
          </radialGradient>
          <radialGradient id="planetShadow" cx="68%" cy="62%" r="50%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(7, 10, 18, 0.75)" />
          </radialGradient>
          <clipPath id="planetClip">
            <circle cx={CX} cy={CY} r="82" />
          </clipPath>
        </defs>

        {/* 1. TOP half of rings — behind the planet */}
        <g transform={`rotate(${TILT}, ${CX}, ${CY})`}>
          <RingHalves half="top" />
        </g>

        {/* 2. Opaque planet body */}
        <circle cx={CX} cy={CY} r="82" fill="#0e1630" />
        <circle cx={CX} cy={CY} r="82" fill="url(#planetGrad)" />

        {/* 3. Surface bands — clipped to sphere */}
        <g clipPath="url(#planetClip)">
          <ellipse cx="130" cy="50" rx="84" ry="10" fill="rgba(34, 211, 238, 0.18)" />
          <ellipse cx="130" cy="66" rx="84" ry="7" fill="rgba(139, 92, 246, 0.14)" />
          <ellipse cx="130" cy="80" rx="84" ry="9" fill="rgba(34, 211, 238, 0.12)" />
          <ellipse cx="130" cy="94" rx="84" ry="6" fill="rgba(100, 140, 230, 0.13)" />
          <ellipse cx="130" cy="108" rx="84" ry="8" fill="rgba(139, 92, 246, 0.1)" />
          <ellipse cx="130" cy="122" rx="84" ry="7" fill="rgba(34, 211, 238, 0.12)" />
          <ellipse cx="130" cy="136" rx="84" ry="11" fill="rgba(80, 120, 220, 0.12)" />
          <ellipse cx="130" cy="150" rx="84" ry="8" fill="rgba(139, 92, 246, 0.1)" />
          <ellipse cx="130" cy="162" rx="84" ry="6" fill="rgba(34, 211, 238, 0.08)" />
          <ellipse cx="98" cy="102" rx="14" ry="9" fill="rgba(139, 92, 246, 0.2)" />
        </g>

        {/* 4. Shadow overlay */}
        <circle cx={CX} cy={CY} r="82" fill="url(#planetShadow)" />

        {/* 5. BOTTOM half of rings — in front of the planet */}
        <g transform={`rotate(${TILT}, ${CX}, ${CY})`}>
          <RingHalves half="bottom" />
        </g>
      </svg>

      <div className={`${styles.comet} ${styles.comet1}`} />
      <div className={`${styles.comet} ${styles.comet2}`} />
      <div className={`${styles.comet} ${styles.comet3}`} />
      <div className={`${styles.comet} ${styles.comet4}`} />
    </div>
  )
}
