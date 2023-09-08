#version 100 

//modified for texture from simple
precision mediump float;
varying vec2 outTex;
uniform sampler2D sampler;

void main() {

  vec4 color = texture2D(sampler, outTex);
  if(color.a < 0.1){
    discard;
  }
  gl_FragColor = color;
}