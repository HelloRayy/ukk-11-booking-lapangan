interface CenterFlyingLogoProps {
  centerLogoRef: React.RefObject<HTMLDivElement | null>
  ballRef: React.RefObject<SVGGElement | null>
}

export default function CenterFlyingLogo({ centerLogoRef, ballRef }: CenterFlyingLogoProps) {
  return (
    <div
      ref={centerLogoRef}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[94px] w-[114px] z-30 pointer-events-none"
    >
      <svg
        aria-hidden="true"
        className="h-full w-auto block overflow-visible"
        width="109"
        height="21"
        fill="none"
        viewBox="0 0 109 21"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g ref={ballRef} className="origin-center" style={{ transformBox: 'fill-box' }}>
          <path
            d="m17.09 18.42-1.84-1.02a7.01 7.01 0 0 1-8.84-4.92l-1.84-1.02a8.66 8.66 0 0 0 12.52 6.96Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.63 6.46a8.67 8.67 0 1 1 14.33 9.64l3.33 1.86-.85 1.52L1 7.55l.85-1.52L5.03 7.8c.16-.46.36-.9.6-1.34Zm12.88 8.84L6.48 8.6a7.06 7.06 0 0 1 10.15-4.08A7.04 7.04 0 0 1 18.5 15.3Z"
            fill="currentColor"
          />
        </g>
        <path
          d="M33.02 17V4.4h4.47c2.68 0 4.17 1.3 4.17 3.33 0 1.44-.79 2.32-1.98 2.74 1.34.25 2.5 1.11 2.5 2.93 0 2.23-1.58 3.6-4.57 3.6h-4.59Zm4.54-11.18h-2.97v4.05h2.97c1.62 0 2.54-.75 2.54-2.03 0-1.26-.9-2.02-2.54-2.02Zm.05 5.46H34.6v4.3h3.02c1.95 0 2.97-.81 2.97-2.1 0-1.43-1.1-2.2-2.97-2.2ZM53.08 17h-7.3V4.4h1.56v11.16h5.74V17Zm3.94 0H55.4l4.8-12.6h1.86L66.85 17h-1.68l-1.33-3.4h-5.49L57.02 17Zm4.07-10.89-2.27 6.07h4.55L61.1 6.1ZM71.42 17H69.9V4.4h1.44l6.77 9.72V4.4h1.53V17H78.2l-6.77-9.72V17Zm17.7.1c-3.62 0-5.9-2.55-5.9-6.4 0-3.82 2.37-6.4 6.02-6.4 2.79 0 4.82 1.61 5.3 4.22h-1.66a3.62 3.62 0 0 0-3.71-2.79c-2.65 0-4.34 2.05-4.34 4.97 0 2.9 1.62 4.97 4.27 4.97 1.94 0 3.29-1.03 3.76-2.8h1.65c-.46 2.62-2.55 4.24-5.4 4.24Zm9.04-.1h-1.62l4.8-12.6h1.86L108 17h-1.67l-1.34-3.4H99.5L98.16 17Zm4.07-10.89-2.27 6.07h4.56l-2.3-6.07Z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}
