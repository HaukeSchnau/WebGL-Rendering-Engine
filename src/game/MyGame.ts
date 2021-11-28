import Game from "../engine/core/Game";
import GameObject from "../engine/core/GameObject";
import Vector3 from "../engine/math/Vector3";
import Attenuation from "../engine/rendering/Attenuation";
import Material from "../engine/rendering/Material";
import SpotLight from "../engine/components/SpotLight";
import Texture from "../engine/rendering/Texture";
import DirectionalLight from "../engine/components/DirectionalLight";
import PointLight from "../engine/components/PointLight";
import Camera from "../engine/components/Camera";
import { toRadians } from "../engine/math/MathUtils";
import Quaternion from "../engine/math/Quaternion";
import Planet from "./Planet";
import PlanetControls from "./PlanetControls";
import SpaceControls from "./SpaceControls";

export default class MyGame extends Game {
  constructor() {
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
    super(canvas);

    const material = new Material();
    material.attributes.set("diffuse", new Texture("img/missing.png"));
    material.attributes.set("specularIntensity", 1);
    material.attributes.set("specularPower", 8);

    // this.root.addChild(
    //   new GameObject().addComponent(
    //     new MeshRenderer(new Mesh("plane", true), material)
    //   )
    // );

    // const pyramid = new GameObject().addComponent(
    //   new MeshRenderer(new Mesh("pyramid", true), material)
    // );
    // pyramid.transform.translation.x = 3;
    // pyramid.transform.translation.z = 7;
    // this.root.addChild(pyramid);

    // const monkey = new GameObject().addComponent(
    //   new MeshRenderer(new Mesh("monkey2"), material)
    // );
    // monkey.transform.translation.x = -3;
    // monkey.transform.translation.z = 7;
    // this.root.addChild(monkey);

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

    const stauchung = 1e12;

    const sun = new Planet(100, 1.98847e30 / stauchung, new Vector3(0, 0, 0));
    const earth = new Planet(40, 5.9722e13 / stauchung, new Vector3(0, 0, 500));
    this.root.addChild(sun);
    this.root.addChild(earth);
    earth.transform.translation.x = 500;

    const player = new GameObject();
    player
      .addComponent(
        new Camera(
          toRadians(70),
          canvas.clientWidth / canvas.clientHeight,
          0.1,
          147.58e9 * 10
        )
      )
      .addComponent(new SpaceControls());
    this.root.addChild(player);
    player.transform.translation.y = 2000;
    player.transform.rotate(player.transform.rotation.right, toRadians(90));
    // this.root.addChild(monkey);
    directionalLight.transform.rotation = new Quaternion().initRotation(
      new Vector3(1, 0, 0),
      toRadians(-45)
    );
  }
}
