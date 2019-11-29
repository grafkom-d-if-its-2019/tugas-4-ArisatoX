precision mediump float;

attribute vec2 vPositionLeft, vPositionRight, vPositionMid;
attribute vec3 vColorLeft, vColorRight, vColorMid;
varying vec3 fColor;
uniform float theta, scaleX, scaleY, left, mid, right;

void main() {

  vec3 translateLeft = vec3(-0.4, 0.0, 0.0);
  vec3 translateRight = vec3(0.4, 0.0, 0.0);

  mat4 mTransformLeft = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    translateLeft, 1.0
  ); 

  mat4 mTransformRight = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    translateRight, 1.0
  ); 

  // Rotasi
  mat4 mRotate = mat4(
    cos(theta), sin(theta), 0.0, 0.0,
    -sin(theta), cos(theta), 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  );

  // Skalasi
  mat4 mScale = mat4(
    scaleX, 0.0, 0.0, 0.0,
    0.0, scaleY, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0 
  );

  if(left == 1.0)
  {
    fColor= vColorLeft;
    gl_Position = mTransformLeft * mRotate * vec4(vPositionLeft, 0.0, 1.0);
  }
  else if (mid == 1.0)
  {
    fColor= vColorMid;
    gl_Position = mTransformLeft * mRotate * vec4(vPositionMid, 0.0, 1.0);
  }
  else if (right == 1.0)
  {
    fColor = vColorRight;
    gl_Position = mTransformRight * mScale * vec4(vPositionRight, 0.0, 1.0);
  }

}
