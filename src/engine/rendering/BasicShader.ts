import Matrix4 from "../math/Matrix4";
import { unbindTextures } from "./GraphicsUtil";
import Material from "./Material";
import Shader from "./Shader";

export default class BasicShader extends Shader {
    private static _instance: BasicShader;

    private constructor() {
        super("basicShader", ["position", "texCoord", "normal"], ["transform", "color"]);
    }

    updateUniforms(worldMatrix: Matrix4, projectedMatrix: Matrix4, material: Material) {
        if(material.texture)
            material.texture.bind();
        else
            unbindTextures();

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