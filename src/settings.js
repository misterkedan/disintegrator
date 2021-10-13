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

function reset() {

	Object.entries( defaults ).forEach( ( [ key, value ] ) => {

		settings[ key ] = value;

	} );

}

settings = { reset };
reset();

export { settings };
