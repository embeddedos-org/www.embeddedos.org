import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Cylinder, Cone } from "@react-three/drei";
import * as THREE from "three";

// ── Rotor blade ───────────────────────────────────────────────────────────────
function Rotor({
  position,
  speed = 1,
}: {
  position: [number, number, number];
  speed?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current)
      ref.current.rotation.y = clock.getElapsedTime() * speed * 8;
  });
  return (
    <group ref={ref} position={position}>
      {/* Hub */}
      <Cylinder args={[0.06, 0.06, 0.08, 12]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="#F97316"
          emissive="#F97316"
          emissiveIntensity={0.8}
        />
      </Cylinder>
      {/* 4 blades */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 0.4, 0, Math.sin(angle) * 0.4]}
          rotation={[0, angle, 0]}
        >
          <boxGeometry args={[0.7, 0.025, 0.12]} />
          <meshStandardMaterial
            color="#1e2540"
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── AeroSwift Personal (AS-1/2) ───────────────────────────────────────────────
function AeroSwiftPersonal() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.12;
  });

  return (
    <group ref={groupRef}>
      {/* Main fuselage */}
      <RoundedBox args={[2.8, 0.55, 0.9]} radius={0.2} smoothness={4}>
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
      </RoundedBox>
      {/* Canopy */}
      <mesh position={[0.3, 0.3, 0]}>
        <sphereGeometry args={[0.38, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#22D3EE"
          transparent
          opacity={0.35}
          metalness={0.1}
          roughness={0}
        />
      </mesh>
      {/* Wings */}
      <mesh position={[0, 0, 0.9]}>
        <boxGeometry args={[1.8, 0.06, 1.2]} />
        <meshStandardMaterial
          color="#1e2540"
          metalness={0.8}
          roughness={0.15}
        />
      </mesh>
      <mesh position={[0, 0, -0.9]}>
        <boxGeometry args={[1.8, 0.06, 1.2]} />
        <meshStandardMaterial
          color="#1e2540"
          metalness={0.8}
          roughness={0.15}
        />
      </mesh>
      {/* Tail fin */}
      <mesh position={[-1.2, 0.25, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.06]} />
        <meshStandardMaterial
          color="#1e2540"
          metalness={0.8}
          roughness={0.15}
        />
      </mesh>
      {/* Solar panel strips */}
      {[-0.5, 0, 0.5].map((z, i) => (
        <mesh key={i} position={[0, 0.04, z * 0.55]}>
          <boxGeometry args={[1.4, 0.02, 0.12]} />
          <meshStandardMaterial
            color="#1a3a5c"
            emissive="#60A5FA"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      {/* Rotors — 4 corners */}
      <Rotor position={[0.8, 0.35, 0.85]} speed={1.2} />
      <Rotor position={[-0.8, 0.35, 0.85]} speed={-1.1} />
      <Rotor position={[0.8, 0.35, -0.85]} speed={-1.3} />
      <Rotor position={[-0.8, 0.35, -0.85]} speed={1.0} />
      {/* Thrust nozzles */}
      <Cone
        args={[0.08, 0.3, 8]}
        position={[-1.55, 0, 0.3]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial
          color="#F97316"
          emissive="#F97316"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </Cone>
      <Cone
        args={[0.08, 0.3, 8]}
        position={[-1.55, 0, -0.3]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial
          color="#F97316"
          emissive="#F97316"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </Cone>
    </group>
  );
}

// ── AeroSwift Transit (AS-10) — larger air taxi ───────────────────────────────
function AeroSwiftTransit() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.25;
    groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.6) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Main fuselage — larger */}
      <RoundedBox args={[3.5, 0.9, 1.4]} radius={0.25} smoothness={4}>
        <meshStandardMaterial
          color="#0d1424"
          metalness={0.85}
          roughness={0.12}
        />
      </RoundedBox>
      {/* Passenger windows */}
      {[-0.8, -0.2, 0.4, 1.0].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 0.72]}>
          <boxGeometry args={[0.28, 0.22, 0.04]} />
          <meshStandardMaterial
            color="#22D3EE"
            transparent
            opacity={0.5}
            emissive="#22D3EE"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      {/* Canopy / cockpit */}
      <mesh position={[1.5, 0.4, 0]}>
        <sphereGeometry args={[0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#22D3EE"
          transparent
          opacity={0.3}
          metalness={0.1}
          roughness={0}
        />
      </mesh>
      {/* Wings */}
      <mesh position={[0, 0, 1.4]}>
        <boxGeometry args={[2.5, 0.08, 1.8]} />
        <meshStandardMaterial
          color="#1a2035"
          metalness={0.8}
          roughness={0.15}
        />
      </mesh>
      <mesh position={[0, 0, -1.4]}>
        <boxGeometry args={[2.5, 0.08, 1.8]} />
        <meshStandardMaterial
          color="#1a2035"
          metalness={0.8}
          roughness={0.15}
        />
      </mesh>
      {/* 8 rotors for transit */}
      {[
        [1.0, 0.55, 1.3],
        [-1.0, 0.55, 1.3],
        [1.0, 0.55, -1.3],
        [-1.0, 0.55, -1.3],
        [0, 0.55, 1.3],
        [0, 0.55, -1.3],
      ].map((pos, i) => (
        <Rotor
          key={i}
          position={pos as [number, number, number]}
          speed={i % 2 === 0 ? 1.1 : -1.0}
        />
      ))}
      {/* Landing gear */}
      {[-1.2, 1.2].map((x, i) => (
        <Cylinder
          key={i}
          args={[0.05, 0.05, 0.5, 8]}
          position={[x, -0.7, 0]}
          rotation={[0, 0, 0]}
        >
          <meshStandardMaterial color="#555" metalness={0.9} roughness={0.2} />
        </Cylinder>
      ))}
      {/* Thrust nozzles */}
      <Cone
        args={[0.1, 0.4, 8]}
        position={[-1.9, 0, 0.5]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial
          color="#F97316"
          emissive="#F97316"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </Cone>
      <Cone
        args={[0.1, 0.4, 8]}
        position={[-1.9, 0, -0.5]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial
          color="#F97316"
          emissive="#F97316"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </Cone>
    </group>
  );
}

// ── Exported canvas wrappers ──────────────────────────────────────────────────
export function AeroSwiftPersonalCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} intensity={2} color="#F97316" />
      <pointLight position={[-4, 2, 2]} intensity={1} color="#22D3EE" />
      <pointLight position={[0, -2, 4]} intensity={0.5} color="#A78BFA" />
      <AeroSwiftPersonal />
    </Canvas>
  );
}

export function AeroSwiftTransitCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 4, 4]} intensity={2} color="#F97316" />
      <pointLight position={[-5, 2, 2]} intensity={1} color="#22D3EE" />
      <pointLight position={[0, -2, 5]} intensity={0.5} color="#A78BFA" />
      <AeroSwiftTransit />
    </Canvas>
  );
}

// ── Flight telemetry simulation ───────────────────────────────────────────────
export function FlightTelemetry({ model }: { model: "personal" | "transit" }) {
  const data =
    model === "personal"
      ? {
          altitude: "1,200 ft",
          speed: "185 mph",
          range: "280 mi",
          battery: "94%",
          rotors: 4,
          passengers: 2,
        }
      : {
          altitude: "2,800 ft",
          speed: "210 mph",
          range: "320 mi",
          battery: "88%",
          rotors: 8,
          passengers: 10,
        };

  return (
    <div className="grid grid-cols-3 gap-3">
      {Object.entries(data).map(([key, val]) => (
        <div
          key={key}
          className="bg-white/5 border border-white/10 rounded-xl p-3 text-center"
        >
          <div className="text-lg font-bold text-[#F97316]">{val}</div>
          <div className="text-xs text-white/40 capitalize mt-0.5">{key}</div>
        </div>
      ))}
    </div>
  );
}
