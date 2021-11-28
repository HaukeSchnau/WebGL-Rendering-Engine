import { removeEmptyStrings } from "../../../core/Util";
import Vector2 from "../../../math/Vector2";
import Vector3 from "../../../math/Vector3";
import HashMap from "../../../util/HashMap";
import IndexedModel from "./IndexedModel";
import ObjIndex from "./ObjIndex";

export default class ObjModel {
  positions: Vector3[] = [];
  texCoords: Vector2[] = [];
  normals: Vector3[] = [];
  indices: ObjIndex[] = [];
  hasTexCoords = false;
  hasNormals = false;

  constructor(raw: string) {
    const lines = raw.split("\n");

    for (const line of lines) {
      let tokens = line.split(" ");
      tokens = removeEmptyStrings(tokens);

      if (tokens.length === 0 || tokens[0] === "#") {
        continue;
      } else if (tokens[0] === "v") {
        this.positions.push(
          new Vector3(
            parseFloat(tokens[1]),
            parseFloat(tokens[2]),
            parseFloat(tokens[3])
          )
        );
      } else if (tokens[0] === "vt") {
        this.texCoords.push(
          new Vector2(parseFloat(tokens[1]), parseFloat(tokens[2]))
        );
      } else if (tokens[0] === "vn") {
        this.normals.push(
          new Vector3(
            parseFloat(tokens[1]),
            parseFloat(tokens[2]),
            parseFloat(tokens[3])
          )
        );
      } else if (tokens[0] === "f") {
        for (let i = 0; i < tokens.length - 3; i++) {
          this.indices.push(this.parseObjIndex(tokens[1]));
          this.indices.push(this.parseObjIndex(tokens[2 + i]));
          this.indices.push(this.parseObjIndex(tokens[3 + i]));
        }
      }
    }
  }

  parseObjIndex(token: string) {
    const values = token.split("/");

    const index = new ObjIndex(parseInt(values[0]) - 1);

    if (values.length > 0) {
      this.hasTexCoords = true;
      index.texCoordIndex = parseInt(values[1]) - 1;

      if (values.length > 2) {
        index.texCoordIndex = parseInt(values[2]) - 1;
      }
    }

    return index;
  }

  toIndexedModel() {
    const result = new IndexedModel();
    const normalModel = new IndexedModel();
    const resultIndexMap = new HashMap<ObjIndex, number>();
    const normalIndexMap = new Map<number, number>();
    const indexMap = new Map<number, number>();

    for (const [_, currentIndex] of this.indices.entries()) {
      const currentPosition = this.positions[currentIndex.vertexIndex];
      const currentTexCoord = currentIndex.texCoordIndex
        ? this.texCoords[currentIndex.texCoordIndex]
        : new Vector2();
      const currentNormal = currentIndex.normalIndex
        ? this.normals[currentIndex.normalIndex]
        : new Vector3();

      let modelVertexIndex = resultIndexMap.get(currentIndex);
      if (!modelVertexIndex) {
        modelVertexIndex = result.positions.length;
        resultIndexMap.set(currentIndex, modelVertexIndex);

        result.positions.push(currentPosition);
        result.texCoords.push(currentTexCoord);
        if (this.hasNormals) result.normals.push(currentNormal);
      }

      let normalModelIndex = normalIndexMap.get(currentIndex.vertexIndex);
      if (!normalModelIndex) {
        normalModelIndex = normalModel.positions.length;
        normalIndexMap.set(currentIndex.vertexIndex, normalModelIndex);

        normalModel.positions.push(currentPosition);
        normalModel.texCoords.push(currentTexCoord);
        normalModel.normals.push(currentNormal);
      }

      result.indices.push(modelVertexIndex);
      normalModel.indices.push(normalModelIndex);
      indexMap.set(modelVertexIndex, normalModelIndex);
    }

    if (!this.hasNormals) {
      normalModel.calcNormals();

      for (let i = 0; i < result.positions.length; i++) {
        result.normals.push(normalModel.normals[indexMap.get(i) ?? 0]);
      }
    }

    return result;
  }
}
