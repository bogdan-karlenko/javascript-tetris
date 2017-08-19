var dotSize = 20;
var mainWidth = 10*dotSize;
var mainHeight = 20*dotSize;

//This function runs when current page is loaded
function draw() {
        var main = document.getElementById("main-ttrs");
        if (main.getContext) {
        	var ctx = main.getContext('2d');
        	ctx.canvas.width = mainWidth;
        	ctx.canvas.height = mainHeight;
        	reload(ctx);
        	var currentPiece = pickRandomPiece(pieces);
        	drawPieceAt(ctx, 1, 1, currentPiece);

			document.addEventListener("keydown", function(event) {
				document.getElementById("txt1").value=event.key;
				currentPiece = rotatePiece(currentPiece);
				reload(ctx);
				drawPieceAt(ctx, 1, 1, currentPiece);
			}, false);
        }
    }

function reload(ctx) {
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, mainWidth, mainHeight);
	drawGrid(ctx);
}

//This function is returning piece with specified name and rotStage
function findPiece(name, rotStage) {
	for (piece in pieces) {
		if (pieces[piece].name == name && pieces[piece].rotStage == rotStage) {
			return pieces[piece];
		}
	}
} 
//This function is drawing a grid with specified dot size in pixels from dotSize variable.
function drawGrid(ctx) {
	ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
	//horisontal lines
	ctx.beginPath();
	for (i=0; i<mainWidth; i++) {
		ctx.moveTo(i*dotSize, 0);
		ctx.lineTo(i*dotSize, mainHeight);
	};
	ctx.stroke();
	//vertical lines
	ctx.beginPath();
	for (i=0; i<mainHeight; i++) {
		ctx.moveTo(0, i*dotSize);
		ctx.lineTo(mainWidth, i*dotSize);
	};
	ctx.stroke();
}

//This function is drawing chosen piece starting at (x,y)
function drawPieceAt(ctx, x, y, piece) {
	ctx.fillStyle = piece.color;
	for (i=0; i<piece.body.length; i++) {
		for (j=0; j<piece.body[i].length; j++) {
			if (piece.body[i][j] != 0) {
				roundRect(ctx, (i+x)*dotSize, (j+y)*dotSize, dotSize, dotSize, dotSize/4, true, true);
			}
		}
	}
}

//This function is picking random piece from pieces
function pickRandomPiece(pieces) {
return pieces[Math.floor(Math.random() * (pieces.length-1))]; 
}

//This function is rotating current piece one step forward
function rotatePiece(piece) {
	if (piece.rotStage === 3) {piece = findPiece(piece.name, 0);}
		else piece = findPiece(piece.name, piece.rotStage + 1);
	return piece;
}

//This function is drawing rectangle with rounded corners starting at (x,y)
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
	if (typeof stroke == 'undefined') {stroke = true;}
	if (typeof radius === 'undefined') {radius = 5;}
	if (typeof radius === 'number') {radius = {tl: radius, tr: radius, br: radius, bl: radius};}
	else {
		var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
		for (var side in defaultRadius) {
			radius[side] = radius[side] || defaultRadius[side];
		}
	}
	ctx.beginPath();
	ctx.moveTo(x + radius.tl, y);
	ctx.lineTo(x + width - radius.tr, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	ctx.lineTo(x + width, y + height - radius.br);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	ctx.lineTo(x + radius.bl, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	ctx.lineTo(x, y + radius.tl);
	ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	ctx.closePath();
	if (fill) {ctx.fill();}
	if (stroke) {ctx.stroke();}
}

//This is where all the pieces are listed.
var pieces = [{name:"i", rotStage:0, color:"cyan", body:["0#00",
										   "0#00",
										   "0#00",
										   "0#00"]},
			  {name:"i", rotStage:1, color:"cyan", body:["0000",
			  							   "####",
			  							   "0000",
			  							   "0000"]},
			  {name:"i", rotStage:2, color:"cyan", body:["00#0",
			  							   "00#0",
			  							   "00#0",
			  							   "00#0"]},
			  {name:"i", rotStage:3, color:"cyan", body:["0000",
			  							   "0000",
			  							   "####",
			  							   "0000"]},
			  {name:"j", rotStage:0, color:"blue", body:["0#00",
										   "0#00",
										   "##00",
										   "0000"]},
			  {name:"j", rotStage:1, color:"blue", body:["#000",
			  							   "###0",
			  							   "0000",
			  							   "0000"]},
			  {name:"j", rotStage:2, color:"blue", body:["0##0",//mmmmmmmm
			  							   "0#00",
			  							   "0#00",
			  							   "0000"]},
			  {name:"j", rotStage:3, color:"blue", body:["0000",
			  							   "###0",
			  							   "00#0",
			  							   "0000"]},
			  {name:"l", rotStage:0, color:"orange", body:["0#00",
										   "0#00",
										   "0##0",
										   "0000"]},
			  {name:"l", rotStage:1, color:"orange", body:["0000",
			  							   "###0",
			  							   "#000",
			  							   "0000"]},
			  {name:"l", rotStage:2, color:"orange", body:["##00",
			  							   "0#00",
			  							   "0#00",
			  							   "0000"]},
			  {name:"l", rotStage:3, color:"orange", body:["00#0",
			  							   "###0",
			  							   "0000",
			  							   "0000"]},			  							   			  							   
			  {name:"o", rotStage:0, color:"yellow", body:["##00",
										   "##00",
										   "0000",
										   "0000"]},
			  {name:"o", rotStage:1, color:"yellow", body:["##00",
			  							   "##00",
			  							   "0000",
			  							   "0000"]},
			  {name:"o", rotStage:2, color:"yellow", body:["##00",
			  							   "##0",
			  							   "0000",
			  							   "0000"]},
			  {name:"o", rotStage:3, color:"yellow", body:["##00",
			  							   "##00",
			  							   "0000",
			  							   "0000"]},                       
			  {name:"s", rotStage:0, color:"green", body:["0000",
										   "0##0",
										   "##00",
										   "0000"]},
			  {name:"s", rotStage:1, color:"green", body:["#000",
			  							   "##00",
			  							   "0#00",
			  							   "0000"]},
			  {name:"s", rotStage:2, color:"green", body:["0##0",
			  							   "##00",
			  							   "0000",
			  							   "0000"]},
			  {name:"s", rotStage:3, color:"green", body:["0#00",
			  							   "0##0",
			  							   "00#0",
			  							   "0000"]},
			  {name:"t", rotStage:0, color:"purple", body:["0000",
										   "###0",
										   "0#00",
										   "0000"]},
			  {name:"t", rotStage:1, color:"purple", body:["0#00",
			  							   "##00",
			  							   "0#00",
			  							   "0000"]},
			  {name:"t", rotStage:2, color:"purple", body:["0#00",
			  							   "###0",
			  							   "0000",
			  							   "0000"]},
			  {name:"t", rotStage:3, color:"purple", body:["#000",
			  							   "##00",
			  							   "#000",
			  							   "0000"]},                       
			  {name:"z", rotStage:0, color:"red", body:["0000",
										   "##00",
										   "0##0",
										   "0000"]},
			  {name:"z", rotStage:1, color:"red", body:["0#00",
			  							   "##00",
			  							   "#000",
			  							   "0000"]},
			  {name:"z", rotStage:2, color:"red", body:["##00",
			  							   "0##0",
			  							   "0000",
			  							   "0000"]},
			  {name:"z", rotStage:3, color:"red", body:["00#0",
			  							   "0##0",
			  							   "0#00",
			  							   "0000"]}];

