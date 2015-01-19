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
var hitSound = new Audio("sounds/hit.wav");
var hurtSound = new Audio("sounds/hurt.wav");
var textSound = new Audio("sounds/text.wav");
var findItemSound = new Audio("sounds/fanfare.wav");

var linkX = 7;
var linkY = 6;

var mapX = 7;
var mapY = 7;

var hasSword = false;
var hasBoomerang = false;

var currentHearts = 3;
var maxHearts = 3;

var rupeesCount = 0;
var keyCount = 0;
var bombCount = 0;

var viewport = $("#viewport");
var level = $("#level");
var link = $("#link");
var boomerang = $("#boomerang");
var beacon = $("#beacon");
var hearts = $("#hearts-bottom");
var rupees = $("#rupees");
var keys = $("#keys");
var bombs = $("#bombs");

link.addClass("up");

var canWalkThruWalls = function(){
    return $("#walkThruWalls:checked").val();
};

var canLinkMove = true;
var isGamePaused = false;

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

var moveUp = function(){
    if (!canLinkMove || isGamePaused) {
        return;
    }

    if (!link.hasClass("up")) {
        link.removeClass("down left right").addClass("up");
        return;
    }

    if (!canWalkThruWalls() && getUpFromLink() === 0) {
        console.log("link can't move up");
        return;
    } else if (getUpFromLink() === 2) {
        linkY--;
        console.log("cave");
        enterCave();
        return;
    } else if (getUpFromLink() === 4) {
        linkY--;
        console.log("dungeon");
        enterDungeon();
        return;
    } else {
        if (getEnemyDomNodeAt(linkX, linkY-1).length) {
            console.log("take damage");
            updateHealth(-1);
            console.log("enemy " + getEnemyType(currentEnemyMap[linkY-1][linkX]));
            return;
        }

        var itemNodes = getItemDomNodeAt(linkX, linkY-1);
        if (itemNodes.length) {
            findItem(itemNodes.eq(0));
            console.log("found item")
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

var getUpFromLink = function(){
    return currentMap[linkY-1] && currentMap[linkY-1][linkX];
};

var moveDown = function(){
    if (!canLinkMove || isGamePaused) {
        return;
    }

    if (!link.hasClass("down")) {
        link.removeClass("up left right").addClass("down");
        return;
    }

    if (!canWalkThruWalls() && getDownFromLink() === 0) {
        console.log("link can't move down");
        return;
    } else if (getDownFromLink() === 3) {
        linkY++;
        console.log("exit cave");
        exitCave();
        return;
    } else {
        if (getEnemyDomNodeAt(linkX, linkY+1).length) {
            console.log("take damage");
            updateHealth(-1);
            console.log("enemy " + getEnemyType(currentEnemyMap[linkY+1][linkX]));
            return;
        }

        var itemNodes = getItemDomNodeAt(linkX, linkY+1);
        if (itemNodes.length) {
            findItem(itemNodes.eq(0));
            console.log("found item")
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

var getDownFromLink = function(){
    return currentMap[linkY+1] && currentMap[linkY+1][linkX];
};

var moveLeft = function(){
    if (!canLinkMove || isGamePaused) {
        return;
    }

    if (!link.hasClass("left")) {
        link.removeClass("up down right").addClass("left");
        return;
    }

    if (!canWalkThruWalls() && getLeftFromLink() === 0) {
        console.log("link can't move left");
        return;
    } else {
        if (getEnemyDomNodeAt(linkX-1, linkY).length) {
            console.log("take damage");
            updateHealth(-1);
            console.log("enemy " + getEnemyType(currentEnemyMap[linkY][linkX-1]));
            return;
        }

        var itemNodes = getItemDomNodeAt(linkX-1, linkY);
        if (itemNodes.length) {
            findItem(itemNodes.eq(0));
            console.log("found item")
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

var getLeftFromLink = function(){
    return currentMap[linkY] && currentMap[linkY][linkX-1];
};

var moveRight = function(){
    if (!canLinkMove || isGamePaused) {
        return;
    }

    if (!link.hasClass("right")) {
        link.removeClass("up down left").addClass("right");
        return;
    }

    if (!canWalkThruWalls() && getRightFromLink() === 0) {
        console.log("link can't move right");
        return;
    } else {
        if (getEnemyDomNodeAt(linkX+1, linkY).length) {
            console.log("take damage");
            updateHealth(-1);
            console.log("enemy " + getEnemyType(currentEnemyMap[linkY][linkX+1]));
            return;
        }

        var itemNodes = getItemDomNodeAt(linkX+1, linkY);
        if (itemNodes.length) {
            findItem(itemNodes.eq(0));
            console.log("found item")
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

var getRightFromLink = function(){
    return currentMap[linkY] && currentMap[linkY][linkX+1];
};

var preCaveMapX, preCaveMapY, preCaveLinkX, preCaveLinkY, preCaveMovementMap;

var caveTextMap = {
    "6-6": "BUY SOMETHIN' WILL YA!",
    "7-7": "IT'S DANGEROUS TO GO\nALONE! TAKE THIS."
};

var caveTextInterval;

var enterCave = function(){
//    overworldSound.pause();
    viewport.addClass("cave");
    $("#cave-sprites").removeClass("hidden");
    var printCaveText = $("#printCaveText");

    printCaveText.removeClass("hidden");

    preCaveMapX = mapX;
    preCaveMapY = mapY;
    preCaveLinkX = linkX;
    preCaveLinkY = linkY;
    preCaveMovementMap = currentMap;

    link.css("top", "200px");
    boomerang.css("top", "200px");
    linkY = 9;

    link.css("left", "112px");
    boomerang.css("left", "112px");
    linkX = 7;

    var caveSprites = $("[data-cave='" + preCaveMapX + "-" + preCaveMapY + "']");
    caveSprites.removeClass("hidden");

    var caveText = caveTextMap[preCaveMapX + "-" + preCaveMapY] || "";

    var texty = "";

    function getNextLetter() {
        if (caveText.length) {
            var toReturn = caveText[0];
            var chopped = caveText.substring(1);
            caveText = chopped;
            textSound.play();
            return toReturn;
        }

        caveTextInterval.stop();
        canLinkMove = true;
        return "";
    }

    caveTextInterval = $.timer(function(){
        texty = printCaveText.text();
        texty += getNextLetter();
        printCaveText.text(texty);
    }, 100);
    caveTextInterval.play();
    canLinkMove = false;

    currentMap = m_cave;
};

var exitCave = function(){
//    overworldSound.currentTime = 0;
//    overworldSound.play();

    viewport.removeClass("cave");
    $("#cave-sprites").addClass("hidden");
    $(".cave-text").addClass("hidden");
    $("#printCaveText").text("");

    var caveSprites = $("[data-cave]");
    caveSprites.addClass("hidden");
    caveTextInterval.stop();

    mapX = preCaveMapX;
    mapY = preCaveMapY;
    linkX = preCaveLinkX;
    linkY = preCaveLinkY;
    currentMap  = preCaveMovementMap;

    var linkTop = (linkY * 16) + 56;
    var linkLeft = linkX * 16;

    link.css("top", linkTop + "px");
    boomerang.css("top", linkTop + "px");

    link.css("left", linkLeft + "px");
    boomerang.css("left", linkLeft + "px");

};

var preDungeonMapX, preDungeonMapY, preDungeonLinkX, preDungeonLinkY, preDungeonMovementMap;

var dungeonInfo = {
    "7-3": {
        levelName: "LEVEL-1",
        "background-position-x": "-768px",
        "background-position-y": "-1232px",
        dungeonMapX: 3,
        dungeonMapY: 7
    }
};

var enterDungeon = function(){
    viewport.addClass("dungeon");

    var dungeonStart = dungeonInfo[mapX + "-" + mapY];

    level.text(dungeonStart.levelName);

    viewport.css({
        "background-position-x": dungeonStart["background-position-x"],
        "background-position-y": dungeonStart["background-position-y"]
    });

    preDungeonMapX = mapX;
    preDungeonMapY = mapY;
    preDungeonLinkX = linkX;
    preDungeonLinkY = linkY;
    preDungeonMovementMap = currentMap;

    link.css("top", "200px");
    boomerang.css("top", "200px");
    linkY = 9;

    link.css("left", "112px");
    boomerang.css("left", "112px");
    linkX = 7;
};

var getItemDomNodeAt = function(x, y){
    return $("[data-item-x='" + x + "'][data-item-y='" + y + "']").not(".hidden");
};

var findItem = function(itemNode) {
    var itemType = itemNode.attr("data-item");
    var itemCost = parseInt(itemNode.attr("data-cost") || 0);

    console.log("itemType", itemType);

    switch (itemType) {
        case "sword":
            findSword();
            break;
        case "store-key":
            if (rupeesCount >= itemCost) {
                findItemSound.play();
                updateRupees(-itemCost);
                updateKeys(1);
            }
            break;
        default:
            break;
    }
};

var findSword = function(){
    findItemSound.play();
    hasSword = true;
    $("#a-box-item").removeClass("hidden");
    $("#cave-sword").remove();
    $("[data-cave='7-7']").remove();
    $("#printCaveText").text("");
    caveTextMap["7-7"] = "";
};

var doSword = function(){
    if (!hasSword) {
        return;
    }

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
        var enemy = getEnemyDomNodeAt(linkX+1, linkY);
        if (enemy.length) {
            console.log("enemy attacked! " + getEnemyType(enemy));
            currentEnemyMap[linkY][linkX+1] = 0;
            doEnemyDamage(enemy);
        }
    } else if (link.hasClass("left")) {
        var enemy = getEnemyDomNodeAt(linkX-1, linkY);
        if (enemy.length) {
            console.log("enemy attacked! " + getEnemyType(enemy));
            currentEnemyMap[linkY][linkX-1] = 0;
            doEnemyDamage(enemy);
        }
    } else if (link.hasClass("up")) {
        var enemy = getEnemyDomNodeAt(linkX, linkY-1);
        if (enemy.length) {
            console.log("enemy attacked! " + getEnemyType(enemy));
            currentEnemyMap[linkY-1][linkX] = 0;
            doEnemyDamage(enemy);
        }
    } else if (link.hasClass("down")) {
        var enemy = getEnemyDomNodeAt(linkX, linkY+1);
        if (enemy.length) {
            console.log("enemy attacked! " + getEnemyType(enemy));
            currentEnemyMap[linkY+1][linkX] = 0;
            doEnemyDamage(enemy);
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

var doEnemyDamage = function(enemy){
    var enemyHealth = parseInt(enemy.attr("data-hp"));

    if (enemyHealth === 1) {
        enemy.remove();
        killSound.play();
    } else {
        enemy.attr("data-hp", enemyHealth - 1);
        hitSound.play();
    }
};

var doBoomerang = function(){
    if (!hasBoomerang) {
        return;
    }

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
    $("#item-menu").slideToggle({ easing: "linear" });
    isGamePaused = !isGamePaused;
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

var updateHealth = function(difference){
    difference = difference || 0;
    currentHearts += difference;

    if (currentHearts <= 0) {
        currentHearts = 0;
        console.log("you died");
    }

    var heartsHtml = "";
    for (var i = 0; i < currentHearts; i ++) {
        heartsHtml += '<img src="images/heart.png">';
    }

    for (var i = 0; i < maxHearts - currentHearts; i ++) {
        heartsHtml += '<img src="images/heart-empty.png" class="heart-empty">';
    }

    hearts.html(heartsHtml);
};

updateHealth();

var updateRupees = function(difference){
    difference = difference || 0;

    if (rupeesCount < 0) {
        return;
    }

    rupeesCount += difference;

    if (rupeesCount < 100) {
        rupees.text("X" + rupeesCount);
    } else {
        rupees.text(rupeesCount);
    }
};

updateRupees(255);

var updateKeys = function(difference){
    difference = difference || 0;

    if (keyCount < 0) {
        return;
    }

    keyCount += difference;

    keys.text("X" + keyCount);
};

updateKeys(0);

var updateBombs = function(difference){
    difference = difference || 0;

    if (bombCount < 0) {
        return;
    }

    bombCount += difference;

    bombs.text("X" + bombCount);
};

updateBombs(0);

var rightInterval;
var leftInterval;
var upInterval;
var downInterval;

$.event.special.tap.tapholdThreshold = 100;

$("#up").on("tap", function(){
    moveUp();
//    upInterval = $.timer(function(){
//        moveUp();
//    }, 200);
//    upInterval.play();
//}).on("vmouseup", function(){
//    upInterval.stop();
//    upInterval = undefined;
});

$("#down").on("tap", function(){
    moveDown();
//    downInterval = $.timer(function(){
//        moveDown();
//    }, 200);
//    downInterval.play();
//}).on("vmouseup", function(){
//    downInterval.stop();
//    downInterval = undefined;
});

$("#left").on("tap", function(){
    moveLeft();
//    leftInterval = $.timer(function(){
//        moveLeft();
//    }, 200);
//    leftInterval.play();
//}).on("vmouseup", function(){
//    leftInterval.stop();
//    leftInterval = undefined;
});

$("#right").on("tap", function(){
    moveRight();
//    rightInterval = $.timer(function(){
//        moveRight();
//    }, 200);
//    rightInterval.play();
//}).on("vmouseup", function(){
//    rightInterval.stop();
//    rightInterval = undefined;
})

$("#a-button").on("tap", function(){
//    if (rightInterval) {
//        rightInterval.stop();
//    }
//    if (leftInterval) {
//        leftInterval.stop();
//    }
//    if (upInterval) {
//        upInterval.stop();
//    }
//    if (downInterval) {
//        downInterval.stop();
//    }
//
//    rightInterval = undefined;
//    leftInterval = undefined;
//    upInterval = undefined;
//    downInterval = undefined;

    doSword();
});

$("#b-button").on("tap", function(){
    doBoomerang();
});

$("#start-button").on("tap", function(){
    doStart();
});

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
    //'m'
    if (e.which == 77) {
        $("#map-builder").toggle();
    }
    //'n'
    if (e.which == 78) {
        $("#debug").toggle();
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

//overworldSound.play();
