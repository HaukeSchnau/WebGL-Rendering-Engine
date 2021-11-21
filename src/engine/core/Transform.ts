import Matrix4 from "../math/Matrix4";
import Vector3 from "../math/Vector3";

export default class Transform {
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
}
