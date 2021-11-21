import Camera from "../core/Camera";
import GameObject from "../core/GameObject";
import { toRadians } from "../math/MathUtils";
import Vector3 from "../math/Vector3";
import Attenuation from "./Attenuation";
import BaseLight from "./BaseLight";
import DirectionalLight from "./DirectionalLight";
import ForwardAmbient from "./ForwardAmbient";
import ForwardDirectional from "./ForwardDirectional";
import ForwardPoint from "./ForwardPoint";
import ForwardSpot from "./ForwardSpot";
import PointLight from "./PointLight";
import SpotLight from "./SpotLight";

export let currentRenderingEngine: RenderingEngine;
export let gl: WebGL2RenderingContext;

const setGl = (newGl: WebGL2RenderingContext) => (gl = newGl);

export default class RenderingEngine {
  gl: WebGL2RenderingContext;
  mainCamera: Camera;
  ambientLight: Vector3 = new Vector3(0.2, 0.2, 0.2);
  directionalLight = new DirectionalLight(
    new BaseLight(new Vector3(1, 1, 1), 0.4),
    new Vector3(1, 1, 1)
  );
  pointLight = new PointLight(
    new BaseLight(new Vector3(0, 1, 0), 0.4),
    new Attenuation(0, 0, 1),
    new Vector3(1, 0, 5),
    100
  );
  spotLight = new SpotLight(
    new PointLight(
      new BaseLight(new Vector3(1, 0, 0), 0.6),
      new Attenuation(0, 0, 1),
      new Vector3(1, 0, 5),
      100
    ),
    new Vector3(-1, 0, 0),
    0.2
  );

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

  render(object: GameObject) {
    this.clearScreen();

    currentRenderingEngine = this;
    setGl(gl);

    object.render(ForwardAmbient.instance);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.depthMask(false);
    gl.depthFunc(gl.EQUAL);

    object.render(ForwardDirectional.instance);
    object.render(ForwardPoint.instance);
    object.render(ForwardSpot.instance);

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
}
