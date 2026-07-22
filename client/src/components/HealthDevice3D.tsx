import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Torus, Cylinder, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

// ── HEALTH-KEY ULTRA — smart key fob ─────────────────────────────────────────
function KeyUltraModel({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.5;
    groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.15;
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.5 + Math.sin(clock.getElapsedTime() * 2) * 0.5;
    }
  });

  return (
    <group ref={groupRef} scale={hovered ? 1.08 : 1}>
      {/* Main body */}
      <RoundedBox args={[1.2, 2.2, 0.35]} radius={0.18} smoothness={4}>
        <meshStandardMaterial color="#1a1f35" metalness={0.9} roughness={0.1} />
      </RoundedBox>
      {/* Screen */}
      <RoundedBox args={[0.85, 1.0, 0.05]} radius={0.06} smoothness={4} position={[0, 0.35, 0.2]}>
        <meshStandardMaterial color="#0a0f1e" emissive="#22D3EE" emissiveIntensity={0.4} />
      </RoundedBox>
      {/* Sensor ring */}
      <Torus args={[0.28, 0.04, 16, 32]} position={[0, -0.65, 0.2]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#F97316" emissive="#F97316" emissiveIntensity={2} toneMapped={false} />
      </Torus>
      {/* LED indicator */}
      <mesh ref={glowRef} position={[0, 0.95, 0.2]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#34D399" emissive="#34D399" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      {/* Key ring hole */}
      <Torus args={[0.12, 0.03, 8, 16]} position={[0, 1.2, 0]}>
        <meshStandardMaterial color="#888" metalness={1} roughness={0.2} />
      </Torus>
    </group>
  );
}

// ── HEALTH-BAND Neuro — smartwatch band ───────────────────────────────────────
function BandNeuroModel({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.4;
    groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.25) * 0.1;
  });

  return (
    <group ref={groupRef} scale={hovered ? 1.08 : 1}>
      {/* Watch body */}
      <RoundedBox args={[1.5, 1.5, 0.4]} radius={0.22} smoothness={4}>
        <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.15} />
      </RoundedBox>
      {/* Display */}
      <RoundedBox args={[1.15, 1.15, 0.08]} radius={0.12} smoothness={4} position={[0, 0, 0.24]}>
        <meshStandardMaterial color="#0a0f1e" emissive="#A78BFA" emissiveIntensity={0.5} />
      </RoundedBox>
      {/* Crown */}
      <Cylinder args={[0.06, 0.06, 0.25, 12]} position={[0.83, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#555" metalness={1} roughness={0.2} />
      </Cylinder>
      {/* Neural sensor array (3 dots) */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={i} position={[x, -0.85, 0.1]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#A78BFA" emissive="#A78BFA" emissiveIntensity={2.5} toneMapped={false} />
        </mesh>
      ))}
      {/* Band stubs */}
      <RoundedBox args={[1.3, 0.55, 0.25]} radius={0.1} smoothness={4} position={[0, 1.1, 0]}>
        <meshStandardMaterial color="#1e2540" metalness={0.5} roughness={0.4} />
      </RoundedBox>
      <RoundedBox args={[1.3, 0.55, 0.25]} radius={0.1} smoothness={4} position={[0, -1.1, 0]}>
        <meshStandardMaterial color="#1e2540" metalness={0.5} roughness={0.4} />
      </RoundedBox>
    </group>
  );
}

// ── HEALTH-RING — smart ring ──────────────────────────────────────────────────
function RingModel({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.6;
    groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.4) * 0.2;
  });

  return (
    <group ref={groupRef} scale={hovered ? 1.08 : 1}>
      {/* Ring body */}
      <Torus args={[0.9, 0.22, 32, 64]}>
        <meshStandardMaterial color="#1a1f35" metalness={0.95} roughness={0.05} />
      </Torus>
      {/* Inner sensor ring */}
      <Torus args={[0.9, 0.08, 16, 64]}>
        <meshStandardMaterial color="#34D399" emissive="#34D399" emissiveIntensity={1.5} toneMapped={false} />
      </Torus>
      {/* Sensor bump */}
      <mesh position={[0.9, 0, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#F97316" emissive="#F97316" emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ── HEALTH-LAB — portable lab device ─────────────────────────────────────────
function LabModel({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.35;
    groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.12;
  });

  return (
    <group ref={groupRef} scale={hovered ? 1.08 : 1}>
      {/* Main body */}
      <RoundedBox args={[2.2, 1.4, 0.5]} radius={0.15} smoothness={4}>
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.2} />
      </RoundedBox>
      {/* Screen */}
      <RoundedBox args={[1.4, 0.9, 0.06]} radius={0.08} smoothness={4} position={[-0.3, 0.1, 0.28]}>
        <meshStandardMaterial color="#0a0f1e" emissive="#60A5FA" emissiveIntensity={0.5} />
      </RoundedBox>
      {/* Test port */}
      <Cylinder args={[0.12, 0.12, 0.2, 16]} position={[0.85, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#F97316" emissive="#F97316" emissiveIntensity={1.5} toneMapped={false} />
      </Cylinder>
      {/* LED strip */}
      {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
        <mesh key={i} position={[x, -0.55, 0.28]}>
          <boxGeometry args={[0.08, 0.06, 0.04]} />
          <meshStandardMaterial
            color={["#34D399", "#F97316", "#A78BFA", "#22D3EE"][i]}
            emissive={["#34D399", "#F97316", "#A78BFA", "#22D3EE"][i]}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Device canvas wrapper ─────────────────────────────────────────────────────
type DeviceType = "key" | "band" | "ring" | "lab";

const DEVICE_CAMERAS: Record<DeviceType, [number, number, number]> = {
  key: [0, 0, 4],
  band: [0, 0, 4],
  ring: [0, 0.5, 4],
  lab: [0, 0, 5],
};

export function HealthDevice3DCanvas({ device, hovered = false }: { device: DeviceType; hovered?: boolean }) {
  return (
    <Canvas camera={{ position: DEVICE_CAMERAS[device], fov: 45 }} gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={1.5} color="#F97316" />
      <pointLight position={[-3, -2, 2]} intensity={1} color="#22D3EE" />
      <pointLight position={[0, 0, 4]} intensity={0.5} color="#A78BFA" />

      {device === "key" && <KeyUltraModel hovered={hovered} />}
      {device === "band" && <BandNeuroModel hovered={hovered} />}
      {device === "ring" && <RingModel hovered={hovered} />}
      {device === "lab" && <LabModel hovered={hovered} />}
    </Canvas>
  );
}

// ── Biometric waveform simulation ─────────────────────────────────────────────
export function BiometricWaveform({ type, color }: { type: "ecg" | "spo2" | "neural" | "temp"; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const offsetRef = useRef(0);

  const generateWave = useMemo(() => {
    switch (type) {
      case "ecg":
        return (x: number) => {
          const t = x % (Math.PI * 2);
          if (t < 0.3) return Math.sin(t * 10) * 0.3;
          if (t < 0.5) return Math.sin((t - 0.3) * Math.PI / 0.2) * 1.0;
          if (t < 0.7) return -Math.sin((t - 0.5) * Math.PI / 0.2) * 0.4;
          if (t < 1.0) return Math.sin((t - 0.7) * Math.PI / 0.3) * 0.6;
          return Math.sin(t * 2) * 0.05;
        };
      case "spo2":
        return (x: number) => Math.sin(x * 1.2) * 0.6 + Math.sin(x * 2.4) * 0.2;
      case "neural":
        return (x: number) =>
          Math.sin(x * 8) * 0.15 + Math.sin(x * 3.3) * 0.4 + Math.sin(x * 1.1) * 0.3 + (Math.random() - 0.5) * 0.08;
      case "temp":
        return (x: number) => Math.sin(x * 0.5) * 0.3 + Math.sin(x * 1.5) * 0.1;
    }
  }, [type]);

  useRef(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Glow effect
      ctx.shadowBlur = 8;
      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const points = 200;
      for (let i = 0; i < points; i++) {
        const x = (i / points) * w;
        const t = (i / points) * Math.PI * 4 + offsetRef.current;
        const y = h / 2 - generateWave(t) * (h * 0.38);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Fade left edge
      const grad = ctx.createLinearGradient(0, 0, w * 0.15, 0);
      grad.addColorStop(0, "rgba(10,15,30,1)");
      grad.addColorStop(1, "rgba(10,15,30,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w * 0.15, h);

      // Fade right edge
      const grad2 = ctx.createLinearGradient(w * 0.85, 0, w, 0);
      grad2.addColorStop(0, "rgba(10,15,30,0)");
      grad2.addColorStop(1, "rgba(10,15,30,1)");
      ctx.fillStyle = grad2;
      ctx.fillRect(w * 0.85, 0, w * 0.15, h);

      offsetRef.current += type === "neural" ? 0.06 : 0.03;
      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  });

  // Use useEffect for the animation loop
  const startAnimation = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => {};

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.shadowBlur = 8;
      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const points = 200;
      for (let i = 0; i < points; i++) {
        const x = (i / points) * w;
        const t = (i / points) * Math.PI * 4 + offsetRef.current;
        const y = h / 2 - generateWave(t) * (h * 0.38);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      const grad = ctx.createLinearGradient(0, 0, w * 0.15, 0);
      grad.addColorStop(0, "rgba(10,15,30,1)");
      grad.addColorStop(1, "rgba(10,15,30,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w * 0.15, h);

      const grad2 = ctx.createLinearGradient(w * 0.85, 0, w, 0);
      grad2.addColorStop(0, "rgba(10,15,30,0)");
      grad2.addColorStop(1, "rgba(10,15,30,1)");
      ctx.fillStyle = grad2;
      ctx.fillRect(w * 0.85, 0, w * 0.15, h);

      offsetRef.current += type === "neural" ? 0.06 : 0.03;
      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  };

  return (
    <canvas
      ref={el => { if (el) { canvasRef.current = el; startAnimation(el); } }}
      width={400}
      height={80}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
