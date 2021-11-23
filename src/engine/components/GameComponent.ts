import Transform from "../core/Transform";
import Vector2 from "../math/Vector2";
import RenderingEngine from "../rendering/RenderingEngine";
import Shader from "../rendering/Shader";

export default abstract class GameComponent {
  input(_transform: Transform, _mouseMovement: Vector2): void {}
  update(_transform: Transform): void {}
  render(_transform: Transform, _shader: Shader): void {}

  addToRenderingEngine(_renderingEngine: RenderingEngine): void {}
}
