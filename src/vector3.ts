export default class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(r: Vector3 | number): Vector3 {
    if (typeof r === "number")
      return new Vector3(this.x + r, this.y + r, this.z + r);
    return new Vector3(this.x + r.x, this.y + r.y, this.z + r.z);
  }

  sub(r: Vector3 | number): Vector3 {
    if (typeof r === "number")
      return new Vector3(this.x - r, this.y - r, this.z - r);
    return new Vector3(this.x - r.x, this.y - r.y, this.z - r.z);
  }

  mul(r: Vector3 | number): Vector3 {
    if (typeof r === "number")
      return new Vector3(this.x * r, this.y * r, this.z * r);
    return new Vector3(this.x * r.x, this.y * r.y, this.z * r.z);
  }

  div(r: Vector3 | number): Vector3 {
    if (typeof r === "number")
      return new Vector3(this.x / r, this.y / r, this.z / r);
    return new Vector3(this.x / r.x, this.y / r.y, this.z / r.z);
  }

  dot(r: Vector3) {
    return this.x * r.x + this.y * r.y + this.z * r.z;
  }

  cross(r: Vector3) {
    return new Vector3(
      this.y * r.z - this.z * r.y,
      this.z * r.x - this.x * r.z,
      this.x * r.y - this.y * r.x
    );
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  get normalized() {
    const length = this.length;

    return new Vector3(this.x / length, this.y / length, this.z / length);
  }
}
