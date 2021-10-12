import * as dat from 'dat.gui';

//import { render } from './render';
import { generator } from './scene/generator';
import { settings } from './settings';

const gui = new dat.GUI();

gui.init = function () {

	const gen = gui.addFolder( 'Generator' );
	gen.add( settings, 'geometry', Object.keys( generator.geometries ) )
		.onChange( generator.generate )
		.listen();
	gen.open();

	const set = gui.addFolder( 'Settings' );
	set.add( generator, 'reset' ).onFinishChange( generator.generate );
	set.add( generator, 'random' ).onFinishChange( generator.generate );
	set.open();

	/*
	const { adjustments } = render.post;
	const floatStep = 0.001;
	const adjust = gui.addFolder( 'Color' );
	adjust.add( adjustments, 'hue', 0, Math.PI * 2 ).step( floatStep );
	adjust.add( adjustments, 'saturation', 	0, 3 ).step( floatStep );
	adjust.add( adjustments, 'vibrance', 	0, 3 ).step( floatStep );
	adjust.add( adjustments, 'brightness', 	0, 3 ).step( floatStep );
	adjust.add( adjustments, 'contrast', 	0, 3 ).step( floatStep );
	adjust.open();
	*/

};

export { gui };
