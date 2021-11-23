import MeshRenderer from "../engine/components/MeshRenderer";
import Game from "../engine/core/Game";
import GameObject from "../engine/core/GameObject";
import Vector3 from "../engine/math/Vector3";
import Attenuation from "../engine/rendering/Attenuation";
import Material from "../engine/rendering/Material";
import Mesh from "../engine/rendering/Mesh";
import SpotLight from "../engine/components/SpotLight";
import { Texture } from "../engine/rendering/Texture";
import DirectionalLight from "../engine/components/DirectionalLight";
import PointLight from "../engine/components/PointLight";

export default class MyGame extends Game {
  constructor() {
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
    super(canvas);

    const material = new Material(
      new Texture("/img/missing.png"),
      new Vector3(1, 1, 1)
    );

    const sphere = new GameObject();
    sphere.transform.translation.z = 5;
    sphere.addComponent(new MeshRenderer(new Mesh("sphere", true), material));

    const light = new GameObject();
    const directionalLight = new DirectionalLight(
      new Vector3(1, 1, 1),
      0.4,
      new Vector3(1, 1, 1)
    );
    light.addComponent(directionalLight);
    light.addComponent(
      new PointLight(new Vector3(0, 1, 0), 0.9, new Attenuation(0, 0, 1))
    );
    light.addComponent(
      new SpotLight(new Vector3(1, 0, 0), 0.6, new Attenuation(0, 0, 1), 0.1)
    );

    this.root.addChild(light);
    this.root.addChild(sphere);
  }
}
