import MeshRenderer from "../engine/components/MeshRenderer";
import GameObject from "../engine/core/GameObject";
import Vector3 from "../engine/math/Vector3";
import Material from "../engine/rendering/Material";
import Mesh from "../engine/rendering/Mesh";
import Gravitaional from "./Gravitational";

export default class Planet extends GameObject {
  constructor(radius: number, mass: number, initialVelocity: Vector3) {
    super();
    const mesh = new Mesh("sphere");
    const material = new Material();
    this.transform.scale = new Vector3(radius, radius, radius);

    this.addComponent(new MeshRenderer(mesh, material));
    this.addComponent(new Gravitaional(mass, initialVelocity));
  }
}
