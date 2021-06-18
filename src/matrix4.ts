import Vector3 from "./vector3";
import MathUtils from "./mathUtils";

export default class Matrix4 {
  private m: number[][];

  constructor() {
    this.m = [];

    for (let i = 0; i < 4; i++) {
      this.m[i] = [];
      for (let j = 0; j < 4; j++) {
        this.m[i][j] = 0;
      }
    }
  }

  initIdentity() {
    const m = this.m;

    m[0][0] = 1;
    m[0][1] = 0;
    m[0][2] = 0;
    m[0][3] = 0;
    m[1][0] = 0;
    m[1][1] = 1;
    m[1][2] = 0;
    m[1][3] = 0;
    m[2][0] = 0;
    m[2][1] = 0;
    m[2][2] = 1;
    m[2][3] = 0;
    m[3][0] = 0;
    m[3][1] = 0;
    m[3][2] = 0;
    m[3][3] = 1;

    return this;
  }

  initTranslation(translation: Vector3) {
    const m = this.m;
    const { x, y, z } = translation;

    m[0][0] = 1;
    m[0][1] = 0;
    m[0][2] = 0;
    m[0][3] = x;
    m[1][0] = 0;
    m[1][1] = 1;
    m[1][2] = 0;
    m[1][3] = y;
    m[2][0] = 0;
    m[2][1] = 0;
    m[2][2] = 1;
    m[2][3] = z;
    m[3][0] = 0;
    m[3][1] = 0;
    m[3][2] = 0;
    m[3][3] = 1;

    return this;
  }

  initRotation(rotation: Vector3) {
    const m = this.m;

    const rx = new Matrix4();
    const ry = new Matrix4();
    const rz = new Matrix4();

    let { x, y, z } = rotation;

    x = MathUtils.toRadians(x);
    y = MathUtils.toRadians(y);
    z = MathUtils.toRadians(z);

    rz.m[0][0] = Math.cos(z);
    rz.m[0][1] = -Math.sin(z);
    rz.m[0][2] = 0;
    rz.m[0][3] = 0;
    rz.m[1][0] = Math.sin(z);
    rz.m[1][1] = Math.cos(z);
    rz.m[1][2] = 0;
    rz.m[1][3] = 0;
    rz.m[2][0] = 0;
    rz.m[2][1] = 0;
    rz.m[2][2] = 1;
    rz.m[2][3] = 0;
    rz.m[3][0] = 0;
    rz.m[3][1] = 0;
    rz.m[3][2] = 0;
    rz.m[3][3] = 1;

    rx.m[0][0] = 1;
    rx.m[0][1] = 0;
    rx.m[0][2] = 0;
    rx.m[0][3] = 0;
    rx.m[1][0] = 0;
    rx.m[1][1] = Math.cos(x);
    rx.m[1][2] = -Math.sin(x);
    rx.m[1][3] = 0;
    rx.m[2][0] = 0;
    rx.m[2][1] = Math.sin(x);
    rx.m[2][2] = Math.cos(x);
    rx.m[2][3] = 0;
    rx.m[3][0] = 0;
    rx.m[3][1] = 0;
    rx.m[3][2] = 0;
    rx.m[3][3] = 1;

    ry.m[0][0] = Math.cos(y);
    ry.m[0][1] = 0;
    ry.m[0][2] = -Math.sin(y);
    ry.m[0][3] = 0;
    ry.m[1][0] = 0;
    ry.m[1][1] = 1;
    ry.m[1][2] = 0;
    ry.m[1][3] = 0;
    ry.m[2][0] = Math.sin(y);
    ry.m[2][1] = 0;
    ry.m[2][2] = Math.cos(y);
    ry.m[2][3] = 0;
    ry.m[3][0] = 0;
    ry.m[3][1] = 0;
    ry.m[3][2] = 0;
    ry.m[3][3] = 1;

    this.m = rz.mul(ry.mul(rx)).m;

    return this;
  }

  mul(r: Matrix4) {
    const res = new Matrix4();
    const m = this.m;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        res.set(
          i,
          j,
          m[i][0] * r.get(0, j) +
            m[i][1] * r.get(1, j) +
            m[i][2] * r.get(2, j) +
            m[i][3] * r.get(3, j)
        );
      }
    }

    return res;
  }

  set(x: number, y: number, val: number) {
    this.m[x][y] = val;
  }

  get(x: number, y: number) {
    return this.m[x][y];
  }
}
