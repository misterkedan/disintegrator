import {
	BoxBufferGeometry,
	CircleBufferGeometry,
	MeshStandardMaterial,
	PlaneBufferGeometry,
	SphereBufferGeometry,
	TorusBufferGeometry,
	TorusKnotBufferGeometry,
} from 'three';

import { Disintegration } from './scene/Disintegration';

import { settings } from './settings';
import { stage } from './stage';

let control;

const geometries = {
	box: () => new BoxBufferGeometry( 1.6, 1.6, 1.6, 8, 8, 8 ),
	circle: () => new CircleBufferGeometry( 1, 128 ),
	plane: () => new PlaneBufferGeometry( 1.8, 1.8, 10, 10 ),
	sphere: () => new SphereBufferGeometry( 1, 64, 64 ),
	torus: () => new TorusBufferGeometry( 0.8, 0.35, 64, 64 ),
	torusKnot: () => new TorusKnotBufferGeometry( 0.7, 0.27, 96, 48 ),
};

function generate() {

	const geometry = geometries[ settings.geometry ]().toNonIndexed();

	const material = new MeshStandardMaterial( {
		//wireframe: true,
		//transparent: true,
		//opacity: 0.5,
		//side: DoubleSide,
	} );

	if ( control.mesh ) stage.remove( control.mesh );

	const mesh = new Disintegration( geometry, material, {
		maxEdgeLength: 0.05,
		maxIterations: 6,
		fillers: 5,
	} );

	//console.log( geometry );
	//console.log( mesh.geometry.attributes.position.count );

	stage.add( mesh );
	control.mesh = mesh;

	if ( control.ticker ) control.ticker.reset();

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

	const { mesh } = control;
	if ( mesh ) mesh.update( time );

}

control = {
	geometries,
	generate, reset, random, update,
	get geometry() {

		return settings.geometry;

	},
	set geometry( value ) {

		settings.geometry = value;
		generate();

	}
};

export { control };
