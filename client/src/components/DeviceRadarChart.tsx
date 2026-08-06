import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const DIMENSIONS = [
  "Vitals",
  "Advanced",
  "Biochemistry",
  "Software",
  "Hardware",
  "Connectivity",
];

const DEVICES = [
  {
    name: "HEALTH-KEY ULTRA",
    color: "#F85149",
    scores: [8, 7, 3, 9, 9, 8], // per dimension
  },
  {
    name: "HEALTH-BAND Neuro",
    color: "#F59E0B",
    scores: [9, 10, 2, 9, 8, 8],
  },
  {
    name: "HEALTH-RING",
    color: "#A78BFA",
    scores: [10, 8, 4, 8, 7, 7],
  },
  {
    name: "HEALTH-LAB",
    color: "#34D399",
    scores: [6, 5, 10, 9, 7, 7],
  },
];

function polarToXY(angle: number, radius: number, cx: number, cy: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

export default function DeviceRadarChart() {
  const [visible, setVisible] = useState<Record<string, boolean>>({
    "HEALTH-KEY ULTRA": true,
    "HEALTH-BAND Neuro": true,
    "HEALTH-RING": true,
    "HEALTH-LAB": true,
  });
  const [hovered, setHovered] = useState<string | null>(null);

  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const n = DIMENSIONS.length;
  const angleStep = 360 / n;

  // Grid rings
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getPolygon = (scores: number[]) =>
    scores
      .map((s, i) => {
        const angle = i * angleStep;
        const r = (s / 10) * maxR;
        const pt = polarToXY(angle, r, cx, cy);
        return `${pt.x},${pt.y}`;
      })
      .join(" ");

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Grid rings */}
        {rings.map(r => (
          <polygon
            key={r}
            points={DIMENSIONS.map((_, i) => {
              const pt = polarToXY(i * angleStep, r * maxR, cx, cy);
              return `${pt.x},${pt.y}`;
            }).join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {DIMENSIONS.map((_, i) => {
          const outer = polarToXY(i * angleStep, maxR, cx, cy);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={outer.x}
              y2={outer.y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          );
        })}

        {/* Device polygons */}
        {DEVICES.map(device => {
          if (!visible[device.name]) return null;
          const isHovered = hovered === device.name;
          return (
            <g key={device.name}>
              <polygon
                points={getPolygon(device.scores)}
                fill={device.color + (isHovered ? "30" : "18")}
                stroke={device.color}
                strokeWidth={isHovered ? 2 : 1.5}
                strokeOpacity={isHovered ? 1 : 0.7}
                style={{ transition: "all 0.3s ease" }}
              />
              {/* Score dots */}
              {device.scores.map((s, i) => {
                const angle = i * angleStep;
                const r = (s / 10) * maxR;
                const pt = polarToXY(angle, r, cx, cy);
                return (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 4 : 3}
                    fill={device.color}
                    opacity={isHovered ? 1 : 0.8}
                    style={{ transition: "all 0.3s ease" }}
                  />
                );
              })}
            </g>
          );
        })}

        {/* Axis labels */}
        {DIMENSIONS.map((dim, i) => {
          const angle = i * angleStep;
          const pt = polarToXY(angle, maxR + 22, cx, cy);
          return (
            <text
              key={dim}
              x={pt.x}
              y={pt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.5)"
              fontSize="9"
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="600"
            >
              {dim}
            </text>
          );
        })}
      </svg>

      {/* Legend / toggles */}
      <div className="flex flex-wrap justify-center gap-2">
        {DEVICES.map(device => (
          <motion.button
            key={device.name}
            onClick={() =>
              setVisible(v => ({ ...v, [device.name]: !v[device.name] }))
            }
            onMouseEnter={() => setHovered(device.name)}
            onMouseLeave={() => setHovered(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all"
            style={{
              borderColor: visible[device.name]
                ? device.color + "60"
                : "rgba(255,255,255,0.1)",
              background: visible[device.name]
                ? device.color + "15"
                : "rgba(255,255,255,0.03)",
              color: visible[device.name]
                ? device.color
                : "rgba(255,255,255,0.3)",
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: visible[device.name]
                  ? device.color
                  : "rgba(255,255,255,0.2)",
              }}
            />
            {device.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
