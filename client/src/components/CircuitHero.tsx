import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ── Particle field ──────────────────────────────────────────────────────────
function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const count = 1800;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#F97316"), // amber
      new THREE.Color("#22D3EE"), // cyan
      new THREE.Color("#A78BFA"), // violet
      new THREE.Color("#34D399"), // green
      new THREE.Color("#60A5FA"), // blue
    ];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.04;
    meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.08;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.65} sizeAttenuation />
    </points>
  );
}

// ── Circuit node (glowing sphere) ────────────────────────────────────────────
function CircuitNode({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const baseY = position[1];

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = baseY + Math.sin(clock.getElapsedTime() * speed + position[0]) * 0.3;
    const s = 0.85 + 0.15 * Math.sin(clock.getElapsedTime() * speed * 1.5);
    meshRef.current.scale.setScalar(s);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} toneMapped={false} />
    </mesh>
  );
}

// ── Glowing connection line ───────────────────────────────────────────────────
function ConnectionLine({ from, to, color }: { from: [number, number, number]; to: [number, number, number]; color: string }) {
  const points = useMemo(() => [new THREE.Vector3(...from), new THREE.Vector3(...to)], [from, to]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.25} />
    </lineSegments>
  );
}

// ── Circuit board grid lines ──────────────────────────────────────────────────
function CircuitGrid() {
  const linesRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!linesRef.current) return;
    linesRef.current.rotation.z = clock.getElapsedTime() * 0.008;
  });

  // Build a single merged geometry for all horizontal lines
  const hGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let y = -5; y <= 5; y += 1.2) {
      pts.push(new THREE.Vector3(-12, y, -3), new THREE.Vector3(12, y, -3));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  const vGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let x = -12; x <= 12; x += 2.4) {
      pts.push(new THREE.Vector3(x, -5, -3), new THREE.Vector3(x, 5, -3));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  return (
    <group ref={linesRef}>
      <lineSegments geometry={hGeo}>
        <lineBasicMaterial color="#F97316" transparent opacity={0.06} />
      </lineSegments>
      <lineSegments geometry={vGeo}>
        <lineBasicMaterial color="#22D3EE" transparent opacity={0.06} />
      </lineSegments>
    </group>
  );
}

// ── Nodes + connections ───────────────────────────────────────────────────────
const NODES: Array<{ pos: [number, number, number]; color: string; speed: number }> = [
  { pos: [-4, 1.5, 0], color: "#F97316", speed: 0.8 },
  { pos: [-1.5, -1, 0.5], color: "#22D3EE", speed: 1.1 },
  { pos: [1.5, 1.8, 0.2], color: "#A78BFA", speed: 0.7 },
  { pos: [4, -0.5, 0.3], color: "#34D399", speed: 1.3 },
  { pos: [0, 2.5, -0.2], color: "#60A5FA", speed: 0.9 },
  { pos: [-3, -2, 0.4], color: "#F59E0B", speed: 1.0 },
  { pos: [3, 2.2, 0.1], color: "#F97316", speed: 1.2 },
  { pos: [-2, 0.5, 0.6], color: "#22D3EE", speed: 0.6 },
  { pos: [2.5, -1.8, 0.2], color: "#A78BFA", speed: 1.4 },
];

const CONNECTIONS: Array<{ from: [number, number, number]; to: [number, number, number]; color: string }> = [
  { from: [-4, 1.5, 0], to: [-1.5, -1, 0.5], color: "#F97316" },
  { from: [-1.5, -1, 0.5], to: [1.5, 1.8, 0.2], color: "#22D3EE" },
  { from: [1.5, 1.8, 0.2], to: [4, -0.5, 0.3], color: "#A78BFA" },
  { from: [0, 2.5, -0.2], to: [1.5, 1.8, 0.2], color: "#60A5FA" },
  { from: [-4, 1.5, 0], to: [-3, -2, 0.4], color: "#F59E0B" },
  { from: [-3, -2, 0.4], to: [-1.5, -1, 0.5], color: "#34D399" },
  { from: [3, 2.2, 0.1], to: [4, -0.5, 0.3], color: "#F97316" },
  { from: [-2, 0.5, 0.6], to: [-1.5, -1, 0.5], color: "#22D3EE" },
  { from: [2.5, -1.8, 0.2], to: [4, -0.5, 0.3], color: "#A78BFA" },
  { from: [-2, 0.5, 0.6], to: [0, 2.5, -0.2], color: "#60A5FA" },
];

// ── Mouse-responsive camera ───────────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 1.5 - camera.position.x) * 0.04;
    camera.position.y += (mouse.current.y * 0.8 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ── Main exported component ───────────────────────────────────────────────────
export default function CircuitHero() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#F97316" />
        <pointLight position={[-5, -5, 5]} intensity={0.8} color="#22D3EE" />

        <CameraRig />
        <CircuitGrid />
        <ParticleField />

        {NODES.map((n, i) => (
          <CircuitNode key={i} position={n.pos} color={n.color} speed={n.speed} />
        ))}
        {CONNECTIONS.map((c, i) => (
          <ConnectionLine key={i} from={c.from} to={c.to} color={c.color} />
        ))}
      </Canvas>
    </div>
  );
}
