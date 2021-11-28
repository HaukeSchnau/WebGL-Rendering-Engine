import Matrix4 from "./Matrix4";
import Vector3 from "./Vector3";

export default class Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  initRotation(axis: Vector3, angle: number) {
    const sinHalfAngle = Math.sin(angle / 2);
    const cosHalfAngle = Math.cos(angle / 2);

    this.x = axis.x * sinHalfAngle;
    this.y = axis.y * sinHalfAngle;
    this.z = axis.z * sinHalfAngle;
    this.w = cosHalfAngle;

    return this;
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

  toRotationMatrix() {
    return new Matrix4().initRotationDirections(
      this.forward,
      this.up,
      this.right
    );
  }

  get forward() {
    return new Vector3(
      2 * (this.x * this.z - this.w * this.y),
      2 * (this.y * this.z + this.w * this.x),
      1 - 2 * (this.x * this.x + this.y * this.y)
    );
  }

  get back() {
    return new Vector3(
      -2 * (this.x * this.z - this.w * this.y),
      -2 * (this.y * this.z + this.w * this.x),
      -(1 - 2 * (this.x * this.x + this.y * this.y))
    );
  }

  get up() {
    return new Vector3(
      2 * (this.x * this.y + this.w * this.z),
      1 - 2 * (this.x * this.x + this.z * this.z),
      2 * (this.y * this.z - this.w * this.x)
    );
  }

  get down() {
    return new Vector3(
      -2 * (this.x * this.y + this.w * this.z),
      -(1 - 2 * (this.x * this.x + this.z * this.z)),
      -2 * (this.y * this.z - this.w * this.x)
    );
  }

  get right() {
    return new Vector3(
      1 - 2 * (this.y * this.y + this.z * this.z),
      2 * (this.x * this.y - this.w * this.z),
      2 * (this.x * this.z + this.w * this.y)
    );
  }

  get left() {
    return new Vector3(
      -(1 - 2 * (this.y * this.y + this.z * this.z)),
      -2 * (this.x * this.y - this.w * this.z),
      -2 * (this.x * this.z + this.w * this.y)
    );
  }
}
