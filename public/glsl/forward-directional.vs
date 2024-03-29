attribute vec3 position;
attribute vec2 texCoord;
attribute vec3 normal;

uniform mat4 model;
uniform mat4 MVP;

varying vec2 texCoord0;
varying vec3 normal0;
varying vec3 worldPos0;

void main() {
  texCoord0 = texCoord;
  normal0 = (model * vec4(normal, 0.0)).xyz;
  worldPos0 = (model * vec4(position, 1.0)).xyz;
  gl_Position = MVP * vec4(position, 1.0);
}