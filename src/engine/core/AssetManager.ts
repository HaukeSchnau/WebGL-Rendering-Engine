import Vector2 from "../math/Vector2";
import Vector3 from "../math/Vector3";
import { Vertex } from "../rendering/Vertex";
import { removeEmptyStrings } from "./Util";

type Assets = {
  meshes: MeshAssets;
  shaders: ShaderAssets;
};

type ShaderAsset = {
  vertex: string;
  fragment: string;
};

type MeshAsset = {
  vertices: Vertex[];
  indices: number[];
};

interface ShaderAssets {
  [key: string]: ShaderAsset;
}

interface MeshAssets {
  [key: string]: MeshAsset;
}

const loadedAssets: Assets = {
  meshes: {},
  shaders: {},
};

async function loadTextFile(url: string) {
  return await fetch(url).then((res) => res.text());
}

export async function loadShader(name: string) {
  loadedAssets.shaders[name] = {
    vertex: await loadTextFile("/glsl/" + name + ".vs"),
    fragment: await loadTextFile("/glsl/" + name + ".fs"),
  };
}

export async function loadMesh(name: string) {
  const raw = await loadTextFile("/obj/" + name + ".obj");

  const vertices: Vertex[] = [];
  const indices: number[] = [];

  const lines = raw.split("\n");

  for (let line of lines) {
    let tokens = line.split(" ");
    tokens = removeEmptyStrings(tokens);

    if (tokens.length == 0 || tokens[0] === "#") {
      continue;
    } else if (tokens[0] === "v") {
      vertices.push(
        new Vertex(
          new Vector3(
            parseFloat(tokens[1]),
            parseFloat(tokens[2]),
            parseFloat(tokens[3])
          ),
          new Vector2(
            0,0
          ) // TODO
        )
      );
    } else if (tokens[0] === "f") {
      indices.push(
        parseInt(tokens[1]) - 1,
        parseInt(tokens[2]) - 1,
        parseInt(tokens[3]) - 1
      );
    }
  }

  addMesh(name, vertices, indices)
}

export function getVertexShader(name: string) {
  return loadedAssets.shaders[name].vertex;
}

export function getFragmentShader(name: string) {
  return loadedAssets.shaders[name].fragment;
}

export function getMesh(name: string) {
  return loadedAssets.meshes[name];
}

export function addMesh(name: string, vertices: Vertex[], indices: number[]) {
  loadedAssets.meshes[name] = {
    vertices,
    indices,
  };
}

export default {
  getVertexShader,
  getFragmentShader,
  loadShader,
  loadMesh,
  getMesh,
  addMesh,
};
