import Vector3 from "../math/Vector3";
import PointLight from "./PointLight";

export default class SpotLight {
    pointLight: PointLight;
    direction: Vector3;
    cutoff: number;

    constructor(pointLight: PointLight, direction: Vector3, cutoff: number) {
        this.pointLight = pointLight;
        this.direction = direction.normalized ;
        this.cutoff = cutoff;
    }
}