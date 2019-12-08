precision mediump float;

varying vec3 fNormal;
varying vec3 fPosition;
varying vec2 fTexCoord;
uniform sampler2D sampler0;

uniform vec3 diffuseColor;
uniform vec3 diffusePosition; // Titik sumber cahaya
uniform vec3 ambientColor;

varying vec3 fColor;
uniform float flag;
float specularLight;
float specular;

void main() {

  if(flag == 0.0)
  {
    vec3 diffuseDirection = normalize(diffusePosition - fPosition);
    float normalDotLight = max(dot(fNormal, diffuseDirection), 0.0);

    specularLight = 100.0;
    specular = 0.0;

    if (normalDotLight > 0.0) 
    {
      vec3 vv = vec3(0, 0, 1.0);
      vec3 rv = reflect(-diffuseDirection, fNormal);

      float specularFactor = max (dot(rv, vv), 0.0);
      specular = pow(specularFactor, specularLight);
    }

    vec4 textureColor = texture2D(sampler0, fTexCoord);

    vec3 diffuse = diffuseColor * textureColor.rgb * normalDotLight;
    vec3 ambient = ambientColor * textureColor.rgb;

    gl_FragColor = vec4(diffuse + ambient + specular, 1.0);
  }
  
  else if(flag == 1.0)
  {
    gl_FragColor = vec4(fColor, 1.0);
  }
  
}
