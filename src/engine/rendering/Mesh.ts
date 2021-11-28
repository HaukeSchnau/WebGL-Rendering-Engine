import AssetManager from "../core/AssetManager";
import { gl } from "./RenderingEngine";
import Shader from "./Shader";
import { Vertex } from "./Vertex";

export default class Mesh {
  private vbo: WebGLBuffer;
  private ibo: WebGLBuffer;
  private size: number;

  constructor(name: string, calcNormals = false) {
    const { vertices } = AssetManager.getMesh(name);
    const { indices } = AssetManager.getMesh(name);

    if (calcNormals) this.calcNormals(vertices, indices);

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

  draw(shader: Shader) {
    shader.bind();

    shader.enableAttrib("position");
    shader.enableAttrib("texCoord");
    shader.enableAttrib("normal");

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.vertexAttribPointer(
      shader.getAttribLocation("position"),
      3,
      gl.FLOAT,
      false,
      Vertex.SIZE * 4,
      0
    );
    gl.vertexAttribPointer(
      shader.getAttribLocation("texCoord"),
      2,
      gl.FLOAT,
      false,
      Vertex.SIZE * 4,
      3 * 4
    );
    gl.vertexAttribPointer(
      shader.getAttribLocation("normal"),
      3,
      gl.FLOAT,
      false,
      Vertex.SIZE * 4,
      5 * 4
    );

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    gl.drawElements(gl.TRIANGLES, this.size, gl.UNSIGNED_SHORT, 0);

    shader.disableAttrib("position");
    shader.disableAttrib("texCoord");
    shader.disableAttrib("normal");
  }

  private calcNormals(vertices: Vertex[], indices: number[]) {
    for (let i = 0; i < indices.length; i += 3) {
      const i0 = indices[i];
      const i1 = indices[i + 1];
      const i2 = indices[i + 2];

      const v1 = vertices[i1].pos.sub(vertices[i0].pos);
      const v2 = vertices[i2].pos.sub(vertices[i0].pos);

      const normal = v1.cross(v2).normalized;

      vertices[i0].normal = vertices[i0].normal.add(normal);
      vertices[i1].normal = vertices[i1].normal.add(normal);
      vertices[i2].normal = vertices[i2].normal.add(normal);
    }

    for (let i = 0; i < vertices.length; i++) {
      vertices[i].normal = vertices[i].normal.normalized;
    }
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
    buffer[j++] = vertex.texCoord.x;
    buffer[j++] = vertex.texCoord.y;
    buffer[j++] = vertex.normal.x;
    buffer[j++] = vertex.normal.y;
    buffer[j++] = vertex.normal.z;
  }

  return buffer;
}
