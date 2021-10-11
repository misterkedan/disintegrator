import vesuna from 'vesuna';
import { generator } from './scene/generator';

let settings;

const defaults = {

	loopDuration: 3000,
	geometry: 'torus',

};

function deepCopy( object ) {

	return JSON.parse( JSON.stringify( object ) );

}

function reset() {

	settings = { ...deepCopy( defaults ), reset, random };

}

function random() {

	vesuna.autoseed();
	const newGeometry = vesuna.item( Object.keys( generator.geometries ).filter( key => key !== settings.geometry ) );

	reset();

	settings.geometry = newGeometry;

}

reset();

export { settings };
