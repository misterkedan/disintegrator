import vesuna from 'vesuna';
import { control } from './control';

let settings;

const defaults = {

	loopDuration: 3000,
	geometry: 'torus',

};

function reset() {

	Object.entries( defaults ).forEach( ( [ key, value ] ) => {

		settings[ key ] = value;

	} );

}

function random() {

	vesuna.autoseed();

	settings.geometry = vesuna.item( Object.keys( control.geometries ).filter(
		key => key !== settings.geometry
	) );

}

settings = {
	reset, random
};

reset();

export { settings };
