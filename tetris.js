function draw() {
        var main = document.getElementById("main-ttrs");
        if (main.getContext) {
        	var ctx = main.getContext('2d');
        	ctx.fillStyle = 'rgb(200, 0, 0)';
        	ctx.fillRect(10, 10, 50, 50);
        }
    }

var pieces = {[name:i, rotStage:0, body:[0100,
										 0100,
										 0100,
										 0100]],
			  [name:i, rotStage:1, body:[0000,
			  							 1111,
			  							 0000,
			  							 0000]],
			  [name:i, rotStage:2, body:[0010,
			  							 0010,
			  							 0010,
			  							 0010]],
			  [name:i, rotStage:3, body:[0000,
			  							 0000,
			  							 1111,
			  							 0000]],
			  [name:j, rotStage:0, body:[0100,
										 0100,
										 1100,
										 0000]],
			  [name:j, rotStage:1, body:[1000,
			  							 1111,
			  							 0000,
			  							 0000]],
                       
  //to be continued
  
			  [name:j, rotStage:2, body:[0010,
			  							 0010,
			  							 0010,
			  							 0010]],
			  [name:j, rotStage:3, body:[0000,
			  							 0000,
			  							 1111,
			  							 0000]],

}
