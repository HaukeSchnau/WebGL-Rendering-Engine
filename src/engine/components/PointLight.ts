import Vector3 from "../math/Vector3";
import BaseLight from "../components/BaseLight";
import Attenuation from "../rendering/Attenuation";
import ForwardPoint from "../rendering/ForwardPoint";

export default class PointLight extends BaseLight {
  atten: Attenuation;
  position: Vector3;
  range: number;

  constructor(
    color: Vector3,
    intensity: number,
    atten: Attenuation,
    position: Vector3,
    range: number,
    shader = ForwardPoint.instance
  ) {
    super(color, intensity, shader);
    this.atten = atten;
    this.position = position;
    this.range = range;
  }
}
