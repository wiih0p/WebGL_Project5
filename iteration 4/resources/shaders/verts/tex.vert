#version 100

//modified for textures from simple
attribute vec3 aVertexPosition;
attribute vec2 aVertexTexCoord;

varying vec2 outTex;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {

  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
  outTex = aVertexTexCoord;
}