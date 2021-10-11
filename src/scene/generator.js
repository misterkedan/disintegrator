import {
	BoxBufferGeometry,
	CircleBufferGeometry,
	MeshStandardMaterial,
	PlaneBufferGeometry,
	SphereBufferGeometry,
	TorusBufferGeometry,
	TorusKnotBufferGeometry
} from 'three';

import { settings } from '../settings';
import { stage } from '../stage';
import { Disintegration } from './Disintegration';

let generator;

const geometries = {
	box: () => new BoxBufferGeometry( 1.6, 1.6, 1.6, 196, 196, 196 ),
	cicle: () => new CircleBufferGeometry( 1, 10000 ),
	plane: () => new PlaneBufferGeometry( 1.8, 1.8, 320, 320 ),
	sphere: () => new SphereBufferGeometry( 1, 420, 420 ),
	torus: () => new TorusBufferGeometry( 0.8, 0.35, 720, 240 ),
	torusKnot: () => new TorusKnotBufferGeometry( 0.7, 0.28, 1024, 320 ),
};

function generate() {

	const geometry = geometries[ settings.geometry ]();

	const material = new MeshStandardMaterial( {
		//wireframe: true,
		//transparent: true,
		//opacity: 0.5,
	} );

	if ( generator.mesh ) stage.remove( generator.mesh );

	const mesh = new Disintegration( geometry, material, {
		maxEdgeLength: 1,
		maxIterations: 1,
	} );

	console.log( mesh.geometry.attributes.position.count );

	stage.add( mesh );
	generator.mesh = mesh;

}

function update( time ) {

	const { mesh } = generator;
	if ( mesh ) mesh.update( time );

}

generator = { geometries, generate, update };

export { generator };
