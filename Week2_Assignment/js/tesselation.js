var VERTICES,
gl,
program,
tesselator,
canvas,
angleSlider,
subdivisionSlider,
subdivisionLabel;

window.onload = function() {
    var points = [];
    VERTICES = [vec2(0,0.7),vec2(-0.7,-0.7),vec2(0.7,-0.7)];
    canvas = document.getElementById('gl-canvas');
    angleSlider = document.getElementById('angle-slider');
    subdivisionSlider = document.getElementById('subdivision-slider');
    subdivisionLabel = document.getElementById('subdivision-label');

    gl = WebGLUtils.setupWebGL(canvas);

    if (!gl) {
        alert('WebGL is not supported on your browser');
        return;
    }

    
    tesselator = new Tesselator(points);
    subdivideTriangles(points, VERTICES[0],VERTICES[1],VERTICES[2],subdivisionSlider.value);
    tessellateAndRender(angleSlider.value);
};

var tessellateAndRender = function(value) {
    var newPoints;
    updateSlider(value);
    newPoints = tesselator.tessellate(value);
    setupArraysAndRender(canvas,newPoints);
};

var subdivisionChanged = function(value) {
    var points = [];
    subdivisionLabel.innerHTML = "Number of subdivisions: " + value;
    tesselator = new Tesselator(points);
    subdivideTriangles(points, VERTICES[0],VERTICES[1],VERTICES[2],subdivisionSlider.value);
    tessellateAndRender(angleSlider.value);
};

var startStopRendering = (function() {
    var started = false,
    timerId = -1,
    currentAngle = 0;
    return function() {
        started = !started;
        if(started) {
            currentAngle = angleSlider.value;
            timerId = setInterval(function() {
                currentAngle = ++currentAngle % 360;
                tessellateAndRender(currentAngle);
            },20);
        } else {
            clearInterval(timerId);
            timerId = -1;
        }
        updateButton(started);
    };
})();

var setupArraysAndRender = function(canvas, newPoints) {
    setupArrays(canvas,newPoints);
    render(newPoints.length);
};

var setupArrays = function(canvas,newPoints){
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.clearColor(1.0,1.0,1.0,1.0);

    var program = initShaders(gl,"vertex-shader","fragment-shader");
    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,bufferId);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(newPoints),gl.STATIC_DRAW);

    var vPositions = gl.getAttribLocation(program,'vPositions');
    gl.vertexAttribPointer(vPositions,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vPositions);
};

var render = function(length){
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,length);
};

var subdivideTriangles = function(points, vertex1, vertex2, vertex3, numberOfDivisions) {
    if(numberOfDivisions === 0) {
        points.push(vertex1,vertex2,vertex3);
        return;
    }

    var v1v2 = mix(vertex1,vertex2,0.5);
    var v2v3 = mix(vertex2,vertex3,0.5);
    var v1v3 = mix(vertex1,vertex3,0.5);

    subdivideTriangles(points, vertex1,v1v2,v1v3, numberOfDivisions - 1);
    subdivideTriangles(points, vertex2,v1v2,v2v3, numberOfDivisions - 1);
    subdivideTriangles(points, vertex3,v2v3,v1v3, numberOfDivisions - 1);
    subdivideTriangles(points, v2v3,v1v2,v1v3, numberOfDivisions - 1);
};

var updateButton = (function(){
    var startStopButton;
    return function(started) {
        if(!startStopButton) {
            startStopButton = document.getElementById('start-stop-button');
        }
        if(started){
            startStopButton.innerHTML = "Stop";
        } else {
            startStopButton.innerHTML = "Start";
        }
    }
})();

var Tesselator = function(points) {
    var that = this;
    this.points = points;
    this.tessellate = function(degree) {
        var newVertex,
        oldVertex,
        newPoints = [],
        radian = 0,
        d = 0,
        x = 0,
        y = 0;
        for (var i in that.points) {
            oldVertex = points[i];
            radian = MyMathUtils.toRadian(degree);
            d = MyMathUtils.distance(oldVertex[0],oldVertex[1]);
            x = oldVertex[0] * Math.cos(d * radian) - oldVertex[1] * Math.sin(d*radian);
            y = oldVertex[0] * Math.sin(d * radian) + oldVertex[1] * Math.cos(d*radian);
            newPoints.push(vec2(x,y));
        }
        return newPoints
    }
};

var MyMathUtils = function(){};
MyMathUtils.toRadian = function(degree) {
    return degree*Math.PI/180;
};

MyMathUtils.distance = function(x, y) {
    return Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
}

var updateSlider = (function() {
    var label;
    return function(value) {
        if (!label) {
            label = document.getElementById('value-label');
        }
        angleSlider.value = value;
        label.innerHTML = "Degree: " + value;
    };
})();

