import Vector2 from "../math/Vector2";
import Shader from "../rendering/Shader";
import GameComponent from "./GameComponent";
import Transform from "./Transform";

export default class GameObject {
    children: GameObject[] = [];
    components: GameComponent[] = [];
    transform: Transform = new Transform();

    input(mouseMovement: Vector2) {
        for (const component of this.components)
            component.input(this.transform, mouseMovement);

        for (const child of this.children)
            child.input(mouseMovement);
    }

    update() {
        for (const component of this.components)
            component.update(this.transform);

        for (const child of this.children)
            child.update();
    }

    render(shader: Shader) {
        for (const component of this.components)
            component.render(this.transform, shader);

        for (const child of this.children)
            child.render(shader);
    }
}