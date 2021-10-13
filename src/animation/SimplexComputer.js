import { FloatPack } from './FloatPack';
import { TextureComputer } from './TextureComputer';
import simplex3D from '../glsl/noise/simplex3D.glsl';

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

}

SimplexComputer.formatUniforms = ( { min, max, scale, seed } ) => {

	return {
		uMin:   { value: min   },
		uMax:   { value: max   },
		uScale: { value: scale },
		uSeed:  { value: seed  },
	};

};

SimplexComputer.shader = /*glsl*/`

	uniform float uMin;
	uniform float uMax;
	uniform float uScale;
	uniform float uSeed;
	uniform sampler2D tData;

    ${ FloatPack.glsl }
	${ simplex3D }

    void main() {
        
        vec2 uv = gl_FragCoord.xy / resolution.xy;

		float noise = 0.5 + simplex3D( 
			uv.x * uScale, 
			uv.y * uScale, 
			uSeed * uScale
		) / 2.0;

		float data = noise * ( uMax - uMin ) + uMin;

        gl_FragColor = pack( data );

    }

`;

export { SimplexComputer };
