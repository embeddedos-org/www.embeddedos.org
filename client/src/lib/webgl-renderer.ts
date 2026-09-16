import * as THREE from "three";

export function createRendererOrFallback(
  defaults: THREE.WebGLRendererParameters,
  onRendererUnavailable: () => void,
  createRenderer: (
    options: THREE.WebGLRendererParameters
  ) => THREE.WebGLRenderer = options => new THREE.WebGLRenderer(options)
): THREE.WebGLRenderer {
  try {
    return createRenderer({
      ...defaults,
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
  } catch {
    onRendererUnavailable();
    // Keep Fiber's async initializer pending while React replaces its canvas
    // with the static semantic view. Rejecting here would escape React's error
    // boundary because Fiber configures the renderer asynchronously.
    return new Promise<THREE.WebGLRenderer>(
      () => undefined
    ) as unknown as THREE.WebGLRenderer;
  }
}
