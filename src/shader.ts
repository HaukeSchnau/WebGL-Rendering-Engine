import { gl } from "./glUtil";
import Matrix4 from "./matrix4";
import Vector3 from "./vector3";

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
    vertexSource: string,
    fragmentSource: string,
    attribNames: string[] = [],
    uniformNames: string[] = []
  ) {
    this.vertex = Shader.compileShader(gl.VERTEX_SHADER, vertexSource);
    this.fragment = Shader.compileShader(gl.FRAGMENT_SHADER, fragmentSource);

    this.program = gl.createProgram()!;
    gl.attachShader(this.program, this.vertex);
    gl.attachShader(this.program, this.fragment);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error(
        "Unable to initialize the shader program: " +
          gl.getProgramInfoLog(this.program)
      );
    }

    for (let key of attribNames) {
      this.attribLocations[key] = gl.getAttribLocation(this.program, key);
    }

    for (let key of uniformNames) {
      this.uniformLocations[key] = gl.getUniformLocation(this.program, key)!;
    }
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

  bind() {
    gl.useProgram(this.program);
  }

  static async loadSource(type: number, filename: string) {
    return await fetch(`/glsl/` + filename).then((res) => res.text());
  }

  static compileShader(type: number, source: string): WebGLShader {
    const shader = gl.createShader(type)!;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(
        "An error occurred compiling the shaders: " +
          gl.getShaderInfoLog(shader)
      );
      gl.deleteShader(shader);
    }

    return shader;
  }

  static async fromName(
    name: string,
    attribNames: string[] = [],
    uniformNames: string[] = []
  ) {
    const vertex = await Shader.loadSource(gl.VERTEX_SHADER, name + ".vs");
    const fragment = await Shader.loadSource(gl.FRAGMENT_SHADER, name + ".fs");

    return new Shader(vertex, fragment, attribNames, uniformNames);
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
