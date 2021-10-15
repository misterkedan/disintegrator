import * as dat from 'dat.gui';

import { Easing } from './animation/easing/Easing';
import { core } from './core';
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
	add( geometry, core, 'geometry', Object.keys( core.geometries ) );
	add( geometry, core, 'density' ).onFinishChange( core.generate );
	geometry.open();

	const spread = gui.addFolder( 'Spread' );
	add( spread, core, 'spread' );
	add( spread, core, 'turbulence' );
	add( spread, core, 'stagger' );
	add( spread, core, 'dynamics' );
	spread.open();

	const wind = gui.addFolder( 'Wind' );
	add( wind, core.wind, 'x' );
	add( wind, core.wind, 'y' );
	add( wind, core.wind, 'z' );
	add( wind, core, 'zeroWind' );
	wind.open();

	const anim = gui.addFolder( 'Animation' );
	add( anim, core, 'easingFunction', Easing.functions );
	add( anim, core, 'easingCategory', Easing.categories );
	add( anim, core, 'reversed' );
	add( anim, core, 'duration' );
	add( anim, core, 'loopDuration' ).listen();
	add( anim, core, 'delay' );
	anim.open();

	const set = gui.addFolder( 'Settings' );
	add( set, core, 'grid' );
	add( set, core, 'reset' );
	add( set, core, 'random' );
	set.open();

	if ( settings.debug ) {

		const { innerWidth, devicePixelRatio } = window;
		const ratio = devicePixelRatio || 1;
		const smallWidth = ( Math.ceil( innerWidth / ratio ) < 1024 );
		if ( smallWidth ) gui.close();

	} else gui.close();

};

export { gui };
