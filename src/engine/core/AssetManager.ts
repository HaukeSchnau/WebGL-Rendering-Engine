import ObjModel from "../rendering/loader/mesh/ObjModel";
import Vertex from "../rendering/Vertex";

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

function loadTextFile(url: string) {
  return fetch(url).then((res) => res.text());
}

export async function loadShader(name: string) {
  loadedAssets.shaders[name] = {
    vertex: await loadTextFile(`/glsl/${name}.vs`),
    fragment: await loadTextFile(`/glsl/${name}.fs`),
  };
}

export async function loadMesh(name: string) {
  const raw = await loadTextFile(`/obj/${name}.obj`);

  const objModel = new ObjModel(raw);
  const indexedModel = objModel.toIndexedModel();
  indexedModel.calcNormals();

  const vertices = indexedModel.positions.map(
    (_, i) =>
      new Vertex(
        indexedModel.positions[i],
        indexedModel.texCoords[i],
        indexedModel.normals[i]
      )
  );

  addMesh(name, vertices, indexedModel.indices);
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
