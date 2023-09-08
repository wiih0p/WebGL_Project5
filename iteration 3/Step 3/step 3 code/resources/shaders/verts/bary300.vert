#version 300 es // These is an OpenGL ES 3.0 Shader!

in vec3 aVertexPosition;
in vec3 aBarycentricCoord;

out vec3 outColor;
out vec3 outBary;


uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  // gl_Position is still reserved in this version of GLSL :
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
  outColor = vec3(1.0, 1.0, 1.0);
  outBary = aBarycentricCoord;
}