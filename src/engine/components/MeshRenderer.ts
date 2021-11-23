import Material from "../rendering/Material";
import Mesh from "../rendering/Mesh";
import Shader from "../rendering/Shader";
import GameComponent from "./GameComponent";

export default class MeshRenderer extends GameComponent {
  mesh: Mesh;
  material: Material;

  constructor(mesh: Mesh, material: Material) {
    super();
    this.mesh = mesh;
    this.material = material;
  }

  render(shader: Shader) {
    shader.bind();
    shader.updateUniforms(this.transform, this.material);
    this.mesh.draw(shader);
  }
}
