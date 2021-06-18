import Vector3 from "./vector3";

export default class Camera {
  public static readonly yAxis = new Vector3(0, 1, 0);

  pos: Vector3;
  forward: Vector3;
  up: Vector3;

  constructor() {
    this.pos = new Vector3(0, 0, 0);
    this.forward = new Vector3(0, 0, 1);
    this.up = new Vector3(0, 1, 0);

    this.up = this.up.normalized;
    this.forward = this.forward.normalized;
  }

  move(dir: Vector3, amt: number) {
    this.pos = this.pos.add(dir.normalized.mul(amt));
  }

  rotateY(angle: number) {
    const hAxis = Camera.yAxis.cross(this.forward).normalized;

    this.forward = this.forward.rotate(angle, hAxis).normalized;

    this.up = this.forward.cross(hAxis).normalized;
  }

  rotateX(angle: number) {
    const hAxis = Camera.yAxis.cross(this.forward).normalized;

    this.forward = this.forward.rotate(angle, Camera.yAxis).normalized;

    this.up = this.forward.cross(hAxis).normalized;
  }

  get left() {
    return this.forward.cross(this.up).normalized;
  }

  get right() {
    return this.up.cross(this.forward).normalized;
  }
}
