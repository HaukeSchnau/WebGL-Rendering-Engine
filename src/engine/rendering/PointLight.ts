import Vector3 from "../math/Vector3";
import Attenuation from "./Attenuation";
import BaseLight from "./BaseLight";

export default class PointLight {
    baseLight: BaseLight;
    atten: Attenuation;
    position: Vector3;
    range: number;

    constructor(baseLight: BaseLight, atten: Attenuation, position: Vector3, range: number) {
        this.baseLight = baseLight;
        this.atten = atten;
        this.position = position;
        this.range = range;
    }
}