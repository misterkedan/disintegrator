import * as dat from 'dat.gui';

import { control } from './control';

const gui = new dat.GUI();

gui.init = function () {

	const geometry = gui.addFolder( 'Geometry' );
	geometry.add( control, 'geometry', Object.keys( control.geometries ) ).listen();
	geometry.open();

	const spread = gui.addFolder( 'Spread' );
	spread.add( control, 'spread', 1, 10 ).step( 0.1 );
	spread.add( control, 'turbulence', 1, 20 ).step( 0.1 );
	spread.add( control, 'stagger', 0, 500 ).step( 5 );
	spread.add( control, 'dynamics', 0, 1 ).step( 0.01 );
	spread.open();

	const wind = gui.addFolder( 'Wind' );
	wind.add( control.wind, 'x', - 5, 5 ).step( 0.1 );
	wind.add( control.wind, 'y', - 5, 5 ).step( 0.1 );
	wind.add( control.wind, 'z', - 5, 5 ).step( 0.1 );
	wind.add( control, 'zeroWind' );
	wind.open();

	const anim = gui.addFolder( 'Animation' );
	anim.add( control, 'delay', 0, 1000 ).step( 50 );
	anim.add( control, 'duration', 500, 5000 ).step( 50 );
	anim.add( control, 'loopDuration', 1000, 7500 ).step( 50 ).listen();
	anim.open();

	const set = gui.addFolder( 'Settings' );
	set.add( control, 'grid' );
	set.add( control, 'reset' );
	set.add( control, 'random' );
	set.open();

	const { innerWidth, devicePixelRatio } = window;
	const ratio = devicePixelRatio || 1;
	const smallWidth = ( Math.ceil( innerWidth / ratio ) < 640 );
	if ( smallWidth ) gui.close();

};

export { gui };
