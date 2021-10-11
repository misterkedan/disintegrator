import { FloatPack } from './FloatPack';
import { TextureComputer } from './TextureComputer';
import simplex3d from '../glsl/noise/simplex3d.glsl';

class SimplexComputer extends TextureComputer {

	constructor( length, {
		min = 0,
		max = 1,
		scale = 1,
		seed = Math.random(),
	} = {} ) {

		super( length, SimplexComputer.shader, {
			uMin:   { value: min   },
			uMax:   { value: max   },
			uScale: { value: scale },
			uSeed:  { value: seed  },
		} );

	}

	get seed() {

		return this.uniforms.uSeed.value;

	}

	set seed( value ) {

		this.uniforms.uSeed.value = value;

	}

}

SimplexComputer.shader = /*glsl*/`

	uniform float uMin;
	uniform float uMax;
	uniform float uSeed;
	uniform sampler2D tData;

    ${ FloatPack.glsl }
	${ simplex3d }

    void main() {
        
        vec2 uv = gl_FragCoord.xy / resolution.xy;

		float uScale = 7.0;
		float noise = 0.5 + simplex3d( 
			uv.x * uScale, 
			uv.y * uScale, 
			uSeed * uScale
		) / 2.0;
		float data = noise * ( uMax - uMin ) + uMin;

        gl_FragColor = pack( data );

    }

`;

export { SimplexComputer };
