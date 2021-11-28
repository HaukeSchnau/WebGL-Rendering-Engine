import Transform from "../core/Transform";
import BaseLight from "../components/BaseLight";
import Material from "./Material";
import { currentRenderingEngine } from "./RenderingEngine";
import Shader from "./Shader";
import DirectionalLight from "../components/DirectionalLight";
import { Texture } from "./Texture";

export default class ForwardDirectional extends Shader {
  private static _instance: ForwardDirectional;

  private constructor() {
    super(
      "forward-directional",
      ["position", "texCoord", "normal"],
      [
        "model",
        "MVP",
        "baseColor",
        "ambientLight",

        "directionalLight.base.color",
        "directionalLight.base.intensity",
        "directionalLight.direction",

        "specularIntensity",
        "specularPower",
        "eyePos",
      ]
    );
  }

  updateUniforms(transform: Transform, material: Material) {
    if (!currentRenderingEngine.activeLight) return;

    const worldMatrix = transform.getTransformation();
    const projectedMatrix = currentRenderingEngine.mainCamera
      .getViewProjection()
      .mul(worldMatrix);

    const texture = material.attributes.get("diffuse");
    if (texture instanceof Texture) texture.bind();
    else currentRenderingEngine.unbindTextures();

    this.setUniform("model", worldMatrix);
    this.setUniform("MVP", projectedMatrix);

    this.setUniformDirLight(
      "directionalLight",
      currentRenderingEngine.activeLight as DirectionalLight
    );

    const specularIntensity = material.attributes.get("specularIntensity");
    if (typeof specularIntensity === "number")
      this.setUniformf("specularIntensity", specularIntensity);

    const specularPower = material.attributes.get("specularPower");
    if (typeof specularPower === "number")
      this.setUniformf("specularPower", specularPower);

    this.setUniform(
      "eyePos",
      currentRenderingEngine.mainCamera.transform.getTransformedTranslation()
    );
  }

  setUniformBaseLight(uniformName: string, baseLight: BaseLight) {
    this.setUniform(`${uniformName}.color`, baseLight.color);
    this.setUniformf(`${uniformName}.intensity`, baseLight.intensity);
  }

  setUniformDirLight(uniformName: string, directionalLight: DirectionalLight) {
    this.setUniformBaseLight(`${uniformName}.base`, directionalLight);
    this.setUniform(`${uniformName}.direction`, directionalLight.direction);
  }

  static get instance() {
    if (!ForwardDirectional._instance) {
      ForwardDirectional._instance = new ForwardDirectional();
    }

    return ForwardDirectional._instance;
  }
}
