import { ACESFilmicToneMapping, WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { TextureComputer } from './animation/gpgpu/TextureComputer';

import { FXAAPass } from './postprocessing/FXAAPass';
import { stage } from './stage';

let render;

const renderer = new WebGLRenderer( {
	powerPreference: 'high-performance',
	antialias: false,
	stencil: false,
	depth: false,
} );
renderer.toneMapping = ACESFilmicToneMapping;
TextureComputer.init( renderer );

const canvas = renderer.domElement;
document.getElementById( 'main' ).appendChild( canvas );

const composer = new EffectComposer( renderer );

function init() {

	const { scene, camera } = stage;

	const post = {
		render: new RenderPass( scene, camera ),
		fxaa: new FXAAPass(),
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
