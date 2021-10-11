import vesuna from 'vesuna';
import { generator } from './scene/generator';

let settings;

const DEFAULT_GEOMETRY = 'torusKnot';
const defaults = {

	loopDuration: 3000,
	geometry: DEFAULT_GEOMETRY,

};

function deepCopy( object ) {

	return JSON.parse( JSON.stringify( object ) );

}

function reset() {

	settings = { ...deepCopy( defaults ), reset, random };
	settings.geometry = DEFAULT_GEOMETRY;

}

function random() {

	vesuna.autoseed();
	const newGeometry = vesuna.item( Object.keys( generator.geometries ).filter( key => key !== settings.geometry ) );

	reset();

	settings.geometry = newGeometry;

}

reset();

export { settings };
