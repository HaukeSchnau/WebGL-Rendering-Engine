import Vector2 from "../math/Vector2";
import RenderingEngine from "../rendering/RenderingEngine";
import GameObject from "./GameObject";
import { onKeyDown, onKeyUp } from "./Input";
import { getTime, SECOND, sleep } from "./Util";

export default abstract class Game {
  private static readonly MS_PER_UPDATE = 16;

  private lastTime = getTime();
  private unprocessedTime = 0;

  private frames = 0;
  private frameCounter = 0;

  private canvas: HTMLCanvasElement;
  private isRunning = false;

  root: GameObject = new GameObject();
  private renderingEngine: RenderingEngine;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.onclick = () => {
      canvas.requestPointerLock();
    };

    const context = this.canvas.getContext("webgl");
    if (context === null) {
      throw Error("WebGL konnte nicht intialisiert werden.");
    }

    const { innerWidth: width, innerHeight: height } = window;
    this.renderingEngine = new RenderingEngine(context, width, height);
    this.onResize(width, height);

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
      this.renderingEngine.render(this.root);
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

    this.renderingEngine.resize(width, height);
  }

  update(_deltaTime: number) {
    this.root.update();
  };
  onMouseMove(movement: Vector2) {
    this.root.input(movement);
  };

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
