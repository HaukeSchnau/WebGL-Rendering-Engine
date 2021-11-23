import Vector3 from "../math/Vector3";
import BaseLight from "../components/BaseLight";
import ForwardDirectional from "../rendering/ForwardDirectional";

export default class DirectionalLight extends BaseLight {
  direction: Vector3;

  constructor(color: Vector3, intensity: number, direction: Vector3) {
    super(color, intensity, ForwardDirectional.instance);
    this.direction = direction.normalized;
  }
}
