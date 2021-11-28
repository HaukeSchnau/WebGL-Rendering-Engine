import Transform from "../core/Transform";
import Attenuation from "./Attenuation";
import BaseLight from "../components/BaseLight";
import Material from "./Material";
import { currentRenderingEngine } from "./RenderingEngine";
import Shader from "./Shader";
import PointLight from "../components/PointLight";

export default class ForwardPoint extends Shader {
  private static _instance: ForwardPoint;

  private constructor() {
    super(
      "forward-point",
      ["position", "texCoord", "normal"],
      [
        "model",
        "MVP",
        "baseColor",
        "ambientLight",

        "pointLight.base.color",
        "pointLight.base.intensity",
        "pointLight.atten.constant",
        "pointLight.atten.linear",
        "pointLight.atten.exponent",
        "pointLight.position",
        "pointLight.range",

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

    if (material.texture) material.texture.bind();
    else currentRenderingEngine.unbindTextures();

    this.setUniform("model", worldMatrix);
    this.setUniform("MVP", projectedMatrix);

    this.setUniformPointLight(
      "pointLight",
      currentRenderingEngine.activeLight as PointLight
    );

    this.setUniformf("specularIntensity", material.specularIntensity);
    this.setUniformf("specularPower", material.specularPower);

    this.setUniform(
      "eyePos",
      currentRenderingEngine.mainCamera.transform.translation
    );
  }

  setUniformBaseLight(uniformName: string, baseLight: BaseLight) {
    this.setUniform(uniformName + ".color", baseLight.color);
    this.setUniformf(uniformName + ".intensity", baseLight.intensity);
  }

  setUniformAttenuation(uniformName: string, atten: Attenuation) {
    this.setUniformf(uniformName + ".constant", atten.constant);
    this.setUniformf(uniformName + ".linear", atten.linear);
    this.setUniformf(uniformName + ".exponent", atten.exponent);
  }

  setUniformPointLight(uniformName: string, pointLight: PointLight) {
    this.setUniformBaseLight(uniformName + ".base", pointLight);
    this.setUniformAttenuation(uniformName + ".atten", pointLight.atten);
    this.setUniform(
      uniformName + ".position",
      pointLight.transform.translation
    );
    this.setUniformf(uniformName + ".range", pointLight.range);
  }

  static get instance() {
    if (!ForwardPoint._instance) {
      ForwardPoint._instance = new ForwardPoint();
    }

    return ForwardPoint._instance;
  }
}
