import {
	BoxBufferGeometry,
	CircleBufferGeometry,
	DoubleSide,
	MeshStandardMaterial,
	PlaneBufferGeometry,
	Points,
	PointsMaterial,
	SphereBufferGeometry,
	TorusBufferGeometry,
	TorusKnotBufferGeometry,
	Vector3
} from 'three';
import { Ticker } from '../animation/Ticker';

import { settings } from '../settings';
import { stage } from '../stage';
import { Disintegration } from './Disintegration';

let generator;

const geometries = {
	box: () => new BoxBufferGeometry( 1.6, 1.6, 1.6, 8, 8, 8 ),
	circle: () => new CircleBufferGeometry( 1, 128 ),
	plane: () => new PlaneBufferGeometry( 1.8, 1.8, 10, 10 ),
	sphere: () => new SphereBufferGeometry( 1, 64, 64 ),
	torus: () => new TorusBufferGeometry( 0.8, 0.35, 64, 64 ),
	torusKnot: () => new TorusKnotBufferGeometry( 0.7, 0.27, 96, 32 ),
};

function generate() {

	const geometry = geometries[ settings.geometry ]().toNonIndexed();

	//console.log( geometry );

	const material = new MeshStandardMaterial( {
		//wireframe: true,
		//transparent: true,
		//opacity: 0.5,
		//side: DoubleSide,
	} );

	if ( generator.mesh ) stage.remove( generator.mesh );

	const mesh = new Disintegration( geometry, material, {
		maxEdgeLength: 0.05,
		maxIterations: 6,
		fillers: 5,
	} );

	//console.log( mesh.geometry.attributes.position.count );

	stage.add( mesh );
	generator.mesh = mesh;

	if ( generator.ticker ) generator.ticker.reset();

}

function reset() {

	settings.reset();
	generate();

}

function random() {

	settings.random();
	generate();

}

function update( time ) {

	const { mesh } = generator;
	if ( mesh ) mesh.update( time );

}

generator = { geometries, generate, reset, random, update };

export { generator };
