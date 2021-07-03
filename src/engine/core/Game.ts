import Vector2 from "../math/Vector2";
import { getVersion, gl, initGraphics, setGl } from "../rendering/GraphicsUtil";
import { onKeyDown, onKeyUp } from "./Input";
import Transform from "./Transform";
import { getTime, SECOND, sleep } from "./Util";

export default abstract class Game {
  private static readonly MS_PER_UPDATE = 16;

  private lastTime = getTime();
  private unprocessedTime = 0;

  private frames = 0;
  private frameCounter = 0;

  private canvas: HTMLCanvasElement;
  private isRunning = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.onclick = () => {
      canvas.requestPointerLock();
    };

    setGl(this.canvas.getContext("webgl")!);
    console.log(getVersion());

    this.onResize(window.innerWidth, window.innerHeight);

    if (gl === null) {
      alert("WebGL konnte nicht intialisiert werden.");
      return;
    }

    initGraphics();
    document.addEventListener("pointerlockchange", this.lockChangeAlert, false);

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    window.addEventListener("resize", () => {
      this.onResize(window.innerWidth, window.innerHeight);
    });
  }

  start() {
    this.isRunning = true;

    requestAnimationFrame(this.loop);
  }

  private loop = async () => {
    if (!this.isRunning) return;

    let shouldRender = false;

    const startTime = getTime();
    const passedTime = startTime - this.lastTime;
    this.lastTime = startTime;

    this.unprocessedTime += passedTime;
    this.frameCounter += passedTime;

    while (this.unprocessedTime >= Game.MS_PER_UPDATE) {
      this.unprocessedTime -= Game.MS_PER_UPDATE;

      this.update(Game.MS_PER_UPDATE / SECOND);

      shouldRender = true;

      if (this.frameCounter >= SECOND) {
        console.log(this.frames);
        this.frames = 0;
        this.frameCounter = 0;
      }
    }
    if (shouldRender || true) {
      this.render();
      this.frames++;
    } else {
      await sleep(1);
    }

    requestAnimationFrame(this.loop);
  };

  onResize(width: number, height: number) {
    this.canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

    this.canvas.width = width;
    this.canvas.height = height;

    gl.viewport(0, 0, width, height);
    Transform.setProjection(70, width, height, 0.1, 1000);
  }

  abstract update(deltaTime: number): void;
  abstract render(): void;
  abstract onMouseMove(movement: Vector2): void;

  private mousemove = (e: MouseEvent) => {
    const movement = new Vector2(e.movementX, e.movementY);
    this.onMouseMove(movement);
  };

  private lockChangeAlert = () => {
    if (document.pointerLockElement === this.canvas) {
      console.log("The pointer lock status is now locked");
      document.addEventListener("mousemove", this.mousemove, false);
    } else {
      console.log("The pointer lock status is now unlocked");
      document.removeEventListener("mousemove", this.mousemove, false);
    }
  };
}
