import Camera from "../engine/core/Camera";
import Game from "../engine/core/Game";
import { isKeyDown } from "../engine/core/Input";
import Transform from "../engine/core/Transform";
import Vector2 from "../engine/math/Vector2";
import Vector3 from "../engine/math/Vector3";
import DirectionalLight from "../engine/rendering/DirectionalLight";
import { clearScreen } from "../engine/rendering/GraphicsUtil";
import Material from "../engine/rendering/Material";
import Mesh from "../engine/rendering/Mesh";
import Shader from "../engine/rendering/Shader";
import { Texture } from "../engine/rendering/Texture";
import BasicShader from "../engine/rendering/BasicShader";
import PhongShader from "./PhongShader";
import PointLight from "../engine/rendering/PointLight";
import BaseLight from "../engine/rendering/BaseLight";
import Attenuation from "../engine/rendering/Attenuation";
import SpotLight from "../engine/rendering/SpotLight";

export default class MyGame extends Game {
  mesh: Mesh;
  shader: Shader;
  transform: Transform;
  camera: Camera;
  material: Material;

  pLight1 = new PointLight(
    new BaseLight(new Vector3(1, 0.5, 0), 0.8),
    new Attenuation(0, 0, 1),
    new Vector3(-2, 0, 5),
    6
  );
  pLight2 = new PointLight(
    new BaseLight(new Vector3(0, 0.5, 1), 0.8),
    new Attenuation(0, 0, 1),
    new Vector3(2, 0, 7),
    6
  );

  spotLight = new SpotLight(new PointLight(
    new BaseLight(new Vector3(0, 1, 1), .8),
    new Attenuation(0, 0, .1),
    new Vector3(-2, 0, 5),
    30
  ), new Vector3(1,1,1), 0.7);

  constructor() {
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
    super(canvas);

    this.shader = PhongShader.instance;
    PhongShader.instance.ambientLight = new Vector3(0.1, 0.1, 0.1);
    PhongShader.instance.directionalLight.base.intensity = 0.8;
    PhongShader.instance.directionalLight.direction = new Vector3(1,1,1).normalized;

    // this.mesh = new Mesh("monkey");
    // this.mesh = new Mesh("pyramid", true);
    this.mesh = new Mesh("plane", true);

    this.transform = new Transform();
    this.transform.translation.z = 5;
    // this.transform.rotation.y = 180;

    this.camera = new Camera();
    this.material = new Material(
      new Texture("/img/missing.png"),
      new Vector3(1, 1, 1)
    );
    Transform.camera = this.camera;

    PhongShader.instance.pointLights = [this.pLight1, this.pLight2];
    PhongShader.instance.spotLights = [this.spotLight];
  }

  jumpVelocity = 0;
  gravityVelocity = 0;
  temp = 0;

  update(deltaTime: number) {
    if (this.camera.pos.y < 0) {
      this.camera.pos.y = 0.0;
      this.jumpVelocity = 0.0;
      this.gravityVelocity = 0.0;
    }

    const speed = 5; // m/s
    const movementAmt = speed * deltaTime;

    if (isKeyDown("KeyW")) {
      this.camera.move(this.camera.forward.xz, movementAmt);
    }
    if (isKeyDown("KeyA")) {
      this.camera.move(this.camera.left.xz, movementAmt);
    }
    if (isKeyDown("KeyS")) {
      this.camera.move(this.camera.forward.xz, -movementAmt);
    }
    if (isKeyDown("KeyD")) {
      this.camera.move(this.camera.left.xz, -movementAmt);
    }
    if (isKeyDown("Space") && this.camera.pos.y <= 0) {
      this.jumpVelocity = 6;
      this.gravityVelocity = 0.0;
    }

    this.gravityVelocity -= 9.81 * deltaTime;

    const yAmt = (this.jumpVelocity + this.gravityVelocity) * deltaTime;
    this.camera.move(Camera.yAxis, yAmt);

    this.temp += deltaTime;
    // const sinTemp = Math.sin(this.temp);
    // this.transform.rotation.y = sinTemp * 180;

    this.pLight1.position = new Vector3(
      3,
      -1,
      8.0 * (Math.sin(this.temp) + 1.0 / 2.0) + 10
    );
    this.pLight2.position = new Vector3(
      7,
      -1,
      8.0 * (Math.cos(this.temp) + 1.0 / 2.0) + 10
    );

    this.spotLight.pointLight.position = this.camera.pos;
    this.spotLight.direction = this.camera.forward.normalized;
  }

  render() {
    clearScreen();

    this.shader.bind();
    this.shader.updateUniforms(
      this.transform.getTransformation(),
      this.transform.getProjectedTransformation(),
      this.material
    );
    this.mesh.draw(this.shader);
  }

  onMouseMove(movement: Vector2) {
    this.camera.rotateX(movement.x * 0.07);
    this.camera.rotateY(movement.y * 0.07);
  }
}
