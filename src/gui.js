import { GUI } from 'lil-gui';

import { Easing } from './animation/easing/Easing';
import { core } from './core';
import { settings } from './settings';

const gui = new GUI();

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

	const noise = gui.addFolder( 'Noise' );
	add( noise, core, 'spread' );
	add( noise, core, 'turbulence' );
	add( noise, core, 'stagger' );
	add( noise, core, 'dynamics' );
	noise.open();

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

	gui.updateDisplay = () => gui.controllersRecursive().forEach(
		controller => controller.updateDisplay()
	);

	gui.close();

};

export { gui };
