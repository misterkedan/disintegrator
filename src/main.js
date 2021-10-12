import { pointer } from './pointer';
import { gui } from './gui';
import { render } from './render';
import { settings } from './settings';
import { stage } from './stage';

import { control } from './control';
import { Ticker } from './animation/Ticker';

let ticker;

function init() {

	render.init();
	pointer.init();
	control.generate();

	gui.init();

	window.addEventListener( 'resize', resize );
	resize();

	ticker = new Ticker( animate, 0 );
	ticker.start();

	control.ticker = ticker;

}

function resize() {

	const { innerWidth, innerHeight, devicePixelRatio } = window;

	const width = innerWidth;
	const height = innerHeight;

	const toResize = [ stage, render ];
	toResize.forEach( item => item.resize( width, height, devicePixelRatio ) );

}

function animate( time ) {

	const toUpdate = [ render, pointer, control ];
	toUpdate.forEach( item => item.update( time ) );

	if ( time > settings.loopDuration ) ticker.reset();

}

init();
