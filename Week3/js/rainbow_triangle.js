var gl,
    program,
    canvas;
window.onload = function () {
    var colors = initColors(),
        triangleCoords = initCoords(),
        pointsBufferId,
        colorBufferId,
        vPosition,
        vColor;
    canvas = document.getElementById('gl-canvas');
    gl = WebGLUtils.setupWebGL(canvas);

    if(!gl) {
        alert('Could not initialise Web GL');
        return;
    }

    gl.viewport(0,0,canvas.width,canvas.height);
    gl.clearColor(1.0,1.0,1.0,1.0);
    program = initShaders(gl,'vertex-shader','fragment-shader');
    gl.useProgram(program);

    pointsBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointsBufferId);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(triangleCoords),gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation(program,'vPosition');
    gl.vertexAttribPointer(vPosition,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vPosition);

    colorBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,colorBufferId);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(colors),gl.STATIC_DRAW);

    vColor = gl.getAttribLocation(program,'vColor');
    gl.vertexAttribPointer(vColor,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vColor);
    render();
};

var initColors = function(){
    return [1,0,0,0,1,0,0,0,1];
};

var initCoords = function() {
    return [-1,-1,0,1,1,-1];
};

var render = function() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,3);
};