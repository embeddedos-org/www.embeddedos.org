/**
 * FitCamera — keeps a whole 3D scene in view on whatever stage it is drawn
 * on, wide or tall. Used inside a react-three-fiber <Canvas> by the
 * architecture diagrams, the CAD walkthrough and the eOffice and eApps scenes
 * (EoS3D), whose stages run from a 1350 x 600 desktop band to a 358 x 420
 * phone column.
 *
 * The scene is described by its envelope over the whole animation: a
 * vertical cylinder with centre height `cy`, half height `hy` and radius `r`
 * (the farthest anything reaches from the vertical axis, which is what the
 * auto-orbit sweeps past the camera).
 *
 * The camera keeps its direction (its preset at first, the visitor's orbit
 * after that); only its distance and the point it looks at change.
 * For a vertical field of view 2·atan(t):
 * - across: a point orbiting at radius r is widest on screen when
 *   cos θ = r / d, so it stays inside half-width k when d ≥ r·√(1 + 1/k²);
 * - up and down: the half height seen from the camera's elevation, at the
 *   nearest depth the orbit brings it to (d − r).
 * `insetTop` / `insetBottom` (CSS px) are strips of the stage covered by
 * controls or a legend; the scene is fitted into, and centred in, the band
 * between them.
 */
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export interface SceneExtent {
  cy: number;
  hy: number;
  r: number;
}

export default function FitCamera({
  extent,
  insetTop = 0,
  insetBottom = 0,
}: {
  extent: SceneExtent;
  insetTop?: number;
  insetBottom?: number;
}) {
  const camera = useThree(s => s.camera);
  const width = useThree(s => s.size.width);
  const height = useThree(s => s.size.height);
  const controls = useThree(s => s.controls) as unknown as {
    target: THREE.Vector3;
    update: () => void;
  } | null;
  const invalidate = useThree(s => s.invalidate);
  const lastTarget = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    if (width < 1 || height < 1) return;
    const dir = camera.position.clone().sub(lastTarget.current).normalize();
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const free = Math.max(0.4, (height - insetTop - insetBottom) / height);
    const kv = t * free * 0.92;
    const kh = t * (width / height) * 0.9;
    const elev = Math.abs(Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1)));
    const { cy, hy, r } = extent;
    const across = r * Math.sqrt(1 + 1 / (kh * kh));
    const upDown = (hy * Math.cos(elev) + r * Math.sin(elev)) / kv + r;
    const d = Math.max(across, upDown);
    // centre the scene in the band between the top and bottom insets
    const ty = cy - ((insetBottom - insetTop) * d * t) / height;
    const target = new THREE.Vector3(0, ty, 0);
    camera.position.copy(target).addScaledVector(dir, d);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
    lastTarget.current.copy(target);
    if (controls) {
      controls.target.copy(target);
      controls.update();
    }
    invalidate();
  }, [
    camera,
    controls,
    width,
    height,
    insetTop,
    insetBottom,
    extent,
    invalidate,
  ]);

  return null;
}
