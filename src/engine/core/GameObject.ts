import GameComponent from "../components/GameComponent";
import Vector2 from "../math/Vector2";
import RenderingEngine from "../rendering/RenderingEngine";
import Shader from "../rendering/Shader";
import Transform from "./Transform";

export default class GameObject {
  parent?: GameObject;
  children: GameObject[] = [];
  components: GameComponent[] = [];
  transform: Transform = new Transform();

  addChild(child: GameObject) {
    child.parent = this;
    child.transform.parent = this.transform;
    this.children.push(child);
    return this;
  }

  addComponent(component: GameComponent) {
    component.parent = this;
    this.components.push(component);
    return this;
  }

  get siblings() {
    return this.parent?.children ?? [];
  }

  mouseMove(mouseMovement: Vector2) {
    for (const component of this.components) component.mouseMove(mouseMovement);

    for (const child of this.children) child.mouseMove(mouseMovement);
  }

  input(delta: number) {
    this.transform.update();

    for (const component of this.components) component.input(delta);

    for (const child of this.children) child.input(delta);
  }

  update(delta: number) {
    for (const component of this.components) component.update(delta);

    for (const child of this.children) child.update(delta);
  }

  render(shader: Shader, renderingEngine: RenderingEngine) {
    for (const component of this.components)
      component.render(shader, renderingEngine);

    for (const child of this.children) child.render(shader, renderingEngine);
  }

  addToRenderingEngine(renderingEngine: RenderingEngine) {
    for (const component of this.components)
      component.addToRenderingEngine(renderingEngine);

    for (const child of this.children)
      child.addToRenderingEngine(renderingEngine);
  }
}
