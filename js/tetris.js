var dotSize = 20;
var mainWidth = 10 * dotSize;
var mainHeight = 20 * dotSize;
var step = 0.5;
var KEY = {
	ESC: 27,
	SPACE: 32,
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	W: 87,
	A: 65,
	S: 83,
	D: 68
};



//This function runs when current page is loaded
function draw() {
	var main = document.getElementById("main-ttrs");
	if (main.getContext) {
		var ctx = main.getContext('2d');
		ctx.canvas.width = mainWidth;
		ctx.canvas.height = mainHeight;
		pieces = setPieces(pieces);
		reload(ctx);
		var currentPiece = pickRandomPiece(pieces);
		drawPiece(ctx, currentPiece);
		//while (y<mainHeight) {
		document.addEventListener("keydown", function(event) {
			event.preventDefault();
			switch (event.keyCode) {
				case KEY.A:
				case KEY.LEFT:
					movePiece("left", currentPiece);
					reload(ctx);
					drawPiece(ctx, currentPiece);
					break;
				case KEY.D:
				case KEY.RIGHT:
					movePiece("right", currentPiece);
					reload(ctx);
					drawPiece(ctx, currentPiece);
					break;
				case KEY.W:
				case KEY.UP:
					currentPiece = rotatePiece(currentPiece);
					reload(ctx);
					drawPiece(ctx, currentPiece);
					break;
				case KEY.S:
				case KEY.DOWN:
					movePiece("down", currentPiece);
					reload(ctx);
					drawPiece(ctx, currentPiece);
					break;
			}


		}, false);

		setInterval(function() {
			currentPiece.y += 1;
			reload(ctx);
			drawPiece(ctx, currentPiece.x, currentPiece.y, currentPiece);
		}, step * 1000);
	}
}

function setPieces(pieces) {
	for (piece in pieces) {
		switch (pieces[piece].name) {
			case "i":
				pieces[piece].size = 4;
				pieces[piece].color = "cyan";
				break;
			case "j":
				pieces[piece].size = 3;
				pieces[piece].color = "blue";
				break;
			case "l":
				pieces[piece].size = 3;
				pieces[piece].color = "orange";
				break;
			case "o":
				pieces[piece].size = 2;
				pieces[piece].color = "pink";
				break;
			case "s":
				pieces[piece].size = 3;
				pieces[piece].color = "green";
				break;
			case "t":
				pieces[piece].size = 3;
				pieces[piece].color = "purple";
				break;
			case "z":
				pieces[piece].size = 3;
				pieces[piece].color = "red";
				break;
		}
	}
	return pieces;
}

function movePiece(dir, piece) {
	switch (dir) {
		case "left":
			piece.x -= 1;
			break;
		case "right":
			piece.x += 1;
			break;
		case "down":
			piece.y += 1;
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
	for (i = 0; i < mainWidth; i++) {
		ctx.moveTo(i * dotSize, 0);
		ctx.lineTo(i * dotSize, mainHeight);
	};
	ctx.stroke();
	//vertical lines
	ctx.beginPath();
	for (i = 0; i < mainHeight; i++) {
		ctx.moveTo(0, i * dotSize);
		ctx.lineTo(mainWidth, i * dotSize);
	};
	ctx.stroke();
}

//This function is drawing chosen piece starting at (x,y)
function drawPiece(ctx, piece) {
	ctx.fillStyle = piece.color;
	for (i = 0; i < piece.body.length; i++) {
		for (j = 0; j < piece.body[i].length; j++) {
			if (piece.body[i][j] != 0) {
				roundRect(ctx, (j + piece.x) * dotSize, (i + piece.y) * dotSize, dotSize, dotSize, dotSize / 4, true, true);
			}
		}
	}
}

//This function is picking random piece from pieces
function pickRandomPiece(pieces) {
	var randomPiece = pieces[Math.floor(Math.random() * (pieces.length - 1))];
	randomPiece.x = Math.floor(mainWidth / dotSize / 2);
	randomPiece.y = 0;
	return randomPiece
}

//This function is rotating current piece one step forward
function rotatePiece(piece) {
	var x = piece.x,
		y = piece.y;
	if (piece.rotStage === 3) {
		piece = findPiece(piece.name, 0);
	} else {
		piece = findPiece(piece.name, piece.rotStage + 1);
	}
	piece.x = x;
	piece.y = y;
	return piece;
}

//This function is drawing rectangle with rounded corners starting at (x,y)
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
	if (typeof stroke == 'undefined') {
		stroke = true;
	}
	if (typeof radius === 'undefined') {
		radius = 5;
	}
	if (typeof radius === 'number') {
		radius = {
			tl: radius,
			tr: radius,
			br: radius,
			bl: radius
		};
	} else {
		var defaultRadius = {
			tl: 0,
			tr: 0,
			br: 0,
			bl: 0
		};
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
	if (fill) {
		ctx.fill();
	}
	if (stroke) {
		ctx.stroke();
	}
}

//This is where all the pieces are listed.
var pieces = [{
		name: "i",
		rotStage: 0,
		body: ["0#00",
			"0#00",
			"0#00",
			"0#00"
		]
	},

	{
		name: "i",
		rotStage: 1,
		body: ["0000",
			"####",
			"0000",
			"0000"
		]
	},

	{
		name: "i",
		rotStage: 2,
		body: ["00#0",
			"00#0",
			"00#0",
			"00#0"
		]
	},

	{
		name: "i",
		rotStage: 3,
		body: ["0000",
			"0000",
			"####",
			"0000"
		]
	},

	{
		name: "j",
		rotStage: 0,
		body: ["0#0",
			"0#0",
			"##0"
		]
	},

	{
		name: "j",
		rotStage: 1,
		body: ["#00",
			"###",
			"000"
		]
	},

	{
		name: "j",
		rotStage: 2,
		body: ["0##",
			"0#0",
			"0#0"
		]
	},

	{
		name: "j",
		rotStage: 3,
		body: ["000",
			"###",
			"00#"
		]
	},

	{
		name: "l",
		rotStage: 0,
		body: ["0#0",
			"0#0",
			"0##"
		]
	},

	{
		name: "l",
		rotStage: 1,
		body: ["000",
			"###",
			"#00"
		]
	},

	{
		name: "l",
		rotStage: 2,
		body: ["##0",
			"0#0",
			"0#0"
		]
	},

	{
		name: "l",
		rotStage: 3,
		body: ["00#",
			"###",
			"000"
		]
	},

	{
		name: "o",
		rotStage: 0,
		body: ["##",
			"##"
		]
	},

	{
		name: "o",
		rotStage: 1,
		body: ["##",
			"##"
		]
	},

	{
		name: "o",
		rotStage: 2,
		body: ["##",
			"##"
		]
	},

	{
		name: "o",
		rotStage: 3,
		body: ["##",
			"##"
		]
	},

	{
		name: "s",
		rotStage: 0,
		body: ["000",
			"0##",
			"##0"
		]
	},

	{
		name: "s",
		rotStage: 1,
		body: ["#00",
			"##0",
			"0#0"
		]
	},

	{
		name: "s",
		rotStage: 2,
		body: ["0##",
			"##0",
			"000"
		]
	},

	{
		name: "s",
		rotStage: 3,
		body: ["0#0",
			"0##",
			"00#"
		]
	},

	{
		name: "t",
		rotStage: 0,
		body: ["000",
			"###",
			"0#0"
		]
	},

	{
		name: "t",
		rotStage: 1,
		body: ["0#0",
			"##0",
			"0#0"
		]
	},

	{
		name: "t",
		rotStage: 2,
		body: ["0#0",
			"###",
			"000"
		]
	},

	{
		name: "t",
		rotStage: 3,
		body: ["0#0",
			"0##",
			"0#0"
		]
	},

	{
		name: "z",
		rotStage: 0,
		body: ["000",
			"##0",
			"0##"
		]
	},

	{
		name: "z",
		rotStage: 1,
		body: ["0#0",
			"##0",
			"#00"
		]
	},

	{
		name: "z",
		rotStage: 2,
		body: ["##0",
			"0##",
			"000"
		]
	},

	{
		name: "z",
		rotStage: 3,
		body: ["00#",
			"0##",
			"0#0"
		]
	}
];