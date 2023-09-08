#version 300 es

precision mediump float;
//in vec4 Color;

//basically just the vert shader from gouraud makes the frag phong shader
in vec4 vPosition;
in vec3 vNormal;

//make it easier to change materials with a handy struct
struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
}; 
Material material;

out vec4 fragColor;

void main() {
    
  //set material attributes this one is chrome from the writeup  
  material.ambient = vec3(0.25, 0.25, 0.25);
  material.diffuse = vec3(0.4, 0.4, 0.4);
  material.specular = vec3(0.774597, 0.774597, 0.774597);
  material.shininess = 76.8;

  //this time we take in position as well as the light normal from vertex shader  
  vec3 vLightPosition = normalize(-vPosition.xyz);
  vec3 lightColor = vec3(1.0, 1.0, 1.0);  
  
  //same light calcs as before
  vec3 ambient = material.ambient * lightColor;
  float NdotL = dot(vLightPosition, vNormal);
  float diffuse = 0.5 * NdotL + 0.5;
  vec3 diffuseResult = lightColor * (diffuse * material.diffuse);
  vec3 reflection = reflect(-vLightPosition, vNormal);
  float NdotH = clamp(dot(reflection, vNormal), 0.0, 1.0);
  float specular = pow(NdotH, material.shininess);
  vec3 specularResult = lightColor * (specular * material.specular);
  
  //just set the frag color to the result
  fragColor = vec4((ambient + diffuseResult + specularResult), 1.0);  
}