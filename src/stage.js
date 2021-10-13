import { Color, Fog, GridHelper, HemisphereLight, PerspectiveCamera, Scene } from 'three';
import { settings } from './settings';

// Scene

const scene = new Scene();
scene.background = new Color( 0x34343a );
scene.fog = new Fog( scene.background, 1, 100 );

// Lights

const hemisphere = new HemisphereLight( 0xffffee, 0x303135, 2 );
scene.add( hemisphere );

const lights = { hemisphere };

// Camera

const fov = 45;
const aspect = 1;
const near = 0.1;
const far = 100;

const camera = new PerspectiveCamera( fov, aspect, near, far );
camera.position.set( 3.2, 3.2, 4.2 );
camera.lookAt( 0, 0, 0 );

// Grid

const size = 210;
const divisions = 100;
const grid = new GridHelper( size, divisions, 0x84848a, 0x44444a );
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

function resize( width, height ) {

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

}

const stage = { scene, camera, lights, grid, add, remove, resize };

export { stage };
