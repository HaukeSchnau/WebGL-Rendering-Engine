export let gl: WebGLRenderingContext;

export function setGl(newGl: WebGLRenderingContext) {
  gl = newGl;
}

export function clearScreen() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export function initGraphics() {
  gl.clearColor(0, 0, 0, 1);

  gl.frontFace(gl.CW);
  gl.cullFace(gl.BACK);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
}

export function getVersion() {
  return gl.getParameter(gl.VERSION);
}

export function unbindTextures() {
  gl.bindTexture(gl.TEXTURE_2D, 0);
}
