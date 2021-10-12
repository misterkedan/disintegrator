import { Raycaster, Vector2 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { render } from './render';
import { control } from './control';
import { settings } from './settings';
import { stage } from './stage';

let pointer;

const { camera, scene } = stage;
const cursor = new Vector2();
const raycaster = new Raycaster();

function onPointerMove( event ) {

	cursor.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	cursor.y = 1 - ( event.clientY / window.innerHeight ) * 2;

}

function onPointerUp( event ) {

	onPointerMove( event );

	if ( pointer.intersects ) {

		settings.random();
		control.generate();

	}

}

function update() {

	//document.body.style.cursor = ( controls.intersects ) ? 'pointer' : 'auto';

}

function init() {

	const { camera } = stage;
	const { canvas } = render;
	const orbit = new OrbitControls( camera, canvas );

	pointer.orbit = orbit;

	//canvas.addEventListener( 'pointermove', onPointerMove );
	//canvas.addEventListener( 'pointerup', onPointerUp );

}

pointer = {
	init, update,
	get intersects() {

		raycaster.setFromCamera( cursor, camera );
		return raycaster.intersectObjects( scene.children, false ).length;

	},
};

export { pointer };
