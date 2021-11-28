import Quaternion from "./Quaternion";

export default class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  copy() {
    return new Vector3(this.x, this.y, this.z);
  }

  lerp(dest: Vector3, lerpFactor: number): Vector3 {
    return dest.sub(this).mul(lerpFactor).add(this);
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

  rotate(angle: number, axis: Vector3) {
    return this.rotateQuaternion(new Quaternion().initRotation(axis, angle));
  }

  rotateQuaternion(rotation: Quaternion) {
    const conjugate = rotation.conjugate;
    const w = rotation.mulVec(this).mul(conjugate);
    return new Vector3(w.x, w.y, w.z);
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  get normalized() {
    const length = this.length;

    return new Vector3(this.x / length, this.y / length, this.z / length);
  }

  get xy() {
    return this.mul(new Vector3(1, 1, 0));
  }

  get xz() {
    return this.mul(new Vector3(1, 0, 1));
  }

  get yz() {
    return this.mul(new Vector3(0, 1, 1));
  }

  get abs() {
    return new Vector3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
  }

  get max() {
    return Math.max(this.x, this.y, this.z);
  }

  equals(r: Vector3) {
    return this.x === r.x && this.y === r.y && this.z == r.z;
  }
}
