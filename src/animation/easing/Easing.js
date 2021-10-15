import * as EasingGLSL from './EasingGLSL';

class Easing {

	constructor( f, category ) {

		this._f = f;
		this._category = category;
		this.update();

	}

	update() {

		const { f, category } = this;
		let name = f + category;

		let glsl = EasingGLSL[ name ];

		if ( ! glsl ) {

			name = 'linear';
			glsl = EasingGLSL[ name ];

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

	Static / Read-only

/-----------------------------------------------------------------------------*/

Object.assign( Easing, {

	get functions() {

		return [ ... new Set( Object.keys( EasingGLSL ).map( key => {

			return key.replace( /([a-z]*)(InOut|In|Out)/, '$1' );

		} ) ) ];

	},

	get categories() {

		return [ 'In', 'Out', 'InOut' ];

	}

} );

export { Easing };
