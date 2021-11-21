import Vector2 from "../math/Vector2";
import Shader from "../rendering/Shader";
import Transform from "./Transform";

export default abstract class GameComponent {
    input(_transform: Transform, _mouseMovement: Vector2): void { };
    update(_transform: Transform): void { };

    render(_transform: Transform, _shader: Shader): void { };
}