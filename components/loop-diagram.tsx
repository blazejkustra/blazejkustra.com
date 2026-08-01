/**
 * How a crit loop is wired: one coordinator at the top, a builder/critic pair per
 * piece underneath, verdicts flowing back up for the next round. The dashes crawl
 * along the edges to show the direction of travel (stilled for reduced motion).
 */
const PIECES = [
  { cx: 128, piece: "sprites" },
  { cx: 320, piece: "economy curve" },
  { cx: 512, piece: "UI + HUD" },
];

const box = {
  fill: "var(--code-bg)",
  stroke: "var(--blockquote-border)",
};

export default function LoopDiagram() {
  return (
    // No wrapper element: markdown drops this inside a <p>, where only phrasing
    // content (an <svg>) is legal.
    <svg
      viewBox="0 0 640 334"
      className="block w-full h-auto my-4"
      role="img"
      aria-labelledby="loop-diagram-title loop-diagram-desc"
    >
        <title id="loop-diagram-title">How the loop is wired</title>
        <desc id="loop-diagram-desc">
          A coordinator agent at the top hands one piece of work to a builder for
          each piece. Each builder produces an artifact, which a separate critic
          judges against the bar. Each critic returns a single gap, which travels
          back to the coordinator, which starts the next round with fresh agents.
        </desc>

        <defs>
          <marker
            id="loop-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill="var(--text-secondary)" />
          </marker>
        </defs>

        {/* coordinator */}
        <rect x="170" y="8" width="300" height="52" rx="8" {...box} />
        <text
          x="320"
          y="30"
          textAnchor="middle"
          className="font-mono"
          fontSize="13"
          fill="var(--text-primary)"
        >
          coordinator
        </text>
        <text
          x="320"
          y="47"
          textAnchor="middle"
          className="font-mono"
          fontSize="10"
          fill="var(--text-secondary)"
        >
          holds the goal and the bar
        </text>

        {PIECES.map(({ cx, piece }, i) => (
          <g key={piece}>
            {/* coordinator hands the piece down */}
            <path
              d={`M320 60 V82 H${cx} V112`}
              fill="none"
              stroke="var(--blockquote-border)"
              strokeWidth="1.5"
              markerEnd="url(#loop-arrow)"
            />
            <path
              d={`M320 60 V82 H${cx} V112`}
              fill="none"
              stroke="var(--text-secondary)"
              strokeWidth="1.5"
              className="diagram-flow"
              style={{ animationDelay: `${i * 0.25}s` }}
            />

            <text
              x={cx}
              y={128}
              textAnchor="middle"
              className="font-mono"
              fontSize="10"
              fill="var(--text-secondary)"
            >
              {piece}
            </text>

            {/* builder */}
            <rect x={cx - 82} y={138} width="164" height="46" rx="8" {...box} />
            <text
              x={cx}
              y={158}
              textAnchor="middle"
              className="font-mono"
              fontSize="12"
              fill="var(--text-primary)"
            >
              builder
            </text>
            <text
              x={cx}
              y={173}
              textAnchor="middle"
              className="font-mono"
              fontSize="9"
              fill="var(--text-secondary)"
            >
              no memory of last round
            </text>

            {/* artifact */}
            <path
              d={`M${cx} 184 V216`}
              fill="none"
              stroke="var(--blockquote-border)"
              strokeWidth="1.5"
              markerEnd="url(#loop-arrow)"
            />
            <path
              d={`M${cx} 184 V216`}
              fill="none"
              stroke="var(--text-secondary)"
              strokeWidth="1.5"
              className="diagram-flow"
              style={{ animationDelay: `${i * 0.25 + 0.4}s` }}
            />
            <text
              x={cx + 8}
              y={206}
              className="font-mono"
              fontSize="9"
              fill="var(--text-secondary)"
            >
              artifact
            </text>

            {/* critic */}
            <rect x={cx - 82} y={218} width="164" height="46" rx="8" {...box} />
            <text
              x={cx}
              y={238}
              textAnchor="middle"
              className="font-mono"
              fontSize="12"
              fill="var(--text-primary)"
            >
              critic
            </text>
            <text
              x={cx}
              y={253}
              textAnchor="middle"
              className="font-mono"
              fontSize="9"
              fill="var(--text-secondary)"
            >
              never judged this before
            </text>

            {/* verdict drops onto the return bus */}
            <path
              d={`M${cx} 264 V300`}
              fill="none"
              stroke="var(--blockquote-border)"
              strokeWidth="1.5"
            />
            <path
              d={`M${cx} 264 V300`}
              fill="none"
              stroke="var(--text-secondary)"
              strokeWidth="1.5"
              className="diagram-flow"
              style={{ animationDelay: `${i * 0.25 + 0.8}s` }}
            />
          </g>
        ))}

        {/* return bus, back up the left edge into the coordinator */}
        <path
          d="M512 300 H18 V34 H170"
          fill="none"
          stroke="var(--blockquote-border)"
          strokeWidth="1.5"
          markerEnd="url(#loop-arrow)"
        />
        <path
          d="M512 300 H18 V34 H170"
          fill="none"
          stroke="var(--text-secondary)"
          strokeWidth="1.5"
          className="diagram-flow"
          style={{ animationDelay: "1.1s" }}
        />
        <text
          x="320"
          y="322"
          textAnchor="middle"
          className="font-mono"
          fontSize="10"
          fill="var(--text-secondary)"
        >
          one gap per piece, then the next round with new agents
        </text>
    </svg>
  );
}
