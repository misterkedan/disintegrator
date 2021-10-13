import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { control } from './control';
import { render } from './render';
import { stage } from './stage';

let pointer;

function init() {

	const { camera } = stage;
	const { canvas } = render;
	const orbit = new OrbitControls( camera, canvas );
	pointer.orbit = orbit;

	document.getElementById( 'random' ).addEventListener(
		'pointerup', control.random
	);

}

pointer = { init };

export { pointer };
