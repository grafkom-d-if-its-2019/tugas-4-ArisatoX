precision mediump float;

//Cube
attribute vec3 vPosition;
attribute vec3 vColor;
attribute vec3 vNormal;

varying vec3 fColor;

uniform float theta;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;  //Posisi kamera
uniform mat4 modelMatrix;

uniform vec3 diffuseColor;
uniform vec3 diffuseDirection;
uniform mat3 normalMatrix;  //Berperan sebagai modelMatrix vector normal
uniform vec3 ambientColor;

//P
attribute vec3 vPositionP;
attribute vec3 vColorP;
uniform float scaleX, scaleY, translateX, translateY, translateZ;

//Switch
uniform float flag;

void main() 
{
  vec3 translateP = vec3(translateX, translateY , translateZ);

  mat4 mTransformP = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    translateP, 1.0
  ); 

  mat4 mScale = mat4(
    scaleX, 0.0, 0.0, 0.0,
    0.0, scaleY, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0 
  );

  if(flag == 0.0)
  {
    fColor = vColor;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vPosition, 1.0);


  }
  else if(flag == 1.0)
  {
    fColor = vColorP;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * mTransformP * mScale * vec4(vPositionP, 1.0);
  }
  
}
