var gl,
	program;

window.onload = function() {
	var canvas = $('#gl-canvas')[0],
		program,
		positionBufferId,
		colorBufferId,
		vPosition,
		color;
	gl = WebGLUtils.setupWebGL(canvas);

	if (!gl) {
		alert('The webgl was not initiated!!!');
		return;
	}
	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(1.0,1.0,1.0,1.0);
	
	program = initShaders(gl,'vertex-shader-uniform','fragment-shader-uniform');
	gl.useProgram(program);

	positionBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(initCoords()), gl.STATIC_DRAW);

	vPosition = gl.getAttribLocation(program,'vPosition');
	gl.vertexAttribPointer(vPosition,2,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vPosition);

	color = gl.getUniformLocation(program,'color');
	gl.uniform4fv(color,initColors());

	render();
};

var initColors = function(){
    return vec4(1.0,0.0,0.0,1.0);
};

var initCoords = function() {
    return [-1,-1,0,1,1,-1];
};

var render = function() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES,0,3);
}