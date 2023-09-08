#version 300 es

//modified for texture from simple
//this time using samplercube instead of sampler2d
//also using normal values instead of tex coords
precision mediump float;
in vec3 outTex;
uniform samplerCube cubo;

out vec4 fragColor;
void main() {

  vec4 color = texture(cubo, normalize(outTex));
  if(color.a < 0.1){
    discard;
  }
  fragColor = color;
}