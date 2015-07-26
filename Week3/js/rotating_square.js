var gl;

window.onload = function() {
    init();
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
    gl.clearColor(1.0,1.0,0.0,0.0);
    program = initShaders(gl,'vertex-shader-square','fragment-shader-square');
    gl.useProgram(program);
    setupBuffers(program);
};

var setupBuffers = function(program) {
    var bufferId = gl.createBuffer(),
    vPosition,
    theta,
    renderObject;
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER,initCoords(),gl.STATIC_DRAW);
    vPosition = gl.getAttribLocation(program,"vPosition");
    gl.vertexAttribPointer(vPosition,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vPosition);
    theta = gl.getUniformLocation(program,"theta");
    renderObject = new Render(theta);
};

var initCoords = function () {
    return flatten([0.5,0.5,
        0.5,-0.5,
        -0.5,-0.5,
        -0.5,0.5]);
};

var Render = function(thetaLocation) {
    var that = this,
    theta = 0,
    intervalId = -1,
    thetaLoc = thetaLocation,
    $startStopButton = $('#start-stop-button'),
    $speedSlider = $('#speed-slider'),
    $speedLabel = $('#speed-label'),
    $directionSelect = $('#direction-select'),
    currentSpeed = $speedSlider.val()/100,
    stopRequestFrame = false,
    render = function() {
        if (!stopRequestFrame) {
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.uniform1f(thetaLoc,theta);
            gl.drawArrays(gl.TRIANGLE_FAN,0,4);
            theta = theta + ($directionSelect.val() == 0 ? currentSpeed : -currentSpeed);
            requestAnimationFrame(render);
        }
    };
    $speedSlider.on('change',function (event) {
        $speedLabel.html("Speed: " + $speedSlider.val());
        currentSpeed =  $speedSlider.val()/100;
    });

    $startStopButton.click(function(){
        var text = $startStopButton.html();
        if (text === "Start") {
            // that.start();
            that.startRequestFrame();
            text = "Stop";
        } else {
            // that.stop();
            that.stopRequestFrame();
            text = "Start";
        }
        $startStopButton.html(text);
    });

    this.startRequestFrame =function () {
        stopRequestFrame = false;
        requestAnimationFrame(render);
    };

    this.stopRequestFrame = function () {
        stopRequestFrame = true;
    };

    this.start = function() {
        that.stop();
        intervalId = setInterval(render,20);
    };

    this.stop = function(){
        if (intervalId >= 0) {
            clearInterval(intervalId);
            intervalId = -1;
        }
    };
};