import { useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Grid, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ARCHITECTURE_STAGES } from "@/data/architecture";

/**
 * The 3D scene for the "CAD to ecosystem" hero.
 *
 * A blueprint-style CAD model of a circuit board starts as a bare outline and
 * materializes stage by stage (secure boot, kernel, IPC, apps, AI, physical
 * action) until it is the full EmbeddedOS ecosystem. `step` is the number of
 * stages built (0 = pure CAD outline, 7 = complete ecosystem).
 */

const PCB = { x: 6.4, y: 0.16, z: 4.6 };
const DIE = { x: 2.8, y: 0.24, z: 2.8 };
const DIE_TOP = 0.2 + DIE.y / 2;

// ── Animated build wrapper ──────────────────────────────────────────────────
// Lerps each stage's group scale toward 1 (built) or 0 (not yet built) without
// touching React state, so the animation runs entirely on the render thread.
function BuildPart({
  index,
  step,
  progress,
  children,
}: {
  index: number;
  step: number;
  progress: MutableRefObject<number[]>;
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    const target = step > index ? 1 : 0;
    const next = THREE.MathUtils.damp(
      progress.current[index] ?? 0,
      target,
      5,
      delta
    );
    progress.current[index] = next;
    const g = group.current;
    if (g) {
      g.visible = next > 0.02;
      g.scale.setScalar(Math.max(next, 0.0001));
    }
  });
  return <group ref={group}>{children}</group>;
}

// ── Glowing material with an optional "just built" pulse ────────────────────
function GlowMaterial({
  color,
  highlight,
  metalness = 0.35,
  roughness = 0.4,
}: {
  color: string;
  highlight: boolean;
  metalness?: number;
  roughness?: number;
}) {
  const ref = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.emissiveIntensity = highlight
      ? 1.5 + Math.sin(t * 5) * 0.6
      : 0.85;
  });
  return (
    <meshStandardMaterial
      ref={ref}
      color={color}
      emissive={color}
      emissiveIntensity={0.85}
      metalness={metalness}
      roughness={roughness}
    />
  );
}

// ── Stage 0 — the bare CAD design: PCB, die, pins, sensor pucks ──────────────
function CadBase() {
  const pins = useMemo(() => {
    const list: [number, number][] = [];
    for (let i = 0; i < 9; i++) {
      const z = -1.8 + i * 0.45;
      list.push([-PCB.x / 2 - 0.18, z]);
      list.push([PCB.x / 2 + 0.18, z]);
    }
    return list;
  }, []);
  const pucks: [number, number][] = [
    [-2.55, -1.65],
    [2.55, -1.65],
    [-2.55, 1.65],
    [2.55, 1.65],
  ];
  return (
    <group>
      {/* PCB */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[PCB.x, PCB.y, PCB.z]} />
        <meshStandardMaterial color="#0c1626" metalness={0.2} roughness={0.7} />
        <Edges color="#38bdf8" />
      </mesh>
      {/* Die footprint */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[DIE.x, DIE.y, DIE.z]} />
        <meshStandardMaterial color="#101d33" metalness={0.3} roughness={0.6} />
        <Edges color="#7dd3fc" />
      </mesh>
      {/* Pins */}
      {pins.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.02, z]}>
          <boxGeometry args={[0.16, 0.1, 0.55]} />
          <meshStandardMaterial
            color="#8fa3bf"
            metalness={0.85}
            roughness={0.3}
          />
        </mesh>
      ))}
      {/* Sensor pucks */}
      {pucks.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.16, z]}>
          <cylinderGeometry args={[0.3, 0.3, 0.16, 24]} />
          <meshStandardMaterial
            color="#1e293b"
            metalness={0.4}
            roughness={0.5}
          />
          <Edges color="#38bdf8" />
        </mesh>
      ))}
    </group>
  );
}

// ── Stage 1 — secure boot: the enclave block + lock ring ────────────────────
function SecureEnclave({ highlight }: { highlight: boolean }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ring.current) ring.current.rotation.z = clock.getElapsedTime() * 0.7;
  });
  return (
    <group>
      <mesh position={[-0.75, DIE_TOP + 0.28, -0.75]}>
        <boxGeometry args={[0.95, 0.55, 0.95]} />
        <GlowMaterial color="#fbbf24" highlight={highlight} />
        <Edges color="#fde68a" />
      </mesh>
      <mesh
        ref={ring}
        position={[-0.75, DIE_TOP + 0.1, -0.75]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.78, 0.03, 8, 48]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ── Stage 2 — EoS kernel: four CPU cores ─────────────────────────────────────
function KernelCores({ highlight }: { highlight: boolean }) {
  const offsets: [number, number][] = [
    [-0.36, -0.36],
    [0.36, -0.36],
    [-0.36, 0.36],
    [0.36, 0.36],
  ];
  return (
    <group>
      {offsets.map(([x, z], i) => (
        <mesh key={i} position={[x, DIE_TOP + 0.16, z]}>
          <boxGeometry args={[0.55, 0.32, 0.55]} />
          <GlowMaterial color="#34d399" highlight={highlight} />
          <Edges color="#a7f3d0" />
        </mesh>
      ))}
    </group>
  );
}

// ── Stage 3 — IPC / data: memory, traces, travelling data pulses ────────────
function DataPulses() {
  const group = useRef<THREE.Group>(null);
  const paths = useMemo(
    () => [
      {
        from: new THREE.Vector3(-0.75, DIE_TOP + 0.1, -0.75),
        to: new THREE.Vector3(0, DIE_TOP + 0.1, 0.1),
      },
      {
        from: new THREE.Vector3(0, DIE_TOP + 0.1, 0.1),
        to: new THREE.Vector3(0, DIE_TOP + 0.1, 1.05),
      },
    ],
    []
  );
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.45;
    group.current?.children.forEach((child, i) => {
      const seg = paths[i % paths.length];
      child.position.lerpVectors(seg.from, seg.to, (t + i * 0.37) % 1);
    });
  });
  return (
    <group ref={group}>
      {[0, 1, 2, 3].map(i => (
        <mesh key={i}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial
            color="#cffafe"
            emissive="#22d3ee"
            emissiveIntensity={2.2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function IpcTraces({ highlight }: { highlight: boolean }) {
  return (
    <group>
      {/* memory block */}
      <mesh position={[0, DIE_TOP + 0.15, 1.05]}>
        <boxGeometry args={[1.7, 0.3, 0.55]} />
        <GlowMaterial color="#22d3ee" highlight={highlight} />
        <Edges color="#a5f3fc" />
      </mesh>
      {/* traces: enclave -> cores -> memory */}
      <mesh
        position={[-0.38, DIE_TOP + 0.02, -0.33]}
        rotation={[0, Math.PI / 4, 0]}
      >
        <boxGeometry args={[0.08, 0.03, 1.15]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, DIE_TOP + 0.02, 0.58]}>
        <boxGeometry args={[0.08, 0.03, 0.95]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
      <DataPulses />
    </group>
  );
}

// ── Stage 4 — applications: module blocks around the die ────────────────────
function AppModules({ highlight }: { highlight: boolean }) {
  const spots: [number, number][] = [
    [-2.2, -1.5],
    [2.2, -1.5],
    [-2.2, 1.5],
    [2.2, 1.5],
  ];
  return (
    <group>
      {spots.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.37, z]}>
          <boxGeometry args={[1.0, 0.42, 1.0]} />
          <GlowMaterial color="#f97316" highlight={highlight} />
          <Edges color="#fdba74" />
        </mesh>
      ))}
    </group>
  );
}

// Seeded PRNG (mulberry32) — geometry must be deterministic so prerendered
// snapshots are stable frame-to-frame and run-to-run.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Stage 5 — on-device AI: NPU block + neural particle swarm ────────────────
function NpuSwarm() {
  const ref = useRef<THREE.Points>(null);
  const { positions } = useMemo(() => {
    const rand = mulberry32(0xe05a1);
    const count = 90;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2;
      const r = 0.9 + rand() * 0.7;
      positions[i * 3] = 0.78 + Math.cos(a) * r;
      positions[i * 3 + 1] = DIE_TOP + 0.3 + (rand() - 0.5) * 0.9;
      positions[i * 3 + 2] = 0.78 + Math.sin(a) * r;
    }
    return { positions };
  }, []);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.9;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#c4b5fd"
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
}

function NpuBlock({ highlight }: { highlight: boolean }) {
  return (
    <group>
      <mesh position={[0.78, DIE_TOP + 0.25, 0.78]}>
        <boxGeometry args={[1.15, 0.5, 1.15]} />
        <GlowMaterial color="#a78bfa" highlight={highlight} />
        <Edges color="#ddd6fe" />
      </mesh>
      <NpuSwarm />
    </group>
  );
}

// ── Stage 6 — physical action: antennas, radiating beams, status LED ─────────
function ActionArray({ highlight }: { highlight: boolean }) {
  const corners: [number, number][] = [
    [-2.9, -2.0],
    [2.9, -2.0],
    [-2.9, 2.0],
    [2.9, 2.0],
  ];
  const beams: {
    position: [number, number, number];
    rotation: [number, number, number];
  }[] = [
    { position: [-1.9, 1.0, 0], rotation: [0, 0, 1.05] },
    { position: [1.9, 1.0, 0], rotation: [0, 0, -1.05] },
    { position: [0, 1.0, -1.7], rotation: [1.05, 0, 0] },
    { position: [0, 1.0, 1.7], rotation: [-1.05, 0, 0] },
    { position: [-1.35, 1.0, -1.2], rotation: [0.7, 0, 0.7] },
    { position: [1.35, 1.0, 1.2], rotation: [-0.7, 0, -0.7] },
  ];
  return (
    <group>
      {corners.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.75, z]}>
          <cylinderGeometry args={[0.05, 0.07, 1.3, 10]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}
      {beams.map((b, i) => (
        <mesh key={i} position={b.position} rotation={b.rotation}>
          <boxGeometry args={[0.05, 0.05, 1.7]} />
          <meshStandardMaterial
            color="#f472b6"
            emissive="#f472b6"
            emissiveIntensity={highlight ? 2 : 1.2}
            toneMapped={false}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
      {/* status LED: the ecosystem is alive */}
      <mesh position={[2.9, 1.45, 2.0]}>
        <sphereGeometry args={[0.1, 14, 14]} />
        <meshStandardMaterial
          color="#34d399"
          emissive="#34d399"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ── Full scene ──────────────────────────────────────────────────────────────
export function CadEvolutionScene({
  step,
  progress,
  reducedMotion,
  onRendererUnavailable,
}: {
  step: number;
  progress: MutableRefObject<number[]>;
  reducedMotion: boolean;
  onRendererUnavailable?: () => void;
}) {
  const activeIndex = Math.min(
    Math.max(step - 1, 0),
    ARCHITECTURE_STAGES.length - 1
  );
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [8.2, 6.4, 8.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={({ gl }) => {
        // If the GPU context dies mid-session, fall back to the static
        // semantic view instead of a frozen canvas.
        gl.domElement.addEventListener("webglcontextlost", event => {
          event.preventDefault();
          onRendererUnavailable?.();
        });
      }}
    >
      <fog attach="fog" args={["#0a1428", 16, 34]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 10, 4]} intensity={1.3} />
      <pointLight
        position={[0, 4, 0]}
        intensity={12}
        color="#38bdf8"
        distance={14}
      />

      <Grid
        position={[0, -0.72, 0]}
        args={[40, 40]}
        cellSize={0.8}
        cellThickness={0.6}
        cellColor="#14304f"
        sectionSize={4}
        sectionThickness={1}
        sectionColor="#1f4d7a"
        fadeDistance={30}
        fadeStrength={2.5}
        infiniteGrid
      />

      <group position={[0, 0.4, 0]}>
        <CadBase />
        <BuildPart index={1} step={step} progress={progress}>
          <SecureEnclave highlight={activeIndex === 1} />
        </BuildPart>
        <BuildPart index={2} step={step} progress={progress}>
          <KernelCores highlight={activeIndex === 2} />
        </BuildPart>
        <BuildPart index={3} step={step} progress={progress}>
          <IpcTraces highlight={activeIndex === 3} />
        </BuildPart>
        <BuildPart index={4} step={step} progress={progress}>
          <AppModules highlight={activeIndex === 4} />
        </BuildPart>
        <BuildPart index={5} step={step} progress={progress}>
          <NpuBlock highlight={activeIndex === 5} />
        </BuildPart>
        <BuildPart index={6} step={step} progress={progress}>
          <ActionArray highlight={activeIndex === 6} />
        </BuildPart>
      </group>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={6}
        maxDistance={17}
        minPolarAngle={Math.PI / 5.5}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.55}
      />
    </Canvas>
  );
}
