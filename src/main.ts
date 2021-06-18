import "./style.css";
import { getTime } from "./util";
import Matrix4 from "./matrix4";

let canvas;
let gl: WebGLRenderingContext;

let lastRender: number = getTime();

function init() {
  canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
  gl = canvas.getContext("webgl")!;

  const identity = new Matrix4().initIdentity();
  console.log(identity);

  if (gl === null) {
    alert("WebGL konnte nicht intialisiert werden.");
    return;
  }
}

let time = 0;

function update(deltaTime: number) {
  gl.clearColor(Math.sin(time), Math.cos(time), Math.sin(time + 3.41), 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  time += deltaTime * 0.001;

  window.requestAnimationFrame(() => {
    const currentRender: number = getTime();
    const diff = currentRender - lastRender;

    lastRender = getTime();

    update(diff);
  });
}

init();
requestAnimationFrame(() => {
  update(1);
});
