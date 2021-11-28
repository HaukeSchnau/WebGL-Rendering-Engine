import Vector3 from "../math/Vector3";
import BaseLight from "./BaseLight";
import ForwardDirectional from "../rendering/ForwardDirectional";

export default class DirectionalLight extends BaseLight {
  constructor(color: Vector3, intensity: number) {
    super(color, intensity, ForwardDirectional.instance);
  }

  get direction() {
    return this.transform.getTransformedRotation().forward;
  }
}
