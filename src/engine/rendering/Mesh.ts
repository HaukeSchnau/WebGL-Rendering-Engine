import AssetManager from "../core/AssetManager";
import { removeEmptyStrings } from "../core/Util";
import Vector3 from "../math/Vector3";
import { gl } from "./GraphicsUtil";
import { Vertex } from "./Vertex";

export default class Mesh {
  private vbo: WebGLBuffer;
  private ibo: WebGLBuffer;
  private size: number;

  constructor(name: string) {
    const vertices = AssetManager.getMesh(name).vertices;
    const indices = AssetManager.getMesh(name).indices;

    this.vbo = gl.createBuffer()!;
    this.ibo = gl.createBuffer()!;

    this.size = indices.length;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      createVertexBuffer(vertices),
      gl.STATIC_DRAW
    );

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );
  }

  draw() {
    gl.enableVertexAttribArray(0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, Vertex.SIZE * 4, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    gl.drawElements(gl.TRIANGLES, this.size, gl.UNSIGNED_SHORT, 0);

    gl.disableVertexAttribArray(0);
  }
}

function createVertexBuffer(vertices: Vertex[]) {
  const buffer = new Float32Array(vertices.length * Vertex.SIZE);

  let j = 0;
  for (let i = 0; i < vertices.length; i++) {
    const vertex = vertices[i];
    buffer[j++] = vertex.pos.x;
    buffer[j++] = vertex.pos.y;
    buffer[j++] = vertex.pos.z;
  }

  return buffer;
}
