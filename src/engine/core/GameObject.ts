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
    return this;
  }

  addComponent(component: GameComponent) {
    component.parent = this;
    this.components.push(component);
    return this;
  }

  mouseMove(mouseMovement: Vector2) {
    for (const component of this.components) component.mouseMove(mouseMovement);

    for (const child of this.children) child.mouseMove(mouseMovement);
  }

  input(delta: number) {
    for (const component of this.components) component.input(delta);

    for (const child of this.children) child.input(delta);
  }

  update(delta: number) {
    for (const component of this.components) component.update(delta);

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
