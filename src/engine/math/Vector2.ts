export default class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Vector2(this.x, this.y);
  }

  lerp(dest: Vector2, lerpFactor: number): Vector2 {
    return dest.sub(this).mul(lerpFactor).add(this);
  }

  add(r: Vector2 | number): Vector2 {
    if (typeof r === "number") return new Vector2(this.x + r, this.y + r);
    return new Vector2(this.x + r.x, this.y + r.y);
  }

  sub(r: Vector2 | number): Vector2 {
    if (typeof r === "number") return new Vector2(this.x - r, this.y - r);
    return new Vector2(this.x - r.x, this.y - r.y);
  }

  mul(r: Vector2 | number): Vector2 {
    if (typeof r === "number") return new Vector2(this.x * r, this.y * r);
    return new Vector2(this.x * r.x, this.y * r.y);
  }

  div(r: Vector2 | number): Vector2 {
    if (typeof r === "number") return new Vector2(this.x / r, this.y / r);
    return new Vector2(this.x / r.x, this.y / r.y);
  }

  dot(r: Vector2) {
    return this.x * r.x + this.y * r.y;
  }

  cross(r: Vector2) {
    return this.x * r.y - this.y * r.x;
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  get normalized() {
    const { length } = this;

    return new Vector2(this.x / length, this.y / length);
  }

  get abs() {
    return new Vector2(Math.abs(this.x), Math.abs(this.y));
  }

  get max() {
    return Math.max(this.x, this.y);
  }

  equals(r: Vector2) {
    return this.x === r.x && this.y === r.y;
  }
}
