import Matrix4 from "../math/Matrix4";
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
    const cameraRotation = this.transform
      .getTransformedRotation()
      .conjugate.toRotationMatrix();

    const cameraTranslation = new Matrix4().initTranslation(
      this.transform.getTransformedTranslation().mul(-1)
    );

    return this.projection.mul(cameraRotation.mul(cameraTranslation));
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
