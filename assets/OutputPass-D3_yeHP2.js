import{t as o,y as n,C as r,z as s,D as l,E as p,G as g,A as f,I as _,J as u,K as h}from"./three.module-BlTpHyz9.js";import{P as M,F as m}from"./Pass-DM5kxHL7.js";const i={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class T extends M{constructor(){super(),this.isOutputPass=!0,this.uniforms=o.clone(i.uniforms),this.material=new n({name:i.name,uniforms:this.uniforms,vertexShader:i.vertexShader,fragmentShader:i.fragmentShader}),this._fsQuad=new m(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,a,t){this.uniforms.tDiffuse.value=t.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},r.getTransfer(this._outputColorSpace)===s&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===l?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===p?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===g?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===f?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===_?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===u?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===h&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(a),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}export{T as OutputPass};
