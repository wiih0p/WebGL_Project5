#version 300 es

//updated gouraud for textures discarding the frags less than 0.1
precision mediump float;
in vec4 Color;
in vec2 Tex;

out vec4 fragColor;

uniform sampler2D sampler;

void main() {

  vec4 color = texture(sampler, Tex);
  if(color.a < 0.1){
    discard;
  }

//then frag color is just the texture times the light values from vert
  fragColor = vec4(color * Color);
}