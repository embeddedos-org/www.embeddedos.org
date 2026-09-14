import {
  useMemo,
  useRef,
  useState,
  type ElementRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";

// ── A CAD-style exploded diagram of the EmbeddedOS stack ───────────────────────
// Hairline wireframe parts (no glossy shading) laid out like an engineering
// exploded view, with seven hoverable annotation markers. Hovering a marker
// dollies the camera in on that part and freezes the idle rotation, exactly
// like inspecting a callout on a CAD drawing.

const BLUEPRINT = "#2A4A6B";
const LINE_DIM = "#3E6690";

type Hotspot = {
  id: string;
  label: string;
  desc: string;
  color: string;
  marker: [number, number, number];
  focus: [number, number, number];
  camPos: [number, number, number];
};

const HOTSPOTS: Hotspot[] = [
  {
    id: "cad",
    label: "CAD Drawing",
    desc: "The base engineering drawing every other layer is registered to.",
    color: "#38BDF8",
    marker: [-1.15, -0.82, 0.85],
    focus: [0, -0.92, 0],
    camPos: [1.3, 0.15, 2.7],
  },
  {
    id: "config",
    label: "AI Configuration",
    desc: "Device-tree and model config loaded before the chip boots.",
    color: "#60A5FA",
    marker: [-0.85, -0.15, 0.55],
    focus: [-0.85, -0.55, 0.35],
    camPos: [-0.15, 0.15, 1.5],
  },
  {
    id: "chip",
    label: "Chip / SoC",
    desc: "The microcontroller silicon at the center of every device.",
    color: "#E2E8F0",
    marker: [-0.32, 0.05, 0.5],
    focus: [0, -0.5, 0],
    camPos: [0.95, 0.4, 1.4],
  },
  {
    id: "bootloader",
    label: "Bootloader",
    desc: "eBoot verifies the image and hands off control to the OS.",
    color: "#F59E0B",
    marker: [1.1, -0.2, 0.15],
    focus: [0.85, -0.55, -0.3],
    camPos: [1.95, 0.25, 0.75],
  },
  {
    id: "os",
    label: "Operating System",
    desc: "The EmbeddedOS kernel — scheduling, drivers, and the app layer.",
    color: "#A78BFA",
    marker: [0, 0.62, 0.55],
    focus: [0, 0.25, 0],
    camPos: [0.65, 1.15, 1.85],
  },
  {
    id: "comms",
    label: "Inter-Layer Communication",
    desc: "Config, chip, bootloader, and OS exchange data over shared buses.",
    color: "#F97316",
    marker: [0, -0.1, 1.05],
    focus: [0, -0.25, 0],
    camPos: [0.15, 0.65, 2.7],
  },
  {
    id: "ai-core",
    label: "AI Inside the Chip",
    desc: "An on-die inference core — the chip runs the model itself.",
    color: "#FB923C",
    marker: [0.28, -0.28, 0.18],
    focus: [0, -0.42, 0],
    camPos: [0.42, -0.08, 0.62],
  },
];

const DEFAULT_FOCUS: [number, number, number] = [0, -0.35, 0];
const DEFAULT_CAM: [number, number, number] = [2.2, 1.25, 2.7];

// ── Hairline wireframe box: sharp-edged lines + a near-invisible fill so the
// part still reads as a solid at a glance, the way a CAD viewport shades ──────
function WireBox({
  size,
  color = BLUEPRINT,
  fillOpacity = 0.05,
  lineOpacity = 0.9,
}: {
  size: [number, number, number];
  color?: string;
  fillOpacity?: number;
  lineOpacity?: number;
}) {
  const geometry = useMemo(() => new THREE.BoxGeometry(...size), size);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);
  return (
    <group>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={color} transparent opacity={lineOpacity} />
      </lineSegments>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={fillOpacity}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ── Pin row: a strip of thin wire pins along one edge of a chip package ────────
function PinRow({
  count,
  span,
  axis,
  offset,
  color,
}: {
  count: number;
  span: number;
  axis: "x" | "z";
  offset: [number, number, number];
  color: string;
}) {
  const pins = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const t = count === 1 ? 0 : i / (count - 1) - 0.5;
        return axis === "x"
          ? ([offset[0] + t * span, offset[1], offset[2]] as const)
          : ([offset[0], offset[1], offset[2] + t * span] as const);
      }),
    [count, span, axis, offset]
  );
  return (
    <group>
      {pins.map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]}>
          <boxGeometry args={[0.025, 0.04, 0.025]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ── Dashed exploded-view alignment line between two stacked parts ─────────────
function AlignLine({
  from,
  to,
  color = LINE_DIM,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color?: string;
}) {
  return (
    <Line
      points={[from, to]}
      color={color}
      dashed
      dashSize={0.035}
      gapSize={0.025}
      lineWidth={1}
      transparent
      opacity={0.55}
    />
  );
}

// ── Hoverable annotation marker + dashed leader line back to its part ─────────
function Marker({
  hotspot,
  active,
  onOver,
  onOut,
}: {
  hotspot: Hotspot;
  active: boolean;
  onOver: () => void;
  onOut: () => void;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const pulse = active
      ? 1.3 + Math.sin(clock.getElapsedTime() * 4) * 0.15
      : 1 + Math.sin(clock.getElapsedTime() * 1.5) * 0.08;
    ringRef.current.scale.setScalar(pulse);
  });
  return (
    <group>
      <AlignLine
        from={hotspot.marker}
        to={hotspot.focus}
        color={active ? hotspot.color : LINE_DIM}
      />
      <mesh
        position={hotspot.marker}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          onOver();
        }}
        onPointerOut={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          onOut();
        }}
      >
        {/* generous invisible hit-area so the small marker is easy to hover */}
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={ringRef} position={hotspot.marker}>
        <ringGeometry args={[0.035, 0.05, 24]} />
        <meshBasicMaterial
          color={active ? hotspot.color : "#7FA8CC"}
          transparent
          opacity={active ? 1 : 0.7}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={hotspot.marker}>
        <circleGeometry args={[0.014, 16]} />
        <meshBasicMaterial
          color={active ? hotspot.color : "#7FA8CC"}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ── The exploded assembly itself, drawn entirely in hairline wireframe ─────────
function Assembly({ active }: { active: string | null }) {
  const aiCoreRef = useRef<THREE.Mesh>(null);
  const commsPulses = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (aiCoreRef.current) {
      const mat = aiCoreRef.current.material as THREE.MeshBasicMaterial;
      const boost = active === "ai-core" ? 1 : 0;
      mat.opacity = 0.25 + boost * 0.6 + Math.sin(t * 3) * (0.08 + boost * 0.1);
      aiCoreRef.current.rotation.y = t * 0.6;
      aiCoreRef.current.rotation.x = t * 0.3;
    }
    commsPulses.current.forEach((mesh, i) => {
      if (!mesh) return;
      const local = ((t * 0.35 + i * 0.33) % 1) + (active === "comms" ? 0 : 0);
      const paths: [THREE.Vector3, THREE.Vector3][] = [
        [new THREE.Vector3(-0.85, -0.55, 0.35), new THREE.Vector3(0, -0.5, 0)],
        [new THREE.Vector3(0, -0.5, 0), new THREE.Vector3(0.85, -0.55, -0.3)],
        [new THREE.Vector3(0, -0.5, 0), new THREE.Vector3(0, 0.25, 0)],
      ];
      const [a, b] = paths[i % paths.length];
      mesh.position.lerpVectors(a, b, local);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = active === "comms" ? 1 : 0.5;
    });
  });

  return (
    <group>
      {/* Base sheet — the CAD drawing itself */}
      <gridHelper
        args={[2.6, 20, BLUEPRINT, "#182F47"]}
        position={[0, -0.95, 0]}
      />
      <Line
        points={[
          [-1.3, -0.949, -0.9],
          [-1.1, -0.949, -0.9],
          [-1.1, -0.949, -1.05],
        ]}
        color={BLUEPRINT}
        lineWidth={1}
      />
      <Line
        points={[
          [1.3, -0.949, 0.9],
          [1.1, -0.949, 0.9],
          [1.1, -0.949, 1.05],
        ]}
        color={BLUEPRINT}
        lineWidth={1}
      />

      {/* AI Configuration block */}
      <group position={[-0.85, -0.55, 0.35]}>
        <WireBox size={[0.32, 0.16, 0.32]} color="#60A5FA" />
        <PinRow
          count={5}
          span={0.24}
          axis="x"
          offset={[0, -0.1, 0.18]}
          color="#60A5FA"
        />
      </group>

      {/* Chip / SoC package with exploded lid + AI core inside */}
      <group position={[0, -0.5, 0]}>
        <WireBox
          size={[0.52, 0.1, 0.52]}
          color={active === "chip" ? "#F97316" : "#E2E8F0"}
          fillOpacity={0.06}
        />
        <PinRow
          count={7}
          span={0.42}
          axis="x"
          offset={[0, 0.02, 0.29]}
          color="#94A3B8"
        />
        <PinRow
          count={7}
          span={0.42}
          axis="x"
          offset={[0, 0.02, -0.29]}
          color="#94A3B8"
        />
        <PinRow
          count={7}
          span={0.42}
          axis="z"
          offset={[0.29, 0.02, 0]}
          color="#94A3B8"
        />
        <PinRow
          count={7}
          span={0.42}
          axis="z"
          offset={[-0.29, 0.02, 0]}
          color="#94A3B8"
        />
        {/* exploded lid, offset up */}
        <group position={[0, 0.34, 0]}>
          <WireBox
            size={[0.52, 0.04, 0.52]}
            color="#94A3B8"
            fillOpacity={0.04}
          />
        </group>
        <AlignLine
          from={[0.2, 0.05, 0.2]}
          to={[0.2, 0.32, 0.2]}
          color="#4B617A"
        />
        <AlignLine
          from={[-0.2, 0.05, -0.2]}
          to={[-0.2, 0.32, -0.2]}
          color="#4B617A"
        />
        {/* AI core sitting in the gap between package and lid */}
        <mesh ref={aiCoreRef} position={[0, 0.18, 0]}>
          <icosahedronGeometry args={[0.11, 1]} />
          <meshBasicMaterial
            color="#FB923C"
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>
      </group>

      {/* Bootloader block */}
      <group position={[0.85, -0.55, -0.3]}>
        <WireBox size={[0.4, 0.09, 0.2]} color="#F59E0B" />
        <PinRow
          count={4}
          span={0.3}
          axis="x"
          offset={[0, -0.06, 0.12]}
          color="#F59E0B"
        />
      </group>

      {/* OS layer plate */}
      <group position={[0, 0.25, 0]}>
        <WireBox size={[1.5, 0.05, 1.0]} color="#A78BFA" fillOpacity={0.04} />
        {[-0.55, -0.27, 0, 0.27, 0.55].map((x, i) => (
          <Line
            key={i}
            points={[
              [x, 0.028, -0.35],
              [x, 0.028, 0.35],
            ]}
            color="#A78BFA"
            transparent
            opacity={0.5}
            lineWidth={1}
          />
        ))}
      </group>

      {/* Communication bus lines + traveling pulses */}
      <AlignLine
        from={[-0.85, -0.55, 0.35]}
        to={[0, -0.5, 0]}
        color="#F97316"
      />
      <AlignLine from={[0, -0.5, 0]} to={[0.85, -0.55, -0.3]} color="#F97316" />
      <AlignLine from={[0, -0.5, 0]} to={[0, 0.25, 0]} color="#F97316" />
      {[0, 1, 2].map(i => (
        <mesh
          key={i}
          ref={el => {
            if (el) commsPulses.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#F97316" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({
  active,
  setActive,
}: {
  active: string | null;
  setActive: Dispatch<SetStateAction<string | null>>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);

  useFrame((state, delta) => {
    if (groupRef.current && !active) {
      groupRef.current.rotation.y += delta * 0.12;
    }
    const hotspot = HOTSPOTS.find(h => h.id === active);
    const focus = hotspot ? hotspot.focus : DEFAULT_FOCUS;
    const camPos = hotspot ? hotspot.camPos : DEFAULT_CAM;
    state.camera.position.lerp(
      new THREE.Vector3(...camPos),
      hotspot ? 0.07 : 0.04
    );
    if (controlsRef.current) {
      controlsRef.current.target.lerp(
        new THREE.Vector3(...focus),
        hotspot ? 0.07 : 0.04
      );
      controlsRef.current.update();
    }
  });

  return (
    <>
      <group ref={groupRef}>
        <Assembly active={active} />
        {HOTSPOTS.map(h => (
          <Marker
            key={h.id}
            hotspot={h}
            active={active === h.id}
            onOver={() => setActive(h.id)}
            onOut={() => setActive(a => (a === h.id ? null : a))}
          />
        ))}
      </group>
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.1}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 1.9}
      />
    </>
  );
}

const ACTIVE_HINT = {
  label: "CAD Drawing",
  desc: "Hover a marker to inspect that stage of the build.",
};

// ── Public export ────────────────────────────────────────────────────────────
// A CAD-style exploded diagram of the EmbeddedOS build: hairline wireframe
// parts on a blueprint grid, seven hoverable annotation markers (CAD Drawing,
// AI Configuration, Chip, Bootloader, OS, Inter-Layer Communication, and the
// AI core inside the chip), each dollying the camera in with a label callout.
export default function HeroTechStack() {
  const [active, setActive] = useState<string | null>(null);
  const current = HOTSPOTS.find(h => h.id === active);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: DEFAULT_CAM, fov: 36 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.75]}
      >
        <ambientLight intensity={0.6} />
        <Scene active={active} setActive={setActive} />
      </Canvas>

      {/* CAD-style annotation callout */}
      <div className="pointer-events-none absolute top-3 left-3 max-w-[210px] rounded-md border border-[#2A4A6B] bg-[#050B14]/85 px-3 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#38BDF8]/80 font-mono">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
          {current ? "Inspecting" : "Overview"}
        </div>
        <div
          className="font-mono text-sm font-semibold mt-0.5"
          style={{ color: current?.color ?? "#E2E8F0" }}
        >
          {current?.label ?? ACTIVE_HINT.label}
        </div>
        <div className="text-[11px] text-white/50 mt-0.5 leading-snug">
          {current?.desc ?? ACTIVE_HINT.desc}
        </div>
      </div>
    </div>
  );
}
