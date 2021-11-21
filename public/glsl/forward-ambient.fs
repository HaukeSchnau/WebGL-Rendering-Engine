precision mediump float;

varying vec2 texCoord0;

uniform vec3 ambientIntensity;
uniform sampler2D samplr;

void main() {
  gl_FragColor = texture2D(samplr, texCoord0.xy) * vec4(ambientIntensity, 1.0);
}