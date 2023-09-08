#version 300 es

//updated gouraud for textures discarding the frags less than 0.1
precision mediump float;
in vec4 Color;
in vec3 Tex;
in float fog;

vec4 origcolor;
vec4 fogcolor;
float fogamt;

out vec4 fragColor;

uniform samplerCube cubungus;

void main() {

  vec4 color = texture(cubungus, normalize(Tex));
  if(color.a < 0.1){
    discard;
  }

//#justfogthings
  origcolor = vec4(color * Color);
  fogcolor = vec4(100.0, 0.0, 100.0, 1.0);
  fogamt = smoothstep(15.0, 30.0, fog);
//then frag color is just the texture times the light values from vert
  fragColor = origcolor + (fogcolor - origcolor) * fogamt;
}