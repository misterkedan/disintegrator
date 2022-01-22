import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { core } from './core';
import { render } from './render';
import { stage } from './stage';

let controls;
let visibleUI = true;

function init() {

	const orbit = new OrbitControls( stage.camera, render.canvas );
	orbit.screenSpacePanning = false;
	orbit.minDistance = 4;
	orbit.maxDistance = 20;
	orbit.maxPolarAngle = Math.PI / 2;
	controls.orbit = orbit;

	document.getElementById( 'random' ).addEventListener(

		'click', () => {

			core.random();

		}

	);


	const elements = [
		document.getElementById( 'overlay' ),
		document.getElementById( 'footer' ),
		document.querySelector( '.dg' ),
	];

	const toggle = () => {

		visibleUI = ! visibleUI;
		const visibility = ( visibleUI ) ? 'visible' : 'hidden';

		elements.forEach( element => element.style.visibility = visibility );

	};

	window.addEventListener( 'keyup', ( event ) => {

		const callbacks = {
			' ': () => core.random(),
			'h': () => toggle(),
		};

		const callback = callbacks[ event.key ];
		if ( callback ) callback();

	} );

}

controls = { init };

export { controls };
