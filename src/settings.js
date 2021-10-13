import { Vector3 } from 'three';

let settings;

const windX = 0;
const windY = 0;
const windZ = - 3.5;
const wind = new Vector3( windX, windY, windZ );

const defaults = {

	debug: true,
	grid: true,

	geometry: 'torus',
	maxEdgeLength: 0.05,
	maxIterations: 6,
	density: 4,

	spread: 2,
	turbulence: 12,

	delay: 1000,
	duration: 1200,
	stagger: 300,
	dynamics: 0.7,

	wind, windX, windY, windZ,

	loopDuration: 3500,

};

const ranges = {

	density: { min: 1, max: 10, step: 1 },

	spread: { min: 1, max: 10, step: 0.1 },
	turbulence: { min: 1, max: 20, step: 0.1 },
	stagger: { min: 0, max: 500, step: 5 },
	dynamics: { min: 0, max: 1, step: 0.01 },

	x: { min: - 5, max: 5, step: 0.1 },
	y: { min: - 5, max: 5, step: 0.1 },
	z: { min: - 5, max: 5, step: 0.1 },

	delay: { min: 0, max: 1000, step: 50 },
	duration: { min: 500, max: 5000, step: 50 },
	loopDuration: { min: 1000, max: 7500, step: 50 },

};

const random = JSON.parse( JSON.stringify( ranges ) );
[ 'x', 'y', 'z', 'loopDuration' ].forEach( key => delete random[ key ] );
random.density.max = 6;

function reset() {

	Object.entries( defaults ).forEach( ( [ key, value ] ) => {

		settings[ key ] = value;

	} );

}

settings = { reset, random, ranges };
reset();

export { settings };
