import "./style.css";
import MyGame from "./game/MyGame";
import AssetManager from "./engine/core/AssetManager";

(async () => {

  await AssetManager.loadShader("basicShader");
  await AssetManager.loadMesh("monkey");

  const game = new MyGame();
  game.start();
})();
