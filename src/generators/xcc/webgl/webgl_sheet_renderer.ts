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

// This deliberately exaggerated shader is only an end-to-end proof. It will
// be replaced by the supplied MIT-licensed CRT shader after the spike passes.
const HELLO_WORLD_FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform sampler2D uSheet;
uniform vec2 uResolution;
uniform float uTime;

in vec2 vUv;
out vec4 outColor;

float hash(vec2 value) {
  return fract(sin(dot(value, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 pixel = 1.0 / uResolution;
  float rasterBand = floor(vUv.y * uResolution.y / 3.0);
  float wobblePixels =
    sin(rasterBand * 0.085 + uTime * 4.0) * 2.75 +
    sin(rasterBand * 0.021 - uTime * 2.3) * 1.25;
  vec2 warpedUv = vUv + vec2(wobblePixels * pixel.x, 0.0);

  float red = texture(uSheet, warpedUv + vec2(pixel.x * 3.0, 0.0)).r;
  float green = texture(uSheet, warpedUv + vec2(pixel.x, 0.0)).g;
  float blue = texture(uSheet, warpedUv).b;

  float scanline = 1.0 - 0.15 * (0.5 + 0.5 * sin(vUv.y * uResolution.y * 3.14159265));
  float noise = (hash(vec2(gl_FragCoord.xy + uTime * 173.0)) - 0.5) * 0.045;
  vec3 color = vec3(red, green, blue) * scanline + noise;

  outColor = vec4(color, 1.0);
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
    this.program = createProgram(gl, VERTEX_SHADER, HELLO_WORLD_FRAGMENT_SHADER);

    const texture = gl.createTexture();
    const vertexArray = gl.createVertexArray();
    const timeUniform = gl.getUniformLocation(this.program, "uTime");
    const resolutionUniform = gl.getUniformLocation(this.program, "uResolution");

    if (!texture || !vertexArray || !timeUniform || !resolutionUniform) {
      throw new Error("WebGL could not allocate the hello-world renderer resources.");
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
