/**
 * ArchitectureSystemMapScene — the WebGL scene for the Architecture page's
 * system map. Imported lazily by ArchitectureSystemMap3D so three.js stays in
 * an async chunk (see tests/performance/budgets.test.ts).
 *
 * All animation is gated on `reducedMotion`: with reduced motion the scene
 * renders fully static — no auto-rotate, no idle bobbing, no edge pulsing —
 * while manual orbit still works.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import {
  ARCHITECTURE_STAGES,
  type ArchitectureStage,
  type ArchitectureStageId,
} from "@/data/architecture";
import {
  MATURITY_DOT,
  SYSTEM_MAP_EDGES,
  edgeCurve,
  systemMapCameraDistance,
  systemMapLayout,
  type PlacedNode,
  type SystemMapEdge,
  type Vec3,
} from "./system-map-data";

const HIGHLIGHT_COLOR = "#34D399";
const EDGE_COLOR = "#5B6B8C";

function stageOf(id: ArchitectureStageId): ArchitectureStage {
  const stage = ARCHITECTURE_STAGES.find(s => s.id === id);
  if (!stage) throw new Error(`unknown stage: ${id}`);
  return stage;
}

interface SceneProps {
  reducedMotion: boolean;
  selectedId: ArchitectureStageId | null;
  onSelect: (id: ArchitectureStageId) => void;
}

// ── Node ────────────────────────────────────────────────────────────────────
function SystemNode({
  node,
  reducedMotion,
  selected,
  onSelect,
}: {
  node: PlacedNode;
  reducedMotion: boolean;
  selected: boolean;
  onSelect: (id: ArchitectureStageId) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const stage = stageOf(node.id);

  useFrame(state => {
    if (reducedMotion || !groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y =
      node.y + Math.sin(t * 0.6 + node.y * 2.1) * 0.03;
  });

  return (
    <group ref={groupRef} position={[node.x, node.y, node.z]}>
      <RoundedBox
        args={[node.w, node.h, node.d]}
        radius={0.07}
        smoothness={4}
        onPointerOver={e => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={e => {
          e.stopPropagation();
          onSelect(node.id);
        }}
      >
        <meshStandardMaterial
          color={stage.color}
          emissive={stage.color}
          emissiveIntensity={selected ? 0.85 : hovered ? 0.55 : 0.28}
          metalness={0.35}
          roughness={0.4}
          transparent
          opacity={0.92}
        />
        {(selected || hovered) && (
          <Edges scale={1.04} color={selected ? "#ffffff" : stage.color} />
        )}
      </RoundedBox>
      {/* Maturity badge — small diamond at the node's right end. The DOM
          legend maps these colors to maturity labels. */}
      <mesh position={[node.w / 2 + 0.17, 0, 0]}>
        <octahedronGeometry args={[0.09, 0]} />
        <meshStandardMaterial
          color={MATURITY_DOT[stage.maturity]}
          emissive={MATURITY_DOT[stage.maturity]}
          emissiveIntensity={0.7}
          metalness={0.3}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

// ── Edge ────────────────────────────────────────────────────────────────────
function SystemEdge({
  edge,
  nodes,
  reducedMotion,
}: {
  edge: SystemMapEdge;
  nodes: PlacedNode[];
  reducedMotion: boolean;
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  const { curve, end, quaternion } = useMemo(() => {
    const { a, b, c } = edgeCurve(edge, nodes);
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...a),
      new THREE.Vector3(...c),
      new THREE.Vector3(...b)
    );
    const end = curve.getPoint(0.97);
    const tangent = curve.getTangent(0.97).normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      tangent
    );
    return { curve, end, quaternion };
  }, [edge, nodes]);

  // The shipped eAI Edge profile path gently pulses — never under reduced
  // motion, where it holds a steady bright line instead.
  useFrame(state => {
    if (reducedMotion || !edge.highlight || !matRef.current) return;
    matRef.current.opacity =
      0.7 + 0.25 * Math.sin(state.clock.elapsedTime * 2.2);
  });

  const color = edge.highlight ? HIGHLIGHT_COLOR : EDGE_COLOR;
  return (
    <group>
      <mesh>
        <tubeGeometry
          args={[curve, 32, edge.highlight ? 0.028 : 0.015, 8, false]}
        />
        <meshBasicMaterial
          ref={matRef}
          color={color}
          transparent
          opacity={edge.highlight ? 0.85 : 0.45}
        />
      </mesh>
      <mesh position={[end.x, end.y, end.z] as Vec3} quaternion={quaternion}>
        <coneGeometry args={[0.07, 0.18, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

// ── Camera fit ──────────────────────────────────────────────────────────────
function FitCamera() {
  const camera = useThree(s => s.camera);
  const size = useThree(s => s.size);
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(
      0,
      0.4,
      systemMapCameraDistance(size.width / Math.max(size.height, 1))
    );
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

// ── Scene ───────────────────────────────────────────────────────────────────
export default function ArchitectureSystemMapScene({
  reducedMotion,
  selectedId,
  onSelect,
}: SceneProps) {
  const nodes = useMemo(() => systemMapLayout(), []);

  return (
    <Canvas
      camera={{ position: [0, 0.4, 9], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      <FitCamera />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 4]} intensity={1.0} color="#ffffff" />
      <pointLight position={[-4, 3, 3]} intensity={0.7} color="#22D3EE" />
      <pointLight
        position={[4, -3, 2]}
        intensity={0.4}
        color={HIGHLIGHT_COLOR}
      />
      {SYSTEM_MAP_EDGES.map(edge => (
        <SystemEdge
          key={`${edge.from}->${edge.to}`}
          edge={edge}
          nodes={nodes}
          reducedMotion={reducedMotion}
        />
      ))}
      {nodes.map(node => (
        <SystemNode
          key={node.id}
          node={node}
          reducedMotion={reducedMotion}
          selected={selectedId === node.id}
          onSelect={onSelect}
        />
      ))}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 1.6}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.6}
      />
    </Canvas>
  );
}
