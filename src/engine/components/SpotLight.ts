import Vector3 from "../math/Vector3";
import PointLight from "./PointLight";
import ForwardSpot from "../rendering/ForwardSpot";
import Attenuation from "../rendering/Attenuation";

export default class SpotLight extends PointLight {
  cutoff: number;

  constructor(
    color: Vector3,
    intensity: number,
    atten: Attenuation,
    cutoff: number
  ) {
    super(color, intensity, atten, ForwardSpot.instance);
    this.cutoff = cutoff;
  }

  get direction() {
    return this.transform.getTransformedRotation().forward;
  }
}
