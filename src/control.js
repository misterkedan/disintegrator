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

	const mesh = new Disintegration( geometry, material, settings );

	if ( control.mesh ) stage.remove( control.mesh );
	delete control.mesh;
	control.mesh = mesh;
	stage.add( mesh );
	if ( settings.debug ) console.log( { vertices: mesh.totalVertices } );

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

	const randomize = ( min, max, step ) =>
		Math.round( vesuna.random( min, max ) / step ) * step;

	vesuna.autoseed(); //"emeralddawn"
	if ( settings.debug ) console.log( { seed: vesuna.seed } );

	// Done before reset to avoid repeating the same geometry
	const geometry = vesuna.item( Object.keys( control.geometries ).filter(
		key => key !== settings.geometry
	) );

	settings.reset();

	settings.geometry = geometry;
	Object.entries( settings.random ).forEach( ( [ key, value ] ) => {

		const { min, max, step } = value;
		settings[ key ] = randomize( min, max, step );

	} );
	zeroWind( false );
	if ( vesuna.random() > 0.25 ) {

		const coord = vesuna.item( [ 'x', 'y', 'z' ] );
		const { min, max, step } = settings.ranges[ coord ];
		settings.wind[ coord ] = randomize( min, max, step );

	}

	generate();
	gui.updateDisplay();

}

function update( time ) {

	const { mesh, ticker, loopDuration } = control;
	if ( mesh ) mesh.update( time );
	if ( loopDuration > 0 && time > loopDuration ) ticker.reset();

}

function autoLoopAfter() {

	let { loopDuration, duration, stagger, delay } = control;

	if ( loopDuration === 0 ) return;
	control.loopDuration = duration + stagger + delay * 2;

}

function zeroWind( updateDisplay = true ) {

	settings.wind.x = 0;
	settings.wind.y = 0;
	settings.wind.z = 0;
	if ( updateDisplay ) gui.updateDisplay();

}

control = {
	geometries,
	generate, reset, random, update,
	zeroWind,

	/*eslint-disable*/
	get geometry() { return settings.geometry; },
	set geometry( value ) {
		settings.geometry = value;
		generate();
	},

	get density() { return settings.density; },
	set density( value ) { settings.density = value; },

	get spread() { return settings.spread },
	set spread( value ) { 
		settings.spread = value;
		control.mesh.options.spread = value;
		control.mesh.compute();
	},

	get turbulence() { return settings.turbulence },
	set turbulence( value ) { 
		settings.turbulence = value;
		control.mesh.options.turbulence = value;
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

	get stagger() { return settings.stagger },
	set stagger( value ) {
		settings.stagger = value;
		control.mesh.shader.uniforms.uStagger.value = value;
		autoLoopAfter();
	},

	get dynamics() { return settings.dynamics },
	set dynamics( value ) {
		settings.dynamics = value;
		control.mesh.shader.uniforms.uDynamics.value = value;
	},

	get wind() { return settings.wind },
	set wind( value ) { settings.wind = value },

	get loopDuration() { return settings.loopDuration },
	set loopDuration( value ) { settings.loopDuration = value; },

	get grid() { return settings.grid },
	set grid( value ) { 
		settings.grid = value;
		stage.grid.visible = value;
	},
	/*eslint-enable*/
};

export { control };
