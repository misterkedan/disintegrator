import * as dat from 'dat.gui';

//import { render } from './render';
import { control } from './control';

const gui = new dat.GUI();

gui.init = function () {

	const gen = gui.addFolder( 'Generator' );
	gen.add( control, 'geometry', Object.keys( control.geometries ) ).listen();
	gen.open();

	const set = gui.addFolder( 'Settings' );
	set.add( control, 'reset' ).onFinishChange( control.generate );
	set.add( control, 'random' ).onFinishChange( control.generate );
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
