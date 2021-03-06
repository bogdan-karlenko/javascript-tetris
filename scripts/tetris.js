define(["tetris"], function() {
	var dotSize = 20;
	var mainWidth = 10;
	var mainHeight = 20;
	var speed = {
		changeTime: 60, //time before speed up (sec)
		step: 0.5, //time between steps of piece drop (sec)
		id: 0, //number of the speed
	}
	var firstStart = true;
	var playing = false;
	var linesOut = 0;
	var field = [];
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
		D: 68,
	};

	//	This function runs when current page is loaded
	function draw() {
		var main = document.getElementById("main-ttrs");
		var stats = document.getElementById("main-stats");
		if (main.getContext && stats.getContext) {
			statsCtx = stats.getContext("2d");
			ctx = main.getContext("2d");
			ctx.canvas.width = mainWidth * dotSize;
			ctx.canvas.height = mainHeight * dotSize;
			statsCtx.canvas.width = 150;
			statsCtx.canvas.height = 100;
			pieces = setPieces(pieces);

			field.length = mainHeight * mainWidth;
			clearField(field);
			statsDraw(statsCtx, "stopped");

			document.addEventListener("keydown", function(event) {
				switch (event.keyCode) {
					case KEY.SPACE:
						if (playing === false) {
							if (firstStart) {
								firstStart = false;
								playing = true;
								clearField(field);
								createNewPiece(ctx);
								var startSpeed = speed.step;
								var speedTimer = setInterval(function() {
									if (speed.id === 9) {
										clearInterval(speedTimer);
									} else {
										speed.id += 1;
										speed.step = startSpeed - (startSpeed - 0.05) / 9 * speed.id;
										statsDraw(statsCtx, "stats");
									}
								}, speed.changeTime * 1000);
							} else {
								location.reload(true);
							}
						}
						break;
					case KEY.ESC:
						playing = false;
						clearField(field);
						location.reload(true);
						break;
				}
			}, false);

			drawGrid(ctx);

		}
	}

	function statsDraw(ctx, state) {
		switch (state) {
			case "stopped":
				ctx.font = "22px Georgia bold";
				ctx.fillStyle = "red";
				ctx.fillText("Press Space", 20, 25);
				ctx.fillText("to start", 45, 50);
				break;
			case "clear":
				ctx.fillStyle = "white";
				ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
				break;
			case "stats":
				statsDraw(ctx, "clear");
				ctx.font = "18px Georgia bold";
				ctx.fillStyle = "black";
				ctx.fillText("Speed: " + speed.id, 20, 20);
				ctx.fillText("Lines: " + linesOut, 20, 40);
				break;
			case "gameover":
				statsDraw(ctx, "clear");
				ctx.font = "22px Georgia bold";
				ctx.fillStyle = "red";
				ctx.fillText("Game Over", 25, 25);
				ctx.fillText("Press Esc/Space", 5, 50);
				ctx.fillText("to restart", 30, 75);
				break;
		}
	}

	function clearField(field) {
		field.fill(0);
	}

	function removeLine(field) {
		for (var line = mainHeight - 1; line >= 0; line--) {
			var sum = 0;
			for (var row = 0; row < mainWidth; row++) {
				var idx = line * mainWidth + row;
				if (field[idx] !== 0) {
					sum += 1;
				}
			}
			if (sum === mainWidth) {
				linesOut += 1;
				statsDraw(statsCtx, "stats");
				field.splice(line * mainWidth, mainWidth);
				for (var i = 0; i < mainWidth; i++) {
					field.unshift(0);
				}
				line += 1;
			}

		}
	}

	function checkField(piece, field) {
		for (var i = 0; i < piece.body.length; i++) {
			for (var j = 0; j < piece.body[i].length; j++) {
				if (piece.body[i][j] != 0) {
					var idx = (piece.y + piece.edges.upper + i) * mainWidth + (piece.x + j); //	Converting from (x,y) to linear
					if (field[idx] !== 0) {
						return false
					}
				}
			}
		}
		return true;
	}


	function createNewPiece(ctx) {
		if (playing) {
			statsDraw(statsCtx, "stats");
			var currentPiece = pickRandomPiece(pieces);
			if (!checkField(currentPiece, field)) {
				playing = false;
				statsDraw(statsCtx, "gameover");
				//			location.reload(true);
				//			drawField(ctx, field);
				return;
			}
			removeLine(field);
			reload(ctx);
			gameCycle(ctx, currentPiece);
		}

	}

	function gameCycle(ctx, currentPiece) {

		var timerID = setInterval(function() {
			var returnValue = dropPiece(ctx, currentPiece);
			if (returnValue === true) {
				currentPiece.removedPiece = true;
				clearInterval(timerID);
				createNewPiece(ctx);
			}
		}, speed.step * 1000);

		document.addEventListener("keydown", function(event) {
			if (playing && !currentPiece.removedPiece) {
				keydownActions(event, ctx, currentPiece);
			}
		}, false);
	}

	function drawField(ctx, field) {
		for (i = 0; i < field.length; i++) {
			if (field[i] != 0) {
				var x = i % mainWidth; //	Converting linear coordinate to (x,y)
				var y = (i - x) / mainWidth;
				ctx.fillStyle = field[i];
				roundRect(ctx, x * dotSize, y * dotSize, dotSize, dotSize, dotSize / 4, true, true);
			}
		}
	}

	function savePiece(piece, field) {
		for (var i = 0; i < piece.body.length; i++) {
			for (var j = 0; j < piece.body[i].length; j++) {
				if (piece.body[i][j] != 0) {
					var idx = (piece.y + piece.edges.upper + i) * mainWidth + (piece.x + j); //	Converting from (x,y) to linear
					field[idx] = piece.color;
				}
			}
		}
	}

	function dropPiece(ctx, piece) {
		if (playing) {
			var endOfCycle = false;
			piece.y += 1;
			if (!checkEdge("down", piece) || !checkField(piece, field)) {
				piece.y -= 1;
				savePiece(piece, field);
				endOfCycle = true;
			}
			reload(ctx);
			drawPiece(ctx, piece);
			return endOfCycle;
		}
	}

	function keydownActions(event, ctx, currentPiece) {
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
				rotatePiece(currentPiece);
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
	}

	function checkAllEdges(piece) {
		return (checkEdge("left", piece) && checkEdge("right", piece) && checkEdge("down", piece));
	}

	function checkEdge(dir, piece) {
		switch (dir) {
			case "left":
				if ((piece.x + piece.edges.left) >= 0) return true;
				else return false;
				break;
			case "right":
				if ((piece.x + piece.edges.right) < mainWidth) return true;
				else return false;
				break;
			case "down":
				if ((piece.y + piece.edges.lower) < mainHeight) return true;
				else return false;
				break;
		}
	}

	function findEdges(piece) {
		var edges = {
			upper: null,
			lower: 0,
			right: 0,
			left: null,
		};
		for (var i = 0; i < piece.body.length; i++) {
			for (var j = 0; j < piece.body[i].length; j++) {
				if (piece.body[i][j] != 0) {
					if (edges.upper == null) {
						edges.upper = Number(i);
					}
					if (edges.lower < i) {
						edges.lower = Number(i);
					}
					if (edges.right < j) {
						edges.right = j;
					}
					if (edges.left == null || edges.left > j) {
						edges.left = j;
					}
				}
			}
		}
		return edges;
	}

	function setPieces(pieces) {
		for (piece in pieces) {
			pieces[piece].edges = findEdges(pieces[piece]);
			switch (pieces[piece].name) {
				case "i":
					pieces[piece].color = "cyan";
					break;
				case "j":
					pieces[piece].color = "blue";
					break;
				case "l":
					pieces[piece].color = "orange";
					break;
				case "o":
					pieces[piece].color = "pink";
					break;
				case "s":
					pieces[piece].color = "green";
					break;
				case "t":
					pieces[piece].color = "purple";
					break;
				case "z":
					pieces[piece].color = "red";
					break;
			}
		}
		return pieces;
	}

	function movePiece(dir, piece) {
		if (playing) {
			var newPiece = {};
			newPiece.x = piece.x;
			newPiece.y = piece.y;
			newPiece.body = [];
			for (var i = 0; i < piece.body.length; i++) {
				newPiece.body[i] = piece.body[i];
			}
			newPiece.edges = {};
			newPiece.edges.upper = piece.edges.upper;
			newPiece.edges.left = piece.edges.left;
			newPiece.edges.right = piece.edges.right;
			newPiece.edges.lower = piece.edges.lower;
			switch (dir) {
				case "left":
					newPiece.x -= 1;
					if (checkEdge(dir, newPiece) && checkField(newPiece, field)) {
						piece.x -= 1;
					}
					break;
				case "right":
					newPiece.x += 1;
					if (checkEdge(dir, newPiece) && checkField(newPiece, field)) {
						piece.x += 1;
					}
					break;
				case "down":
					newPiece.y += 1;
					if (checkEdge(dir, newPiece) && checkField(newPiece, field)) {
						piece.y += 1;
					}
					break;
			}
		}
	}

	function reload(ctx) {
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, mainWidth * dotSize, mainHeight * dotSize);
		drawGrid(ctx);
		drawField(ctx, field);
	}

	//	This function is returning piece with specified name and rotStage
	function findPiece(name, rotStage) {
		for (var i = 0; i < pieces.length; i++) {
			if (pieces[i].name === name && pieces[i].rotStage === rotStage) {
				return pieces[i];
			}
		}
	}

	//	This function is drawing a grid with specified dot size in pixels from dotSize variable.
	function drawGrid(ctx) {
		ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
		//	horisontal lines
		ctx.beginPath();
		for (i = 0; i < mainWidth * dotSize; i++) {
			ctx.moveTo(i * dotSize, 0);
			ctx.lineTo(i * dotSize, mainHeight * dotSize);
		};
		ctx.stroke();
		//	vertical lines
		ctx.beginPath();
		for (i = 0; i < mainHeight * dotSize; i++) {
			ctx.moveTo(0, i * dotSize);
			ctx.lineTo(mainWidth * dotSize, i * dotSize);
		};
		ctx.stroke();
	}

	//	This function is drawing chosen piece starting at (x,y)
	function drawPiece(ctx, piece) {
		if (playing) {
			ctx.fillStyle = piece.color;
			for (i = 0; i < piece.body.length; i++) {
				for (j = 0; j < piece.body[i].length; j++) {
					if (piece.body[i][j] != 0) {
						roundRect(ctx, (j + piece.x) * dotSize, (i + piece.y) * dotSize, dotSize, dotSize, dotSize / 4, true, true);
					}
				}
			}
		}
	}

	//	This function is picking random piece from pieces
	function pickRandomPiece() {
		var randomPiece = {};
		var idx = Math.floor(Math.random() * (pieces.length - 1));
		randomPiece.name = pieces[idx].name;
		randomPiece.body = [];
		for (var i = 0; i < pieces[idx].body.length; i++) {
			randomPiece.body[i] = pieces[idx].body[i];
		}
		randomPiece.edges = {};
		for (var i in pieces[idx].edges) {
			if (pieces[idx].edges.hasOwnProperty(i)) {
				randomPiece.edges[i] = pieces[idx].edges[i];
			}
		}
		randomPiece.rotStage = pieces[idx].rotStage;
		randomPiece.color = pieces[idx].color;
		randomPiece.x = Math.floor(mainWidth / 2 - 1);
		randomPiece.y = 0 - randomPiece.edges.upper;
		return randomPiece;
	}

	//	This function is rotating current piece one step forward
	function rotatePiece(piece) {
		if (playing) {
			var newPiece = null;
			if (piece.rotStage === 3) {
				newPiece = findPiece(piece.name, 0);
			} else {
				newPiece = findPiece(piece.name, piece.rotStage + 1);
			}
			newPiece.x = piece.x;
			newPiece.y = piece.y;
			if (!checkAllEdges(newPiece) || !checkField(newPiece, field)) {
				return;
			}
			piece.rotStage = newPiece.rotStage;
			piece.body = [];
			for (var i = 0; i < newPiece.body.length; i++) {
				piece.body[i] = newPiece.body[i];
			}
			piece.edges = {};
			piece.edges.upper = newPiece.edges.upper;
			piece.edges.lower = newPiece.edges.lower;
			piece.edges.left = newPiece.edges.left;
			piece.edges.right = newPiece.edges.right;
		}
	}

	//	This function is drawing rectangle with rounded corners starting at (x,y)
	function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
		if (typeof stroke == "undefined") {
			stroke = true;
		}
		if (typeof radius === "undefined") {
			radius = 5;
		}
		if (typeof radius === "number") {
			radius = {
				tl: radius,
				tr: radius,
				br: radius,
				bl: radius,
			};
		} else {
			var defaultRadius = {
				tl: 0,
				tr: 0,
				br: 0,
				bl: 0,
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

	//	This is where all the pieces are listed.
	var pieces = [{
			name: "i",
			rotStage: 0,
			body: ["0#00",
				"0#00",
				"0#00",
				"0#00",
			],
		},

		{
			name: "i",
			rotStage: 1,
			body: ["0000",
				"####",
				"0000",
				"0000",
			],
		},

		{
			name: "i",
			rotStage: 2,
			body: ["00#0",
				"00#0",
				"00#0",
				"00#0",
			],
		},

		{
			name: "i",
			rotStage: 3,
			body: ["0000",
				"0000",
				"####",
				"0000",
			],
		},

		{
			name: "j",
			rotStage: 0,
			body: ["0#0",
				"0#0",
				"##0",
			],
		},

		{
			name: "j",
			rotStage: 1,
			body: ["#00",
				"###",
				"000",
			],
		},

		{
			name: "j",
			rotStage: 2,
			body: ["0##",
				"0#0",
				"0#0",
			],
		},

		{
			name: "j",
			rotStage: 3,
			body: ["000",
				"###",
				"00#",
			],
		},

		{
			name: "l",
			rotStage: 0,
			body: ["0#0",
				"0#0",
				"0##",
			],
		},

		{
			name: "l",
			rotStage: 1,
			body: ["000",
				"###",
				"#00",
			],
		},

		{
			name: "l",
			rotStage: 2,
			body: ["##0",
				"0#0",
				"0#0",
			],
		},

		{
			name: "l",
			rotStage: 3,
			body: ["00#",
				"###",
				"000",
			],
		},

		{
			name: "o",
			rotStage: 0,
			body: ["##",
				"##",
			],
		},

		{
			name: "o",
			rotStage: 1,
			body: ["##",
				"##",
			],
		},

		{
			name: "o",
			rotStage: 2,
			body: ["##",
				"##",
			],
		},

		{
			name: "o",
			rotStage: 3,
			body: ["##",
				"##",
			],
		},

		{
			name: "s",
			rotStage: 0,
			body: ["000",
				"0##",
				"##0",
			],
		},

		{
			name: "s",
			rotStage: 1,
			body: ["#00",
				"##0",
				"0#0",
			],
		},

		{
			name: "s",
			rotStage: 2,
			body: ["0##",
				"##0",
				"000",
			],
		},

		{
			name: "s",
			rotStage: 3,
			body: ["0#0",
				"0##",
				"00#",
			],
		},

		{
			name: "t",
			rotStage: 0,
			body: ["000",
				"###",
				"0#0",
			],
		},

		{
			name: "t",
			rotStage: 1,
			body: ["0#0",
				"##0",
				"0#0",
			],
		},

		{
			name: "t",
			rotStage: 2,
			body: ["0#0",
				"###",
				"000",
			],
		},

		{
			name: "t",
			rotStage: 3,
			body: ["0#0",
				"0##",
				"0#0",
			],
		},

		{
			name: "z",
			rotStage: 0,
			body: ["000",
				"##0",
				"0##",
			],
		},

		{
			name: "z",
			rotStage: 1,
			body: ["0#0",
				"##0",
				"#00",
			],
		},

		{
			name: "z",
			rotStage: 2,
			body: ["##0",
				"0##",
				"000",
			],
		},

		{
			name: "z",
			rotStage: 3,
			body: ["00#",
				"0##",
				"0#0",
			],
		},
	];

	return draw();
});