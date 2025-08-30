
type MLoaderProps = {
  value?: number         
  size?: number          
  color?: string         
  thickness?: number     
  className?: string
}

export default function MLoader({
  value,
  size = 100,
  color = "#ffffff",
  thickness = 15,
  className = "",
}: MLoaderProps) {
  const pct = value == null ? null : Math.max(0, Math.min(100, value))

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="status"
      aria-label={pct == null ? "Loading" : `Loading ${pct}%`}
    >
      <path
        d="M10 90 L10 10 L50 70 L90 10 L90 90"
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={pct == null ? undefined : 100 - pct}
      >
        {pct == null ? (
          <animate
            attributeName="stroke-dashoffset"
            from="100"
            to="0"
            dur="1.2s"
            repeatCount="indefinite"
          />
        ) : null}
      </path>
    </svg>
  )
}
