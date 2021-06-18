import "./style.css";
import { getTime } from "./util";
import Mesh from "./mesh";
import { clearScreen, getVersion, gl, initGraphics, setGl } from "./glUtil";
import { Vertex } from "./vertex";
import Vector3 from "./vector3";
import Shader from "./shader";
import Transform from "./transform";
import Camera from "./camera";
import { isKeyDown, onKeyDown, onKeyUp } from "./input";
import Vector2 from "./vector2";

let canvas: HTMLCanvasElement;
let triangle: Mesh;
let shader: Shader;
let transform: Transform;
let camera: Camera;

let lastRender: number = getTime();

function resize(width: number, height: number) {
  canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

  canvas.width = width;
  canvas.height = height;

  gl.viewport(0, 0, width, height);
  Transform.setProjection(70, width, height, 0.1, 1000);
}

async function init() {
  canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
  canvas.onclick = () => {
    canvas.requestPointerLock();
  };

  setGl(canvas.getContext("webgl")!);
  console.log(getVersion());

  resize(window.innerWidth, window.innerHeight);

  if (gl === null) {
    alert("WebGL konnte nicht intialisiert werden.");
    return;
  }

  initGraphics();

  shader = await Shader.fromName("basicShader", ["position"], ["transform"]);

  // const vertices: Vertex[] = [
  //   new Vertex(new Vector3(-1, -1, 0)),
  //   new Vertex(new Vector3(0, 1, 0)),
  //   new Vertex(new Vector3(1, -1, 0)),
  //   new Vertex(new Vector3(0, -1, 1)),
  // ];
  // // prettier-ignore
  // const indices: number[] = [
  //   0,1,3,
  //   3,1,2,
  //   2,1,0,
  //   0,2,3
  // ];
  // triangle = new Mesh(vertices, indices);

  triangle = await Mesh.loadMesh("monkey.obj");

  transform = new Transform();
  camera = new Camera();
  Transform.camera = camera;
}

let time = 0;
let yVelocity = 0;

function update(deltaTime: number) {
  const sinTemp = Math.sin(time);
  // transform.translation.x = Math.sin(time);
  // transform.translation.y = Math.cos(time);
  // transform.translation.z = 2;
  // transform.rotation.y = Math.sin(time) * 180;
  // transform.scale = new Vector3(sinTemp * 0.5, sinTemp * 0.5, sinTemp * 0.5);

  const xz = new Vector3(1, 0, 1);

  const speed = 5;
  if (isKeyDown("KeyW")) {
    camera.move(camera.forward.mul(xz), speed * deltaTime);
  }
  if (isKeyDown("KeyA")) {
    camera.move(camera.left.mul(xz), speed * deltaTime);
  }
  if (isKeyDown("KeyS")) {
    camera.move(camera.forward.mul(xz), -speed * deltaTime);
  }
  if (isKeyDown("KeyD")) {
    camera.move(camera.left.mul(xz), -speed * deltaTime);
  }
  if (isKeyDown("Space") && camera.pos.y <= 0) {
    yVelocity = 10;
  }

  yVelocity -= 0.2;
  if (camera.pos.y < 0) {
    camera.pos.y = -0.1;
    if (yVelocity < 0) yVelocity = 0;
  }

  camera.move(Camera.yAxis, yVelocity * deltaTime);

  time += deltaTime;
}

function render() {
  clearScreen();

  shader.bind();
  shader.setUniform("transform", transform.getProjectedTransformation());
  triangle.draw();
}

function loop() {
  const currentRender: number = getTime();
  const diff = currentRender - lastRender;

  update(diff * 0.001);
  render();

  lastRender = getTime();
  // console.log(diff);

  requestAnimationFrame(loop);
}

window.onresize = () => {
  resize(window.innerWidth, window.innerHeight);
};

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

await init();
requestAnimationFrame(loop);

function updatePosition(e: MouseEvent) {
  const movement = new Vector2(e.movementX, e.movementY);
  camera.rotateX(movement.x * 0.07);
  camera.rotateY(movement.y * 0.07);
}

function lockChangeAlert() {
  if (document.pointerLockElement === canvas) {
    console.log("The pointer lock status is now locked");
    document.addEventListener("mousemove", updatePosition, false);
  } else {
    console.log("The pointer lock status is now unlocked");
    document.removeEventListener("mousemove", updatePosition, false);
  }
}

document.addEventListener("pointerlockchange", lockChangeAlert, false);
