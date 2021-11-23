import Vector3 from "../math/Vector3";
import RenderingEngine from "../rendering/RenderingEngine";
import Shader from "../rendering/Shader";
import GameComponent from "./GameComponent";

export default class BaseLight extends GameComponent {
  color: Vector3;
  intensity: number;
  shader: Shader;

  constructor(color: Vector3, intensity: number, shader: Shader) {
    super();
    this.color = color;
    this.intensity = intensity;
    this.shader = shader;
  }

  override addToRenderingEngine(renderingEngine: RenderingEngine) {
    renderingEngine.lights.push(this);
  }
}
