import Vector3 from "../math/Vector3";

export default class BaseLight {
    color: Vector3;
    intensity: number;

    constructor(color: Vector3, intensity: number) {
        this.color = color;
        this.intensity = intensity;
    }    
}