import { controls } from './controls';
import { gui } from './gui';
import { render } from './render';
import { stage } from './stage';

import { Ticker } from './animation/Ticker';
import { generator } from './scene/generator';
import { settings } from './settings';

let ticker;

function init() {

	render.init();
	controls.init();
	generator.generate();

	gui.init();

	window.addEventListener( 'resize', resize );
	resize();

	ticker = new Ticker( animate, 60 );
	ticker.start();

}

function resize() {

	const { innerWidth, innerHeight, devicePixelRatio } = window;

	const width = innerWidth;
	const height = innerHeight;

	const toResize = [ stage, render ];
	toResize.forEach( item => item.resize( width, height, devicePixelRatio ) );

}

function animate( time ) {

	const toUpdate = [ render ];
	toUpdate.forEach( item => item.update( time ) );

	if ( time > settings.loopDuration ) ticker.reset();

}

init();