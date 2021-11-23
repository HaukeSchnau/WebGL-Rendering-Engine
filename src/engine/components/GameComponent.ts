import GameObject from "../core/GameObject";
import Transform from "../core/Transform";
import Vector2 from "../math/Vector2";
import RenderingEngine from "../rendering/RenderingEngine";
import Shader from "../rendering/Shader";

export default abstract class GameComponent {
  parent?: GameObject;

  input(_mouseMovement: Vector2): void {}
  update(): void {}
  render(_shader: Shader): void {}

  addToRenderingEngine(_renderingEngine: RenderingEngine): void {}

  get transform() {
    return this.parent?.transform ?? new Transform();
  }
}
