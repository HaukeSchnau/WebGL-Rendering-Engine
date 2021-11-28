export default class ObjIndex {
  vertexIndex: number;
  texCoordIndex?: number;
  normalIndex?: number;

  constructor(vertexIndex: number) {
    this.vertexIndex = vertexIndex;
  }

  equals(r: unknown) {
    if (!(r instanceof ObjIndex)) return false;

    return (
      this.vertexIndex === r.vertexIndex &&
      this.texCoordIndex === r.texCoordIndex &&
      this.normalIndex === r.normalIndex
    );
  }

  hashCode() {
    const BASE = 17;
    const MULTIPLIER = 31;

    let result = BASE;
    result += MULTIPLIER * this.vertexIndex;
    if (this.texCoordIndex) result += MULTIPLIER * this.texCoordIndex;
    if (this.normalIndex) result += MULTIPLIER * this.normalIndex;

    return result;
  }
}
