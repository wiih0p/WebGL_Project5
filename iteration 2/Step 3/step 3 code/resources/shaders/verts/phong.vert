#version 300 es

//out vec4 Color;

out vec4 vPosition;
out vec3 vNormal;

in vec3 aVertexPosition;
in vec3 aVertexNormal;

// Uniform matrices
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;

void main() {

  //same as the gouraud vert but not doing any of the light and just passing the position and normal to frag  
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vPosition = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vNormal = vec3(transpose(inverse((uModelMatrix))) * vec4(aVertexNormal, 0.0));
}