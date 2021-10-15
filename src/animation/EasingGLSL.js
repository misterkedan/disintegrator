const linear = /*glsl*/`
float linear( float t ) {
	return t;
}
`;

// Quad

const quadIn = /*glsl*/`
float quadIn( float t ) {
	return t * t;
}
`;

const quadOut = /*glsl*/`
float quadOut( float t ) {
	return -t * ( t - 2.0 );
}
`;

const quadInOut = /*glsl*/`
float quadInOut( float t ) {
	float p = 2.0 * t * t;
	return t < 0.5 ? p : -p + ( 4.0 * t ) - 1.0;
}
`;

// Cubic

const cubicIn = /*glsl*/`
float cubicIn( float t ) {
	return t * t * t;
}
`;

const cubicOut = /*glsl*/`
float cubicOut( float t ) {
	float f = t - 1.0;
	return f * f * f + 1.0;
}
`;

const cubicInOut = /*glsl*/`
float cubicInOut( float t ) {
	return t < 0.5
		? 4.0 * t * t * t
		: 0.5 * pow( 2.0 * t - 2.0, 3.0 ) + 1.0;
}
`;

// Quart

const quartIn = /*glsl*/`
float quartIn( float t ) {
	return pow( t, 4.0 );
}
`;

const quartOut = /*glsl*/`
float quartOut( float t ) {
	return pow( t - 1.0, 3.0 ) * ( 1.0 - t ) + 1.0;
}
`;

const quartInOut = /*glsl*/`
float quartInOut( float t ) {
	return t < 0.5
		? + 8.0 * pow( t, 4.0 )
		: - 8.0 * pow( t - 1.0, 4.0 ) + 1.0;
}
`;

// Quint

const quintIn = /*glsl*/`
float quintIn( float t ) {
	return pow( t, 5.0 );
}
`;

const quintOut = /*glsl*/`
float quintOut( float t ) {
	return 1.0 - ( pow( 1.0 - t, 5.0 ) );
}
`;

const quintInOut = /*glsl*/`
float quintInOut( float t ) {
return t < 0.5
		? +16.0 * pow( t, 5.0 )
		: -0.5 * pow( 2.0 * t - 2.0, 5.0 ) + 1.0;
}
`;

// Expo

const expoIn = /*glsl*/`
float expoIn( float t ) {
	return t == 0.0 ? t : pow( 2.0, 10.0 * ( t - 1.0 ) );
}
`;

const expoOut = /*glsl*/`
float expoOut( float t ) {
	return t == 1.0 ? t : 1.0 - pow( 2.0, -10.0 * t );
}
`;

const expoInOut = /*glsl*/`
float expoInOut( float t ) {
	return t == 0.0 || t == 1.0
		? t
		: t < 0.5
			? +0.5 * pow( 2.0, ( 20.0 * t ) - 10.0 )
			: -0.5 * pow( 2.0, 10.0 - ( t * 20.0 ) ) + 1.0;
}
`;

// Circ

const circIn = /*glsl*/`
float circIn( float t ) {
	return 1.0 - sqrt( 1.0 - t * t );
}
`;

const circOut = /*glsl*/`
float circOut( float t ) {
	return sqrt( ( 2.0 - t ) * t );
}
`;

const circInOut = /*glsl*/`
float circInOut( float t ) {
	return t < 0.5
		? 0.5 * ( 1.0 - sqrt( 1.0 - 4.0 * t * t ) )
		: 0.5 * ( sqrt( ( 3.0 - 2.0 * t ) * ( 2.0 * t - 1.0 ) ) + 1.0 );
}
`;

// Sine

const sineIn = /*glsl*/`
#ifndef HALF_PI
#define HALF_PI 1.5707963267948966
#endif

float sineIn( float t ) {
	return sin( ( t - 1.0 ) * HALF_PI ) + 1.0;
}
`;

const sineOut = /*glsl*/`
#ifndef HALF_PI
#define HALF_PI 1.5707963267948966
#endif

float sineOut( float t ) {
	return sin( t * HALF_PI );
}
`;

const sineInOut = /*glsl*/`
#ifndef PI
#define PI 3.141592653589793
#endif

float sineInOut( float t ) {
	return -0.5 * ( cos( PI * t ) - 1.0 );
}
`;

// Back

const backIn = /*glsl*/`
#ifndef PI
#define PI 3.141592653589793
#endif

float backIn( float t ) {
	return pow( t, 3.0 ) - t * sin( t * PI );
}
`;

const backOut = /*glsl*/`
#ifndef PI
#define PI 3.141592653589793
#endif

float backOut( float t ) {
	float f = 1.0 - t;
	return 1.0 - ( pow( f, 3.0 ) - f * sin( f * PI ) );
}
`;

const backInOut = /*glsl*/`
#ifndef PI
#define PI 3.141592653589793
#endif

float backInOut( float t ) {
	float f = t < 0.5
		? 2.0 * t
		: 1.0 - ( 2.0 * t - 1.0 );

	float g = pow( f, 3.0 ) - f * sin( f * PI );

	return t < 0.5
		? 0.5 * g
		: 0.5 * ( 1.0 - g ) + 0.5;
}
`;

// Bounce

const bounceOut = /*glsl*/`
#ifndef PI
#define PI 3.141592653589793
#endif

float bounceOut( float t ) {
	const float a = 4.0 / 11.0;
	const float b = 8.0 / 11.0;
	const float c = 9.0 / 10.0;

	const float ca = 4356.0 / 361.0;
	const float cb = 35442.0 / 1805.0;
	const float cc = 16061.0 / 1805.0;

	float t2 = t * t;

	return t < a
		? 7.5625 * t2
		: t < b
			? 9.075 * t2 - 9.9 * t + 3.4
			: t < c
				? ca * t2 - cb * t + cc
				: 10.8 * t * t - 20.52 * t + 10.72;
}
`;

const bounceIn = /*glsl*/`
${ bounceOut }

float bounceIn( float t ) {
	return 1.0 - bounceOut( 1.0 - t );
}
`;

const bounceInOut = /*glsl*/`
${ bounceOut }

float bounceInOut( float t ) {
	return t < 0.5
		? 0.5 * ( 1.0 - bounceOut( 1.0 - t * 2.0 ) )
		: 0.5 * bounceOut( t * 2.0 - 1.0 ) + 0.5;
}
`;

// Elastic

const elasticIn = /*glsl*/`
#ifndef HALF_PI
#define HALF_PI 1.5707963267948966
#endif

float elasticIn( float t ) {
	return sin( 13.0 * t * HALF_PI ) * pow( 2.0, 10.0 * ( t - 1.0 ) );
}
`;

const elasticOut = /*glsl*/`
#ifndef HALF_PI
#define HALF_PI 1.5707963267948966
#endif

float elasticOut( float t ) {
	return sin( -13.0 * ( t + 1.0 ) * HALF_PI ) * pow( 2.0, -10.0 * t ) + 1.0;
}
`;

const elasticInOut = /*glsl*/`
#ifndef HALF_PI
#define HALF_PI 1.5707963267948966
#endif

float elasticInOut( float t ) {
	return t < 0.5
		? 0.5 * sin( +13.0 * HALF_PI * 2.0 * t ) * pow( 2.0, 10.0 * ( 2.0 * t - 1.0 ) )
		: 0.5 * sin( -13.0 * HALF_PI * ( ( 2.0 * t - 1.0 ) + 1.0 ) ) * 
			pow( 2.0, -10.0 * ( 2.0 * t - 1.0 ) ) + 1.0;
}
`;

export {
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
