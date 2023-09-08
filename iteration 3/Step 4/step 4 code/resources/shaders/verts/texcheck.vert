#version 300 es

//modified for textures from simple
//sending out vertex normal values for texture coords
in vec3 aVertexPosition;
in vec3 aVertexTexCoord;
in vec3 aVertexNormal;

out vec3 outTex;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {

  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
  outTex = aVertexNormal;
}