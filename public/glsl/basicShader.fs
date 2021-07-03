precision mediump float;

varying vec2 texCoord0;

uniform vec3 color;
uniform sampler2D samplr;

void main() {
  gl_FragColor = texture2D(samplr, texCoord0.xy) * vec4(color, 1.0);
}