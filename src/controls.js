import { Raycaster, Vector2 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { render } from './render';
import { generator } from './scene/generator';
import { settings } from './settings';
import { stage } from './stage';

let controls;

const { camera, scene } = stage;
const pointer = new Vector2();
const raycaster = new Raycaster();

function onPointerMove( event ) {

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = 1 - ( event.clientY / window.innerHeight ) * 2;

}

function onPointerUp( event ) {

	onPointerMove( event );

	if ( controls.intersects ) {

		settings.random();
		generator.generate();

	}

}

function update() {

	//document.body.style.cursor = ( controls.intersects ) ? 'pointer' : 'auto';

}

function init() {

	const { camera } = stage;
	const { canvas } = render;
	const orbit = new OrbitControls( camera, canvas );

	controls.orbit = orbit;

	//canvas.addEventListener( 'pointermove', onPointerMove );
	//canvas.addEventListener( 'pointerup', onPointerUp );

}

controls = {
	init, update,
	get intersects() {

		raycaster.setFromCamera( pointer, camera );
		return raycaster.intersectObjects( scene.children, false ).length;

	},
};

export { controls };
