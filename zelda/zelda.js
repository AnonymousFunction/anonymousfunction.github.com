$(document).ready(function(){
    //set viewport size
    var widthScale = Number(window.innerWidth/256).toFixed(2);
    var heightScale = Number(window.innerHeight/346).toFixed(2);

    if (widthScale <= heightScale) {
        $("meta[name=viewport]").attr("content", "initial-scale=" + widthScale + ", user-scalable=no");
    } else {
        $("meta[name=viewport]").attr("content", "initial-scale=" + heightScale + ", user-scalable=no");
    }

	var overworldSound = new Audio("sounds/overworld.mp3");
    var swordSound = new Audio("sounds/sword.wav");
    var boomerangSound = new Audio("sounds/boomerang.wav");
    var killSound = new Audio("sounds/kill.wav");

	var linkX = 7;
	var linkY = 6;

	var mapX = 7;
	var mapY = 7;

	var viewport = $("#viewport");
	var link = $("#link");
    var boomerang = $("#boomerang");
	var beacon = $("#beacon");
    var hearts = $("#hearts-bottom");

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
        if (!link.hasClass("left")) {
            link.removeClass("up down right").addClass("left");
            return;
        }

		if (!canWalkThruWalls() && currentMap[linkY] && currentMap[linkY][linkX-1] === 0) {
			console.log("link can't move left");
			return;
		} else {
            if (currentEnemyMap[linkY] && currentEnemyMap[linkY][linkX-1] &&  currentEnemyMap[linkY][linkX-1] != 0) {
                console.log("enemy " + getEnemyType(currentEnemyMap[linkY][linkX-1]));
                return;
            }
			linkX--;
		}

		var originaLeft = parseInt(link.css("left"));
		var newLeft = originaLeft - 16;

		if (newLeft >= 0) {		
			link.css("left", newLeft + "px");		
			boomerang.css("left", newLeft + "px");
		} else {
			var origMapLeft = parseInt(viewport.css("background-position-x"));
			if (origMapLeft <= -256) {
				var newMapLeft = origMapLeft + 256;
				viewport.css("background-position-x", newMapLeft + "px");

				var origBeaconLeft = parseInt(beacon.css("left"));
				var newBeaconLeft = origBeaconLeft - 4;
				beacon.css("left", newBeaconLeft + "px");

				link.css("left", "240px");
				boomerang.css("left", "240px");
				linkX = 15;
				mapX--;
			}
		}

		updateMapValues();
	};

	var moveRight = function(){
        if (!link.hasClass("right")) {
            link.removeClass("up down left").addClass("right");
            return;
        }

		if (!canWalkThruWalls() && currentMap[linkY] && currentMap[linkY][linkX+1] === 0) {
			console.log("link can't move right");
			return;
		} else {
            if (currentEnemyMap[linkY] && currentEnemyMap[linkY][linkX+1] && currentEnemyMap[linkY][linkX+1] != 0) {
                console.log("enemy " + getEnemyType(currentEnemyMap[linkY][linkX+1]));
                return;
            }
			linkX++;
		}

		var originaLeft = parseInt(link.css("left"));
		var newLeft = originaLeft + 16;
		
		if (newLeft < 256) {
			link.css("left", newLeft + "px");	
			boomerang.css("left", newLeft + "px");
		} else {
			var origMapLeft = parseInt(viewport.css("background-position-x"));
			if (origMapLeft > -4096) {				
				var newMapLeft = origMapLeft - 256;
				viewport.css("background-position-x", newMapLeft + "px");

				var origBeaconLeft = parseInt(beacon.css("left"));
				var newBeaconLeft = origBeaconLeft + 4;
				beacon.css("left", newBeaconLeft + "px");

				link.css("left", "0px");
				boomerang.css("left", "0px");
				linkX = 0;
				mapX++;
			}	
		}

		updateMapValues();
	};

	var moveUp = function(){
        if (!link.hasClass("up")) {
            link.removeClass("down left right").addClass("up");
            return;
        }

		if (!canWalkThruWalls() && currentMap[linkY-1] && currentMap[linkY-1][linkX] === 0) {
			console.log("link can't move up");
			return;
		} else if (currentMap[linkY-1] && currentMap[linkY-1][linkX] === 2) {
			linkY--;
			console.log("cave");
		} else {
            if (currentEnemyMap[linkY-1] && currentEnemyMap[linkY-1][linkX] != 0) {
                console.log("enemy " + getEnemyType(currentEnemyMap[linkY-1][linkX]));
                return;
            }
			linkY--;
		}

		var originalTop = parseInt(link.css("top"));
		var newTop = originalTop - 16;

		if (newTop >= 56) {
			link.css("top", newTop + "px");	
			boomerang.css("top", newTop + "px");
		} else {
			var origMapTop = parseInt(viewport.css("background-position-y"));
			if (origMapTop < 0) {
				var newMapTop = origMapTop + 176;
				viewport.css("background-position-y", newMapTop + "px");

				var origBeaconTop = parseInt(beacon.css("top"));
				var newBeaconTop = origBeaconTop - 4;
				beacon.css("top", newBeaconTop + "px");

				link.css("top", "216px");
				boomerang.css("top", "216px");
				linkY = 10;
				mapY--;
			}
		}

		updateMapValues();
	};

	var moveDown = function(){
        if (!link.hasClass("down")) {
            link.removeClass("up left right").addClass("down");
            return;
        }

		if (!canWalkThruWalls() && currentMap[linkY+1] && currentMap[linkY+1][linkX] === 0) {
			console.log("link can't move down");
			return;
		} else {
            if (currentEnemyMap[linkY+1] && currentEnemyMap[linkY+1][linkX] != 0) {
                console.log("enemy " + getEnemyType(currentEnemyMap[linkY+1][linkX]));
                return;
            }
			linkY++;
		}

		var originalTop = parseInt(link.css("top"));
		var newTop = originalTop + 16;

		if (newTop < 232) {
			//Moving down one square
			link.css("top", newTop + "px");
			boomerang.css("top", newTop + "px");
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
				boomerang.css("top", "56px");
				linkY = 0;
				mapY++;
			}
		}

		updateMapValues();
	};

	var doSword = function(){
        if (upInterval) {
            upInterval.pause();
        }
        if (downInterval) {
            downInterval.pause();
        }
        if (leftInterval) {
            leftInterval.pause();
        }
        if (rightInterval) {
            rightInterval.pause();
        }

		link.addClass("sword");
		swordSound.play();

        if (link.hasClass("right")) {
            if (currentEnemyMap[linkY] && currentEnemyMap[linkY][linkX+1] && currentEnemyMap[linkY][linkX+1] != 0) {
                console.log("enemy attacked! " + getEnemyType(currentEnemyMap[linkY][linkX+1]));
                currentEnemyMap[linkY][linkX+1] = 0;
                killSound.play();
                drawEnemies();
            }
        } else if (link.hasClass("left")) {
            if (currentEnemyMap[linkY] && currentEnemyMap[linkY][linkX-1] && currentEnemyMap[linkY][linkX-1] != 0) {
                console.log("enemy attacked! " + getEnemyType(currentEnemyMap[linkY][linkX-1]));
                currentEnemyMap[linkY][linkX-1] = 0;
                killSound.play();
                drawEnemies();
            }
        } else if (link.hasClass("up")) {
            if (currentEnemyMap[linkY-1] && currentEnemyMap[linkY-1][linkX] != 0) {
                console.log("enemy attacked! " + getEnemyType(currentEnemyMap[linkY-1][linkX]));
                currentEnemyMap[linkY-1][linkX] = 0;
                killSound.play();
                drawEnemies();
            }
        } else if (link.hasClass("down")) {
            if (currentEnemyMap[linkY+1] && currentEnemyMap[linkY+1][linkX] != 0) {
                console.log("enemy attacked! " + getEnemyType(currentEnemyMap[linkY+1][linkX]));
                currentEnemyMap[linkY+1][linkX] = 0;
                killSound.play();
                drawEnemies();
            }
        }


		setTimeout(function(){
			link.removeClass("sword");
            if (upInterval) {
                upInterval.play();
            }
            if (downInterval) {
                downInterval.play();
            }
            if (leftInterval) {
                leftInterval.play();
            }
            if (rightInterval) {
                rightInterval.play();
            }
		}, 200);
	};

	var doBoomerang = function(){
        boomerang.addClass("throw");

        if (link.hasClass("up")) {
            boomerang.addClass("up");
        } else if (link.hasClass("down")) {
            boomerang.addClass("down");
        } else if (link.hasClass("left")) {
            boomerang.addClass("left");
        } else if (link.hasClass("right")) {
            boomerang.addClass("right");
        }

        boomerangSound.play();

        setTimeout(function(){
            boomerangSound.play();
            boomerang.removeClass("throw up down left right");
        }, 400);
	};

    var doStart = function(){
        $("#about").toggle();
    };

    var toggleController = function(){
        $("#controller").toggle();
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

    var currentHearts = 3;

    var updateHealth = function(){
        var heartsHtml = "";
        for (var i = 0; i < currentHearts; i ++) {
            heartsHtml += '<img src="images/heart.png">';
        }

        hearts.html(heartsHtml);
    };

    updateHealth();

    $("#left").on("tap", function(){
		moveLeft();
	});

	$("#right").on("tap", function(){
		moveRight();
	});

	$("#up").on("tap", function(){
		moveUp();
	});

	$("#down").on("tap", function(){
		moveDown();
	});

	$("#a-button").on("tap", function(){
		doSword();
	});

    $("#b-button").on("tap", function(){
		doBoomerang();
	});

    $("#start-button").on("tap", function(){
        doStart();
    });

    var rightInterval;
    var leftInterval;
    var upInterval;
    var downInterval;

	$("body").keydown(function(e){
		//right
		if (e.which == 39) {
            moveRight();
            rightInterval = $.timer(function(){
                moveRight();
            }, 200);
            rightInterval.play();
		}
		//left
		if (e.which == 37) {
			moveLeft();
            leftInterval = $.timer(function(){
                moveLeft();
            }, 200);
            leftInterval.play();
		}
		//up
		if (e.which == 38) {
			moveUp();
            upInterval = $.timer(function(){
                moveUp();
            }, 200);
            upInterval.play();
		}
		//down
		if (e.which == 40) {
			moveDown();
            downInterval = $.timer(function(){
                moveDown();
            }, 200);
            downInterval.play();
		}
		//right 'd'
		if (e.which == 68) {
            moveRight();
		}
		//left 'a'
		if (e.which == 65) {
			moveLeft();
		}
		//up 'w'
		if (e.which == 87) {
			moveUp();
		}
		//down 's'
		if (e.which == 83) {
			moveDown();
		}
		//sword
		if (e.which == 32) {
			doSword();
		}
		//boomerang 'z'
		if (e.which == 90) {
			doBoomerang();
		}
		//start 'q'
		if (e.which == 81) {
			doStart();
		}
		//'t'
		if (e.which == 84) {
			toggleController();
		}
	});

    $("body").keyup(function(e){
		//right
		if (e.which == 39) {
            rightInterval.stop();
            rightInterval = undefined;
		}
        //left
        if (e.which == 37) {
            leftInterval.stop();
            leftInterval = undefined;
        }
        //up
        if (e.which == 38) {
            upInterval.stop();
            upInterval = undefined;
        }
        //down
        if (e.which == 40) {
            downInterval.stop();
            downInterval = undefined;
        }
	});
});