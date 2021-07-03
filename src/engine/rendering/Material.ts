import Vector3 from "../math/Vector3";
import { Texture } from "./Texture";

export default class Material {
  texture: Texture;
  color: Vector3;
  specularIntensity: number;
  specularPower: number;

  constructor(texture: Texture, color: Vector3, specularIntensity = 2, specularPower = 32) {
    this.texture = texture;
    this.color = color;
    this.specularIntensity = specularIntensity;
    this.specularPower = specularPower;
  }
}
