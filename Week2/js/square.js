var points,
gl;


window.onload = function () {
    var canvas = document.getElementById('gl-canvas');
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert('The WebGL is not supported on this browser');
        return;
    }
    var vertices = [
        0.5,0.5,
        0.5,-0.5,
        -0.5,-0.5,
        -0.5,0.5
        ];
    // Alternative to above solution is
    // var vertices = [vec(0.5,0.5), vec2(0.5,-0.5),vec2(-0.5,-0.5),vec2(-0.5,0.5)];

    gl.viewport(0,0,canvas.width,canvas.height);
    gl.clearColor(1.0,1.0,0.0,1.0);

    var program = initShaders(gl,'vertex-shader','fragment-shader');
    gl.useProgram(program)


    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,bufferId);
    // gl.STATIC_DRAW means that data is only sent once and is not being sent over and over
    gl.bufferData(gl.ARRAY_BUFFER,flatten(vertices),gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program,'vPosition');
    // 2 means 2-dimensional
    // false    : Do not normalise
    // first 0  : It is the initial value offset (for intleaving)
    // second 0 : It is the how far apart are data values
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    render();


}

var render = function() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Using triangle fan the first vertex is always fixed
    gl.drawArrays(gl.TRIANGLE_FAN,0,4);
    // Using triangle strip it uses the current vertex and 2 of the previous ones
    // gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
}