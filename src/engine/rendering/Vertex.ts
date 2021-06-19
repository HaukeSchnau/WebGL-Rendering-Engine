import Vector3 from "./Vector3";

export class Vertex {
  public static readonly SIZE = 3;
  pos: Vector3;

  constructor(pos: Vector3) {
    this.pos = pos;
  }
}
