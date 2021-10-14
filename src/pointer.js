import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { control } from './control';
import { render } from './render';
import { stage } from './stage';

let pointer;

function init() {

	const orbit = new OrbitControls( stage.camera, render.canvas );
	orbit.screenSpacePanning = false;
	orbit.minDistance = 4;
	orbit.maxDistance = 20;
	orbit.maxPolarAngle = Math.PI / 2;
	pointer.orbit = orbit;

	document.getElementById( 'random' ).addEventListener(
		'pointerup', control.random
	);

}

pointer = { init };

export { pointer };
