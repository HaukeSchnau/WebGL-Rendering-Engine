import Transform from "../core/Transform";
import Material from "./Material";
import RenderingEngine from "./RenderingEngine";
import Shader from "./Shader";
import Texture from "./Texture";

export default class ForwardAmbient extends Shader {
  private static _instance: ForwardAmbient;

  private constructor() {
    super(
      "forward-ambient",
      ["position", "texCoord", "normal"],
      ["MVP", "ambientIntensity"]
    );
  }

  updateUniforms(
    transform: Transform,
    material: Material,
    renderingEngine: RenderingEngine
  ) {
    const worldMatrix = transform.getTransformation();
    const projectedMatrix = renderingEngine.mainCamera
      .getViewProjection()
      .mul(worldMatrix);

    const texture = material.attributes.get("diffuse");
    if (texture instanceof Texture) texture.bind();
    else renderingEngine.unbindTextures();

    this.setUniform("MVP", projectedMatrix);
    this.setUniform("ambientIntensity", renderingEngine.ambientLight);
  }

  static get instance() {
    if (!ForwardAmbient._instance) {
      ForwardAmbient._instance = new ForwardAmbient();
    }

    return ForwardAmbient._instance;
  }
}
