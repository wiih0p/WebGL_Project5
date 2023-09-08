#version 300 es

precision mediump float;
//in vec4 Color;

in vec4 vPosition;
in vec3 vNormal;
in vec2 Tex;

struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
}; 
  
Material material;

out vec4 fragColor;
uniform sampler2D sampler;

//updated phong shader for textures
//using my struct to easily switch the diffuse value to the texture color
void main() {
    
  vec4 color = texture(sampler, Tex);
  if(color.a < 0.1){
    discard;
  }

  material.ambient = vec3(0, 0, 0);
  material.diffuse = color.rgb;
  material.specular = vec3(5, 5, 5);
  material.shininess = 100.0;

  vec3 vLightPosition = normalize(-vPosition.xyz);
  vec3 lightColor = vec3(1.0, 1.0, 1.0);  
  
  vec3 ambient = material.ambient * lightColor;
  float NdotL = dot(vLightPosition, vNormal);
  float diffuse = 0.5 * NdotL + 0.5;
  vec3 diffuseResult = lightColor * (diffuse * material.diffuse);
  vec3 reflection = reflect(-vLightPosition, vNormal);
  float NdotH = clamp(dot(reflection, vNormal), 0.0, 1.0);
  float specular = pow(NdotH, material.shininess);
  vec3 specularResult = lightColor * (specular * material.specular);
  
  fragColor = vec4((ambient + diffuseResult + specularResult), 1.0);  
}