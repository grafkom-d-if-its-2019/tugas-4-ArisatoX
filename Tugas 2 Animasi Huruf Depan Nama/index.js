(function() {

  var canvas, gl, program,
  n, n2, n3,
  theta, scaleX, scaleY, span , left, right, mid,
  thetaUniformLocation, scaleXUniformLocation, scaleYUniformLocation, leftUniformLocation, rightUniformLocation, midUniformLocation;

  //P garis luar
  var vertices = [], 
    vertices2 = [
    0.0, 0.0, 0.0, 0.0, 0.0,
    -0.1, 0.0, 0.0, 0.0, 0.0,
    -0.1, -0.4, 0.0, 0.0, 0.0,
    -0.2, -0.4, 0.0, 0.0, 0.0,    
    -0.2, 0.5, 0.0, 0.0, 0.0,
    0.0, 0.5, 0.0, 0.0, 0.0
  ];

  //P garis dalam
  var vertices3 = [],
    vertices4 = [

    0.0, 0.1, 0.0, 0.0, 0.0,
    -0.1, 0.1, 0.0, 0.0, 0.0,
    -0.1, 0.4, 0.0, 0.0, 0.0,
    0.0, 0.4, 0.0, 0.0, 0.0
      
    ];

  //P filling luar
  var vertices5 = [],
    vertices6 = [
      
    0.0, -0.4, 1.0, 1.0, 1.0, 
    0.0, 0.5, 1.0, 1.0, 1.0,
    0.1, -0.4, 1.0, 1.0, 1.0,
    0.1, 0.5, 1.0, 1.0, 1.0,
    0.1, 0.375, 1.0, 1.0, 1.0,
    0.2, 0.5, 1.0, 1.0, 1.0,
    0.2, 0.375, 1.0, 1.0, 1.0
    
    ];
  

  glUtils.SL.init({ callback: function() { main(); }});

  function main() {

    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);

    initGlSize();

    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex);
    var fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    program = glUtils.createProgram(gl, vertexShader, fragmentShader);
    
    gl.useProgram(program);

    n = initBuffers(gl, vertices, vertices2, 0.25, 0.0, 0.25);
    n2 = initBuffers2(gl,vertices3, vertices4, 0.15, 0.0, 0.25);
    n3 = initBuffers3(gl, vertices5, vertices6, 0.25, 0.2, 0.25);

    resizer();
    
  }
  
  function initGlSize() {
    var width = canvas.getAttribute("width"), height = canvas.getAttribute("height");
    if (width) {
      gl.maxHeight = height;
    }
    if (height) {
      gl.maxHeight = height;
    }
  }

  function draw() {

    gl.clearColor(255/255, 210/255, 170/255, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //Refleksi
    thetaUniformLocation = gl.getUniformLocation(program, 'theta');
    theta = 0;
    gl.uniform1f(thetaUniformLocation, theta);

    scaleXUniformLocation = gl.getUniformLocation(program, 'scaleX');
    scaleX = 1.0; 
    gl.uniform1f(scaleXUniformLocation, scaleX);

    scaleYUniformLocation = gl.getUniformLocation(program, 'scaleY');
    scaleY = 1.0; 
    gl.uniform1f(scaleYUniformLocation, scaleY);

    left = 1;
    mid = 0;
    right = 0;
    leftUniformLocation=gl.getUniformLocation(program, 'left');
    //P garis luar
    gl.drawArrays(gl.LINE_LOOP, 0, n);

    left = 0;
    mid = 1;
    right = 0;
    midUniformLocation=gl.getUniformLocation(program, 'mid');
    //P garis dalam
    gl.drawArrays(gl.LINE_LOOP, 0, n2);

    left = 0;
    mid = 0;
    right = 1;
    rightUniformLocation=gl.getUniformLocation(program, 'right');
    //P filling
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n3);

    
    function render() {

      // Animasi rotate
      theta += 0.0041;
      gl.uniform1f(thetaUniformLocation, theta);

      // Animasi refleksi
      if (scaleX >= 1.0) span = -1.0;
      else if (scaleX <= -1.0) span = 1.0;
      scaleX += 0.0041 * span;
      gl.uniform1f(scaleXUniformLocation, scaleX);

      gl.clearColor(255/255, 210/255, 170/255, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      left = 1;
      gl.uniform1f(leftUniformLocation, left);
      //P garis luar
      gl.drawArrays(gl.LINE_LOOP, 0, n);

      left = 0;
      mid = 1;
      gl.uniform1f(midUniformLocation, mid);
      gl.uniform1f(leftUniformLocation, left);
      //P garis dalam
      gl.drawArrays(gl.LINE_LOOP, 0, n2);

      mid = 0;
      right = 1;
      gl.uniform1f(midUniformLocation, mid);
      gl.uniform1f(rightUniformLocation, right);
      //P filling
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, n3);

      requestAnimationFrame(render);
      }

      render();

  }

  //P garis
  function initBuffers(gl, vertices, vertices2, x, y1, y2) {
    
    var vertexBuffer = gl.createBuffer();

    //Garis
    vertices = vertices.concat(vertices2);

    //Lengkungan
    for (var i=0.0; i<=180; i+=1) {
    var j = i * Math.PI / 180;
    var vert1 = [
      Math.sin(j) * x + y1,
      Math.cos(j) * x + y2,
      0.0, 0.0, 0.0
    ];
    
    vertices = vertices.concat(vert1);
    
    }

    var ntotal = vertices.length / 5;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vPositionLeft = gl.getAttribLocation(program, 'vPositionLeft');
    var vColorLeft = gl.getAttribLocation(program, 'vColorLeft');

    gl.vertexAttribPointer(
      vPositionLeft,  // variabel yang memegang posisi attribute di shader
      2,          // jumlah elemen per attribute
      gl.FLOAT,   // tipe data attribute
      gl.FALSE,   
      5 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap vertex (overall)
      0                                   // offset dari posisi elemen di array
    );

    gl.vertexAttribPointer( vColorLeft, 3, gl.FLOAT, gl.FALSE, 
      5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

    gl.enableVertexAttribArray(vPositionLeft);
    gl.enableVertexAttribArray(vColorLeft);


    return ntotal;
  }

  function initBuffers2(gl, vertices, vertices2, x, y1, y2) {
    
    var vertexBuffer = gl.createBuffer();

    //Garis
    vertices = vertices.concat(vertices2);

    //Lengkungan
    for (var i=0.0; i<=180; i+=1) {
    var j = i * Math.PI / 180;
    var vert1 = [
      Math.sin(j) * x + y1,
      Math.cos(j) * x + y2,
      0.0, 0.0, 0.0
    ];
    
    vertices = vertices.concat(vert1);
    
    }

    var ntotal = vertices.length / 5;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vPositionMid = gl.getAttribLocation(program, 'vPositionMid');
    var vColorMid = gl.getAttribLocation(program, 'vColorMid');

    gl.vertexAttribPointer(
      vPositionMid,  // variabel yang memegang posisi attribute di shader
      2,          // jumlah elemen per attribute
      gl.FLOAT,   // tipe data attribute
      gl.FALSE,   
      5 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap vertex (overall)
      0                                   // offset dari posisi elemen di array
    );

    gl.vertexAttribPointer( vColorMid, 3, gl.FLOAT, gl.FALSE, 
      5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

    gl.enableVertexAttribArray(vPositionMid);
    gl.enableVertexAttribArray(vColorMid);


    return ntotal;
  }

  //P filling
  function initBuffers3(gl, vertices, vertices2, x, y1, y2) {
    
    var vertexBuffer = gl.createBuffer();
    //Filling
    vertices = vertices.concat(vertices2);

    for (var i=0.0; i<=180; i+=1) {
    var j = i * Math.PI / 180;
    var vert1 = [
      Math.sin(j) * x + y1,
      Math.cos(j) * x + y2,
      1.0, 1.0, 1.0
    ];
    var vert2 = [
      Math.sin(j) * 0.5 * x + y1,
      Math.cos(j) * 0.5 * x + y2,
      1.0, 1.0, 1.0
    ];
    
    vertices = vertices.concat(vert1);
    vertices = vertices.concat(vert2);
    
    }

    var vert3 = [
      0.0, 0.0, 1.0, 1.0, 1.0,
      0.0, 0.125, 1.0, 1.0, 1.0,
      0.0, 0.125, 1.0, 1.0, 1.0,
      0.0, 0.0, 1.0, 1.0, 1.0,
      0.0, 0.0, 1.0, 1.0, 1.0
    ]

    vertices = vertices.concat(vert3);

    var ntotal = vertices.length / 5;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vPositionRight = gl.getAttribLocation(program, 'vPositionRight');
    var vColorRight = gl.getAttribLocation(program, 'vColorRight');

    gl.vertexAttribPointer(
      vPositionRight,  // variabel yang memegang posisi attribute di shader
      2,          // jumlah elemen per attribute
      gl.FLOAT,   // tipe data attribute
      gl.FALSE,   
      5 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap vertex (overall)
      0                                   // offset dari posisi elemen di array
    );

    gl.vertexAttribPointer( vColorRight, 3, gl.FLOAT, gl.FALSE, 
      5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

    gl.enableVertexAttribArray(vPositionRight);
    gl.enableVertexAttribArray(vColorRight);

    return ntotal;
  }

  function resizer () {
    
    var width = canvas.getAttribute("width"), height = canvas.getAttribute("height");
    
    if (!width || width < 0) {
      canvas.width = window.innerWidth;
      gl.maxWidth = window.innerWidth;
    }

    if (!height || height < 0) {
      canvas.height = window.innerHeight;
      gl.maxHeight = window.innerHeight;
    }

    var min = Math.min.apply( Math, [gl.maxWidth, gl.maxHeight, window.innerWidth, window.innerHeight]);
    canvas.width = min;
    canvas.height = min;

    gl.viewport(0, 0, canvas.width, canvas.height);
    
    draw();
    
  }

  window.addEventListener('resize', resizer);

})();
