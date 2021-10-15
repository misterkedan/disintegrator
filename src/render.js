import { ACESFilmicToneMapping, Vector2, WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { TextureComputer } from './animation/gpgpu/TextureComputer';

import { AdjustmentsPass } from './composer/AdjustmentsPass';
import { FXAAPass } from './composer/FXAAPass';
import { stage } from './stage';

let render;

const renderer = new WebGLRenderer( {
	powerPreference: 'high-performance',
	stencil: false,
} );
renderer.toneMapping = ACESFilmicToneMapping;
TextureComputer.init( renderer );

const canvas = renderer.domElement;
document.getElementById( 'main' ).appendChild( canvas );

const composer = new EffectComposer( renderer );

function init() {

	const { scene, camera } = stage;

	const { innerWidth, innerHeight, devicePixelRatio } = window;
	const ratio = devicePixelRatio || 1;

	const width = Math.round( innerWidth / ratio );
	const height = Math.round( innerHeight / ratio );
	const resolution = new Vector2( width, height );
	render.resolution = resolution;

	const post = {
		render: new RenderPass( scene, camera ),
		fxaa: new FXAAPass(),
		adjustments: new AdjustmentsPass(),
	};

	Object.values( post ).forEach( pass => composer.addPass( pass )	);

	render.post = post;

}

function resize( width, height, devicePixelRatio ) {

	renderer.setPixelRatio( devicePixelRatio );
	renderer.setSize( width, height );
	composer.setSize( width, height );

	Object.values( render.post ).forEach( pass => {

		if ( pass.setSize ) pass.setSize( width, height, devicePixelRatio );

	} );

}

function update() {

	composer.render();

}

render = { renderer, canvas, composer, init, resize, update };

export { render };
