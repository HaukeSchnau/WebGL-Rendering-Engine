import Camera from "../core/Camera";
import GameObject from "../core/GameObject";
import { toRadians } from "../math/MathUtils";
import BasicShader from "./BasicShader";

export let currentRenderingEngine: RenderingEngine;
export let gl: WebGLRenderingContext;

const setGl = (newGl: WebGLRenderingContext) => gl = newGl;

export default class RenderingEngine {
    gl: WebGLRenderingContext;
    mainCamera: Camera;

    constructor(gl: WebGLRenderingContext, width: number, height: number) {
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
        object.render(BasicShader.instance);
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