import {
  Camera,
  ClampToEdgeWrapping,
  DataTexture,
  Mesh,
  NearestFilter,
  PlaneBufferGeometry,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  UnsignedByteType,
  WebGLRenderTarget,
} from 'three';

import { FloatPack } from './FloatPack';

class TextureComputer {
  constructor(
    data,
    fragmentShader = TextureComputer.DEFAULT_FRAGMENT,
    uniforms = {}
  ) {
    if (!TextureComputer.renderer)
      throw new Error('Use TextureComputer.init(renderer) before instancing.');

    this._shader = fragmentShader;
    this._uniforms = uniforms;
    this.data = data;
  }

  compute() {
    // Toggling between 2 RenderTargets is required
    // to avoid framebuffer feedback loop
    this.renderTarget = this.renderTarget === this._rt1 ? this._rt2 : this._rt1;

    TextureComputer.render(this.material, this.renderTarget);
    this.material.uniforms.tData.value = this.renderTarget.texture;
  }

  fill(number) {
    this._data.fill(number);
    FloatPack.pack(this._data, this.tData.image.data);
  }

  dispose() {
    this._rt1.dispose();
    this._rt2.dispose();
    this.tData.dispose();
  }

  /*-------------------------------------------------------------------------/
		Getters & Setters
	/-------------------------------------------------------------------------*/

  get data() {
    // This is slow and intended for debug only

    TextureComputer.renderer.readRenderTargetPixels(
      this.renderTarget,
      0,
      0,
      this._size,
      this._size,
      this._buffer
    );
    FloatPack.unpack(this._buffer, this._data);

    return this._data;
  }

  set data(data) {
    // The data can either be an array or a length
    const dataIsArray = Array.isArray(data);

    const size = dataIsArray
      ? TextureComputer.getRequiredSize(data.length)
      : TextureComputer.getRequiredSize(data);
    this._size = size;

    this.tData = TextureComputer.createTexture(size);
    this._buffer = this.tData.image.data;
    this._data = dataIsArray ? data : new Float32Array(size * size);
    if (dataIsArray) FloatPack.pack(data, this.tData.image.data);

    this.uniforms = this._uniforms;

    this._rt1 = TextureComputer.createRenderTarget(size);
    this._rt2 = TextureComputer.createRenderTarget(size);
    this.renderTarget = this._rt1;
  }

  get shader() {
    return this._shader;
  }

  set shader(shader) {
    this._shader = shader;

    this.material = new ShaderMaterial({
      uniforms: this._uniforms,
      vertexShader: TextureComputer.DEFAULT_VERTEX,
      fragmentShader: shader,
    });

    const floatSize = this.size.toFixed(1);
    this.material.defines.resolution = `vec2(${floatSize}, ${floatSize})`;
  }

  get uniforms() {
    return this._uniforms;
  }

  set uniforms(uniforms) {
    uniforms.tData = { value: this.tData };
    this._uniforms = uniforms;
    this.shader = this._shader;
  }

  /*-------------------------------------------------------------------------/
		Read-only
	/-------------------------------------------------------------------------*/

  get size() {
    return this._size;
  }

  get texture() {
    return this.material.uniforms.tData.value;
  }
}

/*-----------------------------------------------------------------------------/
	Static core
/-----------------------------------------------------------------------------*/

TextureComputer.init = (renderer) => {
  if (!TextureComputer.renderer) {
    TextureComputer.renderer = renderer;

    TextureComputer.scene = new Scene();
    TextureComputer.camera = new Camera();
    TextureComputer.mesh = new Mesh(new PlaneBufferGeometry(2, 2));
    TextureComputer.scene.add(TextureComputer.mesh);
  }

  return TextureComputer.checkHardwareCompatibility();
};

TextureComputer.checkHardwareCompatibility = () => {
  TextureComputer.isCompatible = true;

  if (TextureComputer.renderer.capabilities.maxVertexTextures === 0) {
    console.warn('No support for vertex textures.');
    TextureComputer.isCompatible = false;
  }

  if (!TextureComputer.isCompatible) {
    window.alert('Incompatible hardware.');
  }

  return TextureComputer.isCompatible;
};

TextureComputer.render = (material, renderTarget) => {
  TextureComputer.mesh.material = material;
  TextureComputer.renderer.setRenderTarget(renderTarget);
  TextureComputer.renderer.render(
    TextureComputer.scene,
    TextureComputer.camera
  );
  TextureComputer.renderer.setRenderTarget(null);
};

/*-----------------------------------------------------------------------------/
	Static misc
/-----------------------------------------------------------------------------*/

TextureComputer.DEFAULT_VERTEX = /*glsl*/ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

TextureComputer.DEFAULT_FRAGMENT = /*glsl*/ `
  uniform sampler2D tData;
  ${FloatPack.GLSL}

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float data = unpack(texture2D(tData, uv));

    // Modify data...
    gl_FragColor = pack(data);
  }
`;

TextureComputer.createTexture = (size) =>
  new DataTexture(
    new Uint8Array(size * size * 4),
    size,
    size,
    RGBAFormat,
    UnsignedByteType
  );

TextureComputer.createRenderTarget = (size) =>
  new WebGLRenderTarget(size, size, {
    wrapS: ClampToEdgeWrapping,
    wrapT: ClampToEdgeWrapping,
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    stencilBuffer: false,
    depthBuffer: false,
    format: RGBAFormat,
    type: UnsignedByteType,
  });

TextureComputer.getRequiredSize = (length) => {
  if (
    isNaN(length) ||
    !isFinite(length) ||
    !Number.isInteger(length) ||
    length < 1
  ) {
    throw new RangeError('Length must be a natural number.');
  }

  let n = 1;
  let size = 2;

  while (size * size < length) {
    size = Math.pow(2, n);
    n++;
  }

  return size;
};

TextureComputer.round = (float, decimals = 6) => {
  const pow = Math.pow(10, decimals);
  return Math.round(float * pow) / pow;
};

export { TextureComputer };
