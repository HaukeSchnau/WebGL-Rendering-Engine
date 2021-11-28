import "./style.css";
import MyGame from "./game/MyGame";
import AssetManager from "./engine/core/AssetManager";
import { Vertex } from "./engine/rendering/Vertex";
import Vector3 from "./engine/math/Vector3";
import Vector2 from "./engine/math/Vector2";

(async () => {
  await AssetManager.loadShader("forward-ambient");
  await AssetManager.loadShader("forward-directional");
  await AssetManager.loadShader("forward-point");
  await AssetManager.loadShader("forward-spot");
  await AssetManager.loadMesh("monkey");
  await AssetManager.loadMesh("sphere");

  const vertices = [
    new Vertex(new Vector3(-1.0, -1.0, 0.5773), new Vector2(0, 0)),
    new Vertex(new Vector3(0.0, -1.0, -1.15475), new Vector2(0.5, 0)),
    new Vertex(new Vector3(1.0, -1.0, 0.5773), new Vector2(1, 0)),
    new Vertex(new Vector3(0, 1, 0), new Vector2(0.5, 1)),
  ];

  // prettier-ignore
  const indices = [
    0, 3, 1,
    1, 3, 2,
    2, 3, 0,
    1, 2, 0
  ];

  AssetManager.addMesh("pyramid", vertices, indices);

  const fieldDepth = 10;
  const fieldWidth = 10;
  const verticesPlane = [
    new Vertex(new Vector3(-fieldWidth, -2, -fieldDepth), new Vector2(0, 0)),
    new Vertex(new Vector3(-fieldWidth, -2, fieldDepth * 3), new Vector2(0, 1)),
    new Vertex(new Vector3(fieldWidth * 3, -2, -fieldDepth), new Vector2(1, 0)),
    new Vertex(
      new Vector3(fieldWidth * 3, -2, fieldDepth * 3),
      new Vector2(1, 1)
    ),
  ];

  // prettier-ignore
  const indicesPlane = [
    0, 1, 2,
    2, 1, 3
  ];

  AssetManager.addMesh("plane", verticesPlane, indicesPlane);

  const game = new MyGame();
  game.start();
})();
