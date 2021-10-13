import { Color, Fog, GridHelper, HemisphereLight, PerspectiveCamera, Scene } from 'three';
import { settings } from './settings';

// Scene

const scene = new Scene();
scene.background = new Color( 0x1a1a1f );
scene.fog = new Fog( scene.background, 1, 100 );

// Lights

const hemisphere = new HemisphereLight( 0xffffee, 0x303135, 2 );
scene.add( hemisphere );

const lights = { hemisphere };

// Camera

const fov = 45;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 100;

const camera = new PerspectiveCamera( fov, aspect, near, far );
camera.lookAt( 0, 0, 0 );
adaptCameraToRatio();

// Grid

const size = 210;
const divisions = 100;
const grid = new GridHelper( size, divisions, 0x5a5a5f, 0x28282d );
grid.position.y = - 2;
scene.add( grid );
grid.visible = settings.grid;

// Functions

function add( child ) {

	scene.add( child );

}

function remove( child ) {

	scene.remove( child );

}

function adaptCameraToRatio() {

	const scale = camera.aspect >= 1 ? 1 : 1.5;
	const x = 3.5 * scale;
	const y = 2.5 * scale;
	const z = 4.5 * scale;
	camera.position.set( x, y, z );

}

function resize( width, height ) {

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

}

const stage = { scene, camera, lights, grid, add, remove, resize };

export { stage };
