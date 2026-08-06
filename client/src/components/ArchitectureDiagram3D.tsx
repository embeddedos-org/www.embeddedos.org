/**
 * ArchitectureDiagram3D — Multi-mode interactive 3D architecture diagram component.
 * Supports 5 distinct visual modes so each product diagram looks unique:
 *   "layered"  — stacked horizontal slabs (OS kernel, boot chain)
 *   "radial"   — hub-and-spoke orbiting nodes (neural pipeline, sensor fusion)
 *   "pipeline" — left-to-right flowing pipeline stages (eDB query path)
 *   "tree"     — top-down hierarchy tree (eOffice app suite)
 *   "matrix"   — 3D grid of nodes (full stack overview)
 */
import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

export type DiagramMode = "layered" | "radial" | "pipeline" | "tree" | "matrix";

export interface DiagramLayer {
  label: string;
  sublabels?: string[];
  color: string;
  y: number;
  width?: number;
  depth?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYERED MODE — horizontal stacked slabs (default, used for kernel / boot)
// ─────────────────────────────────────────────────────────────────────────────
function LayeredBlock({
  layer,
  index,
}: {
  layer: DiagramLayer;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const w = layer.width ?? 3.6;
  const d = layer.depth ?? 1.1;

  useFrame(state => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y =
      layer.y + Math.sin(t * 0.55 + index * 0.85) * 0.035;
    const target = hovered ? 1.05 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.1);
  });

  const color = new THREE.Color(layer.color);
  const emissive = hovered
    ? color.clone().multiplyScalar(0.4)
    : color.clone().multiplyScalar(0.15);

  return (
    <group>
      <RoundedBox
        ref={meshRef}
        args={[w, 0.36, d]}
        radius={0.055}
        smoothness={4}
        position={[0, layer.y, 0]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={layer.color}
          emissive={emissive}
          emissiveIntensity={hovered ? 1.4 : 0.7}
          metalness={0.35}
          roughness={0.45}
          transparent
          opacity={0.9}
        />
      </RoundedBox>
      {/* Glowing edge strip on top */}
      <mesh position={[0, layer.y + 0.185, 0]}>
        <boxGeometry args={[w * 0.96, 0.018, d * 0.96]} />
        <meshBasicMaterial
          color={layer.color}
          transparent
          opacity={hovered ? 0.9 : 0.5}
        />
      </mesh>
    </group>
  );
}

function LayeredConnectors({ layers }: { layers: DiagramLayer[] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(state => {
    if (!ref.current) return;
    ref.current.children.forEach((c, i) => {
      const mat = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
      if (mat)
        mat.opacity = 0.25 + 0.15 * Math.sin(state.clock.elapsedTime * 0.9 + i);
    });
  });
  const els: React.ReactElement[] = [];
  for (let i = 0; i < layers.length - 1; i++) {
    const a = layers[i],
      b = layers[i + 1];
    const midY = (a.y + b.y) / 2;
    const h = Math.abs(b.y - a.y) - 0.36;
    if (h <= 0) continue;
    els.push(
      <mesh key={i} position={[0, midY, 0]}>
        <cylinderGeometry args={[0.012, 0.012, h, 6]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.35} />
      </mesh>
    );
  }
  return <group ref={ref}>{els}</group>;
}

function LayeredScene({ layers }: { layers: DiagramLayer[] }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(state => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.14) * 0.2;
  });
  return (
    <group ref={groupRef}>
      <LayeredConnectors layers={layers} />
      {layers.map((layer, i) => (
        <LayeredBlock key={layer.label} layer={layer} index={i} />
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RADIAL MODE — hub sphere + orbiting node spheres (neural pipeline)
// ─────────────────────────────────────────────────────────────────────────────
function RadialHub({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(state => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.4;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.15;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.55, 2]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.6}
        roughness={0.2}
        wireframe={false}
        transparent
        opacity={0.92}
      />
    </mesh>
  );
}

function RadialNode({
  layer,
  angle,
  radius,
  index,
}: {
  layer: DiagramLayer;
  angle: number;
  radius: number;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(state => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const a = angle + t * (0.12 + index * 0.02);
    ref.current.position.x = Math.cos(a) * radius;
    ref.current.position.z = Math.sin(a) * radius;
    ref.current.position.y = Math.sin(t * 0.5 + index) * 0.18;
    ref.current.scale.setScalar(hovered ? 1.25 : 1.0);
  });

  return (
    <group>
      <mesh
        ref={ref}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial
          color={layer.color}
          emissive={layer.color}
          emissiveIntensity={hovered ? 0.8 : 0.35}
          metalness={0.4}
          roughness={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

function RadialScene({ layers }: { layers: DiagramLayer[] }) {
  const hubColor = layers[Math.floor(layers.length / 2)]?.color ?? "#F97316";
  const radius = 1.9;
  return (
    <group>
      <RadialHub color={hubColor} />
      {layers.map((layer, i) => {
        const angle = (i / layers.length) * Math.PI * 2;
        return (
          <RadialNode
            key={layer.label}
            layer={layer}
            angle={angle}
            radius={radius}
            index={i}
          />
        );
      })}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PIPELINE MODE — left-to-right flowing boxes with arrows (eDB, eIPC)
// ─────────────────────────────────────────────────────────────────────────────
function PipelineBox({
  layer,
  xPos,
  index,
}: {
  layer: DiagramLayer;
  xPos: number;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(state => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 0.5 + index * 1.1) * 0.06;
    ref.current.scale.setScalar(hovered ? 1.08 : 1.0);
  });

  return (
    <group>
      <RoundedBox
        ref={ref}
        args={[0.9, 0.55, 0.7]}
        radius={0.07}
        smoothness={4}
        position={[xPos, 0, 0]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={layer.color}
          emissive={layer.color}
          emissiveIntensity={hovered ? 0.7 : 0.3}
          metalness={0.3}
          roughness={0.5}
          transparent
          opacity={0.9}
        />
      </RoundedBox>
      {/* Arrow connector to next */}
      {index < 4 && (
        <mesh position={[xPos + 0.72, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.07, 0.2, 8]} />
          <meshBasicMaterial color={layer.color} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}

function PipelineScene({ layers }: { layers: DiagramLayer[] }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(state => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.18) * 0.12;
    groupRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.12) * 0.15;
  });
  const n = layers.length;
  const spacing = 1.25;
  const startX = -((n - 1) * spacing) / 2;
  return (
    <group ref={groupRef}>
      {layers.map((layer, i) => (
        <PipelineBox
          key={layer.label}
          layer={layer}
          xPos={startX + i * spacing}
          index={i}
        />
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TREE MODE — top-down hierarchy (eOffice suite)
// ─────────────────────────────────────────────────────────────────────────────
function TreeNode({
  color,
  position,
  size = 0.38,
  index,
}: {
  color: string;
  position: [number, number, number];
  size?: number;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(state => {
    if (!ref.current) return;
    ref.current.position.y =
      position[1] +
      Math.sin(state.clock.elapsedTime * 0.5 + index * 0.7) * 0.05;
    ref.current.scale.setScalar(hovered ? 1.2 : 1.0);
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 0.7 : 0.3}
        metalness={0.4}
        roughness={0.4}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function TreeEdge({
  from,
  to,
  color,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
}) {
  const midX = (from[0] + to[0]) / 2;
  const midY = (from[1] + to[1]) / 2;
  const midZ = (from[2] + to[2]) / 2;
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dx, dy);
  return (
    <mesh position={[midX, midY, midZ]} rotation={[0, 0, angle]}>
      <cylinderGeometry args={[0.01, 0.01, length * 0.85, 4]} />
      <meshBasicMaterial color={color} transparent opacity={0.35} />
    </mesh>
  );
}

function TreeScene({ layers }: { layers: DiagramLayer[] }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(state => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.13) * 0.22;
  });

  // Build a 3-level tree: root → 2 branches → leaves
  const root: [number, number, number] = [0, 1.6, 0];
  const branches: [number, number, number][] = [
    [-1.4, 0.3, 0],
    [1.4, 0.3, 0],
  ];
  const leaves: [number, number, number][] = [
    [-2.2, -1.1, 0],
    [-1.0, -1.1, 0],
    [0.6, -1.1, 0],
    [2.0, -1.1, 0],
    [0, -1.1, 0.8],
  ];

  const colors = layers.map(l => l.color);
  const rootColor = colors[0] ?? "#F97316";
  const branchColors = [colors[1] ?? "#22D3EE", colors[2] ?? "#A78BFA"];
  const leafColors = colors.slice(2);

  return (
    <group ref={groupRef}>
      {/* Edges */}
      {branches.map((b, i) => (
        <TreeEdge key={`rb${i}`} from={root} to={b} color={branchColors[i]} />
      ))}
      {leaves.map((l, i) => (
        <TreeEdge
          key={`bl${i}`}
          from={branches[i < 2 ? 0 : 1]}
          to={l}
          color={leafColors[i] ?? "#6B7280"}
        />
      ))}
      {/* Nodes */}
      <TreeNode color={rootColor} position={root} size={0.48} index={0} />
      {branches.map((b, i) => (
        <TreeNode
          key={i}
          color={branchColors[i]}
          position={b}
          size={0.38}
          index={i + 1}
        />
      ))}
      {leaves.map((l, i) => (
        <TreeNode
          key={i}
          color={leafColors[i] ?? "#6B7280"}
          position={l}
          size={0.28}
          index={i + 3}
        />
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MATRIX MODE — 3D grid of glowing nodes (full stack overview)
// ─────────────────────────────────────────────────────────────────────────────
function MatrixNode({
  color,
  position,
  index,
}: {
  color: string;
  position: [number, number, number];
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(state => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y =
      position[1] + Math.sin(t * 0.4 + index * 0.5) * 0.07;
    const pulse = 0.9 + 0.1 * Math.sin(t * 1.2 + index * 0.8);
    ref.current.scale.setScalar(hovered ? 1.3 : pulse);
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <octahedronGeometry args={[0.18, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 1.0 : 0.45}
        metalness={0.5}
        roughness={0.25}
        transparent
        opacity={0.88}
      />
    </mesh>
  );
}

function MatrixScene({ layers }: { layers: DiagramLayer[] }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(state => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.12;
    groupRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.09) * 0.15;
  });

  // Build a 4×4 grid of nodes, cycling through layer colors
  const nodes = useMemo(() => {
    const pts: { pos: [number, number, number]; color: string; idx: number }[] =
      [];
    const cols = 4,
      rows = 4;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        pts.push({
          pos: [(c - 1.5) * 1.1, (r - 1.5) * 1.1, (Math.random() - 0.5) * 0.6],
          color: layers[idx % layers.length]?.color ?? "#6B7280",
          idx,
        });
      }
    }
    return pts;
  }, [layers]);

  return (
    <group ref={groupRef}>
      {nodes.map(n => (
        <MatrixNode
          key={n.idx}
          color={n.color}
          position={n.pos}
          index={n.idx}
        />
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface ArchitectureDiagram3DProps {
  layers: DiagramLayer[];
  mode?: DiagramMode;
  height?: number;
  className?: string;
  accentColor?: string;
}

export default function ArchitectureDiagram3D({
  layers,
  mode = "layered",
  height = 320,
  className = "",
  accentColor,
}: ArchitectureDiagram3DProps) {
  const accent = accentColor ?? layers[0]?.color ?? "#F97316";

  function SceneSwitch() {
    switch (mode) {
      case "radial":
        return <RadialScene layers={layers} />;
      case "pipeline":
        return <PipelineScene layers={layers} />;
      case "tree":
        return <TreeScene layers={layers} />;
      case "matrix":
        return <MatrixScene layers={layers} />;
      default:
        return <LayeredScene layers={layers} />;
    }
  }

  // Camera presets per mode
  const camPos: [number, number, number] =
    mode === "pipeline"
      ? [0, 1.5, 6.5]
      : mode === "tree"
        ? [0, 0.5, 6.5]
        : mode === "matrix"
          ? [0, 0, 7.0]
          : mode === "radial"
            ? [0, 1.0, 6.0]
            : [0, 0, 5.5];

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-white/8 ${className}`}
      style={{ height, background: "#050A18" }}
    >
      {/* Layer legend overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-10 flex flex-wrap gap-x-3 gap-y-1 px-3 py-2"
        style={{
          background: "linear-gradient(to top, #050A18ee, transparent)",
        }}
      >
        {layers.map(layer => (
          <div key={layer.label} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: layer.color }}
            />
            <span className="text-[9px] font-mono font-semibold tracking-wider text-white/55 uppercase">
              {layer.label}
            </span>
          </div>
        ))}
      </div>

      {/* Mode badge */}
      <div className="absolute top-2 right-3 z-10 pointer-events-none">
        <span
          className="text-[9px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border"
          style={{
            color: accent,
            borderColor: accent + "40",
            background: accent + "15",
          }}
        >
          {mode}
        </span>
      </div>

      <Canvas
        camera={{ position: camPos, fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[3, 5, 3]}
          intensity={0.9}
          color="#ffffff"
        />
        <pointLight position={[-3, 2, 2]} intensity={0.6} color={accent} />
        <pointLight position={[3, -2, 2]} intensity={0.35} color="#22D3EE" />
        <React.Suspense fallback={null}>
          <SceneSwitch />
        </React.Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI / 1.6}
          autoRotate={mode !== "pipeline"}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
