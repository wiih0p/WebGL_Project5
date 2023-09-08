#version 300 es

precision mediump float;
in vec4 Color;

//just take color calced in vert and set it to the fragColor
out vec4 fragColor;

void main() {

  fragColor = Color;
}