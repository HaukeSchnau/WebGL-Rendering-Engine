import Vector2 from "../math/Vector2";
import Vector3 from "../math/Vector3";

export default class Vertex {
  public static readonly SIZE = 8;
  pos: Vector3;
  texCoord: Vector2;
  normal: Vector3;

  constructor(
    pos: Vector3,
    texCoord = new Vector2(0, 0),
    normal = new Vector3(0, 0, 0)
  ) {
    this.pos = pos;
    this.texCoord = texCoord;
    this.normal = normal;
  }
}
