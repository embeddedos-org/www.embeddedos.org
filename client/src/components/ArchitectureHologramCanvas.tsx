import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Edges, Line } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import {
  ARCHITECTURE_STAGES,
  type ArchitectureStage,
  type ArchitectureStageId,
} from "@/data/architecture";
import { createRendererOrFallback } from "@/lib/webgl-renderer";

const STAGE_GAP = 0.72;
const FIRST_STAGE_Y = -2.16;

function StagePlate({
  stage,
  index,
  selected,
  motionPaused,
  onSelect,
}: {
  stage: ArchitectureStage;
  index: number;
  selected: boolean;
  motionPaused: boolean;
  onSelect: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const baseY = FIRST_STAGE_Y + index * STAGE_GAP;

  useFrame(({ clock }) => {
    if (!groupRef.current || motionPaused) return;
    const phase = clock.getElapsedTime() * 0.7 + index * 0.55;
    groupRef.current.position.x = Math.sin(phase) * 0.045;
    groupRef.current.rotation.z = Math.sin(phase * 0.65) * 0.012;
  });

  const handlePointer = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onSelect();
  };

  return (
    <group ref={groupRef} position={[0, baseY, 0]}>
      <mesh
        onClick={handlePointer}
        onPointerOver={handlePointer}
        scale={selected ? [1.06, 1, 1.06] : [1, 1, 1]}
      >
        <boxGeometry args={[3.3 - index * 0.13, 0.15, 1.35]} />
        <meshBasicMaterial
          color={stage.color}
          transparent
          opacity={selected ? 0.27 : 0.1}
        />
        <Edges color={stage.color} transparent opacity={selected ? 1 : 0.58} />
      </mesh>
      {[-1, 1].map(side => (
        <mesh key={side} position={[side * (1.78 - index * 0.06), 0, 0]}>
          <sphereGeometry args={[selected ? 0.075 : 0.045, 12, 12]} />
          <meshBasicMaterial color={stage.color} />
        </mesh>
      ))}
    </group>
  );
}

function SignalPath({ motionPaused }: { motionPaused: boolean }) {
  const signalRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!signalRef.current || motionPaused) return;
    const progress = (clock.getElapsedTime() * 0.16) % 1;
    signalRef.current.position.y =
      FIRST_STAGE_Y + progress * STAGE_GAP * (ARCHITECTURE_STAGES.length - 1);
  });

  return (
    <>
      <Line
        points={[
          [0, FIRST_STAGE_Y, 0.76],
          [0, FIRST_STAGE_Y + STAGE_GAP * 6, 0.76],
        ]}
        color="#7DD3FC"
        dashed
        dashSize={0.08}
        gapSize={0.06}
        transparent
        opacity={0.55}
        lineWidth={1}
      />
      <mesh ref={signalRef} position={[0, FIRST_STAGE_Y, 0.76]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshBasicMaterial color="#E0F2FE" />
      </mesh>
    </>
  );
}

function HologramScene({
  activeStageId,
  motionPaused,
  onSelectStage,
}: ArchitectureHologramCanvasProps) {
  const assemblyRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!assemblyRef.current || motionPaused) return;
    assemblyRef.current.rotation.y += delta * 0.08;
  });

  return (
    <group ref={assemblyRef} rotation={[0.05, -0.18, -0.02]}>
      <gridHelper
        args={[5.5, 18, "#1D6B88", "#12374B"]}
        position={[0, FIRST_STAGE_Y - 0.3, 0]}
      />
      {ARCHITECTURE_STAGES.map((stage, index) => (
        <StagePlate
          key={stage.id}
          stage={stage}
          index={index}
          selected={stage.id === activeStageId}
          motionPaused={motionPaused}
          onSelect={() => onSelectStage(stage.id)}
        />
      ))}
      <SignalPath motionPaused={motionPaused} />
    </group>
  );
}

export type ArchitectureHologramCanvasProps = {
  activeStageId: ArchitectureStageId;
  motionPaused: boolean;
  onSelectStage: (stageId: ArchitectureStageId) => void;
  onRendererUnavailable: () => void;
};

export default function ArchitectureHologramCanvas(
  props: ArchitectureHologramCanvasProps
) {
  return (
    <Canvas
      camera={{ position: [5.8, 2.8, 6.8], fov: 38 }}
      dpr={[1, 1.5]}
      frameloop={props.motionPaused ? "demand" : "always"}
      gl={defaults =>
        createRendererOrFallback(defaults, props.onRendererUnavailable)
      }
      onCreated={({ gl }) => {
        gl.domElement.addEventListener(
          "webglcontextlost",
          event => {
            event.preventDefault();
            props.onRendererUnavailable();
          },
          { once: true }
        );
      }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.8} />
      <HologramScene {...props} />
    </Canvas>
  );
}
