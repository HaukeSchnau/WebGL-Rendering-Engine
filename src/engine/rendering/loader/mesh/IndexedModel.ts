import Vector2 from "../../../math/Vector2";
import Vector3 from "../../../math/Vector3";

export default class IndexedModel {
  positions: Vector3[] = [];
  texCoords: Vector2[] = [];
  normals: Vector3[] = [];
  indices: number[] = [];

  public calcNormals() {
    for (let i = 0; i < this.indices.length; i += 3) {
      const i0 = this.indices[i];
      const i1 = this.indices[i + 1];
      const i2 = this.indices[i + 2];

      const v1 = this.positions[i1].sub(this.positions[i0]);
      const v2 = this.positions[i2].sub(this.positions[i0]);

      const normal = v1.cross(v2).normalized;

      this.normals[i0] = this.normals[i0].add(normal);
      this.normals[i1] = this.normals[i1].add(normal);
      this.normals[i2] = this.normals[i2].add(normal);
    }

    for (let i = 0; i < this.normals.length; i++) {
      this.normals[i] = this.normals[i].normalized;
    }
  }
}
