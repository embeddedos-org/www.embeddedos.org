import {
  type ComponentProps,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Torus } from "@react-three/drei";
import * as THREE from "three";
import { supportsWebGL } from "./HeroTechStack";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { useOnScreen } from "@/lib/on-screen";
import FitCamera, { type SceneExtent } from "./fit-camera";

// ── Kernel Core ────────────────────────────────────────────────────────────────
function KernelCore({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.3;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.8;
    if (ring2Ref.current) ring2Ref.current.rotation.x = t * 0.5;
    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.8 + Math.sin(t * 2) * 0.3;
    }
  });

  return (
    <group ref={groupRef} scale={hovered ? 1.05 : 1}>
      {/* Central core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.6, 2]} />
        <meshStandardMaterial
          color="#0b0b0d"
          emissive="#22D3EE"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Orbit ring 1 */}
      <Torus ref={ring1Ref} args={[1.1, 0.025, 8, 64]}>
        <meshStandardMaterial
          color="#22D3EE"
          emissive="#22D3EE"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </Torus>

      {/* Orbit ring 2 */}
      <Torus
        ref={ring2Ref}
        args={[1.4, 0.018, 8, 64]}
        rotation={[Math.PI / 3, 0, Math.PI / 6]}
      >
        <meshStandardMaterial
          color="#34D399"
          emissive="#34D399"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </Torus>

      {/* HAL nodes orbiting */}
      {[0, 1, 2, 3, 4, 5].map(i => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 1.1;
        const z = Math.sin(angle) * 1.1;
        return <HALNode key={i} position={[x, 0, z]} index={i} />;
      })}
    </group>
  );
}

function HALNode({
  position,
  index,
}: {
  position: [number, number, number];
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const colors = [
    "#22D3EE",
    "#34D399",
    "#A78BFA",
    "#F97316",
    "#FBBF24",
    "#F472B6",
  ];

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.5;
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity =
        0.8 + Math.sin(clock.getElapsedTime() * 1.5 + index) * 0.4;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.18, 0.18, 0.18]} />
      <meshStandardMaterial
        color={colors[index]}
        emissive={colors[index]}
        emissiveIntensity={0.8}
        toneMapped={false}
      />
    </mesh>
  );
}

// ── eBoot Sequence ─────────────────────────────────────────────────────────────
function EBootSequence({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.25;
    }
  });

  const stages = [
    { y: -1.2, color: "#6B7280", label: "ROM" },
    { y: -0.4, color: "#FBBF24", label: "eBoot" },
    { y: 0.4, color: "#34D399", label: "EoS" },
    { y: 1.2, color: "#22D3EE", label: "Apps" },
  ];

  return (
    <group ref={groupRef} scale={hovered ? 1.05 : 1}>
      {stages.map((stage, i) => (
        <BootStage key={i} y={stage.y} color={stage.color} index={i} />
      ))}
      {/* Connecting lines */}
      {[0, 1, 2].map(i => (
        <mesh key={i} position={[0, -0.8 + i * 0.8, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
      ))}
    </group>
  );
}

function BootStage({
  y,
  color,
  index,
}: {
  y: number;
  color: string;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity =
        0.5 + Math.sin(clock.getElapsedTime() * 1.5 + index * 0.8) * 0.3;
    }
  });

  return (
    <group position={[0, y, 0]}>
      <RoundedBox ref={ref} args={[1.4, 0.5, 0.3]} radius={0.08} smoothness={4}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.2}
        />
      </RoundedBox>
    </group>
  );
}

// ── EAI Neural Network ─────────────────────────────────────────────────────────
function EAINetwork({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  const nodes = useMemo(() => {
    const n: Array<{ pos: [number, number, number]; layer: number }> = [];
    const layers = [3, 5, 5, 3];
    layers.forEach((count, li) => {
      for (let i = 0; i < count; i++) {
        n.push({
          pos: [(li - 1.5) * 0.9, (i - (count - 1) / 2) * 0.55, 0],
          layer: li,
        });
      }
    });
    return n;
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(clock.getElapsedTime() * 0.3) * 0.4;
      groupRef.current.rotation.x =
        Math.sin(clock.getElapsedTime() * 0.2) * 0.15;
    }
  });

  const layerColors = ["#6B7280", "#A78BFA", "#22D3EE", "#34D399"];

  return (
    <group ref={groupRef} scale={hovered ? 1.05 : 1}>
      {nodes.map((node, i) => (
        <NeuralNode
          key={i}
          position={node.pos}
          color={layerColors[node.layer]}
          index={i}
        />
      ))}
    </group>
  );
}

function NeuralNode({
  position,
  color,
  index,
}: {
  position: [number, number, number];
  color: string;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity =
        0.6 + Math.sin(clock.getElapsedTime() * 2 + index * 0.5) * 0.4;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        toneMapped={false}
      />
    </mesh>
  );
}

// ── eOffice Suite ──────────────────────────────────────────────────────────────
function EOfficeApps({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  const apps = [
    { color: "#22D3EE", label: "eDocs" },
    { color: "#34D399", label: "eSheets" },
    { color: "#F97316", label: "eSlides" },
    { color: "#A78BFA", label: "eMail" },
    { color: "#FBBF24", label: "eDrive" },
    { color: "#F472B6", label: "eChat" },
  ];

  return (
    <group ref={groupRef} scale={hovered ? 1.05 : 1}>
      {apps.map((app, i) => {
        const angle = (i / apps.length) * Math.PI * 2;
        const x = Math.cos(angle) * 1.1;
        const z = Math.sin(angle) * 1.1;
        return (
          <AppIcon key={i} position={[x, 0, z]} color={app.color} index={i} />
        );
      })}
      {/* Central hub */}
      <mesh>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color="#0b0b0d"
          emissive="#F97316"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

function AppIcon({
  position,
  color,
  index,
}: {
  position: [number, number, number];
  color: string;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.8 + index;
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity =
        0.7 + Math.sin(clock.getElapsedTime() * 1.5 + index * 0.7) * 0.3;
    }
  });

  return (
    <RoundedBox
      ref={ref}
      position={position}
      args={[0.35, 0.35, 0.1]}
      radius={0.06}
      smoothness={4}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.7}
        toneMapped={false}
      />
    </RoundedBox>
  );
}

// ── eApps Grid ─────────────────────────────────────────────────────────────────
function EAppsGrid({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.15;
      groupRef.current.rotation.x =
        Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  const colors = [
    "#22D3EE",
    "#34D399",
    "#A78BFA",
    "#F97316",
    "#FBBF24",
    "#F472B6",
    "#60A5FA",
    "#10B981",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#FBBF24",
  ];

  return (
    <group ref={groupRef} scale={hovered ? 1.05 : 1}>
      {colors.map((color, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        return (
          <AppGridItem
            key={i}
            position={[(col - 1.5) * 0.55, (row - 1) * 0.55, 0]}
            color={color}
            index={i}
          />
        );
      })}
    </group>
  );
}

function AppGridItem({
  position,
  color,
  index,
}: {
  position: [number, number, number];
  color: string;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity =
        0.4 + Math.sin(clock.getElapsedTime() * 1.2 + index * 0.4) * 0.3;
    }
  });

  return (
    <RoundedBox
      ref={ref}
      position={position}
      args={[0.42, 0.42, 0.08]}
      radius={0.07}
      smoothness={4}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        toneMapped={false}
      />
    </RoundedBox>
  );
}

// ── Public Canvas exports ──────────────────────────────────────────────────────
// Every scene here animates, so it draws each frame only while it is on screen
// and motion is allowed; otherwise it draws on demand (one frame, then on
// interaction). The pixel ratio is capped at 1.5: these stages are large, and
// a 2x or 3x buffer costs a weak GPU far more than it adds to the picture.
function GuardedCanvas({ children, ...props }: ComponentProps<typeof Canvas>) {
  const [webglReady, setWebglReady] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(wrapRef);

  useEffect(() => {
    setWebglReady(supportsWebGL());
  }, []);

  return (
    <div ref={wrapRef} className="h-full w-full">
      {webglReady && (
        <Canvas
          dpr={[1, 1.5]}
          frameloop={onScreen && !reducedMotion ? "always" : "demand"}
          {...props}
        >
          {children}
        </Canvas>
      )}
    </div>
  );
}

export function EoSKernelCanvas({ hovered }: { hovered: boolean }) {
  return (
    <GuardedCanvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]} intensity={1.5} color="#22D3EE" />
      <pointLight position={[-3, -2, -2]} intensity={0.8} color="#34D399" />
      <KernelCore hovered={hovered} />
    </GuardedCanvas>
  );
}

export function EBootCanvas({ hovered }: { hovered: boolean }) {
  return (
    <GuardedCanvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]} intensity={1.5} color="#FBBF24" />
      <pointLight position={[-3, -2, -2]} intensity={0.8} color="#34D399" />
      <EBootSequence hovered={hovered} />
    </GuardedCanvas>
  );
}

export function EAINetworkCanvas({ hovered }: { hovered: boolean }) {
  return (
    <GuardedCanvas
      camera={{ position: [0, 0, 4.5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]} intensity={1.5} color="#A78BFA" />
      <pointLight position={[-3, -2, -2]} intensity={0.8} color="#22D3EE" />
      <EAINetwork hovered={hovered} />
    </GuardedCanvas>
  );
}

// The envelopes FitCamera fits to the stage (see fit-camera.tsx), over the
// whole animation and at the 1.05 hover scale:
// - eOffice: six 0.35 tiles on a ring of radius 1.1, each spinning on its own
//   axis (0.18 from its centre at most), around a 0.35 hub;
// - eApps: a 4 x 3 grid of 0.42 tiles 0.55 apart (2.07 x 1.52), spun about the
//   vertical and tilted by up to 0.1 rad, which lifts its far edge by 0.1.
const EOFFICE_EXTENT: SceneExtent = { cy: 0, hy: 0.19, r: 1.35 };
const EAPPS_EXTENT: SceneExtent = { cy: 0, hy: 0.9, r: 1.17 };

export function EOfficeCanvas({ hovered }: { hovered: boolean }) {
  // The camera sits a little above the ring, so the six apps read as a ring
  // instead of lining up edge-on; FitCamera then sets its distance.
  return (
    <GuardedCanvas
      camera={{ position: [0, 1.5, 4], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
    >
      <FitCamera extent={EOFFICE_EXTENT} />
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]} intensity={1.5} color="#F97316" />
      <pointLight position={[-3, -2, -2]} intensity={0.8} color="#A78BFA" />
      <EOfficeApps hovered={hovered} />
    </GuardedCanvas>
  );
}

export function EAppsCanvas({ hovered }: { hovered: boolean }) {
  return (
    <GuardedCanvas
      camera={{ position: [0, 0, 4.5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
    >
      <FitCamera extent={EAPPS_EXTENT} />
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]} intensity={1.5} color="#22D3EE" />
      <pointLight position={[-3, -2, -2]} intensity={0.8} color="#F97316" />
      <EAppsGrid hovered={hovered} />
    </GuardedCanvas>
  );
}
