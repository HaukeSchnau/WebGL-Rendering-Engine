import GameComponent from "../core/GameComponent";
import Transform from "../core/Transform";
import Material from "./Material";
import Mesh from "./Mesh";
import Shader from "./Shader";

export default class MeshRenderer extends GameComponent {
    mesh: Mesh;
    material: Material;

    constructor(mesh: Mesh, material: Material) {
        super();
        this.mesh = mesh;
        this.material = material;
    }

    render(transform: Transform, shader: Shader) {
        shader.bind();
        shader.updateUniforms(transform, this.material)
        this.mesh.draw(shader);
    }
}