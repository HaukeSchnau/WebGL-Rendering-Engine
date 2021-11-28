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
import Camera from "../engine/components/Camera";
import { toRadians } from "../engine/math/MathUtils";
import Quaternion from "../engine/math/Quaternion";

export default class MyGame extends Game {
  constructor() {
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
    super(canvas);

    const material = new Material();
    material.attributes.set("diffuse", new Texture("img/missing.png"));
    material.attributes.set("specularIntensity", 1);
    material.attributes.set("specularPower", 8);

    const sphere = new GameObject();
    sphere.transform.translation.z = 5;
    sphere.addComponent(new MeshRenderer(new Mesh("sphere", true), material));

    this.root.addChild(
      new GameObject().addComponent(
        new MeshRenderer(new Mesh("plane", true), material)
      )
    );

    const pyramid = new GameObject().addComponent(
      new MeshRenderer(new Mesh("pyramid", true), material)
    );
    pyramid.transform.translation.x = 3;
    pyramid.transform.translation.z = 7;
    this.root.addChild(pyramid);

    const monkey = new GameObject().addComponent(
      new MeshRenderer(new Mesh("monkey", true), material)
    );
    monkey.transform.translation.x = -3;
    monkey.transform.translation.z = 7;
    this.root.addChild(monkey);

    const light = new GameObject();
    const directionalLight = new DirectionalLight(new Vector3(1, 1, 1), 0.4);
    light.addComponent(directionalLight);
    light.addComponent(
      new PointLight(new Vector3(0, 1, 0), 0.9, new Attenuation(0, 0, 1))
    );
    light.addComponent(
      new SpotLight(new Vector3(1, 0, 0), 0.6, new Attenuation(0, 0, 1), 0.1)
    );

    this.root.addChild(light);
    this.root.addChild(sphere);

    const player = new GameObject();
    player.addComponent(
      new Camera(
        toRadians(70),
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000
      )
    );
    player.addChild(monkey);
    this.root.addChild(player);
    directionalLight.transform.rotation = new Quaternion().initRotation(
      new Vector3(1, 0, 0),
      toRadians(-45)
    );
  }
}
