attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec3 vNormal;

//same as bary shaders but normalized and no barymetric attributes
void main() {
  
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vNormal = normalize(aVertexNormal);
}