precision mediump float;

//Cube
attribute vec3 vPosition;
attribute vec2 vTexCoord;
attribute vec3 vNormal;

varying vec3 fNormal;
varying vec3 fPosition;
varying vec2 fTexCoord;

uniform float theta;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;  // Berperan sebagai modelMatrix-nya vektor normal

//P
attribute vec3 vPositionP;
varying vec3 fColor;
attribute vec3 vColor;
uniform float scaleX, translateX, translateY, translateZ;

//Switch
uniform float flag;

//surfaceWorldPosition = fposition
//u_lightWorldPosition = diffuseposition
//surfaceToLightDirection = diffusedirection

varying vec3 diffusePosition;

//Specular
uniform vec3 u_viewWorldPosition;
varying vec3 v_surfaceToView;


void main() 
{
  vec3 translateP = vec3(translateX, translateY , translateZ);

  // compute the vector of the surface to the view/camera
  // and pass it to the fragment shader
  v_surfaceToView = u_viewWorldPosition - fPosition;

  mat4 mTransformP = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    translateP, 1.0
  ); 

  mat4 mScale = mat4(
    scaleX, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0 
  );

  diffusePosition = vec3(mTransformP * mScale * vec4(vPositionP, 1.0));

  if(flag == 0.0)
  {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vPosition, 1.0);

    // fColor = vColor;
    // Transfer koordinat tekstur ke fragment shader
    fTexCoord = vTexCoord;

    // Transfer vektor normal (yang telah ditransformasi) ke fragment shader
    fNormal = normalize(normalMatrix * vNormal);

    // Transfer posisi verteks
    fPosition = vec3(modelMatrix * vec4(vPosition, 1.0));

  }
  else if(flag == 1.0)
  {
    fColor = vColor;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * mTransformP * mScale * vec4(vPositionP, 1.0);

  }
  
}
