import Transform from "../core/Transform";
import Attenuation from "./Attenuation";
import BaseLight from "../components/BaseLight";
import Material from "./Material";
import { currentRenderingEngine } from "./RenderingEngine";
import Shader from "./Shader";
import SpotLight from "../components/SpotLight";
import { Texture } from "./Texture";

export default class ForwardSpot extends Shader {
  private static _instance: ForwardSpot;

  private constructor() {
    super(
      "forward-spot",
      ["position", "texCoord", "normal"],
      [
        "model",
        "MVP",
        "baseColor",
        "ambientLight",

        "spotLight.pointLight.base.color",
        "spotLight.pointLight.base.intensity",
        "spotLight.pointLight.atten.constant",
        "spotLight.pointLight.atten.linear",
        "spotLight.pointLight.atten.exponent",
        "spotLight.pointLight.position",
        "spotLight.pointLight.range",
        "spotLight.direction",
        "spotLight.cutoff",

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

    this.setUniformSpotLight(
      "spotLight",
      currentRenderingEngine.activeLight as SpotLight
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

  setUniformAttenuation(uniformName: string, atten: Attenuation) {
    this.setUniformf(`${uniformName}.constant`, atten.constant);
    this.setUniformf(`${uniformName}.linear`, atten.linear);
    this.setUniformf(`${uniformName}.exponent`, atten.exponent);
  }

  setUniformPointLight(uniformName: string, pointLight: SpotLight) {
    this.setUniformBaseLight(`${uniformName}.base`, pointLight);
    this.setUniformAttenuation(`${uniformName}.atten`, pointLight.atten);
    this.setUniform(
      `${uniformName}.position`,
      pointLight.transform.getTransformedTranslation()
    );
    this.setUniformf(`${uniformName}.range`, pointLight.range);
  }

  setUniformSpotLight(uniformName: string, spotLight: SpotLight) {
    this.setUniformPointLight(`${uniformName}.pointLight`, spotLight);
    this.setUniform(`${uniformName}.direction`, spotLight.direction);
    this.setUniformf(`${uniformName}.cutoff`, spotLight.cutoff);
  }

  static get instance() {
    if (!ForwardSpot._instance) {
      ForwardSpot._instance = new ForwardSpot();
    }

    return ForwardSpot._instance;
  }
}
