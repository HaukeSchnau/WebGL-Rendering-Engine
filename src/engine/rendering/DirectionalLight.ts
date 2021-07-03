import Vector3 from "../math/Vector3";
import BaseLight from "./BaseLight";

export default class DirectionalLight {
    base: BaseLight;
    direction: Vector3;

    constructor(base: BaseLight, direction: Vector3) {
        this.base = base;
        this.direction = direction.normalized;
    }
}