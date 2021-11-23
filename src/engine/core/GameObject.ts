import GameComponent from "../components/GameComponent";
import Vector2 from "../math/Vector2";
import RenderingEngine from "../rendering/RenderingEngine";
import Shader from "../rendering/Shader";
import Transform from "./Transform";

export default class GameObject {
  private children: GameObject[] = [];
  private components: GameComponent[] = [];
  transform: Transform = new Transform();

  addChild(child: GameObject) {
    this.children.push(child);
  }

  addComponent(component: GameComponent) {
    component.parent = this;
    this.components.push(component);
  }

  input(mouseMovement: Vector2) {
    for (const component of this.components) component.input(mouseMovement);

    for (const child of this.children) child.input(mouseMovement);
  }

  update(delta: number) {
    for (const component of this.components) component.update();

    for (const child of this.children) child.update(delta);
  }

  render(shader: Shader) {
    for (const component of this.components) component.render(shader);

    for (const child of this.children) child.render(shader);
  }

  addToRenderingEngine(renderingEngine: RenderingEngine) {
    for (const component of this.components)
      component.addToRenderingEngine(renderingEngine);

    for (const child of this.children)
      child.addToRenderingEngine(renderingEngine);
  }
}
