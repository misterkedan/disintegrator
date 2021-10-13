import {
	BoxBufferGeometry,
	CircleBufferGeometry,
	DoubleSide,
	MeshStandardMaterial,
	PlaneBufferGeometry,
	SphereBufferGeometry,
	TorusBufferGeometry,
	TorusKnotBufferGeometry,
} from 'three';
import vesuna from 'vesuna';
import { gui } from './gui';

import { Disintegration } from './scene/Disintegration';

import { settings } from './settings';
import { stage } from './stage';

let control;

const geometries = {
	box: () => new BoxBufferGeometry( 1.6, 1.6, 1.6, 64, 64, 64 ),
	circle: () => new CircleBufferGeometry( 1, 720 ),
	plane: () => new PlaneBufferGeometry( 1.8, 1.8, 160, 160 ),
	sphere: () => new SphereBufferGeometry( 1, 128, 128 ),
	torus: () => new TorusBufferGeometry( 0.8, 0.35, 128, 128 ),
	torusKnot: () => new TorusKnotBufferGeometry( 0.7, 0.25, 256, 64 ),
};

function generate() {

	const geometry = geometries[ settings.geometry ]().toNonIndexed();

	const material = new MeshStandardMaterial( {
		side: DoubleSide,

		//wireframe: true,
		//transparent: true,
		//opacity: 0.5,
	} );

	if ( control.mesh ) stage.remove( control.mesh );
	const mesh = new Disintegration( geometry, material, settings );
	control.mesh = mesh;
	stage.add( mesh );
	if ( settings.debug ) console.log( `<${mesh.totalVertices} vertices>` );

	autoLoopAfter();

	if ( control.ticker ) control.ticker.reset();

}

function reset() {

	settings.reset();

	settings.wind.x = settings.windX;
	settings.wind.y = settings.windY;
	settings.wind.z = settings.windZ;
	gui.updateDisplay();

	generate();

}

function random() {

	vesuna.autoseed();
	const geometry = vesuna.item( Object.keys( control.geometries ).filter(
		key => key !== settings.geometry
	) );

	settings.reset();

	settings.geometry = geometry;

	generate();

}

function update( time ) {

	const { mesh, ticker, loopAfter } = control;
	if ( mesh ) mesh.update( time );
	if ( loopAfter > 0 && time > loopAfter ) ticker.reset();

}

function autoLoopAfter() {

	let { loopAfter, duration, timeNoise, delay } = control;

	if ( loopAfter === 0 ) return;
	control.loopAfter = duration + timeNoise + delay * 2;
	//gui.updateDisplay();

}

control = {
	geometries,
	generate, reset, random, update,

	/*eslint-disable*/
	get geometry() { return settings.geometry; },
	set geometry( value ) {
		settings.geometry = value;
		generate();
	},

	get spread() { return settings.spread },
	set spread( value ) { 
		settings.spread = value;
		control.mesh.options.spread = value;
		control.mesh.compute();
	},

	get volatility() { return settings.volatility },
	set volatility( value ) { 
		settings.volatility = value;
		control.mesh.options.volatility = value;
		control.mesh.compute();
	},

	get delay() { return settings.delay },
	set delay( value ) { 
		settings.delay = value;
		control.mesh.shader.uniforms.uDelay.value = value;
		autoLoopAfter();
	},
		
	get duration() { return settings.duration },
	set duration( value ) { 
		settings.duration = value;
		control.mesh.shader.uniforms.uDuration.value = value;
		autoLoopAfter();
	},

	get timeNoise() { return settings.timeNoise },
	set timeNoise( value ) {
		settings.timeNoise = value;
		control.mesh.shader.uniforms.uTimeNoise.value = value;
		autoLoopAfter();
	},

	get timeVariance() { return settings.timeVariance },
	set timeVariance( value ) {
		settings.timeVariance = value;
		control.mesh.shader.uniforms.uTimeVariance.value = value;
	},

	get wind() { return settings.wind },
	set wind( value ) { settings.wind = value },

	get loopAfter() { return settings.loopAfter },
	set loopAfter( value ) { settings.loopAfter = value; },

	get grid() { return settings.grid },
	set grid( value ) { 
		settings.grid = value;
		stage.grid.visible = value;
	},
	/*eslint-enable*/
};

export { control };
