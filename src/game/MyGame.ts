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
    sphere.components.push(
      new MeshRenderer(new Mesh("sphere", true), material)
    );

    const light = new GameObject();
    const directionalLight = new DirectionalLight(
      new Vector3(1, 1, 1),
      0.4,
      new Vector3(1, 1, 1)
    );
    light.components.push(directionalLight);
    light.components.push(
      new PointLight(
        new Vector3(0, 1, 0),
        0.4,
        new Attenuation(0, 0, 1),
        new Vector3(1, 0, 5),
        100
      )
    );
    light.components.push(
      new SpotLight(
        new Vector3(1, 0, 0),
        0.6,
        new Attenuation(0, 0, 1),
        new Vector3(1, 0, 5),
        100,
        new Vector3(-1, 0, 0),
        0.2
      )
    );

    this.root.children.push(light);
    this.root.children.push(sphere);
  }
}
