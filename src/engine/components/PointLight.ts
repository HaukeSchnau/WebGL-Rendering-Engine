import Vector3 from "../math/Vector3";
import BaseLight from "./BaseLight";
import Attenuation from "../rendering/Attenuation";
import ForwardPoint from "../rendering/ForwardPoint";

export default class PointLight extends BaseLight {
  private static readonly COLOR_DEPTH = 256;

  atten: Attenuation;
  range: number;

  constructor(
    color: Vector3,
    intensity: number,
    atten: Attenuation,
    shader = ForwardPoint.instance
  ) {
    super(color, intensity, shader);
    this.atten = atten;

    const a = atten.exponent;
    const b = atten.linear;
    const c = atten.constant - PointLight.COLOR_DEPTH * intensity * color.max;

    this.range = ((-b + Math.sqrt(b * b - 4 * a * c)) / 2) * a;
  }
}
