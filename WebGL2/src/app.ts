import { debounce } from "./common";

const dummyVertexSource: string = require("./shader/dummy-code.vs");
const dummyFragmentSource: string = require("./shader/dummy-code.fs");

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
  throw new Error("No Canvas found.");
}

const gl = canvas.getContext("webgl2", {
  alpha: false,
  antialias: false,
  depth: false,
  desynchronized: true,
  failIfMajorPerformanceCaveat: true,
  powerPreference: "high-performance",
  premultipliedAlpha: false,
  preserveDrawingBuffer: true,
  stencil: false,
});

if (!gl) {
  throw new Error("Unable to initialize WebGL.");
}

const resize = () => {
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = width;
  canvas.height = height;
  gl.viewport(0, 0, canvas.width, canvas.height);
};

const loadShader = (type: GLenum, source: string): WebGLShader => {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Shader Error: Could not create shader.");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const errorMessage = `Shader Error: ${gl.getShaderInfoLog(shader)}`;
    gl.deleteShader(shader);
    throw new Error(errorMessage);
  }

  return shader;
};

const initShaderProgram = (vertexSource: string, fragmentSource: string): WebGLProgram => {
  const vertexShader = loadShader(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!program) {
    throw new Error("Program Error: Could not create program.");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const errorMessage = `Program Error: ${gl.getProgramInfoLog(program)}`;
    gl.deleteProgram(program);
    throw new Error(errorMessage);
  }

  return program;
};

const initBuffer = (): WebGLBuffer => {
  const positionBuffer = gl.createBuffer();
  if (!positionBuffer) {
    throw new Error("Buffer Error: Could not create position buffer.");
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [
    10, 20,
    80, 20,
    10, 30,
    80, 30,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  return positionBuffer;
};

window.addEventListener("resize", () => debounce(resize));

resize();

gl.clearColor(0.122, 0.122, 0.122, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

const program = initShaderProgram(dummyVertexSource, dummyFragmentSource);
const programInfo = {
  program,
  attribLocations: {
    aPos: gl.getAttribLocation(program, "aPos"),
  },
  uniformLocations: {
    uResolution: gl.getUniformLocation(program, "uResolution"),
  },
};
const positionBuffer = initBuffer();

gl.useProgram(programInfo.program);

gl.uniform2f(programInfo.uniformLocations.uResolution, gl.canvas.width, gl.canvas.height);

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.enableVertexAttribArray(programInfo.attribLocations.aPos);
gl.vertexAttribPointer(programInfo.attribLocations.aPos, 2, gl.FLOAT, false, 0, 0);

gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
