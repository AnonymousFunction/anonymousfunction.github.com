/**
 * Enemy types:
 *
 * 1 - Red Octorok
 */

var getEnemyType = function(enemyVal){
    enemyVal = String(enemyVal);
    switch (enemyVal) {
        case "1":
            return {
                cssClass: "red-octorok",
                speed: 1500,
                hp: 1,
                damage: 1,
                canCollide: false
            };
        case "2":
            return {
                cssClass: "blue-octorok",
                speed: 1250,
                hp: 2,
                damage: 1,
                canCollide: false
            };
        default:
            return;
    }
};

var currentEnemyMap;

//default all maps
for (var x=0; x<16; x++){
    for (var y=0; y<8; y++) {
        window["e" + x + y] = [];
    }
}


var e87 = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,0,0,0,2,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

var enemyMap = [
    [e00,e10,e20,e30,e40,e50,e60,e70,e80,e90,e100,e110,e120,e130,e140,e150],
    [e01,e11,e21,e31,e41,e51,e61,e71,e81,e91,e101,e111,e121,e131,e141,e151],
    [e02,e12,e22,e32,e42,e52,e62,e72,e82,e92,e102,e112,e122,e132,e142,e152],
    [e03,e13,e23,e33,e43,e53,e63,e73,e83,e93,e103,e113,e123,e133,e143,e153],
    [e04,e14,e24,e34,e44,e54,e64,e74,e84,e94,e104,e114,e124,e134,e144,e154],
    [e05,e15,e25,e35,e45,e55,e65,e75,e85,e95,e105,e115,e125,e135,e145,e155],
    [e06,e16,e26,e36,e46,e56,e66,e76,e86,e96,e106,e116,e126,e136,e146,e156],
    [e07,e17,e27,e37,e47,e57,e67,e77,e87,e97,e107,e117,e127,e137,e147,e157]
];

var setCurrentEnemyMap = function(x, y){
    //backwards because I'm treating the first index as down the screen/map to make it more readable
    currentEnemyMap = enemyMap[y][x];

    drawEnemies();
};

var drawEnemies = function(){
    var enemies = $("#enemies");
    enemies.html("");
    var allEnemiesHtml = "";

    for (var x=0; x<16; x++){
        for (var y=0; y<11; y++) {
            if (currentEnemyMap[y] && getEnemyType(currentEnemyMap[y][x])) {
                var enemyType = currentEnemyMap[y][x];
                var enemy = getEnemyType(enemyType);

                var enemyHtml = "<div data-enemy='" + enemy.cssClass +  "' class='sprite enemy " +  enemy.cssClass + "'" +
                    "style='top: " + (56 + (y * 16)) + "px; left: " + (x + 0) * 16 + "px'" +
                    "data-hp='" + enemy.hp + "'" +
                    "data-damage='" + enemy.damage + "'" +
                    "data-enemy-type='" + enemyType + "'" +
                    "data-x='" + x + "'" +
                    "data-y='" + y + "'></div>";
                allEnemiesHtml += enemyHtml;
                console.log("enemy at x:" + x + " y:" + y + " = " + enemyHtml);
            }
        }
    }

    enemies.html(allEnemiesHtml);
    animateEnemies();
};

var enemyTimers = [];

var animateEnemies = function(){
    for (var i in enemyTimers) {
        enemyTimers[i].stop();
    }

    enemyTimers = [];

    var allEnemies = $(".enemy");

    allEnemies.each(function(){
        var enemy = $(this);
        var enemyType = getEnemyType(enemy.attr("data-enemy-type"));

        console.log("enemy animate", enemy.attr("data-enemy"));
        enemy.addClass(getRandomDirection());

        var enemyTimer = $.timer(function(){
            if (isGamePaused) {
                return;
            }

            enemy.removeClass("up down left right").addClass(getRandomDirection());

            if (enemy.hasClass("up")) {
                moveEnemyUp(enemy);
            } else if (enemy.hasClass("down")) {
                moveEnemyDown(enemy);
            } else if (enemy.hasClass("left")) {
                moveEnemyLeft(enemy);
            } else if (enemy.hasClass("right")) {
                moveEnemyRight(enemy);
            }
        }, enemyType.speed);

        enemyTimer.play();
        enemyTimers.push(enemyTimer);
    });

};

var moveEnemyUp = function(enemy){
    var originalTop = parseInt(enemy.css("top"));
    var newTop = originalTop - 16;
    if (newTop < 56) {
        return;
    }

    enemy.css("top", newTop + "px");

    var originalY = parseInt(enemy.attr("data-y"));
    var newY = originalY - 1;
    enemy.attr("data-y", newY);
};

var moveEnemyDown = function(enemy){
    var originalTop = parseInt(enemy.css("top"));
    var newTop = originalTop + 16;
    if (newTop > 216) {
        return;
    }
    enemy.css("top", newTop + "px");

    var originalY = parseInt(enemy.attr("data-y"));
    var newY = originalY + 1;
    enemy.attr("data-y", newY);
};

var moveEnemyLeft = function(enemy){
    var originalLeft = parseInt(enemy.css("left"));
    var newLeft = originalLeft - 16;
    if (newLeft < 0) {
        return;
    }
    enemy.css("left", newLeft + "px");

    var originalX = parseInt(enemy.attr("data-x"));
    var newX = originalX - 1;
    enemy.attr("data-x", newX);
};

var moveEnemyRight = function(enemy){
    var originalLeft = parseInt(enemy.css("left"));
    var newLeft = originalLeft + 16;
    if (newLeft >= 256) {
        return;
    }
    enemy.css("left", newLeft + "px");

    var originalX = parseInt(enemy.attr("data-x"));
    var newX = originalX + 1;
    enemy.attr("data-x", newX);
};

var getEnemyDomNodeAt = function(x, y){
    return $("[data-x='" + x + "'][data-y='" + y + "']");
};

var getRandomDirection = function(){
    var random = Math.floor(Math.random() * (4)) + 1;

    switch (random) {
        case 1:
            return "up";
            break;
        case 2:
            return "down";
            break;
        case 3:
            return "left";
            break;
        case 4:
            return "right";
            break;
        default:
            return "up";
    }
};
