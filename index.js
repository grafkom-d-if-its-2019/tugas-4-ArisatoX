(function() {

  var canvas, gl, vertexShader, fragmentShader, program,
  thetaUniformLocation, theta, thetaSpeed, axis, x, y, z, n1, n2,
  mmLoc, mm, vmLoc, vm, pmLoc, pm, camera, nmLoc,
  flagUniformLocation, flag, scaleXUniformLocation, scaleYUniformLocation, scaleX, scaleY,
  translateX, translateXUniformLocation, translateY, translateYUniformLocation, translateZ, translateZUniformLocation,
  animationX, animationY, animationZ;

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
    [1.0, 1.0, 1.0], // merah
    [0.0, 1.0, 0.0], // hijau
    [0.0, 0.0, 1.0], // biru
    [1.0, 0.0, 0.0], // putih
    [1.0, 0.5, 0.0], // oranye
    [1.0, 1.0, 0.0], // kuning
    []
  ];

  var cubeNormals = [
    [],
    [0.0, 0.0, 1.0], // depan
    [1.0, 0.0, 0.0], // kanan
    [0.0, -1.0, 0.0], // bawah
    [0.0, 0.0, -1.0], // belakang
    [-1.0, 0.0, 0.0], // kiri
    [0.0, 1.0, 0.0], // atas
    []
  ];

  // Vertex P
  var vertices5 = [],
  vertices6 = [
    
  -0.07, -0.1, 0.0, 1.0, 1.0, 1.0, 
  -0.07, 0.4, 0.0, 1.0, 1.0, 1.0,
  -0.13, -0.1, 0.0, 1.0, 1.0, 1.0,
  -0.07, 0.4, 0.0, 1.0, 1.0, 1.0,
  -0.13, 0.3, 0.0, 1.0, 1.0, 1.0,
  -0.13, 0.4, 0.0, 1.0, 1.0, 1.0,
  -0.07, 0.35, 0.0, 1.0, 1.0, 1.0
  
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
        vertices.push(cubeNormals[a][j]);
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

  // function quadline(a, b, c, d) {
  //   var indices = [a, b, c, d, a];

  //   for (var i=0; i < indices.length; i++) {
      
  //     for (var j=0; j < 3; j++) {
  //       vertices.push(cubePoints[indices[i]][j]);
  //     }

  //     for (var j=0; j < 3; j++) {
  //       vertices.push(cubeColors[a][j]);
  //     }

  //     for (var j=0; j < 3; j++) {
  //       vertices.push(cubeNormals[a][j]);
  //     }
  //   }
  // }

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
  function onKeyDown(event) {

    //Chrome Configuration
    if (event.keyCode == 189) thetaSpeed -= 0.01;       // key '-'
    else if (event.keyCode == 187) thetaSpeed += 0.01;  // key '='
    else if (event.keyCode == 48) thetaSpeed = 0;       // key '0'

    if (event.keyCode == 55) axis[x] = !axis[x];        //Key 7
    if (event.keyCode == 56) axis[y] = !axis[y];        //Key 8
    if (event.keyCode == 57) axis[z] = !axis[z];        //Key 9

    if (event.keyCode == 45) camera.z -= 0.1;           //Numpad 5
    else if (event.keyCode == 12) camera.z += 0.1;      //Numpad 0

    if (event.keyCode == 38) camera.y -= 0.1;           // Numpad atas 
    else if (event.keyCode == 40) camera.y += 0.1;      // Numpad Bawah

    if (event.keyCode == 37) camera.x -= 0.1;           //Numpad Kiri
    else if (event.keyCode == 39) camera.x += 0.1;      // Numpad Kanan
  }

  //Init Buffer Cube
  function initBuffers(gl, vertices) {

    // Membuat vertex buffer object (CPU Memory <==> GPU Memory)
    var vertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Membuat sambungan untuk attribute
    //Cube
    var vPosition = gl.getAttribLocation(program, 'vPosition');
    var vNormal = gl.getAttribLocation(program, 'vNormal');
    var vTexCoord = gl.getAttribLocation(program, 'vTexCoord');
      
    ntotal = vertices.length / 6;
  
    //Attrib Pointer
    //Cube
    gl.vertexAttribPointer(
      vPosition,    // variabel yang memegang posisi attribute di shader
      3,            // jumlah elemen per atribut
      gl.FLOAT,     // tipe data atribut
      gl.FALSE, 
      11 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap verteks (overall) 
      0                                   // offset dari posisi elemen di array
    );

    //Cube
    gl.vertexAttribPointer(
      vNormal, 
      3, 
      gl.FLOAT, 
      gl.FALSE,
      11 * Float32Array.BYTES_PER_ELEMENT, 
      6 * Float32Array.BYTES_PER_ELEMENT
    );
    
    gl.vertexAttribPointer(
      vTexCoord, 
      2, 
      gl.FLOAT, 
      gl.FALSE,
      11 * Float32Array.BYTES_PER_ELEMENT, 
      9 * Float32Array.BYTES_PER_ELEMENT
    );

    

    //Cube
    gl.enableVertexAttribArray(vPosition);
    gl.enableVertexAttribArray(vNormal);
    gl.enableVertexAttribArray(vTexCoord);

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
      0.0, 1.0, 1.0, 1.0
    ];
    var vert2 = [
      Math.sin(j) * 0.5 * x + y1,
      Math.cos(j) * 0.5 * x + y2,
      0.0, 1.0, 1.0, 1.0
    ];
    
    vertices = vertices.concat(vert1);
    vertices = vertices.concat(vert2);
    
    }

    var ntotal = vertices.length / 6;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vPositionP = gl.getAttribLocation(program, 'vPositionP');
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
    var dcLoc = gl.getUniformLocation(program, 'diffuseColor');
    var dc = glMatrix.vec3.fromValues(1.0, 1.0, 1.0);  // rgb
    gl.uniform3fv(dcLoc, dc);
    var ddLoc = gl.getUniformLocation(program, 'diffusePosition');
    var dd = glMatrix.vec3.fromValues(1., 2., 1.7);  // xyz
    gl.uniform3fv(ddLoc, dd);
    var acLoc = gl.getUniformLocation(program, 'ambientColor');
    var ac = glMatrix.vec3.fromValues(0.2, 0.2, 0.2);
    gl.uniform3fv(acLoc, ac);

    //Uniform untuk modelMatrix vektor normal
    nmLoc = gl.getUniformLocation(program, 'normalMatrix');

    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(
      gl.TEXTURE_2D, 
      0, 
      gl.RGBA, 
      1, 
      1, 
      0, 
      gl.RGBA, 
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 255, 255])
    );

    // Asynchronously load an image
    var image = new Image();
    image.src = "images/tes.bmp";
    image.addEventListener('load', function() {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
    });

    //Set scale refleksi
    scaleXUniformLocation = gl.getUniformLocation(program, 'scaleX');
    scaleX = 1.0; 
    gl.uniform1f(scaleXUniformLocation, scaleX);

    scaleYUniformLocation = gl.getUniformLocation(program, 'scaleY');
    scaleY = 1.0; 
    gl.uniform1f(scaleYUniformLocation, scaleY);

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

    render();


  }

  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Cube
    theta += thetaSpeed;
    if (axis[z]) glMatrix.mat4.rotateZ(mm, mm, thetaSpeed);
    if (axis[y]) glMatrix.mat4.rotateY(mm, mm, thetaSpeed);
    if (axis[x]) glMatrix.mat4.rotateX(mm, mm, thetaSpeed);
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
    if (translateX >= 0.8 - Math.abs(scaleX * 0.07)) animationX = -1.0;
    else if (translateX <= -0.8 + Math.abs(scaleX * 0.07)) animationX = 1.0;
    translateX += 0.01 * animationX;
    gl.uniform1f(translateXUniformLocation, translateX);

    if (translateY >= 0.8 - 0.4) animationY = -1.0;
    else if (translateY <= -0.8 + 0.1) animationY = 1.0;
    translateY += 0.011 * animationY;
    gl.uniform1f(translateYUniformLocation, translateY);

    if (translateZ >= 0.8) animationZ = -1.0;
    else if (translateZ <= -0.8) animationZ = 1.0;
    translateZ += 0.013 * animationZ;
    gl.uniform1f(translateZUniformLocation, translateZ);

    //Switch Mode
    flag = 1.0;
    gl.uniform1f(flagUniformLocation, flag);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n2);

    requestAnimationFrame(render);
  }

  glUtils.SL.init({ callback: function() { main(); }});

  function main() {

    document.addEventListener('keydown', onKeyDown);

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

    // quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
    quad(6, 5, 1, 2);

    // quadline(1, 0, 3, 2); // Depan
    // quadline(2, 3, 7, 6); // Kanan
    // quadline(6, 5, 1, 2); // Atas
    // quadline(5, 4, 0, 1); // Kiri
    // quadline(4, 7, 3, 0); // Bawah
    // quadline(4, 5, 6, 7); // Belakang

    n1 = initBuffers(gl,vertices);
    n2 = initBuffers2(gl, vertices5, vertices6, 0.15, -0.07, 0.25);

    draw();
  }
})();