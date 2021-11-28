import Transform from "../core/Transform";
import Attenuation from "./Attenuation";
import BaseLight from "../components/BaseLight";
import Material from "./Material";
import Shader from "./Shader";
import PointLight from "../components/PointLight";
import Texture from "./Texture";
import RenderingEngine from "./RenderingEngine";

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

  updateUniforms(
    transform: Transform,
    material: Material,
    renderingEngine: RenderingEngine
  ) {
    if (!renderingEngine.activeLight) return;

    const worldMatrix = transform.getTransformation();
    const projectedMatrix = renderingEngine.mainCamera
      .getViewProjection()
      .mul(worldMatrix);

    const texture = material.attributes.get("diffuse");
    if (texture instanceof Texture) texture.bind();
    else renderingEngine.unbindTextures();

    this.setUniform("model", worldMatrix);
    this.setUniform("MVP", projectedMatrix);

    this.setUniformPointLight(
      "pointLight",
      renderingEngine.activeLight as PointLight
    );

    const specularIntensity = material.attributes.get("specularIntensity");
    if (typeof specularIntensity === "number")
      this.setUniformf("specularIntensity", specularIntensity);

    const specularPower = material.attributes.get("specularPower");
    if (typeof specularPower === "number")
      this.setUniformf("specularPower", specularPower);

    this.setUniform(
      "eyePos",
      renderingEngine.mainCamera.transform.getTransformedTranslation()
    );
  }

  setUniformBaseLight(uniformName: string, baseLight: BaseLight) {
    this.setUniform(`${uniformName}.color`, baseLight.color);
    this.setUniformf(`${uniformName}.intensity`, baseLight.intensity);
  }

  setUniformAttenuation(uniformName: string, atten: Attenuation) {
    this.setUniformf(`${uniformName}.constant`, atten.constant);
    this.setUniformf(`${uniformName}.linear`, atten.linear);
    this.setUniformf(`${uniformName}.exponent`, atten.exponent);
  }

  setUniformPointLight(uniformName: string, pointLight: PointLight) {
    this.setUniformBaseLight(`${uniformName}.base`, pointLight);
    this.setUniformAttenuation(`${uniformName}.atten`, pointLight.atten);
    this.setUniform(
      `${uniformName}.position`,
      pointLight.transform.getTransformedTranslation()
    );
    this.setUniformf(`${uniformName}.range`, pointLight.range);
  }

  static get instance() {
    if (!ForwardPoint._instance) {
      ForwardPoint._instance = new ForwardPoint();
    }

    return ForwardPoint._instance;
  }
}
