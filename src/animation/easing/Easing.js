import linear from './glsl/linear.glsl';

import quadIn from './glsl/quadIn.glsl';
import quadOut from './glsl/quadOut.glsl';
import quadInOut from './glsl/quadInOut.glsl';

import cubicIn from './glsl/cubicIn.glsl';
import cubicOut from './glsl/cubicOut.glsl';
import cubicInOut from './glsl/cubicInOut.glsl';

import quartIn from './glsl/quartIn.glsl';
import quartOut from './glsl/quartOut.glsl';
import quartInOut from './glsl/quartInOut.glsl';

import quintIn from './glsl/quintIn.glsl';
import quintOut from './glsl/quintOut.glsl';
import quintInOut from './glsl/quintInOut.glsl';

import expoIn from './glsl/expoIn.glsl';
import expoOut from './glsl/expoOut.glsl';
import expoInOut from './glsl/expoInOut.glsl';

import circIn from './glsl/circIn.glsl';
import circOut from './glsl/circOut.glsl';
import circInOut from './glsl/circInOut.glsl';

import sineIn from './glsl/sineIn.glsl';
import sineOut from './glsl/sineOut.glsl';
import sineInOut from './glsl/sineInOut.glsl';

import backIn from './glsl/backIn.glsl';
import backOut from './glsl/backOut.glsl';
import backInOut from './glsl/backInOut.glsl';

import bounceIn from './glsl/bounceIn.glsl';
import bounceOut from './glsl/bounceOut.glsl';
import bounceInOut from './glsl/bounceInOut.glsl';

import elasticIn from './glsl/elasticIn.glsl';
import elasticOut from './glsl/elasticOut.glsl';
import elasticInOut from './glsl/elasticInOut.glsl';

class Easing {

	constructor( f, category ) {

		this._f = f;
		this._category = category;
		this.update();

	}

	update() {

		const { f, category } = this;
		let name = f + category;

		let glsl = Easing.glsl[ name ];

		if ( ! glsl ) {

			name = 'linear';
			glsl = Easing.glsl[ name ];

		}

		this._name = name;
		this._glsl = glsl;

	}

	/*-------------------------------------------------------------------------/

		Get/Set

	/-------------------------------------------------------------------------*/

	get f() {

		return this._f;

	}

	set f( value ) {

		this._f = value;
		this.update();

	}

	get category() {

		return this._category;

	}

	set category( value ) {

		this._category = value;
		this.update();

	}

	/*-------------------------------------------------------------------------/

		Read-only

	/-------------------------------------------------------------------------*/

	get name() {

		return this._name;

	}

	get glsl() {

		return this._glsl;

	}

}

/*-----------------------------------------------------------------------------/

	Static ( Read-Only )

/-----------------------------------------------------------------------------*/

Object.assign( Easing, {

	get glsl() {

		return {
			linear,
			quadIn, quadOut, quadInOut,
			cubicIn, cubicOut, cubicInOut,
			quartIn, quartOut, quartInOut,
			quintIn, quintOut, quintInOut,
			expoIn, expoOut, expoInOut,
			circIn, circOut, circInOut,
			sineIn, sineOut, sineInOut,
			backIn, backOut, backInOut,
			bounceIn, bounceOut, bounceInOut,
			elasticIn, elasticOut, elasticInOut
		};

	},

	get functions() {

		return [ ... new Set( Object.keys( Easing.glsl ).map( key => {

			return key.replace( /([a-z]*)(InOut|In|Out)/, '$1' );

		} ) ) ];

	},

	get categories() {

		return [ 'In', 'Out', 'InOut' ];

	},

} );

export { Easing };
