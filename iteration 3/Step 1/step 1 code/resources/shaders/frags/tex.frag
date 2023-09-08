#version 100 

//modified for texture from simple
precision mediump float;
varying vec2 outTex;
uniform sampler2D sampler;

void main() {

  gl_FragColor = texture2D(sampler, outTex);
}