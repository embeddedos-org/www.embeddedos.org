/**
 * CadWalkthroughScene — the WebGL scene for the Architecture page's
 * CAD-to-product walkthrough. Imported lazily by CadWalkthrough3D so
 * three.js stays in an async chunk (see tests/performance/budgets.test.ts).
 *
 * One edge-AI sensor board, built from three.js primitives in CAD style:
 * step 0 shows the bare PCB as a blueprint wireframe, and each of the seven
 * architecture stages bolts on tangible parts until step 7 leaves a complete,
 * powered product. `step` is the active walkthrough step (0..7).
 *
 * All animation is gated on `reducedMotion`: with reduced motion, parts
 * appear instantly (no build animation), nothing pulses or rotates, and the
 * orbit control holds still — while manual orbit still works.
 */
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Grid, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  activeStepLabels,
  isPartBuilt,
  WALKTHROUGH_STEPS,
} from "./cad-walkthrough-data";

const PCB = { x: 6.4, y: 0.16, z: 4.6 };
const PCB_TOP = PCB.y / 2;
const BLUEPRINT = "#7dd3fc";

interface SceneProps {
  step: number;
  reducedMotion: boolean;
  motionPaused: boolean;
  onRendererUnavailable?: () => void;
}

// ── Build wrapper ───────────────────────────────────────────────────────────
// Scales each stage's part group in as its step activates. Under reduced
// motion the parts simply appear — no animation loop work.
function BuildPart({
  buildStep,
  step,
  reducedMotion,
  children,
}: {
  buildStep: number;
  step: number;
  reducedMotion: boolean;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const built = isPartBuilt(step, buildStep);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    if (reducedMotion) {
      g.visible = built;
      g.scale.setScalar(built ? 1 : 0.0001);
      return;
    }
    const target = built ? 1 : 0;
    const next = THREE.MathUtils.damp(g.scale.x, target, 5, delta);
    g.visible = next > 0.02;
    g.scale.setScalar(Math.max(next, 0.0001));
  });

  return <group ref={group}>{children}</group>;
}

// ── Emissive material with an optional pulse (never under reduced motion) ───
function PartMaterial({
  color,
  pulse,
  metalness = 0.35,
  roughness = 0.45,
  emissiveIntensity = 0.7,
}: {
  color: string;
  pulse: boolean;
  metalness?: number;
  roughness?: number;
  emissiveIntensity?: number;
}) {
  const ref = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (!ref.current || !pulse) return;
    ref.current.emissiveIntensity =
      emissiveIntensity + Math.sin(clock.getElapsedTime() * 4) * 0.45;
  });
  return (
    <meshStandardMaterial
      ref={ref}
      color={color}
      emissive={color}
      emissiveIntensity={emissiveIntensity}
      metalness={metalness}
      roughness={roughness}
    />
  );
}

// ── Step 0 — the bare CAD drawing ────────────────────────────────────────────
// Blueprint wireframe at step 0; the same board goes solid from step 1 on.
function CadBase({ step }: { step: number }) {
  const blueprint = step === 0;
  const pins = useMemo(() => {
    const list: Array<[number, number]> = [];
    for (let i = 0; i < 9; i++) {
      const z = -1.8 + i * 0.45;
      list.push([-PCB.x / 2 - 0.18, z]);
      list.push([PCB.x / 2 + 0.18, z]);
    }
    return list;
  }, []);

  return (
    <group>
      {/* PCB */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[PCB.x, PCB.y, PCB.z]} />
        {blueprint ? (
          <meshBasicMaterial
            color="#0d1f3c"
            transparent
            opacity={0.55}
            depthWrite={false}
          />
        ) : (
          <meshStandardMaterial
            color="#0c1626"
            metalness={0.2}
            roughness={0.7}
          />
        )}
        <Edges color={blueprint ? BLUEPRINT : "#38bdf8"} />
      </mesh>
      {/* Die footprint */}
      <mesh position={[0, PCB_TOP + 0.01, 0]}>
        <boxGeometry args={[2.8, 0.02, 2.8]} />
        {blueprint ? (
          <meshBasicMaterial color="#0d1f3c" transparent opacity={0.4} />
        ) : (
          <meshStandardMaterial
            color="#101d33"
            metalness={0.3}
            roughness={0.6}
          />
        )}
        <Edges color={BLUEPRINT} />
      </mesh>
      {/* Pin outlines */}
      {pins.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.02, z]}>
          <boxGeometry args={[0.16, 0.1, 0.55]} />
          <meshStandardMaterial
            color={blueprint ? "#33507a" : "#8fa3bf"}
            metalness={0.85}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Step 1 — hardware / sensors: cans, sensor box, mounting holes ─────────────
function SensorParts() {
  const cans: Array<[number, number]> = [
    [-2.5, 1.5],
    [2.6, 1.6],
  ];
  const holes: Array<[number, number]> = [
    [-2.9, -2.0],
    [2.9, -2.0],
    [-2.9, 2.0],
    [2.9, 2.0],
  ];
  return (
    <group>
      {cans.map(([x, z], i) => (
        <mesh key={i} position={[x, PCB_TOP + 0.15, z]}>
          <cylinderGeometry args={[0.3, 0.3, 0.3, 24]} />
          <PartMaterial
            color="#8fa3bf"
            pulse={false}
            metalness={0.85}
            roughness={0.3}
            emissiveIntensity={0.15}
          />
          <Edges color="#38bdf8" />
        </mesh>
      ))}
      <mesh position={[-2.5, PCB_TOP + 0.125, -1.5]}>
        <boxGeometry args={[0.7, 0.25, 0.7]} />
        <PartMaterial color="#1e293b" pulse={false} emissiveIntensity={0.2} />
        <Edges color="#38bdf8" />
      </mesh>
      {holes.map(([x, z], i) => (
        <mesh key={i} position={[x, PCB_TOP + 0.02, z]}>
          <cylinderGeometry args={[0.14, 0.14, 0.2, 20]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ── Step 2 — secure boot: SPI flash + secure element ─────────────────────────
function SecureBootParts({ reducedMotion }: { reducedMotion: boolean }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ring.current && !reducedMotion)
      ring.current.rotation.z = clock.getElapsedTime() * 0.7;
  });
  const flashPins: number[] = [-0.24, -0.08, 0.08, 0.24];
  return (
    <group>
      {/* SPI flash */}
      <group position={[-2.2, PCB_TOP + 0.11, 0.4]}>
        <mesh>
          <boxGeometry args={[0.8, 0.22, 0.6]} />
          <PartMaterial color="#1e293b" pulse={false} emissiveIntensity={0.2} />
          <Edges color="#fbbf24" />
        </mesh>
        {flashPins.map((dz, i) => (
          <mesh key={i} position={[-0.46, -0.04, dz]}>
            <boxGeometry args={[0.12, 0.06, 0.1]} />
            <meshStandardMaterial
              color="#8fa3bf"
              metalness={0.85}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>
      {/* Secure element */}
      <mesh position={[-2.2, PCB_TOP + 0.25, -0.75]}>
        <boxGeometry args={[0.85, 0.5, 0.85]} />
        <PartMaterial color="#fbbf24" pulse={!reducedMotion} />
        <Edges color="#fde68a" />
      </mesh>
      <mesh
        ref={ring}
        position={[-2.2, PCB_TOP + 0.06, -0.75]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.68, 0.03, 8, 48]} />
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

// ── Step 3 — EoS kernel / drivers: SoC, pin arrays, heat spreader ────────────
function KernelParts({ reducedMotion }: { reducedMotion: boolean }) {
  const pins = useMemo(() => {
    const list: Array<{
      position: [number, number, number];
      args: [number, number, number];
    }> = [];
    for (let i = 0; i < 8; i++) {
      const o = -1.05 + i * 0.3;
      list.push({
        position: [o, PCB_TOP + 0.06, -1.0],
        args: [0.14, 0.08, 0.3],
      });
      list.push({
        position: [o, PCB_TOP + 0.06, 1.0],
        args: [0.14, 0.08, 0.3],
      });
      list.push({
        position: [-1.0, PCB_TOP + 0.06, o],
        args: [0.3, 0.08, 0.14],
      });
      list.push({
        position: [1.0, PCB_TOP + 0.06, o],
        args: [0.3, 0.08, 0.14],
      });
    }
    return list;
  }, []);
  return (
    <group>
      <mesh position={[0, PCB_TOP + 0.14, 0]}>
        <boxGeometry args={[1.7, 0.28, 1.7]} />
        <PartMaterial color="#34d399" pulse={!reducedMotion} />
        <Edges color="#a7f3d0" />
      </mesh>
      {pins.map((p, i) => (
        <mesh key={i} position={p.position}>
          <boxGeometry args={p.args} />
          <meshStandardMaterial
            color="#8fa3bf"
            metalness={0.85}
            roughness={0.3}
          />
        </mesh>
      ))}
      {/* Heat spreader */}
      <mesh position={[0, PCB_TOP + 0.315, 0]}>
        <boxGeometry args={[2.0, 0.07, 2.0]} />
        <meshStandardMaterial
          color="#64748b"
          metalness={0.9}
          roughness={0.25}
        />
        <Edges color="#a7f3d0" />
      </mesh>
    </group>
  );
}

// ── Step 4 — IPC / data / storage: traces, comm module, antenna ──────────────
function IpcParts({ reducedMotion }: { reducedMotion: boolean }) {
  const traces: Array<{
    position: [number, number, number];
    args: [number, number, number];
  }> = [
    // SoC -> SPI flash
    { position: [-1.325, PCB_TOP + 0.02, 0.375], args: [0.95, 0.03, 0.08] },
    // SoC -> comm module
    { position: [1.35, PCB_TOP + 0.02, 0.55], args: [1.0, 0.03, 0.08] },
    // SoC -> NPU site
    { position: [1.135, PCB_TOP + 0.02, -0.5], args: [0.57, 0.03, 0.08] },
  ];
  return (
    <group>
      {traces.map((t, i) => (
        <mesh key={i} position={t.position}>
          <boxGeometry args={t.args} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={1.2}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* Comm module */}
      <mesh position={[2.3, PCB_TOP + 0.15, 0.6]}>
        <boxGeometry args={[0.9, 0.3, 0.9]} />
        <PartMaterial color="#22d3ee" pulse={!reducedMotion} />
        <Edges color="#a5f3fc" />
      </mesh>
      {/* Antenna stub */}
      <mesh position={[-2.95, PCB_TOP + 0.55, 1.75]}>
        <cylinderGeometry args={[0.05, 0.07, 1.1, 10]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-2.95, PCB_TOP + 1.12, 1.75]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ── Step 5 — applications: display module + app-layer plate ──────────────────
function AppParts() {
  return (
    <group>
      {/* Standoff posts */}
      {[-1.2, 1.2].map((x, i) => (
        <mesh key={i} position={[x, PCB_TOP + 0.45, -1.95]}>
          <boxGeometry args={[0.12, 0.9, 0.12]} />
          <meshStandardMaterial
            color="#475569"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
      ))}
      {/* Display panel, hinged at the back edge and tilted up */}
      <group position={[0, PCB_TOP + 0.9, -1.95]} rotation={[-1.05, 0, 0]}>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[2.6, 1.7, 0.1]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.4}
            roughness={0.5}
          />
          <Edges color="#f97316" />
        </mesh>
        <mesh position={[0, 0.85, 0.06]}>
          <planeGeometry args={[2.4, 1.5]} />
          <meshStandardMaterial
            color="#1e3a5f"
            emissive="#3b82f6"
            emissiveIntensity={0.55}
            toneMapped={false}
          />
        </mesh>
      </group>
      {/* App-layer plate floating over the compute area */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[2.2, 0.06, 2.2]} />
        <meshStandardMaterial
          color="#f97316"
          transparent
          opacity={0.35}
          emissive="#f97316"
          emissiveIntensity={0.4}
        />
        <Edges color="#fdba74" />
      </mesh>
    </group>
  );
}

// ── Step 6 — on-device AI: NPU block + heatsink fins ─────────────────────────
function AiParts({ reducedMotion }: { reducedMotion: boolean }) {
  const fins = [-0.4, -0.2, 0, 0.2, 0.4];
  return (
    <group position={[2.0, 0, -0.5]}>
      <mesh position={[0, PCB_TOP + 0.25, 0]}>
        <boxGeometry args={[1.15, 0.5, 1.15]} />
        <PartMaterial color="#a78bfa" pulse={!reducedMotion} />
        <Edges color="#ddd6fe" />
      </mesh>
      {fins.map((dz, i) => (
        <mesh key={i} position={[0, PCB_TOP + 0.625, dz]}>
          <boxGeometry args={[1.15, 0.25, 0.08]} />
          <meshStandardMaterial
            color="#7c6bb0"
            metalness={0.85}
            roughness={0.35}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Step 7 — physical action / feedback: drivers, sensor, status LED ────────
function ActionParts({ reducedMotion }: { reducedMotion: boolean }) {
  const led = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (led.current && !reducedMotion) {
      led.current.emissiveIntensity =
        2.2 + Math.sin(clock.getElapsedTime() * 3) * 0.8;
    }
  });
  return (
    <group>
      {[-1.8, 1.8].map((x, i) => (
        <mesh key={i} position={[x, PCB_TOP + 0.2, 1.9]}>
          <boxGeometry args={[0.8, 0.4, 0.6]} />
          <PartMaterial color="#f472b6" pulse={!reducedMotion} />
          <Edges color="#fbcfe8" />
        </mesh>
      ))}
      {/* Feedback sensor */}
      <mesh position={[0, PCB_TOP + 0.175, 1.9]}>
        <cylinderGeometry args={[0.18, 0.18, 0.35, 20]} />
        <PartMaterial color="#f472b6" pulse={false} emissiveIntensity={0.35} />
        <Edges color="#fbcfe8" />
      </mesh>
      {/* Status LED: the product is alive */}
      <mesh position={[0.9, PCB_TOP + 0.27, 2.05]}>
        <sphereGeometry args={[0.1, 14, 14]} />
        <meshStandardMaterial
          ref={led}
          color="#34d399"
          emissive="#34d399"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ── Floating part labels for the newly added parts of the active step ────────
function PartLabels({ step }: { step: number }) {
  const labels = activeStepLabels(step);
  const color = WALKTHROUGH_STEPS[step]?.color ?? "#ffffff";
  return (
    <group>
      {labels.map(part => (
        <Html
          key={part.id}
          position={part.labelAt}
          center
          distanceFactor={11}
          zIndexRange={[10, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            className="whitespace-nowrap rounded border bg-[#050B14]/90 px-1.5 py-0.5 font-mono text-[10px] text-white/90"
            style={{ borderColor: `${color}88` }}
          >
            {part.label}
          </div>
        </Html>
      ))}
    </group>
  );
}

// ── Camera ──────────────────────────────────────────────────────────────────
function FitCamera() {
  const camera = useThree(s => s.camera);
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(8.2, 6.4, 8.2);
    cam.updateProjectionMatrix();
  }, [camera]);
  return null;
}

// ── Scene ───────────────────────────────────────────────────────────────────
export default function CadWalkthroughScene({
  step,
  reducedMotion,
  motionPaused,
  onRendererUnavailable,
}: SceneProps) {
  const complete = step >= 7;

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [8.2, 6.4, 8.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={({ gl }) => {
        // Decorative canvas: hide from assistive tech; the DOM stepper and
        // detail panel carry the full narrative.
        gl.domElement.setAttribute("aria-hidden", "true");
        // If the GPU context dies mid-session, fall back to the static
        // semantic view instead of a frozen canvas.
        gl.domElement.addEventListener("webglcontextlost", event => {
          event.preventDefault();
          onRendererUnavailable?.();
        });
      }}
    >
      <fog attach="fog" args={["#0a1428", 18, 36]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 10, 4]} intensity={1.3} />
      <pointLight
        position={[0, 4, 0]}
        intensity={12}
        color="#38bdf8"
        distance={14}
      />
      {/* Powered glow once the product is complete */}
      {complete && (
        <pointLight
          position={[0, 2.5, 1.9]}
          intensity={6}
          color="#f472b6"
          distance={9}
        />
      )}

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
        <CadBase step={step} />
        <BuildPart buildStep={1} step={step} reducedMotion={reducedMotion}>
          <SensorParts />
        </BuildPart>
        <BuildPart buildStep={2} step={step} reducedMotion={reducedMotion}>
          <SecureBootParts reducedMotion={reducedMotion} />
        </BuildPart>
        <BuildPart buildStep={3} step={step} reducedMotion={reducedMotion}>
          <KernelParts reducedMotion={reducedMotion} />
        </BuildPart>
        <BuildPart buildStep={4} step={step} reducedMotion={reducedMotion}>
          <IpcParts reducedMotion={reducedMotion} />
        </BuildPart>
        <BuildPart buildStep={5} step={step} reducedMotion={reducedMotion}>
          <AppParts />
        </BuildPart>
        <BuildPart buildStep={6} step={step} reducedMotion={reducedMotion}>
          <AiParts reducedMotion={reducedMotion} />
        </BuildPart>
        <BuildPart buildStep={7} step={step} reducedMotion={reducedMotion}>
          <ActionParts reducedMotion={reducedMotion} />
        </BuildPart>
        <PartLabels step={step} />
      </group>

      <FitCamera />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={6}
        maxDistance={17}
        minPolarAngle={Math.PI / 5.5}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate={!motionPaused}
        autoRotateSpeed={0.55}
      />
    </Canvas>
  );
}
