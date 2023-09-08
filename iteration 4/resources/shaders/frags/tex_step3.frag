#version 300 es

precision mediump float;
//in vec4 Color;

in vec4 vPosition;
in vec3 vNormal;
in vec2 Tex;
in mat3 normMap;

struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
}; 
  
Material material;

out vec4 fragColor;
uniform sampler2D dingus;
uniform sampler2D texo;

//updated phong shader for textures
//using my struct to easily switch the diffuse value to the texture color
void main() {
    
  //adding in the textures as samplers to overlay them
  vec3 color = texture(texo, Tex).rgb;  
  vec3 nMap = texture(dingus, Tex).rgb;
  //normal map calculations
  nMap = (nMap * 2.0 - 1.0);
  nMap = normalize(normMap * nMap);

  material.ambient = vec3(0,0,0);
  material.diffuse = color.rgb;
  material.specular = vec3(1, 1, 1);
  material.shininess = 300.0;

  vec3 vLightPosition = normalize(-vPosition.xyz);
  vec3 lightColor = vec3(1.0, 1.0, 1.0);  
  
  vec3 ambient = material.ambient * lightColor;
  float NdotL = dot(vLightPosition, nMap);
  float diffuse = 0.5 * NdotL + 0.5;
  vec3 diffuseResult = lightColor * (diffuse * material.diffuse);
  vec3 reflection = reflect(-vLightPosition, nMap);
  float NdotH = clamp(dot(reflection, nMap), 0.0, 1.0);
  float specular = pow(NdotH, material.shininess);
  vec3 specularResult = lightColor * (specular * material.specular);
  
  fragColor = vec4((ambient + diffuseResult + specularResult), 1.0);  
}