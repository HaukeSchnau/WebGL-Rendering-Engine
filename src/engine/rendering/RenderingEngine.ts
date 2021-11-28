import Camera from "../components/Camera";
import GameObject from "../core/GameObject";
import { toRadians } from "../math/MathUtils";
import Vector3 from "../math/Vector3";
import ForwardAmbient from "./ForwardAmbient";
import BaseLight from "../components/BaseLight";

export let gl: WebGL2RenderingContext;

const setGl = (newGl: WebGL2RenderingContext) => {
  gl = newGl;
};

export default class RenderingEngine {
  gl: WebGL2RenderingContext;
  mainCamera: Camera;
  ambientLight: Vector3 = new Vector3(0.1, 0.1, 0.1);

  lights: BaseLight[] = [];
  activeLight?: BaseLight;

  constructor(gl: WebGL2RenderingContext, width: number, height: number) {
    this.gl = gl;
    setGl(gl);

    gl.clearColor(0, 0, 0, 1);

    gl.frontFace(gl.CW);
    gl.cullFace(gl.BACK);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    this.mainCamera = new Camera(toRadians(70), width / height, 0.1, 1000);
  }

  private clearLightsList() {
    this.lights = [];
  }

  render(object: GameObject) {
    this.clearScreen();

    this.clearLightsList();
    object.addToRenderingEngine(this);

    setGl(gl);

    object.render(ForwardAmbient.instance, this);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.depthMask(false);
    gl.depthFunc(gl.EQUAL);

    for (const light of this.lights) {
      this.activeLight = light;
      object.render(light.shader, this);
    }

    gl.depthFunc(gl.LESS);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
  }

  clearScreen() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  getVersion() {
    return this.gl.getParameter(this.gl.VERSION);
  }

  unbindTextures() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, 0);
  }

  resize(width: number, height: number) {
    this.gl.viewport(0, 0, width, height);
    this.mainCamera.aspect = width / height;
  }

  addCamera(camera: Camera) {
    this.mainCamera = camera;
  }
}
