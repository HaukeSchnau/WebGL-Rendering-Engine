import Game from "../engine/core/Game";
import Vector3 from "../engine/math/Vector3";
import Material from "../engine/rendering/Material";
import Mesh from "../engine/rendering/Mesh";
import { Texture } from "../engine/rendering/Texture";
import MeshRenderer from "../engine/rendering/MeshRenderer";

export default class MyGame extends Game {

  constructor() {
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
    super(canvas);

    const material = new Material(
      new Texture("/img/missing.png"),
      new Vector3(1, 1, 1)
    );

    this.root.components.push(
      new MeshRenderer(new Mesh("monkey", true), material)
    )

    this.root.transform.translation.z = 5;
  }
}
