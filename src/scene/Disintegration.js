import { BufferAttribute, Mesh } from 'three';
import { TessellateModifier } from 'three/examples/jsm/modifiers/TessellateModifier';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

import { FloatPack } from '../animation/FloatPack';
import { SimplexComputer } from '../animation/SimplexComputer';

class Disintegration extends Mesh {

	constructor(
		geometry, material, {
			maxEdgeLength = 0.05,
			maxIterations = 6,
			duration = 1500,
			fillers = 8,
		} = {} ) {

		geometry = Disintegration.fill( geometry, fillers );

		const tesselator = new TessellateModifier( maxEdgeLength, maxIterations );
		geometry = tesselator.modify( geometry );

		super( geometry, material );

		this.duration = duration;
		this.setAttributes();
		this.setChunks();
		material.onBeforeCompile = this.onBeforeCompile.bind( this );

	}

	setAttributes() {

		const { geometry } = this;


		const positions = geometry.attributes.position.array;
		const totalVertices = geometry.attributes.position.count;
		const totalFaces = Math.ceil( totalVertices / 3 );
		//console.log( totalFaces );

		const aDelay = new Float32Array( totalVertices );
		const aDataCoord = new Float32Array( totalVertices * 2 );
		const aCentroid = new Float32Array( totalVertices * 3 );

		const computeCentroid = Disintegration.computeCentroid;

		for ( let face = 0; face < totalFaces; face ++ ) {

			const i = face * 3;
			const i2 = i * 2;
			const i3 = i * 3;

			const delay = Math.random();

			const dataCoordX = ( face % totalFaces ) / totalFaces;
			const dataCoordY = ~ ~ ( face / totalFaces ) / totalFaces;
			// ~ ~ is a less-legible, more performant bitwise Math.floor()
			// Used only because we're dealing with large arrays

			for ( let vertex = 0; vertex < 3; vertex ++ ) {

				const j = i + ( vertex );

				aDelay[ j ] = delay;

				const j2 = i2 + ( 2 * vertex );

				aDataCoord[   j2   ] = dataCoordX;
				aDataCoord[ j2 + 1 ] = dataCoordY;

				const j3 = i3 + ( 3 * vertex );

				aCentroid[   j3   ] = computeCentroid( i3, positions );
				aCentroid[ j3 + 1 ] = computeCentroid( i3 + 1, positions );
				aCentroid[ j3 + 2 ] = computeCentroid( i3 + 2, positions );

			}

		}

		geometry.setAttribute( 'aDelay', new BufferAttribute( aDelay, 1 ) );
		geometry.setAttribute( 'aDataCoord', new BufferAttribute( aDataCoord, 2 ) );
		geometry.setAttribute( 'aCentroid', new BufferAttribute( aCentroid, 3 ) );

		const noiseOptions = { min: - 2, max: 2, scale: 0.1 };
		const noiseX = new SimplexComputer( totalFaces, noiseOptions );
		const noiseY = new SimplexComputer( totalFaces, noiseOptions );
		const noiseZ = new SimplexComputer( totalFaces, noiseOptions );

		noiseX.compute();
		noiseY.compute();
		noiseZ.compute();

		this.noise = {
			x: noiseX.texture,
			y: noiseY.texture,
			z: noiseZ.texture,
		};

	}

	onBeforeCompile( shader ) {

		Object.assign( shader.uniforms, {
			uTime: { value: 0 },
			uDuration: { value: this.duration },
			tNoiseX: { value: this.noise.x },
			tNoiseY: { value: this.noise.y },
			tNoiseZ: { value: this.noise.z },
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

	setChunks() {

		const declarations = /*glsl*/`

			uniform float uTime;
			uniform float uDuration;
			uniform sampler2D tNoiseX;
			uniform sampler2D tNoiseY;
			uniform sampler2D tNoiseZ;

			attribute float aDelay;
			attribute vec2 aDataCoord;
			attribute vec3 aCentroid;

			${FloatPack.glsl}

		`;

		const modifications = /*glsl*/`

			float globalDelay = 500.0;
			float triangleDelay = aDelay * 200.0;
			float delay = globalDelay + triangleDelay;
			
			float time = clamp( uTime - delay, 0.0, uDuration );
			float progress =  clamp( time / uDuration, 0.0, 1.0 );
			//progress = 1.0 - progress; // Invert
		
			float scale = clamp( 1.0 - progress, 0.0, 1.0 );
			transformed -= aCentroid;
			transformed *= scale;
			transformed += aCentroid;
		
			float noiseX = unpack( texture2D( tNoiseX, aDataCoord ) );
			float noiseY = unpack( texture2D( tNoiseY, aDataCoord ) );
			float noiseZ = unpack( texture2D( tNoiseZ, aDataCoord ) );
		
			transformed.x += noiseX * progress;
			transformed.y += noiseY * progress;
			transformed.z += noiseZ * progress - progress * 4.0;
			
		`;

		this.chunks = { declarations, modifications };

	}

	update( time ) {

		this.shader.uniforms.uTime.value = time;

	}

}

Disintegration.fill = ( geometry, fillers ) => {

	if (
		fillers < 1 ||
		! Number.isInteger( fillers ) ||
		! Number.isFinite( fillers )
	) return geometry;

	geometry.computeBoundingBox();

	const box = geometry.boundingBox;
	const minSize = Math.min(
		box.max.x - box.min.x,
		box.max.y - box.min.y,
		box.max.z - box.min.z,
	);
	const step = minSize * 0.01;

	let layeredGeometries = Array.from( { length: fillers }, ( _, i ) => {

		const filler = geometry.clone();
		const scale = 1 - step * ( i + 1 );
		filler.scale( scale, scale, scale );
		return filler;

	} );
	layeredGeometries.push( geometry );

	return mergeBufferGeometries( layeredGeometries );

};

Disintegration.computeCentroid =
	( i, pos ) => ( pos[ i ] + pos[ i + 3 ] + pos[ i + 6 ] ) / 3;

export { Disintegration };
