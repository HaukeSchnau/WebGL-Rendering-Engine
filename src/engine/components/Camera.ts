import { isKeyDown } from "../core/Input";
import { toRadians } from "../math/MathUtils";
import Matrix4 from "../math/Matrix4";
import Quaternion from "../math/Quaternion";
import Vector2 from "../math/Vector2";
import Vector3 from "../math/Vector3";
import RenderingEngine from "../rendering/RenderingEngine";
import GameComponent from "./GameComponent";

export default class Camera extends GameComponent {
  public static readonly yAxis = new Vector3(0, 1, 0);

  private projection: Matrix4;
  private fov: number;
  private _aspect: number;
  private zNear: number;
  private zFar: number;

  constructor(fov: number, aspect: number, zNear: number, zFar: number) {
    super();

    this.projection = new Matrix4().initIdentity();
    this.fov = fov;
    this._aspect = aspect;
    this.zNear = zNear;
    this.zFar = zFar;
    this.initPerspective();
  }

  private initPerspective() {
    this.projection = new Matrix4().initPerspective(
      this.fov,
      this.aspect,
      this.zNear,
      this.zFar
    );
  }

  getViewProjection() {
    const cameraRotation = this.transform.rotation.toRotationMatrix();
    const cameraTranslation = new Matrix4().initTranslation(
      this.transform.translation.mul(-1)
    );

    return this.projection.mul(cameraRotation.mul(cameraTranslation));
  }

  move(dir: Vector3, amt: number) {
    this.transform.translation = this.transform.translation.add(
      dir.normalized.mul(amt)
    );
  }

  rotateY(angle: number) {
    this.transform.rotation = this.transform.rotation.mul(
      new Quaternion().initRotation(Camera.yAxis, angle)
    );
  }

  rotateX(angle: number) {
    this.transform.rotation = this.transform.rotation.mul(
      new Quaternion().initRotation(this.transform.rotation.right, angle)
    );
  }

  yVelocity = 0;

  override input(deltaTime: number) {
    const speed = 5;
    const xz = new Vector3(1, 0, 1);

    if (isKeyDown("KeyW")) {
      this.move(this.transform.rotation.forward.mul(xz), speed * deltaTime);
    }
    if (isKeyDown("KeyA")) {
      this.move(this.transform.rotation.left.mul(xz), speed * deltaTime);
    }
    if (isKeyDown("KeyS")) {
      this.move(this.transform.rotation.back.mul(xz), speed * deltaTime);
    }
    if (isKeyDown("KeyD")) {
      this.move(this.transform.rotation.right.mul(xz), speed * deltaTime);
    }
    if (isKeyDown("Space") && this.transform.translation.y <= 0) {
      this.yVelocity = 10;
    }
    if (isKeyDown("ArrowDown")) this.rotateX(toRadians(-2));
    if (isKeyDown("ArrowUp")) this.rotateX(toRadians(2));
    if (isKeyDown("ArrowLeft")) this.rotateY(toRadians(2));
    if (isKeyDown("ArrowRight")) this.rotateY(toRadians(-2));

    this.yVelocity -= 0.2;
    if (this.transform.translation.y < 0) {
      this.transform.translation.y = -0.1;
      if (this.yVelocity < 0) this.yVelocity = 0;
    }

    this.move(Camera.yAxis, this.yVelocity * deltaTime);
  }

  override mouseMove(movement: Vector2) {
    this.rotateY(-movement.x * 0.002);
    this.rotateX(-movement.y * 0.002);
  }

  override addToRenderingEngine(renderingEngine: RenderingEngine) {
    renderingEngine.addCamera(this);
  }

  set aspect(newAspect: number) {
    this._aspect = newAspect;
    this.initPerspective();
  }

  get aspect() {
    return this._aspect;
  }
}
