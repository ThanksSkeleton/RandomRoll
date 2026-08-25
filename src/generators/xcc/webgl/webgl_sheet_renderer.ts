const VERTEX_SHADER = `#version 300 es
out vec2 vUv;

void main() {
  vec2 position = vec2(
    gl_VertexID == 2 ? 3.0 : -1.0,
    gl_VertexID == 1 ? 3.0 : -1.0
  );

  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Adapted from the supplied CC0 Shadertoy shader in temp/SHADER. Shadertoy's
// iChannel1 noise texture is replaced with deterministic procedural noise so
// the effect remains a self-contained, single-source-texture WebGL2 pass.
const VHS_FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform sampler2D uSheet;
uniform vec2 uResolution;
uniform float uTime;

out vec4 outColor;

const float interference = 1.0;
const float effectResolution = 256.0;
const float pi = 3.14159265359;
const float scanlineAlpha = 0.2;
const float constantNoise = 0.1;
const float scrollingNoise = 0.8;
const vec3 noiseColor = vec3(0.8);
const float horizontalDistortDistance = 0.02;
const float verticalScrollDistance = 0.05;
const float constantChromaticAberration = 0.005;
const float distortChromaticAberration = 0.02;

float hash(vec2 value) {
  return fract(sin(dot(value, vec2(12.9898, 78.233))) * 43758.5453);
}

float noiseTexture(vec2 uv) {
  vec2 position = fract(uv) * effectResolution;
  vec2 cell = floor(position);
  vec2 blend = fract(position);
  blend = blend * blend * (3.0 - 2.0 * blend);

  float lowerLeft = hash(mod(cell, effectResolution));
  float lowerRight = hash(mod(cell + vec2(1.0, 0.0), effectResolution));
  float upperLeft = hash(mod(cell + vec2(0.0, 1.0), effectResolution));
  float upperRight = hash(mod(cell + vec2(1.0), effectResolution));

  return mix(
    mix(lowerLeft, lowerRight, blend.x),
    mix(upperLeft, upperRight, blend.x),
    blend.y
  );
}

vec3 sampleSheet(vec2 uv) {
  return texture(uSheet, clamp(uv, vec2(0.0), vec2(1.0))).rgb;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  float lineInterference = max(
    0.0,
    sin(uv.y * (8.1 - interference * 4.3) + uTime * 1.4) *
      sin(uv.y * (3.2 - interference * 2.6) + uTime * 2.3)
  ) * interference;

  float horizontalDistortion = (
    sin(uv.y * 2.0 + uTime) +
    sin(uv.y * 50.0 + uTime * 5.7) * 0.3 +
    sin(uv.y * 500.0 + uTime * 20.0) * 0.1
  ) * horizontalDistortDistance * lineInterference;

  float verticalDistortion =
    sin(uv.y * 2.5 + 5.1 + uTime * 1.4) *
    sign(sin(uv.y * 3.6 + uTime * 2.4)) *
    verticalScrollDistance *
    lineInterference;

  vec2 roundedUv = round(uv * effectResolution) / effectResolution;
  vec2 scatter = vec2(noiseTexture(uv + vec2(uTime)), 0.0) *
    max(0.0, lineInterference - 0.5) * 0.1;
  float aberrationStrength = constantChromaticAberration +
    distortChromaticAberration * (0.1 + lineInterference);
  float noiseAlpha = (
    constantNoise * interference + lineInterference * scrollingNoise * 0.3
  ) * sin(uTime * 23.4 + noiseTexture(roundedUv) * 123.4);

  vec2 imageUv = vec2(
    uv.x + horizontalDistortion,
    uv.y + verticalDistortion
  ) + scatter;
  float scanline = scanlineAlpha *
    sin(uv.y * effectResolution * pi * 2.0);

  vec3 imageColor = min(
    noiseAlpha * noiseColor + vec3(
      sampleSheet(imageUv - vec2(aberrationStrength, 0.0)).r,
      sampleSheet(imageUv).g,
      sampleSheet(imageUv + vec2(aberrationStrength, 0.0)).b
    ),
    vec3(1.0)
  ) - scanline;

  outColor = vec4(clamp(imageColor, vec3(0.0), vec3(1.0)), 1.0);
}
`;

const FRAME_INTERVAL_MS = 1000 / 60;

export class WebGlUnavailableError extends Error {
  override name = "WebGlUnavailableError";
}

export class WebGlSheetRenderer {
  readonly canvas: HTMLCanvasElement;
  textureUploadCount = 0;

  private readonly gl: WebGL2RenderingContext;
  private readonly program: WebGLProgram;
  private readonly texture: WebGLTexture;
  private readonly vertexArray: WebGLVertexArrayObject;
  private readonly timeUniform: WebGLUniformLocation;
  private readonly resolutionUniform: WebGLUniformLocation;
  private animationFrame: number | null = null;
  private startTime = 0;
  private lastDrawTime = 0;
  private frameCount = 0;
  private hasTexture = false;
  private destroyed = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      preserveDrawingBuffer: false,
      premultipliedAlpha: false,
      stencil: false,
    });

    if (!gl) {
      throw new WebGlUnavailableError("WebGL2 is unavailable in this browser.");
    }

    this.gl = gl;
    this.program = createProgram(gl, VERTEX_SHADER, VHS_FRAGMENT_SHADER);

    const texture = gl.createTexture();
    const vertexArray = gl.createVertexArray();
    const timeUniform = gl.getUniformLocation(this.program, "uTime");
    const resolutionUniform = gl.getUniformLocation(this.program, "uResolution");

    if (!texture || !vertexArray || !timeUniform || !resolutionUniform) {
      throw new Error("WebGL could not allocate the shader renderer resources.");
    }

    this.texture = texture;
    this.vertexArray = vertexArray;
    this.timeUniform = timeUniform;
    this.resolutionUniform = resolutionUniform;

    gl.bindVertexArray(this.vertexArray);
    gl.useProgram(this.program);
    gl.uniform1i(gl.getUniformLocation(this.program, "uSheet"), 0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    canvas.dataset.webglReady = "true";
    canvas.dataset.textureUploads = "0";
    canvas.dataset.framesDrawn = "0";
  }

  updateTexture(source: HTMLCanvasElement): void {
    this.assertActive();

    const maximumTextureSize = this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE) as number;
    if (source.width > maximumTextureSize || source.height > maximumTextureSize) {
      throw new Error(
        `Captured sheet ${source.width}×${source.height} exceeds WebGL texture limit ${maximumTextureSize}.`,
      );
    }

    this.canvas.width = source.width;
    this.canvas.height = source.height;
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      source,
    );

    const error = this.gl.getError();
    if (error !== this.gl.NO_ERROR) {
      throw new Error(`WebGL texture upload failed with error code ${error}.`);
    }

    this.hasTexture = true;
    this.textureUploadCount++;
    this.canvas.dataset.textureUploads = String(this.textureUploadCount);
    this.draw(performance.now());
  }

  start(): void {
    this.assertActive();
    if (this.animationFrame !== null || !this.hasTexture) {
      return;
    }

    this.startTime = performance.now();
    this.lastDrawTime = 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.canvas.dataset.motion = "reduced";
      return;
    }

    this.canvas.dataset.motion = "animated";
    this.animationFrame = requestAnimationFrame(this.frame);
  }

  destroy(): void {
    if (this.destroyed) {
      return;
    }

    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    this.gl.deleteTexture(this.texture);
    this.gl.deleteVertexArray(this.vertexArray);
    this.gl.deleteProgram(this.program);
    this.canvas.dataset.webglReady = "false";
    this.destroyed = true;
  }

  private readonly frame = (now: number): void => {
    if (now - this.lastDrawTime >= FRAME_INTERVAL_MS) {
      this.draw(now);
      this.lastDrawTime = now;
    }
    this.animationFrame = requestAnimationFrame(this.frame);
  };

  private draw(now: number): void {
    if (!this.hasTexture || this.destroyed) {
      return;
    }

    const gl = this.gl;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vertexArray);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1f(this.timeUniform, (now - this.startTime) * 0.001);
    gl.uniform2f(this.resolutionUniform, this.canvas.width, this.canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    this.frameCount++;
    if (this.frameCount === 1 || this.frameCount % 30 === 0) {
      this.canvas.dataset.framesDrawn = String(this.frameCount);
    }
  }

  private assertActive(): void {
    if (this.destroyed) {
      throw new Error("Cannot use a destroyed WebGL sheet renderer.");
    }
  }
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
): WebGLProgram {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

  if (!program) {
    throw new Error("WebGL could not create a shader program.");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`WebGL program link failed: ${gl.getProgramInfoLog(program) ?? "unknown error"}`);
  }

  return program;
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);

  if (!shader) {
    throw new Error("WebGL could not create a shader.");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? "unknown error";
    gl.deleteShader(shader);
    throw new Error(`WebGL shader compilation failed: ${message}`);
  }

  return shader;
}
