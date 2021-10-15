import * as dat from 'dat.gui';

import { Easing } from './animation/Easing';
import { control } from './control';
import { settings } from './settings';

const gui = new dat.GUI();

gui.init = function () {

	function add( folder, target, key, extra ) {

		if ( settings.ranges[ key ] ) {

			const { min, max, step } = settings.ranges[ key ];
			return folder.add( target, key, min, max ).step( step );

		}

		return folder.add( target, key, extra );

	}

	const geometry = gui.addFolder( 'Geometry' );
	add( geometry, control, 'geometry', Object.keys( control.geometries ) );
	add( geometry, control, 'density' ).onFinishChange( control.generate );
	geometry.open();

	const spread = gui.addFolder( 'Spread' );
	add( spread, control, 'spread' );
	add( spread, control, 'turbulence' );
	add( spread, control, 'stagger' );
	add( spread, control, 'dynamics' );
	spread.open();

	const wind = gui.addFolder( 'Wind' );
	add( wind, control.wind, 'x' );
	add( wind, control.wind, 'y' );
	add( wind, control.wind, 'z' );
	add( wind, control, 'zeroWind' );
	wind.open();

	const anim = gui.addFolder( 'Animation' );
	add( anim, control, 'easingFunction', Easing.functions );
	add( anim, control, 'easingCategory', Easing.categories );
	add( anim, control, 'reversed' );
	add( anim, control, 'duration' );
	add( anim, control, 'loopDuration' ).listen();
	add( anim, control, 'delay' );
	anim.open();

	const set = gui.addFolder( 'Settings' );
	add( set, control, 'grid' );
	add( set, control, 'reset' );
	add( set, control, 'random' );
	set.open();

	if ( settings.debug ) {

		const { innerWidth, devicePixelRatio } = window;
		const ratio = devicePixelRatio || 1;
		const smallWidth = ( Math.ceil( innerWidth / ratio ) < 1024 );
		if ( smallWidth ) gui.close();

	} else gui.close();

};

export { gui };
