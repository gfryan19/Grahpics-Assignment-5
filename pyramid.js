//Greg Ryan
//October 27, 2017
//Homework 5
//pyramid.js

var canvas;
var gl;

var NumVertices  = 24;

var projection;

var points = [];
var colors = [];
var vertices = [
    vec3(  0.0,  0.0, 100.0 ),
    vec3(  -100.0,  0.0,  0.0 ),
    vec3(  0.0,  0.0,  -100.0 ),
    vec3(  100.0, 0.0,  0.0 ),
    vec3(  0.0, 100.0, 0.0 )
];

var vertexColors = [
    [ 1.0, 0.0, 0.0, 1.0 ],  // red
    [ 0.0, 0.0, 1.0, 1.0 ],  // blue
    [ 0.0, 1.0, 0.0, 1.0 ],  //green
    [ 1.0, 0.0, 1.0, 1.0 ],  //purple
    [ 0.0, 1.0, 1.0, 1.0 ],  //cyan
];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];
var x = 0.0;
var y = 0.0;
var z = -300.0;

var thetaLoc;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    drawBox();

    gl.viewport( 2, 2, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    projection = gl.getUniformLocation( program, "projection" );
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelView = gl.getUniformLocation( program, "modelView" );
    
    window.onkeydown = keyResponse;
        
    render();
}

function keyResponse(event) {
	var key = String.fromCharCode(event.keyCode);
	switch (key) {
		case '1':
			axis = xAxis;
			theta[axis] += 2.0;
			break;
		case '2':
			axis = xAxis;
			theta[axis] -= 2.0;
			break;
		case '3':
			axis = yAxis;
			theta[axis] += 2.0;
			break;
		case '4':
			axis = yAxis;
			theta[axis] -= 2.0;
			break;
		case '5':
			axis = zAxis;
			theta[axis] += 2.0;
			break;
		case '6':
			axis = zAxis;
			theta[axis] -= 2.0;
			break;
		case 'F': // move forward
			z += 10;
			break;
		case 'B': //move backward
			z -= 10;
			break;
		case 'U': //move up
			y += 10;
			break;
		case 'D': //move down
			y -= 10;
			break;
		case 'R': //move right
			x += 10;
			break;
		case 'L': //move left
			x -= 10;
	}
}

function drawBox()
{
    quad( vertices[0], vertices[1], vertices[2], vertices[3], vertexColors[0] );
    triangle( vertices[0], vertices[3], vertices[4], vertexColors[1] );
    triangle( vertices[1], vertices[0], vertices[4], vertexColors[2] );
    triangle( vertices[2], vertices[1], vertices[4], vertexColors[3] );
    triangle( vertices[3], vertices[2], vertices[4], vertexColors[4] );
    
}

function quad(a, b, c, d, color) 
{

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( indices[i] );
        //colors.push( vertexColors[indices[i]] );
    
        // for solid colored faces use 
        colors.push(color);
        
    }
}

function triangle(a, b, c, color) 
{

    // We need to parition the triangle into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ a, b, c];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( indices[i] );
        //colors.push( vertexColors[indices[i]] );
    
        // for solid colored faces use 
        colors.push(color);
        
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var pMatrix = perspective(45.0, 1.0, 1.0, 500.0);

    mvMatrix = mat4( );
    mvMatrix = mult(mvMatrix, translate(x, y, z, 1.0));
    mvMatrix = mult(mvMatrix, rotate(theta[0], 1.0, 0.0, 0.0));
    mvMatrix = mult(mvMatrix, rotate(theta[1], 0.0, 1.0, 0.0));
    mvMatrix = mult(mvMatrix, rotate(theta[2], 0.0, 0.0, 1.0));

	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
	gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );
	
    gl.drawArrays( gl.TRIANGLES, 0, points.length );

    requestAnimFrame( render );
}

