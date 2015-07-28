var gl,
coords = [],
buffers;

window.onload = function() {
    var program = init();
    buffers = new Buffers(program);
    buffers.render();
}

var init = function()  {
    var canvas = $('#gl-canvas')[0],
    program;
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert('Could not initialize WebGL');
        return;
    }
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.clearColor(1.0,0.0,0.0,1.0);
    program = initShaders(gl,'vertex-shader','fragment-shader');
    gl.useProgram(program);
    return program;
};

var Buffers = function(program) {
    var bufferId = gl.createBuffer(),
    vPosition = gl.getAttribLocation(program,"vPosition"),
    prog = program,
    renderObject = new Render();
    
    this.render = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
        gl.bufferData(gl.ARRAY_BUFFER,flatten(coords),gl.STATIC_DRAW);
        gl.vertexAttribPointer(vPosition,2,gl.FLOAT,true,0,0);
        gl.enableVertexAttribArray(vPosition);
        renderObject.render();
    };
};

var Render = function() {
    var that = this,
    intervalId = -1,
    $lineWidthSlider = $('#linewidth-slider'),
    $lineWidthLabel = $('#linewidth-label'),
    $canvas = $('#gl-canvas'),
    currentLineWidth = $lineWidthSlider.val(),
    pushMouseCoords = function(event) {
         coords.push(event.clientX/256 - 1 ,-event.clientY/256 + 1);
         buffers.render();
    },
    listenMouseMove = function() {
        $canvas.on('mousemove',function(event) {
            pushMouseCoords(event)
        });
    },
    stopListeningMouseMoving = function() {
      $canvas.off('mousemove');
    };

    this.render = function() {
        gl.lineWidth(currentLineWidth)
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.LINE_STRIP,0,coords.length/2 -1); 
    }

    $lineWidthSlider.on('change',function (event){
        currentLineWidth = $lineWidthSlider.val();
        $lineWidthLabel.html("Line Width: " + currentLineWidth);
    });
    $canvas.on("mousedown", function(event) {
        listenMouseMove();
    });

    $canvas.on("mouseup", function(event) {
        stopListeningMouseMoving();
        coords=[];
    });
};
