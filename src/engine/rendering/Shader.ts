import { getVertexShader, getFragmentShader } from "../core/AssetManager";
import Transform from "../core/Transform";
import Matrix4 from "../math/Matrix4";
import Vector3 from "../math/Vector3";
import Material from "./Material";
import RenderingEngine, { gl } from "./RenderingEngine";

interface AttribLocations {
  [key: string]: number;
}

interface UniformLocations {
  [key: string]: WebGLUniformLocation;
}

export default class Shader {
  private vertex: WebGLShader;
  private fragment: WebGLShader;
  private program: WebGLShader;
  private attribLocations: AttribLocations = {};
  private uniformLocations: UniformLocations = {};

  constructor(
    name: string,
    attribNames: string[] = [],
    uniformNames: string[] = []
  ) {
    this.vertex = Shader.compileShader(gl.VERTEX_SHADER, getVertexShader(name));
    this.fragment = Shader.compileShader(
      gl.FRAGMENT_SHADER,
      getFragmentShader(name)
    );

    this.program = gl.createProgram()!;
    gl.attachShader(this.program, this.vertex);
    gl.attachShader(this.program, this.fragment);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error(
        `Unable to initialize the shader program: ${gl.getProgramInfoLog(
          this.program
        )}`
      );
    }

    for (const key of attribNames) {
      this.attribLocations[key] = gl.getAttribLocation(this.program, key);
    }

    for (const key of uniformNames) {
      this.uniformLocations[key] = gl.getUniformLocation(this.program, key)!;
    }
  }

  addUniform(name: string) {
    this.uniformLocations[name] = gl.getUniformLocation(this.program, name)!;
  }

  setUniformi(name: string, value: number) {
    gl.uniform1i(this.uniformLocations[name], value);
  }

  setUniformf(name: string, value: number) {
    gl.uniform1f(this.uniformLocations[name], value);
  }

  setUniform(name: string, value: Vector3 | Matrix4) {
    if (value instanceof Vector3)
      gl.uniform3f(this.uniformLocations[name], value.x, value.y, value.z);

    if (value instanceof Matrix4)
      gl.uniformMatrix4fv(
        this.uniformLocations[name],
        false,
        createMatBuffer(value)
      );
  }

  getAttribLocation(name: string) {
    return this.attribLocations[name];
  }

  enableAttrib(name: string) {
    const location = this.getAttribLocation(name);
    if (location === -1) return;
    gl.enableVertexAttribArray(location);
  }

  disableAttrib(name: string) {
    const location = this.getAttribLocation(name);
    if (location === -1) return;
    gl.disableVertexAttribArray(location);
  }

  updateUniforms(
    _transform: Transform,
    _material: Material,
    _renderingEngine: RenderingEngine
  ) {}

  bind() {
    gl.useProgram(this.program);
  }

  static compileShader(type: number, source: string): WebGLShader {
    const shader = gl.createShader(type)!;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(
        `An error occurred compiling the shaders: ${gl.getShaderInfoLog(
          shader
        )}`
      );
      gl.deleteShader(shader);
    }

    return shader;
  }
}

function createMatBuffer(value: Matrix4) {
  const buffer = new Float32Array(4 * 4);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      buffer[i * 4 + j] = value.get(j, i);
    }
  }

  return buffer;
}
