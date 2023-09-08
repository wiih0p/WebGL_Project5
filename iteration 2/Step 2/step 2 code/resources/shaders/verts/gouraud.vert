#version 300 es

//give color to frag
out vec4 Color;

//take in the normals and position and the uniform matrices
in vec3 aVertexPosition;
in vec3 aVertexNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;

//varying vec3 vNormal;

//make it easier to change materials with a handy struct
struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
}; 
Material material;

void main() {

  //set material attributes this one is polished gold from the writeup
  material.ambient = vec3	(0.24725, 0.2245, 0.0645);
  material.diffuse = vec3(0.34615, 0.3143, 0.0903);
  material.specular = vec3(0.797357, 0.723991, 0.208006);
  material.shininess = 83.2;

  //set gl_position like normal but adding vPosition to set the light pos
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vec4 vPosition = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vec3 vLightPosition = normalize(-vPosition.xyz);

  //calc the light normal and set color to white
  vec3 vNormal = vec3(transpose(inverse((uModelMatrix))) * vec4(aVertexNormal, 0.0));
  vec3 lightColor = vec3(1.0, 1.0, 1.0);  
  
  //set all of the light attributes (ivory example from slide was pog)
  vec3 ambient = material.ambient * lightColor;
  float NdotL = dot(vLightPosition, vNormal);
  float diffuse = 0.5 * NdotL + 0.5;
  vec3 diffuseResult = lightColor * (diffuse * material.diffuse);
  vec3 reflection = reflect(-vLightPosition, vNormal);
  float NdotH = clamp(dot(reflection, vNormal), 0.0, 1.0);
  float specular = pow(NdotH, material.shininess);
  vec3 specularResult = lightColor * (specular * material.specular);
  
  //output the color for frag
  Color = vec4((ambient + diffuseResult + specularResult), 1.0);
}