import Matrix4 from "../math/Matrix4";
import Vector3 from "../math/Vector3";

export default class Camera {
  public static readonly yAxis = new Vector3(0, 1, 0);

  pos: Vector3;
  forward: Vector3;
  up: Vector3;

  private projection: Matrix4;
  private fov: number;
  private _aspect: number;
  private zNear: number;
  private zFar: number;

  constructor(fov: number, aspect: number, zNear: number, zFar: number) {
    this.pos = new Vector3(0, 0, 0);
    this.forward = new Vector3(0, 0, 1);
    this.up = new Vector3(0, 1, 0);

    this.projection = new Matrix4().initIdentity();
    this.fov = fov;
    this._aspect = aspect;
    this.zNear = zNear;
    this.zFar = zFar;
    this.initPerspective();
  }

  private initPerspective() {
    this.projection = new Matrix4().initPerspective(this.fov, this.aspect, this.zNear, this.zFar);
  }

  getViewProjection() {
    const cameraRotation = new Matrix4().initCamera(
      this.forward,
      this.up
    );
    const cameraTranslation = new Matrix4().initTranslation(
      new Vector3(
        -this.pos.x,
        -this.pos.y,
        -this.pos.z
      )
    );

    return this.projection.mul(cameraRotation.mul(cameraTranslation));
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

  set aspect(newAspect: number) {
    this._aspect = newAspect;
    this.initPerspective();
  }

  get aspect() {
    return this._aspect;
  }
}
