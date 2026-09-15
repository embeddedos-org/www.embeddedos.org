import{j as o}from"./vendor-motion-D7Nov3QW.js";import{r as f}from"./vendor-react-DdUyh3Gc.js";import{R as me,I as he,F as Z,c as k,d as O,W as xe,e as q,S as re,V as u,f as ge,U as K,g as Q,h as ae,M as ve,i as C,L as ye,j as Se,k as be,u as we,b as Ae,C as Ee,a as $,D as _e,l as je,E as Be}from"./react-three-fiber.esm-CoGwe948.js";import{O as Le}from"./OrbitControls-DASKvPCS.js";import{_ as Y}from"./extends-CF3RwP-h.js";import"./index-BTBO51Yr.js";const ce=parseInt(me.replace(/\D+/g,"")),le=ce>=125?"uv1":"uv2",ee=new q,P=new u;class J extends he{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],s=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(s),this.setAttribute("position",new Z(e,3)),this.setAttribute("uv",new Z(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,s=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),s.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const s=new k(t,6,1);return this.setAttribute("instanceStart",new O(s,3,0)),this.setAttribute("instanceEnd",new O(s,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let s;e instanceof Float32Array?s=e:Array.isArray(e)&&(s=new Float32Array(e));const n=new k(s,t*2,1);return this.setAttribute("instanceColorStart",new O(n,t,0)),this.setAttribute("instanceColorEnd",new O(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new xe(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new q);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),ee.setFromBufferAttribute(t),this.boundingBox.union(ee))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new re),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const s=this.boundingSphere.center;this.boundingBox.getCenter(s);let n=0;for(let i=0,a=e.count;i<a;i++)P.fromBufferAttribute(e,i),n=Math.max(n,s.distanceToSquared(P)),P.fromBufferAttribute(t,i),n=Math.max(n,s.distanceToSquared(P));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}class de extends J{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const t=e.length-3,s=new Float32Array(2*t);for(let n=0;n<t;n+=3)s[2*n]=e[n],s[2*n+1]=e[n+1],s[2*n+2]=e[n+2],s[2*n+3]=e[n+3],s[2*n+4]=e[n+4],s[2*n+5]=e[n+5];return super.setPositions(s),this}setColors(e,t=3){const s=e.length-t,n=new Float32Array(2*s);if(t===3)for(let i=0;i<s;i+=t)n[2*i]=e[i],n[2*i+1]=e[i+1],n[2*i+2]=e[i+2],n[2*i+3]=e[i+3],n[2*i+4]=e[i+4],n[2*i+5]=e[i+5];else for(let i=0;i<s;i+=t)n[2*i]=e[i],n[2*i+1]=e[i+1],n[2*i+2]=e[i+2],n[2*i+3]=e[i+3],n[2*i+4]=e[i+4],n[2*i+5]=e[i+5],n[2*i+6]=e[i+6],n[2*i+7]=e[i+7];return super.setColors(n,t),this}fromLine(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class X extends ge{constructor(e){super({type:"LineMaterial",uniforms:K.clone(K.merge([Q.common,Q.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new ae(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
					#include <${ce>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(t){this.uniforms.diffuse.value=t}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(t){this.uniforms.linewidth.value=t}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(t){!!t!="USE_DASH"in this.defines&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(t){this.uniforms.dashScale.value=t}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(t){this.uniforms.dashSize.value=t}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(t){this.uniforms.dashOffset.value=t}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(t){this.uniforms.gapSize.value=t}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(t){this.uniforms.opacity.value=t}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(t){this.uniforms.resolution.value.copy(t)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(t){!!t!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),t===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}const H=new C,te=new u,ne=new u,m=new C,h=new C,b=new C,N=new u,G=new Se,x=new ye,ie=new u,T=new q,F=new re,w=new C;let A,j;function se(r,e,t){return w.set(0,0,-e,1).applyMatrix4(r.projectionMatrix),w.multiplyScalar(1/w.w),w.x=j/t.width,w.y=j/t.height,w.applyMatrix4(r.projectionMatrixInverse),w.multiplyScalar(1/w.w),Math.abs(Math.max(w.x,w.y))}function Me(r,e){const t=r.matrixWorld,s=r.geometry,n=s.attributes.instanceStart,i=s.attributes.instanceEnd,a=Math.min(s.instanceCount,n.count);for(let c=0,d=a;c<d;c++){x.start.fromBufferAttribute(n,c),x.end.fromBufferAttribute(i,c),x.applyMatrix4(t);const g=new u,v=new u;A.distanceSqToSegment(x.start,x.end,v,g),v.distanceTo(g)<j*.5&&e.push({point:v,pointOnLine:g,distance:A.origin.distanceTo(v),object:r,face:null,faceIndex:c,uv:null,[le]:null})}}function Ue(r,e,t){const s=e.projectionMatrix,i=r.material.resolution,a=r.matrixWorld,c=r.geometry,d=c.attributes.instanceStart,g=c.attributes.instanceEnd,v=Math.min(c.instanceCount,d.count),p=-e.near;A.at(1,b),b.w=1,b.applyMatrix4(e.matrixWorldInverse),b.applyMatrix4(s),b.multiplyScalar(1/b.w),b.x*=i.x/2,b.y*=i.y/2,b.z=0,N.copy(b),G.multiplyMatrices(e.matrixWorldInverse,a);for(let S=0,z=v;S<z;S++){if(m.fromBufferAttribute(d,S),h.fromBufferAttribute(g,S),m.w=1,h.w=1,m.applyMatrix4(G),h.applyMatrix4(G),m.z>p&&h.z>p)continue;if(m.z>p){const l=m.z-h.z,y=(m.z-p)/l;m.lerp(h,y)}else if(h.z>p){const l=h.z-m.z,y=(h.z-p)/l;h.lerp(m,y)}m.applyMatrix4(s),h.applyMatrix4(s),m.multiplyScalar(1/m.w),h.multiplyScalar(1/h.w),m.x*=i.x/2,m.y*=i.y/2,h.x*=i.x/2,h.y*=i.y/2,x.start.copy(m),x.start.z=0,x.end.copy(h),x.end.z=0;const B=x.closestPointToPointParameter(N,!0);x.at(B,ie);const L=be.lerp(m.z,h.z,B),_=L>=-1&&L<=1,W=N.distanceTo(ie)<j*.5;if(_&&W){x.start.fromBufferAttribute(d,S),x.end.fromBufferAttribute(g,S),x.start.applyMatrix4(a),x.end.applyMatrix4(a);const l=new u,y=new u;A.distanceSqToSegment(x.start,x.end,y,l),t.push({point:y,pointOnLine:l,distance:A.origin.distanceTo(y),object:r,face:null,faceIndex:S,uv:null,[le]:null})}}}class fe extends ve{constructor(e=new J,t=new X({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,s=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let a=0,c=0,d=t.count;a<d;a++,c+=2)te.fromBufferAttribute(t,a),ne.fromBufferAttribute(s,a),n[c]=c===0?0:n[c-1],n[c+1]=n[c]+te.distanceTo(ne);const i=new k(n,2,1);return e.setAttribute("instanceDistanceStart",new O(i,1,0)),e.setAttribute("instanceDistanceEnd",new O(i,1,1)),this}raycast(e,t){const s=this.material.worldUnits,n=e.camera;n===null&&!s&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const i=e.params.Line2!==void 0&&e.params.Line2.threshold||0;A=e.ray;const a=this.matrixWorld,c=this.geometry,d=this.material;j=d.linewidth+i,c.boundingSphere===null&&c.computeBoundingSphere(),F.copy(c.boundingSphere).applyMatrix4(a);let g;if(s)g=j*.5;else{const p=Math.max(n.near,F.distanceToPoint(A.origin));g=se(n,p,d.resolution)}if(F.radius+=g,A.intersectsSphere(F)===!1)return;c.boundingBox===null&&c.computeBoundingBox(),T.copy(c.boundingBox).applyMatrix4(a);let v;if(s)v=j*.5;else{const p=Math.max(n.near,T.distanceToPoint(A.origin));v=se(n,p,d.resolution)}T.expandByScalar(v),A.intersectsBox(T)!==!1&&(s?Me(this,t):Ue(this,n,t))}onBeforeRender(e){const t=this.material.uniforms;t&&t.resolution&&(e.getViewport(H),this.material.uniforms.resolution.value.set(H.z,H.w))}}class Oe extends fe{constructor(e=new de,t=new X({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}}const I=f.forwardRef(function({points:e,color:t=16777215,vertexColors:s,linewidth:n,lineWidth:i,segments:a,dashed:c,...d},g){var v,p;const S=we(_=>_.size),z=f.useMemo(()=>a?new fe:new Oe,[a]),[E]=f.useState(()=>new X),B=(s==null||(v=s[0])==null?void 0:v.length)===4?4:3,L=f.useMemo(()=>{const _=a?new J:new de,W=e.map(l=>{const y=Array.isArray(l);return l instanceof u||l instanceof C?[l.x,l.y,l.z]:l instanceof ae?[l.x,l.y,0]:y&&l.length===3?[l[0],l[1],l[2]]:y&&l.length===2?[l[0],l[1],0]:l});if(_.setPositions(W.flat()),s){t=16777215;const l=s.map(y=>y instanceof Ae?y.toArray():y);_.setColors(l.flat(),B)}return _},[e,a,s,B]);return f.useLayoutEffect(()=>{z.computeLineDistances()},[e,z]),f.useLayoutEffect(()=>{c?E.defines.USE_DASH="":delete E.defines.USE_DASH,E.needsUpdate=!0},[c,E]),f.useEffect(()=>()=>{L.dispose(),E.dispose()},[L]),f.createElement("primitive",Y({object:z,ref:g},d),f.createElement("primitive",{object:L,attach:"geometry"}),f.createElement("primitive",Y({object:E,attach:"material",color:t,vertexColors:!!s,resolution:[S.width,S.height],linewidth:(p=n??i)!==null&&p!==void 0?p:1,dashed:c,transparent:B===4},d)))}),R="#2A4A6B",ue="#3E6690",V=[{id:"cad",label:"CAD Drawing",desc:"The base engineering drawing every other layer is registered to.",color:"#38BDF8",marker:[-1.15,-.82,.85],focus:[0,-.92,0],camPos:[1.3,.15,2.7]},{id:"config",label:"AI Configuration",desc:"Device-tree and model config loaded before the chip boots.",color:"#60A5FA",marker:[-.85,-.15,.55],focus:[-.85,-.55,.35],camPos:[-.15,.15,1.5]},{id:"chip",label:"Chip / SoC",desc:"The microcontroller silicon at the center of every device.",color:"#E2E8F0",marker:[-.32,.05,.5],focus:[0,-.5,0],camPos:[.95,.4,1.4]},{id:"bootloader",label:"Bootloader",desc:"eBoot verifies the image and hands off control to the OS.",color:"#F59E0B",marker:[1.1,-.2,.15],focus:[.85,-.55,-.3],camPos:[1.95,.25,.75]},{id:"os",label:"Operating System",desc:"The EmbeddedOS kernel — scheduling, drivers, and the app layer.",color:"#A78BFA",marker:[0,.62,.55],focus:[0,.25,0],camPos:[.65,1.15,1.85]},{id:"comms",label:"Inter-Layer Communication",desc:"Config, chip, bootloader, and OS exchange data over shared buses.",color:"#F97316",marker:[0,-.1,1.05],focus:[0,-.25,0],camPos:[.15,.65,2.7]},{id:"ai-core",label:"AI Inside the Chip",desc:"An on-die inference core — the chip runs the model itself.",color:"#FB923C",marker:[.28,-.28,.18],focus:[0,-.42,0],camPos:[.42,-.08,.62]}],Ce=[0,-.35,0],pe=[2.2,1.25,2.7];function D({size:r,color:e=R,fillOpacity:t=.05,lineOpacity:s=.9}){const n=f.useMemo(()=>new je(...r),r),i=f.useMemo(()=>new Be(n),[n]);return o.jsxs("group",{children:[o.jsx("lineSegments",{geometry:i,children:o.jsx("lineBasicMaterial",{color:e,transparent:!0,opacity:s})}),o.jsx("mesh",{geometry:n,children:o.jsx("meshBasicMaterial",{color:e,transparent:!0,opacity:t,depthWrite:!1})})]})}function M({count:r,span:e,axis:t,offset:s,color:n}){const i=f.useMemo(()=>Array.from({length:r},(a,c)=>{const d=r===1?0:c/(r-1)-.5;return t==="x"?[s[0]+d*e,s[1],s[2]]:[s[0],s[1],s[2]+d*e]}),[r,e,t,s]);return o.jsx("group",{children:i.map((a,c)=>o.jsxs("mesh",{position:[a[0],a[1],a[2]],children:[o.jsx("boxGeometry",{args:[.025,.04,.025]}),o.jsx("meshBasicMaterial",{color:n,transparent:!0,opacity:.8})]},c))})}function U({from:r,to:e,color:t=ue}){return o.jsx(I,{points:[r,e],color:t,dashed:!0,dashSize:.035,gapSize:.025,lineWidth:1,transparent:!0,opacity:.55})}function ze({hotspot:r,active:e,onOver:t,onOut:s}){const n=f.useRef(null);return $(({clock:i})=>{if(!n.current)return;const a=e?1.3+Math.sin(i.getElapsedTime()*4)*.15:1+Math.sin(i.getElapsedTime()*1.5)*.08;n.current.scale.setScalar(a)}),o.jsxs("group",{children:[o.jsx(U,{from:r.marker,to:r.focus,color:e?r.color:ue}),o.jsxs("mesh",{position:r.marker,onPointerOver:i=>{i.stopPropagation(),t()},onPointerOut:i=>{i.stopPropagation(),s()},children:[o.jsx("sphereGeometry",{args:[.14,8,8]}),o.jsx("meshBasicMaterial",{transparent:!0,opacity:0,depthWrite:!1})]}),o.jsxs("mesh",{ref:n,position:r.marker,children:[o.jsx("ringGeometry",{args:[.035,.05,24]}),o.jsx("meshBasicMaterial",{color:e?r.color:"#7FA8CC",transparent:!0,opacity:e?1:.7,side:_e,depthWrite:!1})]}),o.jsxs("mesh",{position:r.marker,children:[o.jsx("circleGeometry",{args:[.014,16]}),o.jsx("meshBasicMaterial",{color:e?r.color:"#7FA8CC",depthWrite:!1})]})]})}function De({active:r}){const e=f.useRef(null),t=f.useRef([]);return $(({clock:s})=>{const n=s.getElapsedTime();if(e.current){const i=e.current.material,a=r==="ai-core"?1:0;i.opacity=.25+a*.6+Math.sin(n*3)*(.08+a*.1),e.current.rotation.y=n*.6,e.current.rotation.x=n*.3}t.current.forEach((i,a)=>{if(!i)return;const c=(n*.35+a*.33)%1+0,d=[[new u(-.85,-.55,.35),new u(0,-.5,0)],[new u(0,-.5,0),new u(.85,-.55,-.3)],[new u(0,-.5,0),new u(0,.25,0)]],[g,v]=d[a%d.length];i.position.lerpVectors(g,v,c);const p=i.material;p.opacity=r==="comms"?1:.5})}),o.jsxs("group",{children:[o.jsx("gridHelper",{args:[2.6,20,R,"#182F47"],position:[0,-.95,0]}),o.jsx(I,{points:[[-1.3,-.949,-.9],[-1.1,-.949,-.9],[-1.1,-.949,-1.05]],color:R,lineWidth:1}),o.jsx(I,{points:[[1.3,-.949,.9],[1.1,-.949,.9],[1.1,-.949,1.05]],color:R,lineWidth:1}),o.jsxs("group",{position:[-.85,-.55,.35],children:[o.jsx(D,{size:[.32,.16,.32],color:"#60A5FA"}),o.jsx(M,{count:5,span:.24,axis:"x",offset:[0,-.1,.18],color:"#60A5FA"})]}),o.jsxs("group",{position:[0,-.5,0],children:[o.jsx(D,{size:[.52,.1,.52],color:r==="chip"?"#F97316":"#E2E8F0",fillOpacity:.06}),o.jsx(M,{count:7,span:.42,axis:"x",offset:[0,.02,.29],color:"#94A3B8"}),o.jsx(M,{count:7,span:.42,axis:"x",offset:[0,.02,-.29],color:"#94A3B8"}),o.jsx(M,{count:7,span:.42,axis:"z",offset:[.29,.02,0],color:"#94A3B8"}),o.jsx(M,{count:7,span:.42,axis:"z",offset:[-.29,.02,0],color:"#94A3B8"}),o.jsx("group",{position:[0,.34,0],children:o.jsx(D,{size:[.52,.04,.52],color:"#94A3B8",fillOpacity:.04})}),o.jsx(U,{from:[.2,.05,.2],to:[.2,.32,.2],color:"#4B617A"}),o.jsx(U,{from:[-.2,.05,-.2],to:[-.2,.32,-.2],color:"#4B617A"}),o.jsxs("mesh",{ref:e,position:[0,.18,0],children:[o.jsx("icosahedronGeometry",{args:[.11,1]}),o.jsx("meshBasicMaterial",{color:"#FB923C",transparent:!0,opacity:.3,wireframe:!0})]})]}),o.jsxs("group",{position:[.85,-.55,-.3],children:[o.jsx(D,{size:[.4,.09,.2],color:"#F59E0B"}),o.jsx(M,{count:4,span:.3,axis:"x",offset:[0,-.06,.12],color:"#F59E0B"})]}),o.jsxs("group",{position:[0,.25,0],children:[o.jsx(D,{size:[1.5,.05,1],color:"#A78BFA",fillOpacity:.04}),[-.55,-.27,0,.27,.55].map((s,n)=>o.jsx(I,{points:[[s,.028,-.35],[s,.028,.35]],color:"#A78BFA",transparent:!0,opacity:.5,lineWidth:1},n))]}),o.jsx(U,{from:[-.85,-.55,.35],to:[0,-.5,0],color:"#F97316"}),o.jsx(U,{from:[0,-.5,0],to:[.85,-.55,-.3],color:"#F97316"}),o.jsx(U,{from:[0,-.5,0],to:[0,.25,0],color:"#F97316"}),[0,1,2].map(s=>o.jsxs("mesh",{ref:n=>{n&&(t.current[s]=n)},children:[o.jsx("sphereGeometry",{args:[.02,8,8]}),o.jsx("meshBasicMaterial",{color:"#F97316",transparent:!0,opacity:.5})]},s))]})}function Pe({active:r,setActive:e}){const t=f.useRef(null),s=f.useRef(null);return $((n,i)=>{t.current&&!r&&(t.current.rotation.y+=i*.12);const a=V.find(g=>g.id===r),c=a?a.focus:Ce,d=a?a.camPos:pe;n.camera.position.lerp(new u(...d),a?.07:.04),s.current&&(s.current.target.lerp(new u(...c),a?.07:.04),s.current.update())}),o.jsxs(o.Fragment,{children:[o.jsxs("group",{ref:t,children:[o.jsx(De,{active:r}),V.map(n=>o.jsx(ze,{hotspot:n,active:r===n.id,onOver:()=>e(n.id),onOut:()=>e(i=>i===n.id?null:i)},n.id))]}),o.jsx(Le,{ref:s,enableZoom:!1,enablePan:!1,enableDamping:!0,dampingFactor:.1,minPolarAngle:Math.PI/3.4,maxPolarAngle:Math.PI/1.9})]})}const oe={label:"CAD Drawing",desc:"Hover a marker to inspect that stage of the build."};function Ne(){const[r,e]=f.useState(null),t=V.find(s=>s.id===r);return o.jsxs("div",{className:"relative w-full h-full",children:[o.jsxs(Ee,{camera:{position:pe,fov:36},gl:{antialias:!0,alpha:!0},style:{background:"transparent"},dpr:[1,1.75],children:[o.jsx("ambientLight",{intensity:.6}),o.jsx(Pe,{active:r,setActive:e})]}),o.jsxs("div",{className:"pointer-events-none absolute top-3 left-3 max-w-[210px] rounded-md border border-[#2A4A6B] bg-[#050B14]/85 px-3 py-2 backdrop-blur-sm",children:[o.jsxs("div",{className:"flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#38BDF8]/80 font-mono",children:[o.jsx("span",{className:"inline-block w-1.5 h-1.5 rounded-full bg-[#38BDF8]"}),t?"Inspecting":"Overview"]}),o.jsx("div",{className:"font-mono text-sm font-semibold mt-0.5",style:{color:t?.color??"#E2E8F0"},children:t?.label??oe.label}),o.jsx("div",{className:"text-[11px] text-white/50 mt-0.5 leading-snug",children:t?.desc??oe.desc})]})]})}export{Ne as default};
