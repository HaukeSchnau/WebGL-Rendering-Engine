import Transform from "../core/Transform";
import Material from "./Material";
import { currentRenderingEngine } from "./RenderingEngine";
import Shader from "./Shader";

export default class BasicShader extends Shader {
  private static _instance: BasicShader;

  private constructor() {
    super(
      "basicShader",
      ["position", "texCoord", "normal"],
      ["transform", "color"]
    );
  }

  updateUniforms(transform: Transform, material: Material) {
    const worldMatrix = transform.getTransformation();
    const projectedMatrix = currentRenderingEngine.mainCamera
      .getViewProjection()
      .mul(worldMatrix);

    if (material.texture) material.texture.bind();
    else currentRenderingEngine.unbindTextures();

    this.setUniform("transform", projectedMatrix);
    this.setUniform("color", material.color);
  }

  static get instance() {
    if (!BasicShader._instance) {
      BasicShader._instance = new BasicShader();
    }

    return BasicShader._instance;
  }
}
