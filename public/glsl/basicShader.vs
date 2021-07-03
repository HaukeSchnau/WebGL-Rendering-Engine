attribute vec3 position;
attribute vec2 texCoord;

uniform mat4 transform;

varying vec2 texCoord0;

void main() {
  texCoord0 = texCoord;
  gl_Position = transform * vec4(position, 1.0);
}