import Matrix4 from "../math/Matrix4";
import Quaternion from "../math/Quaternion";
import Vector3 from "../math/Vector3";

export default class Transform {
  parent?: Transform;
  private currentParentMatrix: Matrix4;

  translation: Vector3;
  rotation: Quaternion;
  scale: Vector3;

  private oldTranslation?: Vector3;
  private oldRotation?: Quaternion;
  private oldScale?: Vector3;

  constructor() {
    this.translation = new Vector3(0, 0, 0);
    this.rotation = new Quaternion(0, 0, 0, 1);
    this.scale = new Vector3(1, 1, 1);
    this.currentParentMatrix = new Matrix4().initIdentity();
  }

  hasChanged() {
    if (this.parent?.hasChanged()) return true;

    if (!this.oldTranslation?.equals(this.translation)) return true;
    if (!this.oldRotation?.equals(this.rotation)) return true;
    if (!this.oldScale?.equals(this.scale)) return true;

    return false;
  }

  update() {
    if (!this.oldTranslation) {
      this.oldTranslation = this.translation.copy();
      this.oldRotation = this.rotation.copy();
      this.oldScale = this.scale.copy();
    } else {
      this.oldTranslation = this.translation.add(1);
      this.oldRotation = new Quaternion(
        this.rotation.x * 0.5,
        this.rotation.y * 0.5,
        this.rotation.z * 0.5,
        this.rotation.w * 0.5
      );
      this.oldScale = this.scale.add(1);
    }
  }

  getTransformation(): Matrix4 {
    const translationMat = new Matrix4().initTranslation(this.translation);
    const rotationMat = this.rotation.toRotationMatrix();
    const scaleMat = new Matrix4().initScale(this.scale);

    return this.parentMatrix.mul(translationMat.mul(rotationMat.mul(scaleMat)));
  }

  get parentMatrix() {
    if (this.parent?.hasChanged) {
      this.currentParentMatrix = this.parent.getTransformation();
    }
    return this.currentParentMatrix;
  }

  getTransformedTranslation() {
    return this.parentMatrix.transform(this.translation);
  }

  getTransformedRotation(): Quaternion {
    const parentRotation =
      this.parent?.getTransformedRotation() ?? new Quaternion();

    return parentRotation.mul(this.rotation);
  }

  rotate(axis: Vector3, angle: number) {
    this.rotation = new Quaternion()
      .initRotation(axis, angle)
      .mul(this.rotation).normalized;
  }
}
