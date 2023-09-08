#version 300 es

// Output to the fragment shader
out vec4 Color;
out vec3 Tex;
out float fog;

//just added the texture values so we pass those too
in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec3 aVertexTexCoord;

// Uniform matrices
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;

//varying vec3 vNormal;

struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
}; 
  
Material material;

void main() {

  material.ambient = vec3(1, 1, 1);
  material.diffuse = vec3(1, 1, 1);
  material.specular = vec3(10, 10, 10);
  material.shininess = 100.0;

  // Transform the vertex position to clip space
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vec4 vPosition = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vec3 vLightPosition = normalize(-vPosition.xyz);

  vec3 vNormal = vec3(transpose(inverse((uModelMatrix))) * vec4(aVertexNormal, 0.0));
  vec3 lightColor = vec3(1.0, 1.0, 1.0);  
  
  vec3 ambient = material.ambient * lightColor;
  float NdotL = dot(vLightPosition, vNormal);
  float diffuse = 0.5 * NdotL + 0.5;
  vec3 diffuseResult = lightColor * (diffuse * material.diffuse);
  vec3 reflection = reflect(-vLightPosition, vNormal);
  float NdotH = clamp(dot(reflection, vNormal), 0.0, 1.0);
  float specular = pow(NdotH, material.shininess);
  vec3 specularResult = lightColor * (specular * material.specular);

  Tex = aVertexNormal;
  fog = -(uModelViewMatrix * vec4(aVertexPosition, 1.0)).z;
  Color = vec4((ambient + diffuseResult + specularResult), 1.0);
}