import Camera from "../engine/core/Camera";
import Game from "../engine/core/Game";
import { isKeyDown } from "../engine/core/Input";
import Transform from "../engine/core/Transform";
import Vector2 from "../engine/math/Vector2";
import Vector3 from "../engine/math/Vector3";
import { clearScreen } from "../engine/rendering/GraphicsUtil";
import Mesh from "../engine/rendering/Mesh";
import Shader from "../engine/rendering/Shader";

export default class MyGame extends Game {
  triangle: Mesh;
  shader: Shader;
  transform: Transform;
  camera: Camera;

  constructor() {
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
    super(canvas);

    this.shader = new Shader("basicShader", ["position"], ["transform"]);

    this.triangle = new Mesh("monkey");

    this.transform = new Transform();
    this.camera = new Camera();
    Transform.camera = this.camera;
  }

  yVelocity = 0;

  update(deltaTime: number) {
    const xz = new Vector3(1, 0, 1);

    const speed = 5;
    if (isKeyDown("KeyW")) {
      this.camera.move(this.camera.forward.mul(xz), speed * deltaTime);
    }
    if (isKeyDown("KeyA")) {
      this.camera.move(this.camera.left.mul(xz), speed * deltaTime);
    }
    if (isKeyDown("KeyS")) {
      this.camera.move(this.camera.forward.mul(xz), -speed * deltaTime);
    }
    if (isKeyDown("KeyD")) {
      this.camera.move(this.camera.left.mul(xz), -speed * deltaTime);
    }
    if (isKeyDown("Space") && this.camera.pos.y <= 0) {
      this.yVelocity = 10;
    }

    this.yVelocity -= 0.2;
    if (this.camera.pos.y < 0) {
      this.camera.pos.y = -0.1;
      if (this.yVelocity < 0) this.yVelocity = 0;
    }

    this.camera.move(Camera.yAxis, this.yVelocity * deltaTime);
  }

  render() {
    clearScreen();

    this.shader.bind();
    this.shader.setUniform(
      "transform",
      this.transform.getProjectedTransformation()
    );
    this.triangle.draw();
  }

  onMouseMove(movement: Vector2) {
    this.camera.rotateX(movement.x * 0.07);
    this.camera.rotateY(movement.y * 0.07);
  }
}
