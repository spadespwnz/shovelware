function ScreenObject(gl, iBuffer, vBuffer, cBuffer, indices, points, colors, iSize, pSize, iIndex, pIndex, cIndex, translation, type){
	this.type = type;
	var speed = 0.5;
	var left;
	var right;
	var top;
	var bottom;
	var front;
	var back;
	var rotationSpeed;
	var translationSpeed;
	var radius;
	var speedMod;
	var scale = 1;
	if (type=="ball"){
		speedMod = 1;
		this.left = -.9;
		this.right = 0.9;
		this.top = 0.9;
		this.bottom = -0.9;
		this.front = .9;
		this.back = -0.9;
		rotationSpeed = [3,2,1];
		this.translationSpeed = [speed*0.02,speed*0.03,speed*0.01];
		radius = 0.05;
	}
	else if (type == "bullet"){
		rotationSpeed = [7,7,0];
		this.translationSpeed = [0,0,0];
	}
	else{
		var rotationSpeed = [0,0,0];
		this.translationSpeed = [0,0,0];
	}
	this.rotation = [0,0,0];
	//this.translationSpeed = [0,0,0];
	this.translation = translation;
	
	this.scale = 1;
	
	
	this.iIndex = iIndex
	this.iSize = iSize;
	this.pSize = pSize;
	var iSmallest = 10000;
	var iBiggest = 0;
	for (var i=0;i<indices.length;i++){
		if (indices[i] > iBiggest){
			iBiggest = indices[i];
		}
		if (indices[i] < iSmallest){
			iSmallest = indices[i];
		}
	}
	
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
	gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, iIndex, new Uint8Array(indices));
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, pIndex, flatten(points));
	
	gl.bindBuffer(gl.ARRAY_BUFFER,  cBuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, cIndex, flatten(colors));
	
	//troubleshoot();
	

	this.troubleshoot = function(){
		alert("iIndex: "+iIndex+"  "+"iSize: "+iSize+"  "+"pIndex: "+pIndex+"  "+"pSize: "+pSize*4+"  "+"iSmallest: "+iSmallest+"  "+"iBiggest: "+iBiggest);
		alert("Index range: "+iSmallest*3*4+"-"+iBiggest*3*4+",  P range: "+pIndex+"-"+(pIndex+pSize*4));
	
	}
	
	this.rightHit = function(){
		this.right -= 0.15;
	}
	this.rightMiss = function(){
		this.right += 0.15;
	}
	this.leftHit = function(){
		this.left += 0.15;
	}
	this.leftMiss = function(){
		this.left -= 0.15;
	}
	
	this.bottomHit = function(){
		this.bottom += 0.15;
	}
	
	this.bottomMiss = function(){
		this.bottom -= 0.15;
	}
	this.topHit = function(){
		this.top -= 0.15;
	}
	
	this.topMiss = function(){
		this.top += 0.15;
	}
	this.frontHit = function(){
		this.front -= 0.15;
	}
	this.frontMiss = function(){
		this.front += 0.15;
	}
	this.backHit = function(){
		this.back += 0.15;
	}
	this.backMiss = function(){
		this.back -= 0.15;
	}
	this.setTranslation = function(trans){
		this.translation = trans;
	}
	this.setSpeed = function(s){
		speedMod = s;
	}
	this.setSize = function(s){
		
		this.scale = s;
	}
	this.setTranslationSpeed = function(speed){
		
		this.translationSpeed.pop(0);
		this.translationSpeed.pop(0);
		this.translationSpeed.pop(0);
		this.translationSpeed.push(speed[0]);
		this.translationSpeed.push(speed[1]);
		this.translationSpeed.push(speed[2]);
	
	}
	this.work = function(){
	
		if (this.type == "ball"){
			if (translation[0]+radius*this.scale > this.right){
				if (this.translationSpeed[0] > 0){
					this.translationSpeed[0] *= -1;
				}
			}
			
			if (translation[0]-radius*this.scale  < this.left){
				if (this.translationSpeed[0] < 0){
					this.translationSpeed[0] *= -1;
				}
			}
			if (translation[1]+radius*this.scale  > this.top){
				if (this.translationSpeed[1] > 0){
					this.translationSpeed[1] *= -1;
				}
			}
			if (translation[1]-radius*this.scale  < this.bottom){
				if (this.translationSpeed[1] < 0){
					this.translationSpeed[1] *= -1;
				}
			}

			if (translation[2]+radius*this.scale  > this.front){
				if (this.translationSpeed[2] > 0){
					this.translationSpeed[2] *= -1;
				}
			}
			if (translation[2]-radius*this.scale  < this.back){
				if (this.translationSpeed[2] < 0){
					this.translationSpeed[2] *= -1;
				}
			}

			for (var i=0;i<translation.length;i++){
				translation[i] += this.translationSpeed[i]*speedMod;
				
			}
			for (var i=0;i<this.rotation.length;i++){
				this.rotation[i]+=rotationSpeed[i];
			}
			
		}
		else{
			for (var i=0;i<this.translation.length;i++){
				this.translation[i] += this.translationSpeed[i];
				
				
			}
			for (var i=0;i<this.rotation.length;i++){
				this.rotation[i]+=rotationSpeed[i];
			}
		}
	}

	
}


var canvas;
var gl;
var vBuffer, cBuffer, iBuffer;
var maxIndices = 10000;
var maxPoints = 10000;
var maxNumTriangles = 2000;
var maxNumVertices = 3 * maxNumTriangles;
var iIndex = 0;
var pIndex = 0;
var cIndex = 0;
var theta = [0,0,0];
var translation = [0,0,0,0];
var thetaLoc;
var translationLoc;
var worldOffset = [0,0,0];
var worldOffsetLoc;
var scale = 1;
var scaleLoc;
var lookAtLoc;
var lookAtMatrix;
var perspectiveLoc;
var perspectiveMatrix;
var numOfObjects = 0;
var objects = new Array();
var overwritable = new Array();
var t1, t2, t3, t4;
var printValue = false;
var vertexOffset = 0;
var cameraX = .90;
var cameraY = 0;
var cameraZ = 0;
var lookAtSpot = [0,0,0];
var camera = 1;
var up = [0,1,0];
var leftOffset = [-.90,0,0];
var rightOffset = [.9,0,0];
var backOffset = [0,0,-.90];
var frontOffset = [0,0,.90];
var bottomOffset = [0,-.90,0];
var topOffset = [0,.90,0];
var canShoot = true;
var hits = [0,0,0,0,0,0];
var angle = 0;
var maxCameraTurn = 5;
var xCameraTurn = 0;
var yCameraTurn = 0;
var normalBuffer = [];
var lightPosition = vec4(0.0, 0.0, 0.0, 1.0 );
var lightAmbient = vec4(0.0, 0.0, 0.0, 0.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var hasPrintWin = false;
var materialAmbient = vec4( .5, 0.0, .5, 1.0 );
var materialDiffuse = vec4( .5, 0.8, 0.0, 1.0);
var materialSpecular = vec4( .5, 0.8, 0.0, 1.0 );
var materialShininess = 100.0;
var ambientColor, diffuseColor, specularColor;

var ambientLoc, diffuseLoc, specularLoc, lightPosLoc, shininessLoc;


var colors = [
vec4( 0.0, 0.0, 0.0, 1.0 ), // black
vec4( 1.0, 0.0, 0.0, 1.0 ), // red
vec4( 1.0, 1.0, 0.0, 1.0 ), // yellow
vec4( 0.0, 1.0, 0.0, 1.0 ), // green
vec4( 0.0, 0.0, 1.0, 1.0 ), // blue
vec4( 1.0, 0.0, 1.0, 1.0 ), // magenta
vec4( 0.0, 1.0, 1.0, 1.0 ) // cyan
];

var vertices = [];
var vertexColors = [];
var indices = [];

function reset(){

}


function pressW(){
	if (yCameraTurn > -1*maxCameraTurn){
		yCameraTurn -= 1;
		switch(camera){
			case 0:
				angle -= 0.1;
				var oldUp = [];
				oldUp.push ([up[0]]);
				oldUp.push ([up[1]]);
				oldUp.push ([up[2]]);
				up.pop();
				up.pop();
				up.pop();
				up.push(0);
				up.push (Math.cos(angle));
				
				up.push(Math.sin(angle));
		
				break;
			case 1:

				angle -= 0.1;
				var oldUp = [];
				oldUp.push ([up[0]]);
				oldUp.push ([up[1]]);
				oldUp.push ([up[2]]);
				up.pop();
				up.pop();
				up.pop();
				up.push(0);
				up.push (Math.cos(angle));
				
				up.push(Math.sin(angle));
		
				break;
				
				
			case 2:

				lookAtSpot[1] += 0.1;
			
				break;
				
			case 3:

				lookAtSpot[1] -= 0.1;
				break;
			
				
			case 4:

				lookAtSpot[2] -= 0.1;
			
				break;
				
			case 5:

				lookAtSpot[2] -= 0.1;
				break;
		}
	}

	

}
function pressS(){
	if (yCameraTurn < maxCameraTurn){
	yCameraTurn += 1;
	switch(camera){
		case 0:
			angle += 0.1;
			var oldUp = [];
			oldUp.push ([up[0]]);
			oldUp.push ([up[1]]);
			oldUp.push ([up[2]]);
			up.pop();
			up.pop();
			up.pop();
			up.push(0);
			up.push (Math.cos(angle));
			
			up.push(Math.sin(angle));
	
			break;

		case 1:

			angle += 0.1;
			var oldUp = [];
			oldUp.push ([up[0]]);
			oldUp.push ([up[1]]);
			oldUp.push ([up[2]]);
			up.pop();
			up.pop();
			up.pop();
			up.push(0);
			up.push (Math.cos(angle));
			up.push(Math.sin(angle));
			break;
			
			
		case 2:

			lookAtSpot[1] -= 0.1;
			break;
			
		case 3:
			lookAtSpot[1] += 0.1;
			break;
		
		case 4:

			lookAtSpot[2] += 0.1;
		
			break;
			
		case 5:

			lookAtSpot[2] += 0.1;
			break;
	
	}

	}
}

function pressA(){
	if (xCameraTurn > -1*maxCameraTurn){
	xCameraTurn -= 1;
	switch(camera){

		case 0:
			lookAtSpot[2] += 0.1;


			break;

		case 1:
			lookAtSpot[2] -= 0.1;


			break;
			
		case 2:

			lookAtSpot[0] -= 0.1;
			break;
			
		case 3:
			lookAtSpot[0] += 0.1;
			break;
			
		case 4:

			angle -= 0.1;
			var oldUp = [];
			oldUp.push ([up[0]]);
			oldUp.push ([up[1]]);
			oldUp.push ([up[2]]);
			up.pop();
			up.pop();
			up.pop();
			up.push(Math.sin(angle));
			up.push(0);
			up.push (Math.cos(angle));
			
			break;
			
		case 5:
			angle -= 0.1;
			var oldUp = [];
			oldUp.push ([up[0]]);
			oldUp.push ([up[1]]);
			oldUp.push ([up[2]]);
			up.pop();
			up.pop();
			up.pop();
			
			up.push(Math.sin(angle-3.2));
			up.push(0);
			up.push (Math.cos(angle-3.2));
			
			break;
	}

	}
}

function pressD(){
	if (xCameraTurn < maxCameraTurn){
	xCameraTurn += 1;
	switch(camera){
		case 0:
			lookAtSpot[2] -= 0.1;

			break;

		case 1:
			lookAtSpot[2] += 0.1;

			break;
		case 2:

			lookAtSpot[0] += 0.1;
			break;
			
		case 3:
			lookAtSpot[0] -= 0.1;
			break;
			
			
		case 4:

			angle += 0.1;
			var oldUp = [];
			oldUp.push ([up[0]]);
			oldUp.push ([up[1]]);
			oldUp.push ([up[2]]);
			up.pop();
			up.pop();
			up.pop();
			up.push(Math.sin(angle));
			up.push(0);
			up.push (Math.cos(angle));
			
			break;
			
		case 5:
			angle += 0.1;
			var oldUp = [];
			oldUp.push ([up[0]]);
			oldUp.push ([up[1]]);
			oldUp.push ([up[2]]);
			up.pop();
			up.pop();
			up.pop();
			up.push(Math.sin(angle-3.2));
			up.push(0);
			up.push (Math.cos(angle-3.2));

			break;
	}

	}
}
function hitLeft(){
	for (var i = 0; i<objects.length;i++){
		if (objects[i].type == "leftWall"){

			objects[i].translation[0] += 0.15;
		}
		if (objects[i].type == "ball"){

			objects[i].leftHit();
			
		}
		

	}
	rightOffset[0] -= .15;
}
function missLeft(){
	for (var i = 0; i<objects.length;i++){
		if (objects[i].type == "leftWall"){

			objects[i].translation[0] -= 0.15;
		}
		if (objects[i].type == "ball"){

			objects[i].leftMiss();
			
		}
		

	}
	rightOffset[0] += .15;
}


function hitRight(){
	for (var i = 0; i<objects.length;i++){
		
		if (objects[i].type == "rightWall"){

			objects[i].translation[0] -= 0.15;
		}
		//objects[i].hitLeft();
		if (objects[i].type == "ball"){

			objects[i].rightHit();
			
		}
		
	}
		
	
	leftOffset[0] += .15;
}

function missRight(){
	for (var i = 0; i<objects.length;i++){
		
		if (objects[i].type == "rightWall"){

			objects[i].translation[0] += 0.15;
		}
		//objects[i].hitLeft();
		if (objects[i].type == "ball"){

			objects[i].rightMiss();
			
		}
		
	}
		
	
	leftOffset[0] -= .15;
}

function hitTop(){
	for (var i = 0; i<objects.length;i++){
		if (objects[i].type == "topWall"){

			objects[i].translation[1] -= 0.15;
		}
		if (objects[i].type == "ball"){

			objects[i].topHit();
			
		}
	}

	bottomOffset[1] += .15;
}

function missTop(){
	for (var i = 0; i<objects.length;i++){
		if (objects[i].type == "topWall"){

			objects[i].translation[1] += 0.15;
		}
		if (objects[i].type == "ball"){

			objects[i].topMiss();
			
		}
	}

	bottomOffset[1] -= .15;
}


function hitBottom(){
	for (var i = 0; i<objects.length;i++){
		if (objects[i].type == "bottomWall"){

			objects[i].translation[1] += 0.15;
		}
		if (objects[i].type == "ball"){

			objects[i].bottomHit();
			
		}
	}
	topOffset[1] -= .15;
	
}

function missBottom(){
	for (var i = 0; i<objects.length;i++){
		if (objects[i].type == "bottomWall"){

			objects[i].translation[1] -= 0.15;
		}
		if (objects[i].type == "ball"){

			objects[i].bottomMiss();
			
		}
	}
	topOffset[1] += .15;
	
}

function hitFront(){
	for (var i = 0; i<objects.length;i++){
		if (objects[i].type == "frontWall"){

			objects[i].translation[2] -= 0.15;
		}
		
		if (objects[i].type == "ball"){

			objects[i].frontHit();
			
		}
	}
	backOffset[2] += .15;
}


function missFront(){
	for (var i = 0; i<objects.length;i++){
		if (objects[i].type == "frontWall"){

			objects[i].translation[2] += 0.15;
		}
		
		if (objects[i].type == "ball"){

			objects[i].frontMiss();
			
		}
	}
	backOffset[2] -= .15;
}


function hitBack(){
	for (var i = 0; i<objects.length;i++){
		if (objects[i].type == "backWall"){

			objects[i].translation[2] += 0.15;
		}
		if (objects[i].type == "ball"){

			objects[i].backHit();
			
		}
	}
	frontOffset[2] -= .15;
}


function missBack(){
	for (var i = 0; i<objects.length;i++){
		if (objects[i].type == "backWall"){

			objects[i].translation[2] -= 0.15;
		}
		if (objects[i].type == "ball"){

			objects[i].backMiss();
			
		}
	}
	frontOffset[2] += .15;
}
function getWallOffset(side){
	var len = 1;
	var offset = [];
	switch(side){
		case "left":
			offset = [-len,0,0];
			break;
		case "right":
			offset = [len,0,0];
			break;
		case "front":
			offset = [0,0,len];
			break;
		case "back":
			offset = [0,0,-len];
			break;
		case "bottom":
			offset = [0,-len,0];
			break;
			
		case "top":
			offset = [0,len,0];
			break;
			
	}
	return offset;
}
function getWall(vertices, vertexColors, indices, side){
	var shortSide=0.001;
	var longSide = 1;
	switch(side){
		case "left":
			var left = -shortSide;
			var right = shortSide;
			var top = -longSide;
			var bottom = longSide;
			var back = -longSide;
			var front = longSide;
			/*for (var i = 0;i<8;i++){
				vertexColors.push(vec4(1.0,0,1.0,1.0));
			}*/


			break;
		case "right":
			var left = -shortSide;
			var right = shortSide;
			var top = -longSide;
			var bottom = longSide;
			var back = -longSide;
			var front = longSide;
			/*for (var i = 0;i<8;i++){
				vertexColors.push(vec4(0,1.0,1.0,1.0));
			}*/
			break;
		case "front":
			var left = -longSide;
			var right = longSide;
			var top = -longSide;
			var bottom = longSide;
			var back = -shortSide;
			var front = shortSide;
			/*for (var i = 0;i<8;i++){
				vertexColors.push(vec4(0,0,1.0,1.0));
			}*/
			break;
		case "back":
			var left = -longSide;
			var right = longSide;
			var top = -longSide;
			var bottom = longSide;
			var back = -shortSide;
			var front = shortSide;
			/*for (var i = 0;i<8;i++){
				vertexColors.push(vec4(1.0,1.0,0,1.0));
			}*/
			break;
		case "bottom":
			var left = -longSide;
			var right = longSide;
			var top = -shortSide;
			var bottom = shortSide;
			var back = -longSide;
			var front = longSide;
			/*for (var i = 0;i<8;i++){
				vertexColors.push(vec4(0,1.0,0,1.0));
			}*/
			break;
			
		case "top":
			var left = -longSide;
			var right = longSide;
			var top = -shortSide;
			var bottom = shortSide;
			var back = -longSide;
			var front = longSide;
			/*for (var i = 0;i<8;i++){
				vertexColors.push(vec4(1.0,0,0,1.0));
			}*/
			break;
			
	}
	
	vertices.push( vec3( left, top, front  ));
	vertices.push( vec3( left, bottom, front ));
	vertices.push( vec3( right, bottom, front ));
	vertices.push( vec3(  right, top, front));
	vertices.push( vec3( left,top,back ));
	vertices.push( vec3( left, bottom,back));
	vertices.push( vec3( right,bottom,back ));
	vertices.push( vec3( right, top,back));

	
	vertexColors.push(vec4( 0.0, 0.0, 0.0, 1.0 ));
	vertexColors.push(vec4( 1.0, 0.0, 0.0, 1.0 ));
	vertexColors.push(vec4( 1.0, 1.0, 0.0, 1.0 ));
	vertexColors.push(vec4( 0.0, 1.0, 0.0, 1.0 ));
	vertexColors.push(vec4( 0.0, 0.0, 1.0, 1.0 ));
	vertexColors.push(vec4( 1.0, 0.0, 1.0, 1.0 ));
	vertexColors.push(vec4( 1.0, 1.0, 1.0, 1.0 ));
	vertexColors.push(vec4( 0.0, 1.0, 1.0, 1.0 ));
	
	
	
	var boxIndices = [
		1, 0, 3,
		3, 2, 1,
		2, 3, 7,
		7, 6, 2,
		3, 0, 4,
		4, 7, 3,
		6, 5, 1,
		1, 2, 6,
		4, 5, 6,
		6, 7, 4,
		5, 4, 0,
		0, 1, 5
	];
	
	for (var i = 0;i<boxIndices.length;i=i+6){
		var a = vertices[boxIndices[i]];
		var b = vertices[boxIndices[i+1]];
		var c =vertices[boxIndices[i+2]];
		var t1 = subtract(b, a);
		var t2 = subtract(c, b);
		var normal = cross(t1, t2);
		normal = vec3(normal);
		normal = normalize(normal);
		normalBuffer.push(normal);
		normalBuffer.push(normal);
		normalBuffer.push(normal);
		normalBuffer.push(normal);
		normalBuffer.push(normal);
		normalBuffer.push(normal);
	}
	for (var i = 0;i<boxIndices.length;i++){
		indices.push(boxIndices[i]);
		
	}
	
}

function getBullet(vertices, vertexColors, indices){
	var left = -0.02;
	var right = 0.02;
	var top = 0.02;
	var bottom = -0.02;
	var front = 0.02;
	var back = -0.02;
	vertices.push( vec3( left, top, front  ));
	vertices.push( vec3( left, bottom, front ));
	vertices.push( vec3( right, bottom, front ));
	vertices.push( vec3( right, top, front));
	vertices.push( vec3( left,top,back ));
	vertices.push( vec3( left, bottom,back));
	vertices.push( vec3( right,bottom,back ));
	vertices.push( vec3( right, top,back));

	
	for (var i = 0;i<8;i++){
		vertexColors.push(vec4(1.0,1.0,1.0,1.0));
	}
	/*
	vertexColors.push(vec4( 0.0, 0.0, 0.0, 1.0 ));
	vertexColors.push(vec4( 1.0, 0.0, 0.0, 1.0 ));
	vertexColors.push(vec4( 1.0, 1.0, 0.0, 1.0 ));
	vertexColors.push(vec4( 0.0, 1.0, 0.0, 1.0 ));
	vertexColors.push(vec4( 0.0, 0.0, 1.0, 1.0 ));
	vertexColors.push(vec4( 1.0, 0.0, 1.0, 1.0 ));
	vertexColors.push(vec4( 1.0, 1.0, 1.0, 1.0 ));
	vertexColors.push(vec4( 0.0, 1.0, 1.0, 1.0 ));
	*/
	
	var boxIndices = [
		1, 0, 3,
		3, 2, 1,
		2, 3, 7,
		7, 6, 2,
		3, 0, 4,
		4, 7, 3,
		6, 5, 1,
		1, 2, 6,
		4, 5, 6,
		6, 7, 4,
		5, 4, 0,
		0, 1, 5
	];
	for (var i = 0;i<boxIndices.length;i=i+6){
		var a = vertices[boxIndices[i]];
		var b = vertices[boxIndices[i+1]];
		var c =vertices[boxIndices[i+2]];
		var t1 = subtract(b, a);
		var t2 = subtract(c, b);
		var normal = cross(t1, t2);
		normal = vec3(normal);
		normal = normalize(normal);
		normalBuffer.push(normal);
		normalBuffer.push(normal);
		normalBuffer.push(normal);
		normalBuffer.push(normal);
		normalBuffer.push(normal);
		normalBuffer.push(normal);
	}
	for (var i = 0;i<boxIndices.length;i++){
		indices.push(boxIndices[i]);
		
	}
	
}

function getCircle(vertices, vertexColors, indices){
	var radius = 0.05;
	var latitudeBands = 10;
	var longitudeBands = 10;


    //var normalData = [];
   // var textureCoordData = [];
    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
      var theta = latNumber * Math.PI / latitudeBands;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);

      for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        var phi = longNumber * 2 * Math.PI / longitudeBands;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);

        var x = cosPhi * sinTheta;
        var y = cosTheta;
        var z = sinPhi * sinTheta;

		vertices.push(vec3( radius * x, radius * y, radius * z) );
		vertexColors.push(vec4(1*longNumber/longitudeBands,0.0,1*latNumber/latitudeBands,1.0));
		
      }
    }
	
	 
    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
      for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
        var first = (latNumber * (longitudeBands + 1)) + longNumber;
        var second = first + longitudeBands + 1;
        indices.push(first);
        indices.push(second);
        indices.push(first + 1);

        indices.push(second);
        indices.push(second + 1);
        indices.push(first + 1);
      }
    }
	
	for (var i = 0;i<indices.length;i=i+6){
		var a = vertices[indices[i]];
		var b = vertices[indices[i+1]];
		var c =vertices[indices[i+2]];
		var t1 = subtract(b, a);
		var t2 = subtract(c, b);
		var normal = cross(t1, t2);
		normal = vec3(normal);
		normal = normalize(normal);
		normalBuffer.push(normal);
		normalBuffer.push(normal);
		normalBuffer.push(normal);
		normalBuffer.push(normal);
		normalBuffer.push(normal);
		normalBuffer.push(normal);
	}



}

function setVertices(){
	this.offset = 0;
	this.size = 0.1;
	this.v = [
		vec3(this.offset-this.size, this.offset-this.size, this.offset+this.size),
		vec3(this.offset-this.size, this.offset+this.size, this.offset+this.size),
		vec3(this.offset+this.size, this.offset+this.size, this.offset+this.size),
		vec3(this.offset+this.size, this.offset-this.size, this.offset+this.size),
		vec3(this.offset-this.size, this.offset-this.size, this.offset-this.size),
		vec3(this.offset-this.size, this.offset+this.size, this.offset-this.size),
		vec3(this.offset+this.size, this.offset+this.size, this.offset-this.size),
		vec3(this.offset+this.size, this.offset-this.size, this.offset-this.size)
	];

	return this.v;
	

	return this.vertices;
	
	

}
function setVertexColors(){
	this.vc = [
		vec4( 0.0, 0.0, 0.0, 1.0 ), // black
		vec4( 1.0, 0.0, 0.0, 1.0 ), // red
		vec4( 1.0, 1.0, 0.0, 1.0 ), // yellow
		vec4( 0.0, 1.0, 0.0, 1.0 ), // green
		vec4( 0.0, 0.0, 1.0, 1.0 ), // blue
		vec4( 1.0, 0.0, 1.0, 1.0 ), // magenta
		vec4( 1.0, 1.0, 1.0, 1.0 ), // white
		vec4( 0.0, 1.0, 1.0, 1.0 ) // cyan
	];
	return this.vc;
}

function setIndices(offset){
	var i = [
		1, 0, 3,
		3, 2, 1,
		2, 3, 7,
		7, 6, 2,
		3, 0, 4,
		4, 7, 3,
		6, 5, 1,
		1, 2, 6,
		4, 5, 6,
		6, 7, 4,
		5, 4, 0,
		0, 1, 5
	];
	for (var j=0;j<i.length;j++){
		i[j] += offset;
	}
	return i;
}
function generateCube(vertices, vertexColors, indices){
	
	vertices = this.v;
	vertexColors = this.vc;
	indices = this.i;
	/*i = this.indices;
	vc = this.vertexColors;
	v = this.vertices;*/

}

function clearArrays(v,vc,ind){
	while (v.length > 0){
		v.pop(0);
	}
	

	while(vc.length > 0){
		vc.pop();
	}
	while (ind.length > 0){
		ind.pop();
	}
	
}

function adjustIndices(indices, offset){
	for (var i=0;i<indices.length;i++){
		indices[i]+=offset;
	}
}

function resetBall(){
	canShoot = true;
	for (var i=0;i<objects.length;i++){
		if (objects[i].type == "bullet"){

			objects[i].setTranslation([-5,-5,-5]);
		}
	}
}

function shoot(x,y){

	switch(camera){
		
		case 0:
			for (var i=0; i<objects.length;i++){
				if (objects[i].type == "bullet"){
					var speed = .1;
					var end = [-1,y*1.5-yCameraTurn*.1,-x*1.5-xCameraTurn*.1];
					for (var j=0;j<end.length;j++){
						end[j] = end[j]*speed;
					}
					objects[i].setTranslation([.9-(worldOffset[0]+0.9),0,0]);
					objects[i].setTranslationSpeed([end[0],end[1],end[2]]);
				}
			}
			break;
	
		case 1:
			for (var i=0; i<objects.length;i++){
				if (objects[i].type == "bullet"){
					var speed = .1;
					var end = [1,y*1.5-yCameraTurn*.1,x*1.5+xCameraTurn*.1];

					for (var j=0;j<end.length;j++){
						end[j] = end[j]*speed;
					}
					objects[i].setTranslation([-.9-(worldOffset[0]-0.9),0,0]);
					objects[i].setTranslationSpeed([end[0],end[1],end[2]]);
				}
			}
			break;
		case 3:
			for (var i=0; i<objects.length;i++){
				if (objects[i].type == "bullet"){
					var speed = .1;
					var end = [x*1.5+xCameraTurn*.1,y*1.5-yCameraTurn*.1,-1];
					for (var j=0;j<end.length;j++){
						end[j] = end[j]*speed;
					}
					objects[i].setTranslation([0,0,-.9-(worldOffset[2]-0.9)]);
					objects[i].setTranslationSpeed([end[0],end[1],end[2]]);
				}
			}
			break;
		case 2:
			for (var i=0; i<objects.length;i++){
				if (objects[i].type == "bullet"){
					var speed = .1;
					var end = [-x*1.5-xCameraTurn*.1,y*1.5-yCameraTurn*.1,1];
					for (var j=0;j<end.length;j++){
						end[j] = end[j]*speed;
					}
					objects[i].setTranslation([0,0,.9-(worldOffset[2]+0.9)]);
					objects[i].setTranslationSpeed([end[0],end[1],end[2]]);
				}
			}
			break;
		case 5:
			for (var i=0; i<objects.length;i++){
				if (objects[i].type == "bullet"){
					var speed = .1;
					var end = [-x*1.5-xCameraTurn*.1,1,-y*1.5+yCameraTurn*.1];
					for (var j=0;j<end.length;j++){
						end[j] = end[j]*speed;
					}
					objects[i].setTranslation([0,-.9-(worldOffset[1]-0.9),0]);
					objects[i].setTranslationSpeed([end[0],end[1],end[2]]);
				}
			}
			break;
		case 4:
			for (var i=0; i<objects.length;i++){
				if (objects[i].type == "bullet"){
					var speed = .1;
					var end = [x*1.5+xCameraTurn*.1,-1,-y*1.5+yCameraTurn*.1];
					for (var j=0;j<end.length;j++){
						end[j] = end[j]*speed;
					}
					objects[i].setTranslation([0,.9-(worldOffset[1]+0.9),0]);
					objects[i].setTranslationSpeed([end[0],end[1],end[2]]);
				}
			}
			break;
	}
}

function start(){
		worldOffset = rightOffset;
		//Left Wall
		clearArrays(vertices, vertexColors, indices);
		getWall(vertices, vertexColors, indices,"left");
		adjustIndices(indices, vertexOffset);
		objects.push(new ScreenObject(gl, iBuffer, vBuffer, cBuffer, indices, vertices, vertexColors, flatten(indices).length, flatten(vertices).length, iIndex, pIndex, cIndex,getWallOffset("left"),"leftWall"));
		cIndex+=flatten(vertexColors).length*4;
		pIndex+=flatten(vertices).length*4;
		iIndex+=flatten(indices).length;
		vertexOffset += flatten(vertices).length/3;
		
		//Top Wall
		clearArrays(vertices, vertexColors, indices);
		getWall(vertices, vertexColors, indices,"top");
		adjustIndices(indices, vertexOffset);
		objects.push(new ScreenObject(gl, iBuffer, vBuffer, cBuffer, indices, vertices, vertexColors, flatten(indices).length, flatten(vertices).length, iIndex, pIndex, cIndex,getWallOffset("top"),"topWall"));
		cIndex+=flatten(vertexColors).length*4;
		pIndex+=flatten(vertices).length*4;
		iIndex+=flatten(indices).length;
		vertexOffset += flatten(vertices).length/3;
		
		//Right Wall
		clearArrays(vertices, vertexColors, indices);
		getWall(vertices, vertexColors, indices,"right");
		adjustIndices(indices, vertexOffset);
		objects.push(new ScreenObject(gl, iBuffer, vBuffer, cBuffer, indices, vertices, vertexColors, flatten(indices).length, flatten(vertices).length, iIndex, pIndex, cIndex,getWallOffset("right"),"rightWall"));
		cIndex+=flatten(vertexColors).length*4;
		pIndex+=flatten(vertices).length*4;
		iIndex+=flatten(indices).length;
		vertexOffset += flatten(vertices).length/3;
		
		//Bottom Wall
		clearArrays(vertices, vertexColors, indices);
		getWall(vertices, vertexColors, indices,"bottom");
		adjustIndices(indices, vertexOffset);
		objects.push(new ScreenObject(gl, iBuffer, vBuffer, cBuffer, indices, vertices, vertexColors, flatten(indices).length, flatten(vertices).length, iIndex, pIndex, cIndex,getWallOffset("bottom"),"bottomWall"));
	
		cIndex+=flatten(vertexColors).length*4;
		pIndex+=flatten(vertices).length*4;
		iIndex+=flatten(indices).length;
		vertexOffset += flatten(vertices).length/3;
		
		//Back Wall
		clearArrays(vertices, vertexColors, indices);
		getWall(vertices, vertexColors, indices,"back");
		adjustIndices(indices, vertexOffset);
		objects.push(new ScreenObject(gl, iBuffer, vBuffer, cBuffer, indices, vertices, vertexColors, flatten(indices).length, flatten(vertices).length, iIndex, pIndex, cIndex,getWallOffset("back"),"backWall"));

		cIndex+=flatten(vertexColors).length*4;
		pIndex+=flatten(vertices).length*4;
		iIndex+=flatten(indices).length;
		vertexOffset += flatten(vertices).length/3;
		
		//Front Wall
		clearArrays(vertices, vertexColors, indices);
		getWall(vertices, vertexColors, indices,"front");
		adjustIndices(indices, vertexOffset);
		objects.push(new ScreenObject(gl, iBuffer, vBuffer, cBuffer, indices, vertices, vertexColors, flatten(indices).length, flatten(vertices).length, iIndex, pIndex, cIndex,getWallOffset("front"),"frontWall"));
		cIndex+=flatten(vertexColors).length*4;
		pIndex+=flatten(vertices).length*4;
		iIndex+=flatten(indices).length;
		vertexOffset += flatten(vertices).length/3;
		
		
		//Ball
		clearArrays(vertices, vertexColors, indices);
		getCircle(vertices, vertexColors, indices);
		adjustIndices(indices, vertexOffset);
		objects.push(new ScreenObject(gl, iBuffer, vBuffer, cBuffer, indices, vertices, vertexColors, flatten(indices).length, flatten(vertices).length, iIndex, pIndex, cIndex,[0,0,0],"ball"));
		cIndex+=flatten(vertexColors).length*4;
		pIndex+=flatten(vertices).length*4;
		iIndex+=flatten(indices).length;
		vertexOffset += flatten(vertices).length/3;
		
		//Bullet
		clearArrays(vertices, vertexColors, indices);
		getBullet(vertices, vertexColors, indices);
		adjustIndices(indices, vertexOffset);
		objects.push(new ScreenObject(gl, iBuffer, vBuffer, cBuffer, indices, vertices, vertexColors, flatten(indices).length, flatten(vertices).length, iIndex, pIndex, cIndex,[0,0,0],"bullet"));
		cIndex+=flatten(vertexColors).length*4;
		pIndex+=flatten(vertices).length*4;
		iIndex+=flatten(indices).length;
		vertexOffset += flatten(vertices).length/3;
		
		resetBall();
}
window.onload = function init() {

	canvas = document.getElementById( "gl-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGL isn’t available" ); }
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
	gl.enable(gl.DEPTH_TEST);
	gl.clear( gl.COLOR_BUFFER_BIT );
	
	document.getElementById("lightAmbientX").onchange = function() {
		lightAmbient[0] = event.srcElement.value;
	};
	document.getElementById("lightAmbientY").onchange = function() {
		lightAmbient[1] = event.srcElement.value;
	};
	document.getElementById("lightAmbientZ").onchange = function() {
		lightAmbient[2] = event.srcElement.value;
	};
	
	document.getElementById("lightDiffuseX").onchange = function() {
		lightDiffuse[0] = event.srcElement.value;
	};
	document.getElementById("lightDiffuseY").onchange = function() {
		lightDiffuse[1] = event.srcElement.value;
	};
	document.getElementById("lightDiffuseZ").onchange = function() {
		lightDiffuse[2] = event.srcElement.value;
	};
	
	document.getElementById("lightSpecularX").onchange = function() {
		lightSpecular[0] = event.srcElement.value;
	};
	document.getElementById("lightSpecularY").onchange = function() {
		lightSpecular[1] = event.srcElement.value;
	};
	document.getElementById("lightSpecularZ").onchange = function() {
		lightSpecular[2] = event.srcElement.value;
	};
	
	
	
	document.getElementById("materialAmbientX").onchange = function() {
		materialAmbient[0] = event.srcElement.value;
	};
	document.getElementById("materialAmbientY").onchange = function() {
		materialAmbient[1] = event.srcElement.value;
	};
	document.getElementById("materialAmbientZ").onchange = function() {
		materialAmbient[2] = event.srcElement.value;
	};
	
	document.getElementById("materialDiffuseX").onchange = function() {
		materialDiffuse[0] = event.srcElement.value;
	};
	document.getElementById("materialDiffuseY").onchange = function() {
		materialDiffuse[1] = event.srcElement.value;
	};
	document.getElementById("materialDiffuseZ").onchange = function() {
		materialDiffuse[2] = event.srcElement.value;
	};
	
	document.getElementById("materialSpecularX").onchange = function() {
		materialSpecular[0] = event.srcElement.value;
	};
	document.getElementById("materialSpecularY").onchange = function() {
		materialSpecular[1] = event.srcElement.value;
	};
	document.getElementById("materialSpecularZ").onchange = function() {
		materialSpecular[2] = event.srcElement.value;
	};
	
	
	document.getElementById("lightPosX").onchange = function() {
		lightPosition[0] = event.srcElement.value;
	};
	document.getElementById("lightPosY").onchange = function() {
		lightPosition[1] = event.srcElement.value;
	};
	document.getElementById("lightPosZ").onchange = function() {
		lightPosition[2] = event.srcElement.value;
	};
	
	
	document.getElementById("slider").onchange = function() {
		for (var i=0;i<objects.length;i++){
			if (objects[i].type == "ball"){
				objects[i].setSpeed(event.srcElement.value);
			}
		}	
	};
	document.getElementById("discSize").onchange = function() {
		for (var i=0;i<objects.length;i++){
			if (objects[i].type == "ball"){
				objects[i].setSize(event.srcElement.value);
			}
		}
		scale = event.srcElement.value;
	};
	canvas.addEventListener("mousedown", function(){
		var click = vec2(2*event.clientX/canvas.width-1,
			2*(canvas.height-event.clientY)/canvas.height-1);
		
		if (canShoot == true){
			shoot(click[0],click[1]);
			canShoot = false;
	
			
			//Set direction of the bullet
			
		}
	} );

	window.onkeydown = function(event) {
		var key = event.keyCode;
		switch(key) {
		case 87:
			pressW();
			break
			
		case 83:
			pressS();
			break
			
		case 65:
			pressA();
			break
			
		case 68:
			pressD();
			break
		case 80:
			printValue = true;
			break
		
		case 37:
			worldOffset = rightOffset;
			camera = 1;
			up = [0,1,0];
			cameraX=1;
			cameraY=0;
			cameraZ=0;
			lookAtSpot = [0,0,0];
			angle = 0;
			xCameraTurn = 0;
			yCameraTurn = 0;
			break;
		
		case 39:
			worldOffset = leftOffset;
			camera = 0;
			up = [0,1,0];
			cameraX=-1;
			cameraY=0;
			cameraZ=0;
			lookAtSpot = [0,0,0];
			angle = 0;
			xCameraTurn = 0;
			yCameraTurn = 0;
			break;
		
		
		case 38:
			worldOffset = backOffset;
			camera = 3;
			up = [0,1,0];
			cameraX=0;
			cameraY=0;
			cameraZ=1;
			lookAtSpot = [0,0,0];
			angle = 0;
			xCameraTurn = 0;
			yCameraTurn = 0;
			break;
		
		case 40:
			worldOffset = frontOffset
			camera = 2;
			up = [0,1,0];
			cameraX=0;
			cameraY=0;
			cameraZ=-1;
			lookAtSpot = [0,0,0];
			angle = 0;
			xCameraTurn = 0;
			yCameraTurn = 0;
			break;
		case 188:
			worldOffset = bottomOffset;
			camera = 4;
			up = [0,0,1];
			cameraX=0;
			cameraY=-1;
			cameraZ=0;
			lookAtSpot = [0,0,0];
			angle = 0;
			xCameraTurn = 0;
			yCameraTurn = 0;
			break;
		
		case 190:
			worldOffset = topOffset;
			camera = 5;
			up = [0,0,-1];
			cameraX=0;
			cameraY=-1;
			cameraZ=0;
			lookAtSpot = [0,0,0];
			angle = 0;
			xCameraTurn = 0;
			yCameraTurn = 0;
			break;

		}
		
		
		
	};
	
	// Load shaders and initialize attribute buffers
	
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );
	
	
	iBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
	
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, maxIndices, gl.STATIC_DRAW);

	
	vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, 12*maxPoints, gl.STATIC_DRAW);
	var vPosition = gl.getAttribLocation( program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	thetaLoc = gl.getUniformLocation(program, "theta");
	perspectiveLoc = gl.getUniformLocation(program, "perspective");
	lookAtLoc = gl.getUniformLocation(program, "lookAt");
	scaleLoc = gl.getUniformLocation(program, "scale");
	translationLoc = gl.getUniformLocation(program, "translation");
	worldOffsetLoc = gl.getUniformLocation(program, "worldOffset");
	scaleLoc = gl.getUniformLocation(program, "scale");
	ambientLoc = gl.getUniformLocation(program, "ambientProduct");
	diffuseLoc = gl.getUniformLocation(program, "diffuseProduct");
	specularLoc = gl.getUniformLocation(program, "specularProduct");
	lightPosLoc = gl.getUniformLocation(program, "lightPosition");
	shininessLoc = gl.getUniformLocation(program, "shininess");
	

	cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, 16*maxPoints, gl.STATIC_DRAW );
	var vColor = gl.getAttribLocation( program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	start();
	
	var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalBuffer), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

	render();

}
function render() {
	gl.clear( gl.COLOR_BUFFER_BIT );
	
	lookAtMatrix = lookAt([cameraX,cameraY,cameraZ],lookAtSpot,up);
	lookAtMatrix = [lookAtMatrix[0][0],lookAtMatrix[0][1],lookAtMatrix[0][2],lookAtMatrix[0][3],lookAtMatrix[1][0],lookAtMatrix[1][1],lookAtMatrix[1][2],lookAtMatrix[1][3],lookAtMatrix[2][0],lookAtMatrix[2][1],lookAtMatrix[2][2],lookAtMatrix[2][3],lookAtMatrix[3][0],lookAtMatrix[3][1],lookAtMatrix[3][2],lookAtMatrix[3][3]]

	perspectiveMatrix = perspective(70,1,1,10);
	

	perspectiveMatrix = [perspectiveMatrix[0][0],perspectiveMatrix[0][1],perspectiveMatrix[0][2],perspectiveMatrix[0][3],perspectiveMatrix[1][0],perspectiveMatrix[1][1],perspectiveMatrix[1][2],perspectiveMatrix[1][3],perspectiveMatrix[2][0],perspectiveMatrix[2][1],perspectiveMatrix[2][2],perspectiveMatrix[2][3],perspectiveMatrix[3][0],perspectiveMatrix[3][1],perspectiveMatrix[3][2],perspectiveMatrix[3][3]]
	
	gl.uniformMatrix4fv(perspectiveLoc,false,perspectiveMatrix);
	gl.uniformMatrix4fv(lookAtLoc, false, lookAtMatrix);
	gl.uniform3fv(worldOffsetLoc,worldOffset);
	
	
	ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	
	
    gl.uniform4fv(ambientLoc, flatten(ambientProduct));
    gl.uniform4fv(diffuseLoc, flatten(diffuseProduct) );
    gl.uniform4fv(specularLoc, flatten(specularProduct) );	
    gl.uniform4fv(lightPosLoc, flatten(lightPosition) );
	//gl.uniform4fv(lightPosLoc, flatten([worldOffset[0],worldOffset[1],worldOffset[2],0]) );
       
    gl.uniform1f(shininessLoc,materialShininess);

	var ballSpot;
	var bulletSpot;
	for (var i=0;i<objects.length;i++){
		
		if (objects[i].type == "ball"){
			ballSpot = objects[i].translation;
		}
		if (objects[i].type == "bullet"){
			bulletSpot = objects[i].translation;
		}
		
		objects[i].work();
	}
	var d = Math.sqrt(Math.pow((ballSpot[0]-bulletSpot[0]),2)+Math.pow((ballSpot[1]-bulletSpot[1]),2)+Math.pow((ballSpot[2]-bulletSpot[2]),2));

	if (d < (.05 + 0.05*scale)){
		resetBall();
		if (hits[camera] < 3){
			hits[camera] +=1;
			switch(camera){
				case 1:
					
					hitLeft();
					break;
				case 0:
					hitRight();
					break;
				case 2:
					hitBack();
					break;
				case 3:
					hitFront();
					break;
				case 4:
					hitTop();
					break;
				case 5:
					hitBottom();
					break;
			}
		}
	}
	
	if (bulletSpot[0] < -1 || bulletSpot[0] > 1 | bulletSpot[1] < -1 || bulletSpot[1] > 1 |bulletSpot[2] < -1 || bulletSpot[2] > 1 ){
		if (canShoot == false){
			resetBall();
			if (hits[camera] > 0 & hits[camera] < 3){
				hits[camera] -=1;
				switch(camera){
					case 1:
						
						missLeft();
						break;
					case 0:
						missRight();
						break;
					case 2:
						missBack();
						break;
					case 3:
						missFront();
						break;
					case 4:
						missTop();
						break;
					case 5:
						missBottom();
						break;
				}
			}
		}
	}	
	
	for (var i = 0;i<hits.length;i++){
		if (hits[i] < 3){
			break;
		}
		if (i==5){
			if (hasPrintWin == false){
			alert("You Win!");
			hasPrintWin = true;
			}
		}
	}
	
	for (var i=0;i<objects.length;i++){

		gl.uniform3fv(thetaLoc, objects[i].rotation);
		if (objects[i].type == "ball"){
			gl.uniform3fv(scaleLoc, [objects[i].scale,objects[i].scale,objects[i].scale]);
		}
		else{
			gl.uniform3fv(scaleLoc, [1.0,1.0,1.0]);
		}
		gl.uniform3fv(translationLoc, objects[i].translation);
		gl.drawElements( gl.TRIANGLES, objects[i].iSize, gl.UNSIGNED_BYTE, objects[i].iIndex );
	}
		
	printValue = false;

	
	requestAnimFrame( render );
}


