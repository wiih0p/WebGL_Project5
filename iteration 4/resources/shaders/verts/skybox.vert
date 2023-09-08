#version 300 es

//same as before
//out vec4 Color;

out vec4 vPosition;

//taking in the tan and bitan now
in vec2 aVertexTexCoord;
in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec3 aVertexTangent;
in vec3 aVertexBiTangent;

// Uniform matrices
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;

//updated phong shader to work with textures
void main() {

  vPosition = aVertexPosition;
  gl_Position = aVertexPosition;
  gl_Position.z = 1.0;

}