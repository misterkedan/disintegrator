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

import { Easing } from './animation/easing/Easing';
import { Disintegration } from './objects/Disintegration';

import { gui } from './gui';
import { settings } from './settings';
import { stage } from './stage';

/*-----------------------------------------------------------------------------/

	Private

/-----------------------------------------------------------------------------*/

function autoLoopDuration() {

	let { loopDuration, duration, stagger, delay } = core;

	if ( loopDuration === 0 ) return;
	core.loopDuration = duration + stagger + delay * 2;

}

function cleanup() {

	const { mesh } = core;
	if ( ! mesh ) return;

	mesh.dispose();
	stage.remove( mesh );
	delete core.mesh;

}

/*-----------------------------------------------------------------------------/

	Public

/-----------------------------------------------------------------------------*/

let core;

const geometries = {
	box: () => new BoxBufferGeometry( 1.6, 1.6, 1.6, 64, 64, 64 ),
	circle: () => new CircleBufferGeometry( 1, 720 ),
	plane: () => new PlaneBufferGeometry( 1.8, 1.8, 160, 160 ),
	sphere: () => new SphereBufferGeometry( 1, 128, 128 ),
	torus: () => new TorusBufferGeometry( 0.8, 0.35, 128, 128 ),
	torusKnot: () => new TorusKnotBufferGeometry( 0.7, 0.28, 256, 64 ),
};

function generate() {

	cleanup();

	const geometry = geometries[ settings.geometry ]().toNonIndexed();

	const material = new MeshStandardMaterial( {
		side: DoubleSide,
	} );

	const mesh = new Disintegration( geometry, material, settings );
	core.mesh = mesh;
	stage.add( mesh );
	if ( settings.debug ) console.log( { vertices: mesh.totalVertices } );

	autoLoopDuration();
	gui.updateDisplay();
	if ( core.ticker ) core.ticker.reset();

}

function random() {

	const randomize = ( min, max, step ) =>
		Math.round( vesuna.random( min, max ) / step ) * step;

	vesuna.autoseed(); //"emeralddawn" "velvetflower"
	if ( settings.debug ) console.log( { seed: vesuna.seed } );

	// Done before reset to avoid repeating the same geometry
	const geometry = vesuna.item( Object.keys( core.geometries ).filter(
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

	const unwantedFunctions = [ 'back', 'bounce', 'elastic' ];
	settings.easingFunction = vesuna.item(
		Easing.functions.filter( item => ! unwantedFunctions.includes( item ) )
	);
	settings.easingCategory = vesuna.item( Easing.categories );
	settings.easing.f = settings.easingFunction;
	settings.easing.category = settings.easingCategory;

	generate();

}

function reset() {

	settings.reset();
	core.grid = settings.grid;
	generate();

}

function update( time ) {

	const { mesh, ticker, loopDuration } = core;
	if ( mesh ) mesh.update( time );
	if ( loopDuration > 0 && time > loopDuration ) ticker.reset();

}

function zeroWind( updateDisplay = true ) {

	settings.wind.x = 0;
	settings.wind.y = 0;
	settings.wind.z = 0;
	if ( updateDisplay ) gui.updateDisplay();

}

core = {
	geometries,
	generate, random, reset, update, zeroWind,
	init: reset,

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
		core.mesh.options.spread = value;
		core.mesh.compute();
	},

	get turbulence() { return settings.turbulence },
	set turbulence( value ) { 
		settings.turbulence = value;
		core.mesh.options.turbulence = value;
		core.mesh.compute();
	},

	get delay() { return settings.delay },
	set delay( value ) { 
		settings.delay = value;
		core.mesh.shader.uniforms.uDelay.value = value;
		autoLoopDuration();
	},
		
	get duration() { return settings.duration },
	set duration( value ) { 
		settings.duration = value;
		core.mesh.shader.uniforms.uDuration.value = value;
		autoLoopDuration();
	},

	get stagger() { return settings.stagger },
	set stagger( value ) {
		settings.stagger = value;
		core.mesh.shader.uniforms.uStagger.value = value;
		autoLoopDuration();
	},

	get dynamics() { return settings.dynamics },
	set dynamics( value ) {
		settings.dynamics = value;
		core.mesh.shader.uniforms.uDynamics.value = value;
	},

	get wind() { return settings.wind },
	set wind( value ) { settings.wind = value },

	get loopDuration() { return settings.loopDuration },
	set loopDuration( value ) { settings.loopDuration = value; },

	get reversed() { return settings.reversed },
	set reversed( value ) {
		settings.reversed = value;
		core.mesh.options.reversed = value;
		core.mesh.setChunks();
	},

	get easingFunction() { return settings.easingFunction },
	set easingFunction( value ) {
		settings.easingFunction = value;
		settings.easing.f = value;
		core.mesh.setChunks();
	},

	get easingCategory() { return settings.easingCategory },
	set easingCategory( value ) {
		settings.easingCategory = value;
		settings.easing.category = value;
		core.mesh.setChunks();
	},

	get grid() { return settings.grid },
	set grid( value ) { 
		settings.grid = value;
		stage.grid.visible = value;
	},
	/*eslint-enable*/
};

export { core  };
