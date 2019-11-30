precision mediump float;

varying vec3 fNormal;
varying vec3 fPosition;
varying vec2 fTexCoord;
varying vec3 fColor;

uniform vec3 diffuseColor;
varying vec3 diffusePosition; // Titik sumber cahaya
uniform vec3 ambientColor;
float normalDotLight;

uniform sampler2D sampler0;
uniform float flag;

//Specular
uniform vec3 specularColor;
varying vec3 v_surfaceToView;
uniform float u_shininess;

void main() {

  if(flag == 0.0)
  {
    // Arah cahaya = lokasi titik verteks - lokasi titik sumber cahaya
    vec3 diffuseDirection = normalize(diffusePosition - fPosition);

    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    vec3 halfVector = normalize(diffuseDirection + surfaceToViewDirection);

    // Nilai intensitas cahaya 
    //  nilai COS sudut antara arah datang cahaya dengan arah vektor normal =
    //  dot product dari vektor arah datang cahaya • arah vektor normal
    normalDotLight = max(dot(fNormal, diffuseDirection), 0.0);

    float specularDotLight = 0.0;
    if (normalDotLight > 0.0) {
      specularDotLight = pow(dot(fNormal, halfVector), u_shininess);
    }

    // Untuk mendapatkan nilai warna (RGBA) dari tekstur
    vec4 textureColor = texture2D(sampler0, fTexCoord);

    vec3 diffuse = diffuseColor * textureColor.rgb * normalDotLight;
    vec3 ambient = ambientColor * textureColor.rgb;
    vec3 specular = specularColor * textureColor.rgb * specularDotLight;

    gl_FragColor = vec4(diffuse + ambient , 1.0);
  }
  
  else if(flag == 1.0)
  {
    gl_FragColor = vec4(fColor, 1.0);
  }
  
}
