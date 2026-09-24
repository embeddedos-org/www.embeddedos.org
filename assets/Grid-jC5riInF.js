import{_ as u}from"./extends-CF3RwP-h.js";import{r as e}from"./vendor-react-aOLDZyDv.js";import{g as F,s as G,U as D,l as T,R as U,t as I,a as V,v as b,r as E,V as t,b as g}from"./react-three-fiber.esm-BKMUk-MQ.js";function R(n,a,s,f){var i;return i=class extends F{constructor(l){super({vertexShader:a,fragmentShader:s,...l});for(const o in n)this.uniforms[o]=new G(n[o]),Object.defineProperty(this,o,{get(){return this.uniforms[o].value},set(c){this.uniforms[o].value=c}});this.uniforms=D.clone(this.uniforms)}},i.key=T.generateUUID(),i}const N=()=>parseInt(U.replace(/\D+/g,"")),O=N(),W=R({cellSize:.5,sectionSize:1,fadeDistance:100,fadeStrength:1,fadeFrom:1,cellThickness:.5,sectionThickness:1,cellColor:new g,sectionColor:new g,infiniteGrid:!1,followCamera:!1,worldCamProjPosition:new t,worldPlanePosition:new t},`
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform vec3 worldPlanePosition;
    uniform float fadeDistance;
    uniform bool infiniteGrid;
    uniform bool followCamera;

    void main() {
      localPosition = position.xzy;
      if (infiniteGrid) localPosition *= 1.0 + fadeDistance;
      
      worldPosition = modelMatrix * vec4(localPosition, 1.0);
      if (followCamera) {
        worldPosition.xyz += (worldCamProjPosition - worldPlanePosition);
        localPosition = (inverse(modelMatrix) * worldPosition).xyz;
      }

      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,`
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform float cellSize;
    uniform float sectionSize;
    uniform vec3 cellColor;
    uniform vec3 sectionColor;
    uniform float fadeDistance;
    uniform float fadeStrength;
    uniform float fadeFrom;
    uniform float cellThickness;
    uniform float sectionThickness;

    float getGrid(float size, float thickness) {
      vec2 r = localPosition.xz / size;
      vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
      float line = min(grid.x, grid.y) + 1.0 - thickness;
      return 1.0 - min(line, 1.0);
    }

    void main() {
      float g1 = getGrid(cellSize, cellThickness);
      float g2 = getGrid(sectionSize, sectionThickness);

      vec3 from = worldCamProjPosition*vec3(fadeFrom);
      float dist = distance(from, worldPosition.xyz);
      float d = 1.0 - min(dist / fadeDistance, 1.0);
      vec3 color = mix(cellColor, sectionColor, min(1.0, sectionThickness * g2));

      gl_FragColor = vec4(color, (g1 + g2) * pow(d, fadeStrength));
      gl_FragColor.a = mix(0.75 * gl_FragColor.a, gl_FragColor.a, g2);
      if (gl_FragColor.a <= 0.0) discard;

      #include <tonemapping_fragment>
      #include <${O>=154?"colorspace_fragment":"encodings_fragment"}>
    }
  `),$=e.forwardRef(({args:n,cellColor:a="#000000",sectionColor:s="#2080ff",cellSize:f=.5,sectionSize:i=1,followCamera:l=!1,infiniteGrid:o=!1,fadeDistance:c=100,fadeStrength:P=1,fadeFrom:v=1,cellThickness:w=.5,sectionThickness:p=1,side:C=b,...h},x)=>{I({GridMaterial:W});const r=e.useRef(null);e.useImperativeHandle(x,()=>r.current,[]);const m=new E,y=new t(0,1,0),z=new t(0,0,0);V(S=>{m.setFromNormalAndCoplanarPoint(y,z).applyMatrix4(r.current.matrixWorld);const d=r.current.material,_=d.uniforms.worldCamProjPosition,j=d.uniforms.worldPlanePosition;m.projectPoint(S.camera.position,_.value),j.value.set(0,0,0).applyMatrix4(r.current.matrixWorld)});const k={cellSize:f,sectionSize:i,cellColor:a,sectionColor:s,cellThickness:w,sectionThickness:p},M={fadeDistance:c,fadeStrength:P,fadeFrom:v,infiniteGrid:o,followCamera:l};return e.createElement("mesh",u({ref:r,frustumCulled:!1},h),e.createElement("gridMaterial",u({transparent:!0,"extensions-derivatives":!0,side:C},k,M)),e.createElement("planeGeometry",{args:n}))});export{$ as G};
