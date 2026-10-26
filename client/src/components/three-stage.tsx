import { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/** A model's extreme points: [distance from its vertical axis, height], in model units. */
export type Extent = readonly (readonly [number, number])[];

/**
 * Places the camera so a model that turns about its vertical axis stays whole
 * at every angle and fills the stage. Each point of `extent` is checked at its
 * worst angle (turned towards the camera, where perspective makes it largest),
 * so nothing is cut off; `fill` is the share of the stage the largest point may
 * reach. Re-fits whenever the canvas changes size: a phone stage is squarer
 * than a desktop one. `elevation` (radians) looks down on the model a little.
 */
export function FitCamera({
  extent,
  elevation = 0,
  fill = 0.88,
}: {
  extent: Extent;
  elevation?: number;
  fill?: number;
}) {
  const camera = useThree(s => s.camera);
  const width = useThree(s => s.size.width);
  const height = useThree(s => s.size.height);
  const invalidate = useThree(s => s.invalidate);

  useLayoutEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera) || !width || !height)
      return;
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * fill;
    const aspect = width / height;
    const ce = Math.cos(elevation);
    const se = Math.sin(elevation);
    let d = 0;
    for (const [r, y] of extent) {
      // how far the point reaches up or down on screen, and towards the camera
      const up = Math.abs(y) * ce + r * se;
      const near = r * ce + Math.abs(y) * se;
      d = Math.max(d, up / t + near, Math.hypot(r / (t * aspect), r));
    }
    camera.position.set(0, d * se, d * ce);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, width, height, extent, elevation, fill, invalidate]);

  return null;
}

/**
 * Neutral studio light for a dark grey model on a black stage: a soft sky and
 * ground, a white key from the front, a fill from the left and a rim from
 * behind that draws the outline. Colour comes from the models' own lit parts.
 */
export function StageLights() {
  return (
    <>
      <hemisphereLight args={["#ffffff", "#3a3a40", 2]} />
      <directionalLight position={[3, 4, 5]} intensity={5} />
      <directionalLight position={[-5, 1, 2]} intensity={1.6} />
      <directionalLight position={[0, 1.5, -6]} intensity={2.5} />
    </>
  );
}
