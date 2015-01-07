$(document).ready(function(){
	// new Audio("overworld.mp3").play();

	var linkX = 7;
	var linkY = 6;

	var mapX = 7;
	var mapY = 7;

	var viewport = $("#viewport");
	var link = $("#link");
	var beacon = $("#beacon");
	link.addClass("up");

	var canWalkThruWalls = function(){
		return $("#walkThruWalls:checked").val();
	};

	var updateLinkXVal = function(){
		$("#linkXVal").text(linkX);
	};

	var updateLinkYVal = function(){
		$("#linkYVal").text(linkY);
	};

	var updateMapXVal = function(){
		$("#mapXVal").text(mapX);
	};

	var updateMapYVal = function(){
		$("#mapYVal").text(mapY);
		if (!currentMap.length) {
			$("#mapDefined").text("No");
		} else {
			$("#mapDefined").text("Yes");
		}
	};

	var updateBGXVal = function(){
		$("#bgXVal").text($("#viewport").css("background-position-x"));
	};

	var updateBGYVal = function(){
		$("#bgYVal").text($("#viewport").css("background-position-y"));
	};


	updateLinkXVal();
	updateLinkYVal();

	updateMapXVal();
	updateMapYVal();

	updateBGXVal();
	updateBGYVal();

	var moveLeft = function(){
		link.removeClass("up down right").addClass("left");

		if (!canWalkThruWalls() && currentMap[linkY] && currentMap[linkY][linkX-1] === 0) {
			console.log("link can't move left");
			return;
		} else {
			// console.log("link can move left");
			linkX--;
		}

		var originaLeft = parseInt(link.css("left"));
		var newLeft = originaLeft - 16;

		if (newLeft >= 0) {		
			link.css("left", newLeft + "px");		
		} else {
			var origMapLeft = parseInt(viewport.css("background-position-x"));
			if (origMapLeft <= -256) {
				var newMapLeft = origMapLeft + 256;
				viewport.css("background-position-x", newMapLeft + "px");

				var origBeaconLeft = parseInt(beacon.css("left"));
				var newBeaconLeft = origBeaconLeft - 4;
				beacon.css("left", newBeaconLeft + "px");

				link.css("left", "240px");
				linkX = 15;
				mapX--;
			}
		}

		updateMapValues();
	};

	var moveRight = function(){
		link.removeClass("up down left").addClass("right");	

		if (!canWalkThruWalls() && currentMap[linkY] && currentMap[linkY][linkX+1] === 0) {
			console.log("link can't move right");
			return;
		} else {
			// console.log("link can move right");
			linkX++;
		}

		var originaLeft = parseInt(link.css("left"));
		var newLeft = originaLeft + 16;
		
		if (newLeft < 256) {
			link.css("left", newLeft + "px");	
		} else {
			var origMapLeft = parseInt(viewport.css("background-position-x"));
			if (origMapLeft > -4096) {				
				var newMapLeft = origMapLeft - 256;
				viewport.css("background-position-x", newMapLeft + "px");

				var origBeaconLeft = parseInt(beacon.css("left"));
				var newBeaconLeft = origBeaconLeft + 4;
				beacon.css("left", newBeaconLeft + "px");

				link.css("left", "0px");
				linkX = 0;
				mapX++;
			}	
		}

		updateMapValues();
	};

	var moveUp = function(){
		link.removeClass("down left right").addClass("up");

		if (!canWalkThruWalls() && currentMap[linkY-1] && currentMap[linkY-1][linkX] === 0) {
			console.log("link can't move up");
			return;
		} else if (currentMap[linkY-1] && currentMap[linkY-1][linkX] === 2) {
			linkY--;
			console.log("cave");
		} else {
			// console.log("link can move up");
			linkY--;
		}

		var originalTop = parseInt(link.css("top"));
		var newTop = originalTop - 16;

		if (newTop >= 56) {
			link.css("top", newTop + "px");	
		} else {
			var origMapTop = parseInt(viewport.css("background-position-y"));
			if (origMapTop < 0) {
				var newMapTop = origMapTop + 176;
				viewport.css("background-position-y", newMapTop + "px");

				var origBeaconTop = parseInt(beacon.css("top"));
				var newBeaconTop = origBeaconTop - 4;
				beacon.css("top", newBeaconTop + "px");

				link.css("top", "216px");
				linkY = 10;
				mapY--;
			}
		}

		updateMapValues();
	};

	var moveDown = function(){
		link.removeClass("up left right").addClass("down");

		if (!canWalkThruWalls() && currentMap[linkY+1] && currentMap[linkY+1][linkX] === 0) {
			console.log("link can't move down");
			return;
		} else {
			// console.log("link can move down");
			linkY++;
		}

		var originalTop = parseInt(link.css("top"));
		var newTop = originalTop + 16;

		if (newTop < 232) {
			//Moving down one square
			link.css("top", newTop + "px");
		} else {
			//Bottom of map, have to change map
			var origMapTop = parseInt(viewport.css("background-position-y"));

			if (origMapTop > -1232) {
				var newMapTop = origMapTop - 176;
				viewport.css("background-position-y", newMapTop + "px");

				var origBeaconTop = parseInt(beacon.css("top"));
				var newBeaconTop = origBeaconTop + 4;
				beacon.css("top", newBeaconTop + "px");

				link.css("top", "56px");
				linkY = 0;
				mapY++;
			}
		}

		updateMapValues();
	};

	var doSword = function(){
		link.addClass("sword");
		new Audio("sword.wav").play();
		setTimeout(function(){
			link.removeClass("sword");
		}, 200);
	};

	var updateMapValues = function(){
		updateLinkXVal();
		updateLinkYVal();
		setCurrentMap(mapX,mapY);
		updateMapXVal();
		updateMapYVal();
		updateBGXVal();
		updateBGYVal();
	};

	$("#left").on("click", function(){
		moveLeft();
	});

	$("#right").on("click", function(){
		moveRight();
	});

	$("#up").on("click", function(){
		moveUp();
	});

	$("#down").on("click", function(){
		moveDown();
	});

	$("#a-button").on("click", function(){
		doSword();
	});

	$("body").keydown(function(e){
		//right
		if (e.which == 39) {
			moveRight();
		}
		//left
		if (e.which == 37) {
			moveLeft();
		}
		//up
		if (e.which == 38) {
			moveUp();
		}
		//down
		if (e.which == 40) {
			moveDown();
		}
		//sword
		if (e.which == 32) {
			doSword();
		}
	});
});