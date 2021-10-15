import { BufferAttribute, Mesh } from 'three';
import { TessellateModifier } from 'three/examples/jsm/modifiers/TessellateModifier';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import vesuna from 'vesuna';

import { FloatPack } from '../animation/FloatPack';
import { SimplexComputer } from '../animation/SimplexComputer';

class Disintegration extends Mesh {

	constructor(
		geometry, material, {

			density,
			reversed,
			easing,

			// Tesselation
			maxEdgeLength,
			maxIterations,

			// GPGPU
			spread,
			turbulence,

			// Uniforms
			stagger,
			dynamics,
			delay,
			wind,
			duration,

		} = {} ) {

		const tesselator = new TessellateModifier( maxEdgeLength, maxIterations );
		geometry = tesselator.modify( geometry );

		geometry = Disintegration.densify( geometry, density );

		super( geometry, material );


		this.options = {
			reversed, easing,
			spread, turbulence,
			delay, duration, stagger, dynamics, wind
		};

		this.setAttributes();
		this.setChunks();
		this.material.onBeforeCompile = this.onBeforeCompile.bind( this );

	}

	setAttributes() {

		const { geometry } = this;

		const positions = geometry.attributes.position.array;
		const totalVertices = geometry.attributes.position.count;
		const totalFaces = Math.ceil( totalVertices / 3 );

		const aNoise = new Float32Array( totalVertices );
		const aDataCoord = new Float32Array( totalVertices * 2 );
		const aCentroid = new Float32Array( totalVertices * 3 );

		const computeCentroid = Disintegration.computeCentroid;

		for ( let face = 0; face < totalFaces; face ++ ) {

			const i = face * 3;
			const i2 = i * 2;
			const i3 = i * 3;

			const dataCoordX = ( face % totalFaces ) / totalFaces;
			const dataCoordY = ~ ~ ( face / totalFaces ) / totalFaces;
			// ~ ~ is a less-legible, more performant bitwise Math.floor()
			// Used only because we're dealing with large arrays

			const noise = Math.random();

			for ( let vertex = 0; vertex < 3; vertex ++ ) {

				const j = i + ( vertex );

				aNoise[ j ] = noise;

				const j2 = i2 + ( 2 * vertex );

				aDataCoord[   j2   ] = dataCoordX;
				aDataCoord[ j2 + 1 ] = dataCoordY;

				const j3 = i3 + ( 3 * vertex );

				aCentroid[   j3   ] = computeCentroid( i3, positions );
				aCentroid[ j3 + 1 ] = computeCentroid( i3 + 1, positions );
				aCentroid[ j3 + 2 ] = computeCentroid( i3 + 2, positions );

			}

		}

		geometry.setAttribute( 'aNoise', new BufferAttribute( aNoise, 1 ) );
		geometry.setAttribute( 'aDataCoord', new BufferAttribute( aDataCoord, 2 ) );
		geometry.setAttribute( 'aCentroid', new BufferAttribute( aCentroid, 3 ) );

		// GPGPU

		const x = new SimplexComputer( totalFaces );
		const y = new SimplexComputer( totalFaces );
		const z = new SimplexComputer( totalFaces );
		this.gpgpu = { x, y, z };
		this.compute();

	}

	compute() {

		const { gpgpu, shader, options } = this;

		const { spread, turbulence } = options;
		const spreadUniforms = {
			uMin:   { value: - spread   },
			uMax:   { value: spread     },
			uScale: { value: turbulence },
		};

		Object.entries( gpgpu ).forEach( ( [ key, computer ] ) => {

			computer.uniforms = JSON.parse( JSON.stringify( spreadUniforms ) );
			vesuna.seed = key;
			computer.uniforms.uSeed = { value: vesuna.random() };
			computer.compute();

		} );

		if ( ! shader ) return;
		const { uniforms } = shader;
		uniforms.tNoiseX.value = gpgpu.x.texture;
		uniforms.tNoiseY.value = gpgpu.y.texture;
		uniforms.tNoiseZ.value = gpgpu.z.texture;

	}

	setChunks() {

		const { options } = this;
		const easing = options.easing;

		const declarations = /*glsl*/`

			uniform float uTime;
			uniform float uStagger;
			uniform float uDynamics;
			uniform float uDelay;
			uniform float uDuration;
			uniform vec3 uWind;
			uniform sampler2D tNoiseX;
			uniform sampler2D tNoiseY;
			uniform sampler2D tNoiseZ;

			attribute float aNoise;
			attribute vec2 aDataCoord;
			attribute vec3 aCentroid;

			${ FloatPack.glsl }
			${ easing.glsl }
		`;

		const reverseChunk = ( options.reversed )
			? 'progress = 1.0 - progress;'
			: '';

		const modifications = /*glsl*/`

			float bias = 0.9;
			float noiseDuration = clamp(
				( 1.0 - aNoise ) * uDynamics * uDuration,
				0.0,
				0.9 * uDuration
			);
			float duration = uDuration - noiseDuration;

			float noiseDelay = aNoise * uStagger;
			float delay = uDelay + noiseDelay;

			float time = clamp( uTime - delay, 0.0, duration );
			float progress =  clamp( time / duration, 0.0, 1.0 );
			${ reverseChunk }
			progress = ${easing.name}( progress );
		
			float scale = clamp( 1.0 - progress, 0.0, 1.0 );
			transformed -= aCentroid;
			transformed *= scale;
			transformed += aCentroid;
		
			float noiseX = unpack( texture2D( tNoiseX, aDataCoord ) );
			float noiseY = unpack( texture2D( tNoiseY, aDataCoord ) );
			float noiseZ = unpack( texture2D( tNoiseZ, aDataCoord ) );
			
			transformed.x += ( noiseX + uWind.x ) * progress;
			transformed.y += ( noiseY + uWind.y ) * progress;
			transformed.z += ( noiseZ + uWind.z ) * progress;

		`;

		this.chunks = { declarations, modifications };
		this.material.dispose();

	}

	onBeforeCompile( shader ) {

		const { gpgpu, options } = this;
		const { duration, stagger, dynamics, delay, wind } = options;

		Object.assign( shader.uniforms, {
			uTime: 		{ value: 0 },
			uStagger: 	{ value: stagger },
			uDynamics: 	{ value: dynamics },
			uDelay: 	{ value: delay },
			uDuration: 	{ value: duration },
			uWind: 		{ value: wind },
			tNoiseX: 	{ value: gpgpu.x.texture },
			tNoiseY: 	{ value: gpgpu.y.texture },
			tNoiseZ: 	{ value: gpgpu.z.texture },
		} );

		const main = 'void main()';
		const vertex = '#include <begin_vertex>';
		const { declarations, modifications } = this.chunks;

		let { vertexShader } = shader;
		vertexShader = vertexShader.replace( main, declarations + main );
		vertexShader = vertexShader.replace( vertex, vertex + modifications );
		shader.vertexShader = vertexShader;

		this.shader = shader;

	}

	update( time ) {

		this.shader.uniforms.uTime.value = time;

	}

	dispose() {

		this.geometry.dispose();
		this.material.dispose();
		Object.values( this.gpgpu ).forEach( value => value.dispose() );


	}

	get totalVertices() {

		return this.geometry.attributes.position.count;

	}

}

Disintegration.densify = ( geometry, density ) => {

	if (
		density < 2 ||
		! Number.isInteger( density ) ||
		! Number.isFinite( density )
	) return geometry;

	geometry.computeBoundingBox();

	const box = geometry.boundingBox;
	const minSize = Math.min(
		box.max.x - box.min.x,
		box.max.y - box.min.y,
		box.max.z - box.min.z,
	);
	const step = minSize * 0.01;

	let layeredGeometries = Array.from( { length: density - 1 }, ( _, i ) => {

		const clone = geometry.clone();
		const scale = 1 - step * ( i + 1 );
		clone.scale( scale, scale, scale );
		return clone;

	} );
	layeredGeometries.unshift( geometry );

	return mergeBufferGeometries( layeredGeometries );

};

Disintegration.computeCentroid = ( i, pos ) =>
	( pos[ i ] + pos[ i + 3 ] + pos[ i + 6 ] ) / 3;

export { Disintegration };
