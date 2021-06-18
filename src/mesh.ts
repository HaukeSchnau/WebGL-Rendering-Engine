import { gl } from "./glUtil";
import Shader from "./shader";
import { removeEmptyStrings } from "./util";
import Vector3 from "./vector3";
import { Vertex } from "./vertex";

export default class Mesh {
  private vbo: WebGLBuffer;
  private ibo: WebGLBuffer;
  private size: number;

  constructor(vertices: Vertex[], indices: number[]) {
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

  static async loadMesh(fileName: string) {
    const vertices: Vertex[] = [];
    const indices: number[] = [];

    const raw = await fetch("/obj/" + fileName).then((res) => res.text());
    const lines = raw.split("\n");

    for (let line of lines) {
      let tokens = line.split(" ");
      tokens = removeEmptyStrings(tokens);

      if (tokens.length == 0 || tokens[0] === "#") {
        continue;
      } else if (tokens[0] === "v") {
        vertices.push(
          new Vertex(
            new Vector3(
              parseFloat(tokens[1]),
              parseFloat(tokens[2]),
              parseFloat(tokens[3])
            )
          )
        );
      } else if (tokens[0] === "f") {
        indices.push(
          parseInt(tokens[1]) - 1,
          parseInt(tokens[2]) - 1,
          parseInt(tokens[3]) - 1
        );
      }
    }

    return new Mesh(vertices, indices);
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
