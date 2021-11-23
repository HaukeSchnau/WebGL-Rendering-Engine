import Vector3 from "../math/Vector3";
import PointLight from "./PointLight";
import ForwardSpot from "../rendering/ForwardSpot";
import Attenuation from "../rendering/Attenuation";

export default class SpotLight extends PointLight {
  direction: Vector3;
  cutoff: number;

  constructor(
    color: Vector3,
    intensity: number,
    atten: Attenuation,
    position: Vector3,
    range: number,
    direction: Vector3,
    cutoff: number
  ) {
    super(color, intensity, atten, position, range, ForwardSpot.instance);
    this.direction = direction.normalized;
    this.cutoff = cutoff;
  }
}
