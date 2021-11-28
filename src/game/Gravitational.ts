import GameComponent from "../engine/components/GameComponent";
import Vector3 from "../engine/math/Vector3";

const G = 6.67408e-11;

export default class Gravitaional extends GameComponent {
  mass: number;
  initialVelocity: Vector3;
  currentVelocity: Vector3;

  constructor(mass: number, initialVelocity: Vector3) {
    super();
    this.mass = mass;
    this.initialVelocity = initialVelocity;
    this.currentVelocity = initialVelocity;
  }

  update(delta: number) {
    for (const sibling of this.parent?.siblings ?? []) {
      const otherGraviational = sibling.components.find(
        (comp) => comp instanceof Gravitaional
      );
      if (
        !(otherGraviational instanceof Gravitaional) ||
        otherGraviational === this
      )
        continue;

      const dist = sibling.transform.translation.sub(
        this.transform.translation
      ).length;
      const gravitaionalForce =
        G * ((this.mass * otherGraviational.mass) / (dist * dist));
      const acceleration = gravitaionalForce / this.mass;
      const dir = sibling.transform.translation.sub(
        this.transform.translation
      ).normalized;
      this.currentVelocity = this.currentVelocity.add(
        dir.mul(acceleration * delta)
      );
    }

    this.transform.translation = this.transform.translation.add(
      this.currentVelocity.mul(delta)
    );
  }
}
