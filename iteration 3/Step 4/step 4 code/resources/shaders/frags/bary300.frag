#version 300 es // These is an OpenGL ES 3.0 Shader!

precision mediump float;

in vec3 outColor;
in vec3 outBary;

out vec4 fragColor;

float saturateF(float f) {
  return clamp(f, 0.0, 1.0);
}

float isOnTriangleEdge(vec3 b, float e){
  vec3 howClose = smoothstep(vec3(0.0), vec3(e), b);
  return saturateF(1.0 - min(min(howClose.x, howClose.y), howClose.z));
}

void main() {
  float ef = isOnTriangleEdge(outBary, 0.05);
  vec3 newColor = outColor;
  newColor.g *= ef;
  fragColor = vec4(newColor, 1.0);
}