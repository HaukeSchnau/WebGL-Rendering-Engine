import Camera from "./camera";
import Matrix4 from "./matrix4";
import Vector3 from "./vector3";

export default class Transform {
  private static zNear: number;
  private static zFar: number;
  private static width: number;
  private static height: number;
  private static fov: number;

  static camera: Camera;

  translation: Vector3;
  rotation: Vector3;
  scale: Vector3;

  constructor() {
    this.translation = new Vector3(0, 0, 0);
    this.rotation = new Vector3(0, 0, 0);
    this.scale = new Vector3(1, 1, 1);
  }

  getTransformation() {
    const translationMat = new Matrix4().initTranslation(this.translation);
    const rotationMat = new Matrix4().initRotation(this.rotation);
    const scaleMat = new Matrix4().initScale(this.scale);

    return translationMat.mul(rotationMat.mul(scaleMat));
  }

  getProjectedTransformation() {
    const transformationMatrix = this.getTransformation();
    const projectionMatrix = new Matrix4().initProjection(
      Transform.fov,
      Transform.width,
      Transform.height,
      Transform.zNear,
      Transform.zFar
    );
    const cameraRotation = new Matrix4().initCamera(
      Transform.camera.forward,
      Transform.camera.up
    );
    const cameraTranslation = new Matrix4().initTranslation(
      new Vector3(
        -Transform.camera.pos.x,
        -Transform.camera.pos.y,
        -Transform.camera.pos.z
      )
    );

    return projectionMatrix.mul(cameraRotation.mul(cameraTranslation.mul(transformationMatrix)));
  }

  static setProjection(
    fov: number,
    width: number,
    height: number,
    zNear: number,
    zFar: number
  ) {
    Transform.fov = fov;
    Transform.width = width;
    Transform.height = height;
    Transform.zNear = zNear;
    Transform.zFar = zFar;
  }
}
