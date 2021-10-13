import { Color, HemisphereLight, PerspectiveCamera, Scene } from 'three';

// Scene

const scene = new Scene();
scene.background = new Color( 0x34343a );

// Lights

const hemisphere = new HemisphereLight( 0xffffee, 0x303135, 2 );
scene.add( hemisphere );

const lights = { hemisphere };

// Camera

const fov = 45;
const aspect = 1;
const near = 0.1;
const far = 1000;

const camera = new PerspectiveCamera( fov, aspect, near, far );
camera.position.set( 3.2, 3.2, 4.2 );
camera.lookAt( 0, 0, 0 );

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

const stage = { scene, camera, lights, add, remove, resize };

export { stage };
