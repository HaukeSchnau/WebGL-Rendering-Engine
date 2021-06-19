import Vector3 from "./Vector3";

export default class Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  get length() {
    return Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
  }

  get normalized() {
    const length = this.length;

    return new Quaternion(
      this.x / length,
      this.y / length,
      this.z / length,
      this.w / length
    );
  }

  get conjugate() {
    return new Quaternion(-this.x, -this.y, -this.z, this.w);
  }

  mul(r: Quaternion) {
    const w_ = this.w * r.w - this.x * r.x - this.y * r.y - this.z * r.z;
    const x_ = this.x * r.w + this.w * r.x + this.y * r.z - this.z * r.y;
    const y_ = this.y * r.w + this.w * r.y + this.z * r.x - this.x * r.z;
    const z_ = this.z * r.w + this.w * r.z + this.x * r.y - this.y * r.x;

    return new Quaternion(x_, y_, z_, w_);
  }

  mulVec(r: Vector3) {
    const w_ = -this.x * r.x - this.y * r.y - this.z * r.z;
    const x_ = this.w * r.x + this.y * r.z - this.z * r.y;
    const y_ = this.w * r.y + this.z * r.x - this.x * r.z;
    const z_ = this.w * r.z + this.x * r.y - this.y * r.x;

    return new Quaternion(x_, y_, z_, w_);
  }
}
