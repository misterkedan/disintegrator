import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { core } from './core';
import { render } from './render';
import { stage } from './stage';

let controls;

function init() {

	const orbit = new OrbitControls( stage.camera, render.canvas );
	orbit.screenSpacePanning = false;
	orbit.minDistance = 4;
	orbit.maxDistance = 20;
	orbit.maxPolarAngle = Math.PI / 2;
	controls.orbit = orbit;

	document.getElementById( 'random' ).addEventListener(
		'pointerup', core.random
	);

}

controls = { init };

export { controls };
