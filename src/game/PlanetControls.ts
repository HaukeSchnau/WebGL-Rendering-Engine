import Camera from "../engine/components/Camera";
import GameComponent from "../engine/components/GameComponent";
import { isKeyDown } from "../engine/core/Input";
import { toRadians } from "../engine/math/MathUtils";
import Vector2 from "../engine/math/Vector2";
import Vector3 from "../engine/math/Vector3";

export default class PlanetControls extends GameComponent {
  yVelocity = 0;

  rotateY(angle: number) {
    this.transform.rotate(Camera.yAxis, angle);
  }

  rotateX(angle: number) {
    this.transform.rotate(this.transform.rotation.right, angle);
  }

  move(dir: Vector3, amt: number) {
    this.transform.translation = this.transform.translation.add(
      dir.normalized.mul(amt)
    );
  }

  override input(deltaTime: number) {
    const speed = 200;
    const xz = new Vector3(1, 0, 1);

    if (isKeyDown("KeyW")) {
      this.move(this.transform.rotation.forward.mul(xz), speed * deltaTime);
    }
    if (isKeyDown("KeyA")) {
      this.move(this.transform.rotation.left.mul(xz), speed * deltaTime);
    }
    if (isKeyDown("KeyS")) {
      this.move(this.transform.rotation.back.mul(xz), speed * deltaTime);
    }
    if (isKeyDown("KeyD")) {
      this.move(this.transform.rotation.right.mul(xz), speed * deltaTime);
    }
    if (isKeyDown("Space") && this.transform.translation.y <= 0) {
      this.yVelocity = 10;
    }
    if (isKeyDown("ArrowDown")) this.rotateX(toRadians(2));
    if (isKeyDown("ArrowUp")) this.rotateX(toRadians(-2));
    if (isKeyDown("ArrowLeft")) this.rotateY(toRadians(-2));
    if (isKeyDown("ArrowRight")) this.rotateY(toRadians(2));

    this.yVelocity -= 0.2;
    if (this.transform.translation.y < 0) {
      this.transform.translation.y = -0.1;
      if (this.yVelocity < 0) this.yVelocity = 0;
    }

    this.move(Camera.yAxis, this.yVelocity * deltaTime);
  }

  override mouseMove(movement: Vector2) {
    this.rotateY(movement.x * 0.002);
    this.rotateX(movement.y * 0.002);
  }
}
