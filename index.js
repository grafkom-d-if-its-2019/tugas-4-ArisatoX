(function() {

  var canvas, gl, vertexShader, fragmentShader, program,
  thetaSpeed, axis, x, y, z, n1, n2,
  mmLoc, mm, vmLoc, vm, pmLoc, pm, camera, nmLoc, dc, dd, ac, dcLoc, ddLoc, acLoc, vPositionP,
  flagUniformLocation, flag, scaleXUniformLocation, scaleX,
  translateX, translateXUniformLocation, translateY, translateYUniformLocation, translateZ, translateZUniformLocation,
  animationX, animationY, animationZ,
  AMORTIZATION, drag, old_x, old_y, dX, dY,
  THETA, PHI, time_old;
  
  // Vertex Cube
  var vertices = [];

  var cubePoints = [
    [ -0.8, -0.8,  0.8 ],
    [ -0.8,  0.8,  0.8 ],
    [  0.8,  0.8,  0.8 ],
    [  0.8, -0.8,  0.8 ],
    [ -0.8, -0.8, -0.8 ],
    [ -0.8,  0.8, -0.8 ],
    [  0.8,  0.8, -0.8 ],
    [  0.8, -0.8, -0.8 ]
  ];
  var cubeColors = [
    [],
    [1.0, 0.0, 0.0], // merah
    [0.0, 1.0, 0.0], // hijau
    [0.0, 0.0, 1.0], // biru
    [1.0, 1.0, 1.0], // putih
    [1.0, 0.5, 0.0], // oranye
    [1.0, 1.0, 0.0], // kuning
    []
  ];
  var cubeNormals = [
    [],
    [  0.0,  0.0,  1.0 ], // depan
    [  1.0,  0.0,  0.0 ], // kanan
    [  0.0, -1.0,  0.0 ], // bawah
    [  0.0,  0.0, -1.0 ], // belakang
    [ -1.0,  0.0,  0.0 ], // kiri
    [  0.0,  1.0,  0.0 ], // atas
    []
  ];

  // Vertex P
  var vertices5 = [],
  vertices6 = [
    
  -0.07, -0.1, 0.0, 1.0, 0.5, 0.0, 
  -0.07, 0.4, 0.0, 1.0, 0.5, 0.0,
  -0.13, -0.1, 0.0, 1.0, 0.5, 0.0,
  -0.07, 0.4, 0.0, 1.0, 0.5, 0.0,
  -0.13, 0.3, 0.0, 1.0, 0.5, 0.0,
  -0.13, 0.4, 0.0, 1.0, 0.5, 0.0,
  -0.07, 0.35, 0.0, 1.0, 0.5, 0.0
  
  ];

  //Quad
  function quad(a, b, c, d) {
    var indices = [a, b, c, a, c, d];
    for (var i=0; i < indices.length; i++) {
      for (var j=0; j < 3; j++) {
        vertices.push(cubePoints[indices[i]][j]);
      }
      for (var j=0; j < 3; j++) {
        vertices.push(cubeColors[a][j]);
      }
      for (var j=0; j < 3; j++) {
        vertices.push(-1*cubeNormals[a][j]);
      }
      switch (indices[i]) {
        case a:
          vertices.push(0.0);
          vertices.push(0.0);
          break;
        case b:
          vertices.push(0.0);
          vertices.push(1.0);
          break;
        case c:
          vertices.push(1.0);
          vertices.push(1.0);
          break;
        case d:
          vertices.push(1.0);
          vertices.push(0.0);
          break;
      
        default:
          break;
      }
    }
  }

  // GL Size
  function initGlSize() {
    var width = canvas.getAttribute("width"), height = canvas.getAttribute("height");
    if (width) {
      gl.maxHeight = height;
    }
    if (height) {
      gl.maxHeight = height;
    }
  }

  // Kontrol menggunakan keyboard
  // function onKeyDown(event) {

  //   //Chrome Configuration
  //   if (event.keyCode == 189) thetaSpeed -= 0.01;       // key '-'
  //   else if (event.keyCode == 187) thetaSpeed += 0.01;  // key '='
  //   else if (event.keyCode == 48) thetaSpeed = 0;       // key '0'

  //   if (event.keyCode == 55) axis[x] = !axis[x];        //Key 7
  //   if (event.keyCode == 56) axis[y] = !axis[y];        //Key 8
  //   if (event.keyCode == 57) axis[z] = !axis[z];        //Key 9

  //   if (event.keyCode == 45) camera.z -= 0.1;           //Numpad 5
  //   else if (event.keyCode == 12) camera.z += 0.1;      //Numpad 0

  //   if (event.keyCode == 38) camera.y -= 0.1;           // Numpad atas 
  //   else if (event.keyCode == 40) camera.y += 0.1;      // Numpad Bawah

  //   if (event.keyCode == 37) camera.x -= 0.1;           //Numpad Kiri
  //   else if (event.keyCode == 39) camera.x += 0.1;      // Numpad Kanan
  // }

  //Control With Mouse

  function mouseControl()
  {
    AMORTIZATION = 0.95;
    drag = false;
    dX = 0; 
    dY = 0;

    var mouseDown = function(e) {
      drag = true;
      old_x = e.pageX, old_y = e.pageY;
      e.preventDefault();
      return false;
    };

    var mouseUp = function(e){
      drag = false;
    };

    var mouseMove = function(e) {
      if (!drag) return false;
      dX = (e.pageX-old_x)*2*Math.PI/canvas.width,
      dY = (e.pageY-old_y)*2*Math.PI/canvas.height;
      THETA+= dX;
      PHI+=dY;
      old_x = e.pageX, old_y = e.pageY;
      e.preventDefault();
    };

    document.addEventListener("mousedown", mouseDown, false);
    document.addEventListener("mouseup", mouseUp, false);
    document.addEventListener("mouseout", mouseUp, false);
    document.addEventListener("mousemove", mouseMove, false);
  }

  function rotateX(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv1 = m[1], mv5 = m[5], mv9 = m[9];

    m[1] = m[1]*c-m[2]*s;
    m[5] = m[5]*c-m[6]*s;
    m[9] = m[9]*c-m[10]*s;

    m[2] = m[2]*c+mv1*s;
    m[6] = m[6]*c+mv5*s;
    m[10] = m[10]*c+mv9*s;
 }

 function rotateY(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv0 = m[0], mv4 = m[4], mv8 = m[8];

    m[0] = c*m[0]+s*m[2];
    m[4] = c*m[4]+s*m[6];
    m[8] = c*m[8]+s*m[10];

    m[2] = c*m[2]-s*mv0;
    m[6] = c*m[6]-s*mv4;
    m[10] = c*m[10]-s*mv8;
 }
  

// Fill the buffer with texture coordinates the cube.
function setTexcoords(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(
        [
        // select the top left image
        0   , 0  ,
        0   , 0.5,
        0.25, 0.5,
        0   , 0  ,
        0.25, 0.5,
        0.25, 0  ,
        
        // select the top middle image
        0.25 , 0.0,
        0.25 , 0.5,
        0.5  , 0.5,
        0.25 , 0.0,
        0.5  , 0.5,
        0.5  , 0.0,

        // select to top right image
        0.5 , 0  ,
        0.5 , 0.5,
        0.75, 0.5,
        0.5 , 0  ,
        0.75, 0.5,
        0.75, 0  ,

        // select the bottom left image
        0   , 0.5,
        0   , 1  ,
        0.25, 1  ,
        0   , 0.5,
        0.25, 1  ,
        0.25, 0.5,

        // select the bottom middle image
        0.25, 0.5,
        0.25, 1  ,
        0.5 , 1  ,
        0.25, 0.5,
        0.5 , 1  ,
        0.5 , 0.5,

      ]),
      gl.STATIC_DRAW);
}

  function initTexture(gl)
  {
    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    // Set Texcoords.
    setTexcoords(gl);

    var vTexCoord = gl.getAttribLocation(program, 'vTexCoord');

    gl.enableVertexAttribArray(vTexCoord);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
      vTexCoord, size, type, normalize, stride, offset
    );

    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));
    
    // Asynchronously load an image
    var image = new Image();
    image.src = "images/final.jpg";
    image.addEventListener('load', function() {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
    });

  }

  //Init Buffer Cube
  function initBuffers(gl, vertices) {

  // Membuat vertex buffer object (CPU Memory <==> GPU Memory)
  var vertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Membuat sambungan untuk attribute

  var vPosition = gl.getAttribLocation(program, 'vPosition');
  var vNormal = gl.getAttribLocation(program, 'vNormal');
  // var vTexCoord = gl.getAttribLocation(program, 'vTexCoord');
    
  ntotal = vertices.length / 6;

  //Attrib Pointer
  gl.vertexAttribPointer(
    vPosition,    // variabel yang memegang posisi attribute di shader
    3,            // jumlah elemen per atribut
    gl.FLOAT,     // tipe data atribut
    gl.FALSE, 
    11 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap verteks (overall) 
    0                                   // offset dari posisi elemen di array
  );

  gl.vertexAttribPointer(
    vNormal, 
    3, 
    gl.FLOAT, 
    gl.FALSE,
    11 * Float32Array.BYTES_PER_ELEMENT, 
    6 * Float32Array.BYTES_PER_ELEMENT
  );

  // gl.vertexAttribPointer(
  //   vTexCoord, 
  //   2, 
  //   gl.FLOAT, 
  //   gl.FALSE,
  //   11 * Float32Array.BYTES_PER_ELEMENT, 
  //   9 * Float32Array.BYTES_PER_ELEMENT
  // );
  
  gl.enableVertexAttribArray(vPosition);
  gl.enableVertexAttribArray(vNormal);
  // gl.enableVertexAttribArray(vTexCoord);

  return ntotal;
  }

  //Init Buffer P
  function initBuffers2(gl, vertices, vertices2, x, y1, y2) {
    
    var vertexBuffer = gl.createBuffer();
    //Filling
    vertices = vertices.concat(vertices2);

    for (var i=0.0; i<=180; i+=1) {
    var j = i * Math.PI / 180;
    var vert1 = [
      Math.sin(j) * x + y1,
      Math.cos(j) * x + y2,
      0.0, 1.0, 0.5, 0.0
    ];
    var vert2 = [
      Math.sin(j) * 0.5 * x + y1,
      Math.cos(j) * 0.5 * x + y2,
      0.0, 1.0, 0.5, 0.0
    ];
    
    vertices = vertices.concat(vert1);
    vertices = vertices.concat(vert2);
    
    }

    var ntotal = vertices.length / 6;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    vPositionP = gl.getAttribLocation(program, 'vPositionP');
    var vColor = gl.getAttribLocation(program, 'vColor');

    gl.vertexAttribPointer(
      vPositionP,  // variabel yang memegang posisi attribute di shader
      3,          // jumlah elemen per attribute
      gl.FLOAT,   // tipe data attribute
      gl.FALSE,   
      6 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap vertex (overall)
      0                                   // offset dari posisi elemen di array
    );

    gl.vertexAttribPointer(
      vColor, 
      3, 
      gl.FLOAT, 
      gl.FALSE,
      6 * Float32Array.BYTES_PER_ELEMENT, 
      3 * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(vPositionP);
    gl.enableVertexAttribArray(vColor);

    return ntotal;
  }

  function draw() 
  {
    //Mouse Rotation
    THETA = 0,
    PHI = 0;
    time_old = 0;

    // Membuat sambungan untuk uniform
    thetaUniformLocation = gl.getUniformLocation(program, 'theta');
    theta = 0;
    thetaSpeed = 0.0;
    axis = [true, true, true];
    x = 0;
    y = 1;
    z = 2;

    // Definisi untuk matriks model
    mmLoc = gl.getUniformLocation(program, 'modelMatrix');
    mm = glMatrix.mat4.create();
    glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -2.0]);

    // Definisi untuk matrix view dan projection
    vmLoc = gl.getUniformLocation(program, 'viewMatrix');
    vm = glMatrix.mat4.create();
    pmLoc = gl.getUniformLocation(program, 'projectionMatrix');
    pm = glMatrix.mat4.create();
    camera = {x: 0.0, y: 0.0, z:0.0};
    glMatrix.mat4.perspective(pm,
      glMatrix.glMatrix.toRadian(90), // fovy dalam radian
      canvas.width/canvas.height,     // aspect ratio
      0.5,  // near
      10.0, // far  
    );
    gl.uniformMatrix4fv(pmLoc, false, pm);

    // Uniform untuk pencahayaan
    dcLoc = gl.getUniformLocation(program, 'diffuseColor');
    dc = glMatrix.vec3.fromValues(1.0, 1.0, 1.0);  // rgb
    gl.uniform3fv(dcLoc, dc);
    
    acLoc = gl.getUniformLocation(program, 'ambientColor');
    ac = glMatrix.vec3.fromValues(0.17, 0.40, 0.41);
    gl.uniform3fv(acLoc, ac);

    //Uniform untuk modelMatrix vektor normal
    nmLoc = gl.getUniformLocation(program, 'normalMatrix');

    //Set scale refleksi
    scaleXUniformLocation = gl.getUniformLocation(program, 'scaleX');
    scaleX = 1.0; 
    gl.uniform1f(scaleXUniformLocation, scaleX);

    // Set translate
    translateXUniformLocation = gl.getUniformLocation(program, 'translateX');
    translateX = 0.0; 
    gl.uniform1f(translateXUniformLocation, translateX);

    translateYUniformLocation = gl.getUniformLocation(program, 'translateY');
    translateY = 0.0; 
    gl.uniform1f(translateYUniformLocation, translateY);

    translateZUniformLocation = gl.getUniformLocation(program, 'translateZ');
    translateZ = 0.0; 
    gl.uniform1f(translateZUniformLocation, translateZ);

    //Set variable animasi
    span = 1.0;
    animationX = 1.0;
    animationY = 1.0;
    animationZ = 1.0;

    flagUniformLocation = gl.getUniformLocation(program, 'flag');

    //Set flag ke P
    flag = 1.0;
    gl.uniform1f(flagUniformLocation, flag);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n2);

    //Clear Color
    gl.clearColor(255/255, 221/255, 209/255, 1.0);
    gl.enable(gl.DEPTH_TEST);

    render(0);

  }

  function render(time) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Animasi rotate mouse
    var dt = time-time_old;

    if (!drag) 
    {
        dX *= AMORTIZATION, dY*=AMORTIZATION;
        THETA+=dX, PHI+=dY;

    }

    mm[0] = 1, mm[1] = 0, mm[2] = 0,
    mm[3] = 0,

    mm[4] = 0, mm[5] = 1, mm[6] = 0,
    mm[7] = 0,

    mm[8] = 0, mm[9] = 0, mm[10] = 1,
    mm[11] = 0,

    mm[12] = 0, mm[13] = 0, mm[14] = 0,
    mm[15] = 1;

    glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -2.0]);

    rotateY(mm, THETA);
    rotateX(mm, PHI);

    time_old = time; 

    //Cube
    // theta += thetaSpeed;
    // if (axis[z]) glMatrix.mat4.rotateZ(mm, mm, thetaSpeed);
    // if (axis[y]) glMatrix.mat4.rotateY(mm, mm, thetaSpeed);
    // if (axis[x]) glMatrix.mat4.rotateX(mm, mm, thetaSpeed);
    gl.uniformMatrix4fv(mmLoc, false, mm);

    //Perhitungan modelMatrix untuk vektor normal
    var nm = glMatrix.mat3.create(); 
    glMatrix.mat3.normalFromMat4(nm, mm);
    gl.uniformMatrix3fv(nmLoc, false, nm);

    glMatrix.mat4.lookAt(vm,
      [camera.x, camera.y, camera.z], // di mana posisi kamera (posisi)
      [0.0, 0.0, -2.0], // ke mana kamera menghadap (vektor)
      [0.0, 1.0, 0.0]  // ke mana arah atas kamera (vektor)
    );
    gl.uniformMatrix4fv(vmLoc, false, vm);

    flag = 0.0;
    gl.uniform1f(flagUniformLocation, flag);
    // gl.drawArrays(gl.TRIANGLES, 0, 36);
    gl.drawArrays(gl.TRIANGLES, 0, n1);

    //P
    
    //Animasi Rotasi
    if (scaleX >= 1.0) span = -1.0;
    else if (scaleX <= -1.0) span = 1.0;
    scaleX += 0.01 * span;
    gl.uniform1f(scaleXUniformLocation, scaleX);

    //Animasi Translasi
    translateX += 0.011 * animationX;
    translateY += 0.012 * animationY;
    translateZ += 0.013 * animationZ;

    if (translateX >= 0.8 - Math.abs(scaleX * 0.08)) animationX = -1.0;
    else if (translateX <= -0.8 + Math.abs(scaleX * 0.08)) animationX = 1.0;
    
    if (translateY >= 0.8 - 0.4) animationY = -1.0;
    else if (translateY <= -0.8 + 0.1) animationY = 1.0;
    
    if (translateZ >= 0.8 ) animationZ = -1.0;
    else if (translateZ <= -0.8 ) animationZ = 1.0;
    
    gl.uniform1f(translateXUniformLocation, translateX);
    gl.uniform1f(translateYUniformLocation, translateY);
    gl.uniform1f(translateZUniformLocation, translateZ);

    //Animasi Lighting
    ddLoc = gl.getUniformLocation(program, 'diffusePosition');
    dd = glMatrix.vec3.fromValues(translateX, translateY, translateZ);
    gl.uniform3fv(ddLoc, dd);

    //Switch Mode
    flag = 1.0;
    gl.uniform1f(flagUniformLocation, flag);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n2);

    requestAnimationFrame(render);
  }

  glUtils.SL.init({ callback: function() { main(); }});

  function main() {

    // document.addEventListener('keydown', onKeyDown);
    mouseControl();

    //Set Canvas
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);
    initGlSize();

    //Get Shader
    vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex);
    fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    
    //Use Program
    program = glUtils.createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    quad(2, 3, 7, 6); //Kanan
    quad(3, 0, 4, 7); //Bawah
    quad(4, 5, 6, 7); //Belakang
    quad(5, 4, 0, 1); //Kiri
    quad(6, 5, 1, 2); //Atas

    n1 = initBuffers(gl,vertices);
    n2 = initBuffers2(gl, vertices5, vertices6, 0.15, -0.07, 0.25);
    initTexture(gl);

    draw();
  }
})();