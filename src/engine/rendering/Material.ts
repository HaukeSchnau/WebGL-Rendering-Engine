import Vector3 from "../math/Vector3";
import Texture from "./Texture";

type MaterialAttribute = Texture | Vector3 | number;

export default class Material {
  attributes = new Map<string, MaterialAttribute>();
}
