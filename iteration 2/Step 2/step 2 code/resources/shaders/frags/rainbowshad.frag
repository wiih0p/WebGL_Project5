precision mediump float;

varying vec3 vNormal;

//set frag color to the absolute value of to normal value from vert
void main() {
  gl_FragColor = vec4(abs(vNormal), 1.0);
}