#version 300 es

//same as before
//out vec4 Color;

out vec4 vPosition;
out vec3 vNormal;
out vec2 Tex;
//this is for the normalmap calcs
out mat3 normMap;

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

  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vPosition = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  
  //making a mat3 to use in frag shader using these calcs for world space then passing to frag
  vec3 T = (vec3(uModelMatrix * vec4(aVertexTangent, 0.0)));
  vec3 B = (vec3(uModelMatrix * vec4(aVertexBiTangent, 0.0)));
  vec3 N = (vec3(uModelMatrix * vec4(aVertexNormal, 0.0)));
  normMap = mat3(T, B, N);
  vNormal = vec3(transpose(inverse((uModelMatrix))) * vec4(aVertexNormal, 0.0));
  Tex = aVertexTexCoord;

}