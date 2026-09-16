import{j as f}from"./vendor-motion-D7Nov3QW.js";import{R as le,I as de,F as $,c as G,d as B,W as fe,e as F,S as te,V as _,f as ue,U as Y,g as J,h as ne,M as pe,i as C,L as me,j as he,k as ve,u as ge,b as ye,E as Se,l as xe,C as we,a as V}from"./react-three-fiber.esm-CeUGvSaG.js";import{r as d}from"./vendor-react-DdUyh3Gc.js";import{aL as ie}from"./index-C2T_nuYj.js";import{_ as W}from"./extends-CF3RwP-h.js";const se=parseInt(le.replace(/\D+/g,"")),oe=se>=125?"uv1":"uv2",X=new F,D=new _;class k extends de{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],s=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(s),this.setAttribute("position",new $(e,3)),this.setAttribute("uv",new $(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,s=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),s.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const s=new G(t,6,1);return this.setAttribute("instanceStart",new B(s,3,0)),this.setAttribute("instanceEnd",new B(s,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let s;e instanceof Float32Array?s=e:Array.isArray(e)&&(s=new Float32Array(e));const n=new G(s,t*2,1);return this.setAttribute("instanceColorStart",new B(n,t,0)),this.setAttribute("instanceColorEnd",new B(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new fe(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new F);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),X.setFromBufferAttribute(t),this.boundingBox.union(X))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new te),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const s=this.boundingSphere.center;this.boundingBox.getCenter(s);let n=0;for(let i=0,c=e.count;i<c;i++)D.fromBufferAttribute(e,i),n=Math.max(n,s.distanceToSquared(D)),D.fromBufferAttribute(t,i),n=Math.max(n,s.distanceToSquared(D));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}class re extends k{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const t=e.length-3,s=new Float32Array(2*t);for(let n=0;n<t;n+=3)s[2*n]=e[n],s[2*n+1]=e[n+1],s[2*n+2]=e[n+2],s[2*n+3]=e[n+3],s[2*n+4]=e[n+4],s[2*n+5]=e[n+5];return super.setPositions(s),this}setColors(e,t=3){const s=e.length-t,n=new Float32Array(2*s);if(t===3)for(let i=0;i<s;i+=t)n[2*i]=e[i],n[2*i+1]=e[i+1],n[2*i+2]=e[i+2],n[2*i+3]=e[i+3],n[2*i+4]=e[i+4],n[2*i+5]=e[i+5];else for(let i=0;i<s;i+=t)n[2*i]=e[i],n[2*i+1]=e[i+1],n[2*i+2]=e[i+2],n[2*i+3]=e[i+3],n[2*i+4]=e[i+4],n[2*i+5]=e[i+5],n[2*i+6]=e[i+6],n[2*i+7]=e[i+7];return super.setColors(n,t),this}fromLine(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class q extends ue{constructor(e){super({type:"LineMaterial",uniforms:Y.clone(Y.merge([J.common,J.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new ne(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${se>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(t){this.uniforms.diffuse.value=t}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(t){this.uniforms.linewidth.value=t}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(t){!!t!="USE_DASH"in this.defines&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(t){this.uniforms.dashScale.value=t}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(t){this.uniforms.dashSize.value=t}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(t){this.uniforms.dashOffset.value=t}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(t){this.uniforms.gapSize.value=t}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(t){this.uniforms.opacity.value=t}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(t){this.uniforms.resolution.value.copy(t)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(t){!!t!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),t===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}const T=new C,K=new _,Q=new _,m=new C,h=new C,x=new C,I=new _,H=new he,v=new me,Z=new _,R=new F,j=new te,w=new C;let b,A;function ee(o,e,t){return w.set(0,0,-e,1).applyMatrix4(o.projectionMatrix),w.multiplyScalar(1/w.w),w.x=A/t.width,w.y=A/t.height,w.applyMatrix4(o.projectionMatrixInverse),w.multiplyScalar(1/w.w),Math.abs(Math.max(w.x,w.y))}function be(o,e){const t=o.matrixWorld,s=o.geometry,n=s.attributes.instanceStart,i=s.attributes.instanceEnd,c=Math.min(s.instanceCount,n.count);for(let r=0,l=c;r<l;r++){v.start.fromBufferAttribute(n,r),v.end.fromBufferAttribute(i,r),v.applyMatrix4(t);const u=new _,g=new _;b.distanceSqToSegment(v.start,v.end,g,u),g.distanceTo(u)<A*.5&&e.push({point:g,pointOnLine:u,distance:b.origin.distanceTo(g),object:o,face:null,faceIndex:r,uv:null,[oe]:null})}}function _e(o,e,t){const s=e.projectionMatrix,i=o.material.resolution,c=o.matrixWorld,r=o.geometry,l=r.attributes.instanceStart,u=r.attributes.instanceEnd,g=Math.min(r.instanceCount,l.count),p=-e.near;b.at(1,x),x.w=1,x.applyMatrix4(e.matrixWorldInverse),x.applyMatrix4(s),x.multiplyScalar(1/x.w),x.x*=i.x/2,x.y*=i.y/2,x.z=0,I.copy(x),H.multiplyMatrices(e.matrixWorldInverse,c);for(let S=0,O=g;S<O;S++){if(m.fromBufferAttribute(l,S),h.fromBufferAttribute(u,S),m.w=1,h.w=1,m.applyMatrix4(H),h.applyMatrix4(H),m.z>p&&h.z>p)continue;if(m.z>p){const a=m.z-h.z,y=(m.z-p)/a;m.lerp(h,y)}else if(h.z>p){const a=h.z-m.z,y=(h.z-p)/a;h.lerp(m,y)}m.applyMatrix4(s),h.applyMatrix4(s),m.multiplyScalar(1/m.w),h.multiplyScalar(1/h.w),m.x*=i.x/2,m.y*=i.y/2,h.x*=i.x/2,h.y*=i.y/2,v.start.copy(m),v.start.z=0,v.end.copy(h),v.end.z=0;const U=v.closestPointToPointParameter(I,!0);v.at(U,Z);const M=ve.lerp(m.z,h.z,U),L=M>=-1&&M<=1,P=I.distanceTo(Z)<A*.5;if(L&&P){v.start.fromBufferAttribute(l,S),v.end.fromBufferAttribute(u,S),v.start.applyMatrix4(c),v.end.applyMatrix4(c);const a=new _,y=new _;b.distanceSqToSegment(v.start,v.end,y,a),t.push({point:y,pointOnLine:a,distance:b.origin.distanceTo(y),object:o,face:null,faceIndex:S,uv:null,[oe]:null})}}}class ae extends pe{constructor(e=new k,t=new q({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,s=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let c=0,r=0,l=t.count;c<l;c++,r+=2)K.fromBufferAttribute(t,c),Q.fromBufferAttribute(s,c),n[r]=r===0?0:n[r-1],n[r+1]=n[r]+K.distanceTo(Q);const i=new G(n,2,1);return e.setAttribute("instanceDistanceStart",new B(i,1,0)),e.setAttribute("instanceDistanceEnd",new B(i,1,1)),this}raycast(e,t){const s=this.material.worldUnits,n=e.camera;n===null&&!s&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const i=e.params.Line2!==void 0&&e.params.Line2.threshold||0;b=e.ray;const c=this.matrixWorld,r=this.geometry,l=this.material;A=l.linewidth+i,r.boundingSphere===null&&r.computeBoundingSphere(),j.copy(r.boundingSphere).applyMatrix4(c);let u;if(s)u=A*.5;else{const p=Math.max(n.near,j.distanceToPoint(b.origin));u=ee(n,p,l.resolution)}if(j.radius+=u,b.intersectsSphere(j)===!1)return;r.boundingBox===null&&r.computeBoundingBox(),R.copy(r.boundingBox).applyMatrix4(c);let g;if(s)g=A*.5;else{const p=Math.max(n.near,R.distanceToPoint(b.origin));g=ee(n,p,l.resolution)}R.expandByScalar(g),b.intersectsBox(R)!==!1&&(s?be(this,t):_e(this,n,t))}onBeforeRender(e){const t=this.material.uniforms;t&&t.resolution&&(e.getViewport(T),this.material.uniforms.resolution.value.set(T.z,T.w))}}class Ee extends ae{constructor(e=new re,t=new q({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}}const ce=d.forwardRef(function({points:e,color:t=16777215,vertexColors:s,linewidth:n,lineWidth:i,segments:c,dashed:r,...l},u){var g,p;const S=ge(L=>L.size),O=d.useMemo(()=>c?new ae:new Ee,[c]),[E]=d.useState(()=>new q),U=(s==null||(g=s[0])==null?void 0:g.length)===4?4:3,M=d.useMemo(()=>{const L=c?new k:new re,P=e.map(a=>{const y=Array.isArray(a);return a instanceof _||a instanceof C?[a.x,a.y,a.z]:a instanceof ne?[a.x,a.y,0]:y&&a.length===3?[a[0],a[1],a[2]]:y&&a.length===2?[a[0],a[1],0]:a});if(L.setPositions(P.flat()),s){t=16777215;const a=s.map(y=>y instanceof ye?y.toArray():y);L.setColors(a.flat(),U)}return L},[e,c,s,U]);return d.useLayoutEffect(()=>{O.computeLineDistances()},[e,O]),d.useLayoutEffect(()=>{r?E.defines.USE_DASH="":delete E.defines.USE_DASH,E.needsUpdate=!0},[r,E]),d.useEffect(()=>()=>{M.dispose(),E.dispose()},[M]),d.createElement("primitive",W({object:O,ref:u},l),d.createElement("primitive",{object:M,attach:"geometry"}),d.createElement("primitive",W({object:E,attach:"material",color:t,vertexColors:!!s,resolution:[S.width,S.height],linewidth:(p=n??i)!==null&&p!==void 0?p:1,dashed:r,transparent:U===4},l)))}),Le=d.forwardRef(({threshold:o=15,geometry:e,...t},s)=>{const n=d.useRef(null);d.useImperativeHandle(s,()=>n.current,[]);const i=d.useMemo(()=>[0,0,0,1,0,0],[]),c=d.useRef(null),r=d.useRef(null);return d.useLayoutEffect(()=>{const l=n.current.parent,u=e??l?.geometry;if(!u||c.current===u&&r.current===o)return;c.current=u,r.current=o;const p=new Se(u,o).attributes.position.array;n.current.geometry.setPositions(p),n.current.geometry.attributes.instanceStart.needsUpdate=!0,n.current.geometry.attributes.instanceEnd.needsUpdate=!0,n.current.computeLineDistances()}),d.createElement(ce,W({segments:!0,points:i,ref:n,raycast:()=>null},t))});function Ae(o,e,t=s=>new xe(s)){try{return t({...o,antialias:!0,alpha:!0,powerPreference:"low-power"})}catch{return e(),new Promise(()=>{})}}const N=.72,z=-2.16;function Ue({stage:o,index:e,selected:t,motionPaused:s,onSelect:n}){const i=d.useRef(null),c=z+e*N;V(({clock:l})=>{if(!i.current||s)return;const u=l.getElapsedTime()*.7+e*.55;i.current.position.x=Math.sin(u)*.045,i.current.rotation.z=Math.sin(u*.65)*.012});const r=l=>{l.stopPropagation(),n()};return f.jsxs("group",{ref:i,position:[0,c,0],children:[f.jsxs("mesh",{onClick:r,onPointerOver:r,scale:t?[1.06,1,1.06]:[1,1,1],children:[f.jsx("boxGeometry",{args:[3.3-e*.13,.15,1.35]}),f.jsx("meshBasicMaterial",{color:o.color,transparent:!0,opacity:t?.27:.1}),f.jsx(Le,{color:o.color,transparent:!0,opacity:t?1:.58})]}),[-1,1].map(l=>f.jsxs("mesh",{position:[l*(1.78-e*.06),0,0],children:[f.jsx("sphereGeometry",{args:[t?.075:.045,12,12]}),f.jsx("meshBasicMaterial",{color:o.color})]},l))]})}function Me({motionPaused:o}){const e=d.useRef(null);return V(({clock:t})=>{if(!e.current||o)return;const s=t.getElapsedTime()*.16%1;e.current.position.y=z+s*N*(ie.length-1)}),f.jsxs(f.Fragment,{children:[f.jsx(ce,{points:[[0,z,.76],[0,z+N*6,.76]],color:"#7DD3FC",dashed:!0,dashSize:.08,gapSize:.06,transparent:!0,opacity:.55,lineWidth:1}),f.jsxs("mesh",{ref:e,position:[0,z,.76],children:[f.jsx("sphereGeometry",{args:[.055,12,12]}),f.jsx("meshBasicMaterial",{color:"#E0F2FE"})]})]})}function Be({activeStageId:o,motionPaused:e,onSelectStage:t}){const s=d.useRef(null);return V((n,i)=>{!s.current||e||(s.current.rotation.y+=i*.08)}),f.jsxs("group",{ref:s,rotation:[.05,-.18,-.02],children:[f.jsx("gridHelper",{args:[5.5,18,"#1D6B88","#12374B"],position:[0,z-.3,0]}),ie.map((n,i)=>f.jsx(Ue,{stage:n,index:i,selected:n.id===o,motionPaused:e,onSelect:()=>t(n.id)},n.id)),f.jsx(Me,{motionPaused:e})]})}function je(o){return f.jsxs(we,{camera:{position:[5.8,2.8,6.8],fov:38},dpr:[1,1.5],frameloop:o.motionPaused?"demand":"always",gl:e=>Ae(e,o.onRendererUnavailable),onCreated:({gl:e})=>{e.domElement.addEventListener("webglcontextlost",t=>{t.preventDefault(),o.onRendererUnavailable()},{once:!0})},style:{background:"transparent"},children:[f.jsx("ambientLight",{intensity:.8}),f.jsx(Be,{...o})]})}export{je as default};
