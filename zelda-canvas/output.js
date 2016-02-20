var Sound = (function () {
    var isSoundOn = true;
    var cave = new Audio("sounds/cave.wav");
    var overworld = new Audio("sounds/overworld.mp3");
    var sword = new Audio("sounds/sword.wav");
    var text = new Audio("sounds/text.mp3");

    return {
        cave: {
            play: function () {
                if (isSoundOn) {
                    cave.play();
                }
            }
        },
        overworld: {
            play: function () {
                if (isSoundOn) {
                    overworld.play();
                }
            },
            stop: function(){
                overworld.pause();
                overworld.currentTime = 0;
            }
        },
        sword: {
            play: function () {
                if (isSoundOn) {
                    sword.play();
                }
            }
        },
        text: {
            play: function () {
                if (isSoundOn) {
                    text.play();
                }
            }
        }
    }
})();
var Merchant = function (game, center) {
    this.id = "merchant";
    this.game = game;
    this.size = { x: 16, y: 16 };
    this.center = { x: center.x, y: center.y };
};

Merchant.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);
    },

    update: function () {
    }
};
var OldMan = function (game, center) {
    this.id = "old-man";
    this.game = game;
    this.size = { x: 16, y: 16 };
    this.center = { x: center.x, y: center.y };
};

OldMan.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);
    },

    update: function () {
    }
};
var RedOctorok = function (game, direction, center) {
    this.id = "red-octorok-up-1";
    this.game = game;
    this.size = { x: 14, y: 14 };
    this.center = { x: center.x, y: center.y };
    this.tile = {}; //does this need to be defaulted?
    this.spriteChangeCount = 0;
    this.spriteCooldown = 8;
    this.velocity = .4;
    this.direction = direction;
    this.changeDirectionCooldown = 160;
    this.changeDirectionCount = 0;
    this.damage = 1;
};

RedOctorok.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);
    },

    kill: function(){
        this.game.removeBody(this);
        this.game.addBody(new Cloud(this.game, this.center));
    },

    update: function () {
        this.tile.x = parseInt(Number(this.center.x).toFixed(0) / 16);
        this.tile.y = parseInt(Number(this.center.y).toFixed(0) / 16);

        if (this.changeDirectionCount === 0) {
            this.changeDirectionCount = this.changeDirectionCooldown;
            this.direction = getRandomDirection();
            this.spriteChangeCount = 0;
        } else {
            this.changeDirectionCount--;
        }

        if (this.spriteChangeCount === 0) {
            this.spriteChangeCount = this.spriteCooldown;

            if (this.direction === "up") {
                this.id = this.id === "red-octorok-up-1" ? "red-octorok-up-2" : "red-octorok-up-1";
            } else if (this.direction === "down") {
                this.id = this.id === "red-octorok-down-1" ? "red-octorok-down-2" : "red-octorok-down-1";
            } else if (this.direction === "left") {
                this.id = this.id === "red-octorok-left-1" ? "red-octorok-left-2" : "red-octorok-left-1";
            } else if (this.direction === "right") {
                this.id = this.id === "red-octorok-right-1" ? "red-octorok-right-2" : "red-octorok-right-1";
            }
        } else {
            this.spriteChangeCount--;
        }

        if (this.direction === "up") {
            if (this.center.y - this.velocity > this.size.y / 2) {
                var newCenterY = this.center.y - this.velocity;
                var newTileY = parseInt(Number(newCenterY).toFixed(0) / 16);
                var leftBoundary = this.center.x - 4;
                var leftBoundaryTile = parseInt(Number(leftBoundary).toFixed(0) / 16);
                var rightBoundary = this.center.x + 4;
                var rightBoundaryTile = parseInt(Number(rightBoundary).toFixed(0) / 16);

                if (this.game.movementMap[newTileY][leftBoundaryTile] === 0 || this.game.movementMap[newTileY][rightBoundaryTile] === 0) {
                    return;
                }

                this.center.y -= this.velocity;
            }
        } else if (this.direction === "down") {
            if (this.center.y + this.velocity < this.game.size.y - this.size.y / 2) {
                var newCenterY = this.center.y + this.size.y / 2 + this.velocity;
                var newTileY = parseInt(Number(newCenterY).toFixed(0) / 16);
                var leftBoundary = this.center.x - 4;
                var leftBoundaryTile = parseInt(Number(leftBoundary).toFixed(0) / 16);
                var rightBoundary = this.center.x + 4;
                var rightBoundaryTile = parseInt(Number(rightBoundary).toFixed(0) / 16);

                if (this.game.movementMap[newTileY] && (this.game.movementMap[newTileY][leftBoundaryTile] === 0 || this.game.movementMap[newTileY][rightBoundaryTile] === 0)) {
                    return;
                }

                this.center.y += this.velocity;
            }
        } else if (this.direction === "left") {
            if (this.center.x - this.velocity > this.size.x / 2) {
                var newCenterX = this.center.x - this.size.x / 2 + this.velocity;
                var newTileX = parseInt(Number(newCenterX).toFixed(0) / 16);
                var bottomY = this.center.y + this.size.y / 2;
                var bottomTileY = parseInt(Number(bottomY).toFixed(0) / 16);

                if (this.game.movementMap[this.tile.y][newTileX] === 0 || this.game.movementMap[bottomTileY][newTileX] === 0) {
                    return;
                }

                this.center.x -= this.velocity;
            }
        } else if (this.direction === "right") {
            if (this.center.x + this.velocity < this.game.size.x - this.size.x / 2) {
                var newCenterX = this.center.x + this.size.x / 2 + this.velocity;
                var newTileX = parseInt(Number(newCenterX).toFixed(0) / 16);
                var bottomY = this.center.y + this.size.y / 2;
                var bottomTileY = parseInt(Number(bottomY).toFixed(0) / 16);

                if (this.game.movementMap[this.tile.y][newTileX] === 0 || this.game.movementMap[bottomTileY][newTileX] === 0) {
                    return;
                }

                this.center.x += this.velocity;
            }
        }
    }
};
var BombExplosion = function (game, center) {
    this.game = game;
    this.size = { x: 32, y: 32 };
    this.center = { x: center.x, y: center.y };
    this.lifeCountdown = 21;
    this.damage = 1;
};

BombExplosion.prototype = {
    draw: function (screen) {

    },

    update: function () {
        if (this.lifeCountdown === 0) {
            this.game.removeBody(this);
        }

        this.lifeCountdown--;
    }
};
var CaveEntrance = function (game, center) {
    this.id = "cave-entrance";
    this.hidden = true;
    this.game = game;
    this.size = { x: 16, y: 2 };
    this.center = { x: center.x, y: center.y };
    this.timer = 0;
};

CaveEntrance.prototype = {
    draw: function (screen) {
        if (this.hidden) {
            return;
        }

        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - 8);
    },

    isHidden: function(){
        return this.hidden;
    },

    show: function(){
        this.hidden = false;
    },

    update: function () {
    }
};
var CaveFire = function (game, center) {
    this.id = "cave-fire";
    this.game = game;
    this.size = { x: 16, y: 16 };
    this.center = { x: center.x, y: center.y };
    this.spriteChangeCount = 0;
    this.spriteCooldown = 10;
};

CaveFire.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);
    },

    update: function () {
        if (this.spriteChangeCount === 0) {
            this.id = this.id === "cave-fire" ? "cave-fire-1" : "cave-fire";
            this.spriteChangeCount = this.spriteCooldown;
        } else {
            this.spriteChangeCount--;
        }
    }
};
var Cloud = function (game, center) {
    this.id = "cloud-1";
    this.game = game;
    this.size = { x: 16, y: 16 };
    this.center = { x: center.x, y: center.y };
    this.countdown = 21;
};

Cloud.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);
    },

    update: function () {
        if (this.countdown === 0) {
            this.game.removeBody(this);
        } else if (this.countdown <= 7) {
            this.id = "cloud-3";
        } else if (this.countdown <= 14) {
            this.id = "cloud-2";
        } else if (this.countdown <= 21) {
            this.id = "cloud-1";
        }

        this.countdown--;
    }
};
var ItemCursor = function (game) {
    this.game = game;
    this.position = 1;
    this.size = { x: 16, y: 16 };
    this.center = { x: 137, y: 33 };
    this.waitTime = 0;
    this.waitCooldown = 15;
};

ItemCursor.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        screen.strokeStyle = "#FF0000";
        screen.strokeRect(x - this.size.x / 2, y - this.size.y / 2,
            this.size.x, this.size.y);

        switch (this.position) {
            case 1:
                this.center = { x: 137, y: 33 };
                break;
            case 2:
                this.center = { x: 137 + (24 * 1), y: 33 };
                break;
            case 3:
                this.center = { x: 137 + (24 * 2), y: 33 };
                break;
            case 4:
                this.center = { x: 137 + (24 * 3), y: 33 };
                break;
            case 5:
                this.center = { x: 137, y: 51 };
                break;
            case 6:
                this.center = { x: 137 + (24 * 1), y: 51 };
                break;
            case 7:
                this.center = { x: 137 + (24 * 2), y: 51};
                break;
            case 8:
                this.center = { x: 137 + (24 * 3), y: 51};
                break;
        }
    },

    update: function () {
        if (this.waitTime) {
            this.waitTime--;
        }
    },

    moveLeft: function () {
        if (!this.waitTime) {
            this.position--;

            if (this.position < 1) {
                this.position = 8;
            }
            this.waitTime = this.waitCooldown;
        }
    },

    moveRight: function () {
        if (!this.waitTime) {
            this.position++;

            if (this.position > 8) {
                this.position = 1;
            }
            this.waitTime = this.waitCooldown;
        }
    },

    selectActive: function () {
        this.game.player.equippedItem = null;
        switch (this.position) {
            case 1: //Boomerang
                this.game.player.equipBoomerang();
                break;
            case 2: //Bomb
                this.game.player.equipBomb();
                break;
            case 3: //Arrow
                this.game.player.equippedItem = null;
                break;
            case 4: //Candle
                this.game.player.equipBlueCandle();
                break;
            case 5: //Whistle
                this.game.player.equippedItem = null;
                break;
            case 6: //Meat grumble grumble...
                this.game.player.equippedItem = null;
                break;
            case 7: //Potion/Map
                this.game.player.equippedItem = null;
                break;
            case 8: //Magic Rod
                this.game.player.equippedItem = null;
                break;
        }
    }
};
var ItemPrice = function (game, center) {
    this.id = "item-price";
    this.game = game;
    this.size = { x: 8, y: 16 };
    this.center = { x: center.x, y: center.y };
};

ItemPrice.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);

        screen.font = "8px 'Press Start 2P'";
        screen.fillStyle = "white";
        screen.fillText("X", x + 6, y + 5);
    },

    update: function () {
    }
};
var Arrow = function (game, player) {
    this.game = game;
    this.velocity = 3;
    this.center = { x: player.center.x, y: player.center.y };
    this.direction = player.getDirection();

    switch (this.direction) {
        case "up":
            this.id = "arrow-up";
            this.size = { x: 5, y: 16 };
            break;
        case "down":
            this.id = "arrow-down";
            this.size = { x: 5, y: 16 };
            break;
        case "left":
            this.id = "arrow-left";
            this.size = { x: 16, y: 5 };
            break;
        case "right":
            this.id = "arrow-right";
            this.size = { x: 16, y: 5 };
            break;
    }
};

Arrow.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);
    },

    update: function () {
        if (this.direction === "up") {
            this.center.y -= this.velocity;
        } else if (this.direction === "down") {
            this.center.y += this.velocity;
        } else if (this.direction === "left") {
            this.center.x -= this.velocity;
        } else if (this.direction === "right") {
            this.center.x += this.velocity;
        }

        if (this.center.x < 0 || this.center.x > 256 || this.center.y < 0 || this.center.y > 176) {
            this.game.removeBody(this);
        }

    }
};
var BlueCandle = function (game, price, center) {
    this.id = "blue-candle";
    this.price = price;
    this.game = game;
    this.size = { x: 8, y: 16 };
    this.center = { x: center.x, y: center.y };
    this.menu = {x: 128, y: 24};
};

BlueCandle.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);

        screen.font = "8px 'Press Start 2P'";
        screen.fillStyle = "white";
        screen.fillText(this.price, x - 10, y + 20);
    },

    update: function () {
    }
};
var Bomb = function (game, player) {
    this.id = "bomb";
    this.game = game;
    this.size = { x: 8, y: 16 };
    this.explodeCountdown = 60;

    switch (player.getDirection()) {
        case "up":
            this.center = { x: player.center.x, y: player.center.y - this.size.y };
            break;
        case "down":
            this.center = { x: player.center.x, y: player.center.y + this.size.y };
            break;
        case "left":
            this.center = { x: player.center.x - this.size.x * 2, y: player.center.y };
            break;
        case "right":
            this.center = { x: player.center.x + this.size.x * 2, y: player.center.y };
            break;
    }
};

Bomb.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);
    },

    update: function () {
        this.explodeCountdown--;
        if (!this.explodeCountdown) {
            this.game.removeBody(this);
            createBombExplosion(this.game, this.center);
        }
    }
};
var Boomerang = function (game, player) {
    this.game = game;
    this.id = "boomerang";
    this.velocity = 3;
    this.center = { x: player.center.x, y: player.center.y };
    this.menu = {x: 129, y: 28};
    this.size = { x: 5, y: 8 };
    this.throwDistance = 72;
    this.rotateAngle = 0;
    this.rotateDelta = 18;
    this.returnToLink = false;
    this.direction = player.getDirection();

    switch (this.direction) {
        case "up":
            this.endpoint = { x: this.center.x, y: this.center.y - this.throwDistance };
            break;
        case "down":
            this.endpoint = { x: this.center.x, y: this.center.y + this.throwDistance };
            break;
        case "left":
            this.endpoint = { x: this.center.x - this.throwDistance, y: this.center.y };
            break;
        case "right":
            this.endpoint = { x: this.center.x + this.throwDistance, y: this.center.y };
            break;
    }
};

Boomerang.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);

        screen.save();
        screen.translate(x, y);
        screen.rotate(this.rotateAngle * Math.PI / 180);

        //Offset from the new translated origin
        screen.drawImage(img, -this.size.x / 2, -this.size.y / 2);

        screen.restore();
        screen.fill();
    },

    update: function () {
        var link = this.game.player;

        this.rotateAngle += this.rotateDelta;

        if (this.returnToLink) {
            if (doBodiesCollide(link, this)) {
                this.game.removeBody(this);
                return;
            }

            //Whichever axis Link throws the boomerang, return along that axis at the same velocity.
            //But if he walks perpendicularly to the throw direction, we need to return along that axis
            //just not as fast as the primary axis
            if (this.direction === "up" || this.direction === "down") {
                if (this.center.x > (link.center.x + link.size.x / 2)) {
                    this.center.x -= this.velocity - 1;
                } else if (this.center.x <= (link.center.x - link.size.x / 2)) {
                    this.center.x += this.velocity - 1;
                }

                if (this.center.y > (link.center.y + link.size.y / 2)) {
                    this.center.y -= this.velocity;
                } else if (this.center.y <= (link.center.y - link.size.y / 2)) {
                    this.center.y += this.velocity;
                }
            } else {
                if (this.center.x > (link.center.x + link.size.x / 2)) {
                    this.center.x -= this.velocity;
                } else if (this.center.x <= (link.center.x - link.size.x / 2)) {
                    this.center.x += this.velocity;
                }

                if (this.center.y > (link.center.y + link.size.y / 2)) {
                    this.center.y -= this.velocity - 1;
                } else if (this.center.y <= (link.center.y - link.size.y / 2)) {
                    this.center.y += this.velocity - 1;
                }
            }

        } else if (this.direction === "up") {
            if ((this.center.y - this.velocity) > this.endpoint.y) {
                this.center.y -= this.velocity;
            } else {
                this.returnToLink = true;
            }
        } else if (this.direction === "down") {
            if ((this.center.y + this.velocity) < this.endpoint.y) {
                this.center.y += this.velocity;
            } else {
                this.returnToLink = true;
            }
        } else if (this.direction === "left") {
            if ((this.center.x - this.velocity) > this.endpoint.x) {
                this.center.x -= this.velocity;
            } else {
                this.returnToLink = true;
            }
        } else if (this.direction === "right") {
            if ((this.center.x + this.velocity) < this.endpoint.x) {
                this.center.x += this.velocity;
            } else {
                this.returnToLink = true;
            }
        }

        if (this.center.x < 0 || this.center.x > 256 || this.center.y < 0 || this.center.y > 176) {
            this.returnToLink = true;
        }
    }
};
var CandleFire = function (game, player) {
    this.id = "cave-fire";
    this.game = game;
    this.size = { x: 16, y: 16 };
    this.spriteChangeCount = 0;
    this.spriteCooldown = 10;
    this.lifeCountdown = 180;
    this.velocity = 0.6;
    this.distance = 32;

    this.direction = player.getDirection();

    switch (this.direction) {
        case "up":
            this.center = { x: player.center.x, y: player.center.y - this.size.y };
            break;
        case "down":
            this.center = { x: player.center.x, y: player.center.y + this.size.y };
            break;
        case "left":
            this.center = { x: player.center.x - this.size.x, y: player.center.y };
            break;
        case "right":
            this.center = { x: player.center.x + this.size.x, y: player.center.y };
            break;
    }
};

CandleFire.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);
    },

    update: function () {
        if (this.spriteChangeCount === 0) {
            this.id = this.id === "cave-fire" ? "cave-fire-1" : "cave-fire";
            this.spriteChangeCount = this.spriteCooldown;
        } else {
            this.spriteChangeCount--;
        }

        if (this.distance) {
            switch (this.direction) {
                case "up":
                    this.center.y -= this.velocity;
                    break;
                case "down":
                    this.center.y += this.velocity;
                    break;
                case "left":
                    this.center.x -= this.velocity;
                    break;
                case "right":
                    this.center.x += this.velocity;
                    break;
            }

            this.distance--;
        }

        this.lifeCountdown--;
        if (!this.lifeCountdown) {
            this.game.removeBody(this);
        }
    }
};
var EquippedArrow = function (game, center) {
    this.id = "arrow-up";
    this.game = game;
    this.size = { x: 5, y: 16 };
    this.center = { x: center.x, y: center.y };
    this.menu = {x: 129, y: 25};
};

EquippedArrow.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);
    },

    update: function () {
    }
};
var EquippedBomb = function (game, center) {
    this.id = "bomb";
    this.game = game;
    this.size = { x: 8, y: 16 };
    this.center = { x: center.x, y: center.y };
    this.menu = {x: 128, y: 24};
};

EquippedBomb.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);
    },

    update: function () {
    }
};
var KeyItem = function (game, price, center) {
    this.id = "key-item";
    this.price = price;
    this.game = game;
    this.size = { x: 8, y: 16 };
    this.center = { x: center.x, y: center.y };
};

KeyItem.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);

        screen.font = "8px 'Press Start 2P'";
        screen.fillStyle = "white";
        screen.fillText(this.price, x - 10, y + 20);
    },

    update: function () {
    }
};
var MagicShield = function (game, price, center) {
    this.id = "magic-shield";
    this.price = price;
    this.game = game;
    this.size = { x: 8, y: 16 };
    this.center = { x: center.x, y: center.y };
};

MagicShield.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);

        screen.font = "8px 'Press Start 2P'";
        screen.fillStyle = "white";
        screen.fillText(this.price, x - 10, y + 20);
    },

    update: function () {
    }
};
var Sword = function (game, center) {
    this.id = "sword-item";
    this.game = game;
    this.size = { x: 7, y: 16 };
    this.center = { x: center.x, y: center.y };
};

Sword.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);
    },

    update: function () {
    }
};
var SwordPower = function (game, center, swordDirection) {
    this.game = game;
    this.spriteChangeCount = 0;
    this.spriteCooldown = 6;
    this.velocity = 3;
    this.center = { x: center.x, y: center.y };

    if (swordDirection.indexOf("up") > -1) {
        this.direction = "up";
        this.id = "sword-power-up";
        this.size = { x: 8, y: 16 };
        this.center.x--;
    } else if (swordDirection.indexOf("down") > -1) {
        this.direction = "down";
        this.id = "sword-power-down";
        this.size = { x: 8, y: 16 };
        this.center.x++;
    } else if (swordDirection.indexOf("left") > -1) {
        this.direction = "left";
        this.id = "sword-power-left";
        this.size = { x: 16, y: 8 };
        this.center.y++;
    } else if (swordDirection.indexOf("right") > -1) {
        this.direction = "right";
        this.id = "sword-power-right";
        this.size = { x: 16, y: 8 };
        this.center.y++;
    }

};

SwordPower.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);
    },

    update: function () {
        if (this.spriteChangeCount === 0) {
            this.spriteChangeCount = this.spriteCooldown;
        } else {
            this.spriteChangeCount--;
        }

        if (this.direction === "up") {
            this.id = this.id === "sword-power-up" ? "sword-power-up-flash" : "sword-power-up";
            this.center.y -= this.velocity;
        } else if (this.direction === "down") {
            this.id = this.id === "sword-power-down" ? "sword-power-down-flash" : "sword-power-down";
            this.center.y += this.velocity;
        } else if (this.direction === "left") {
            this.id = this.id === "sword-power-left" ? "sword-power-left-flash" : "sword-power-left";
            this.center.x -= this.velocity;
        } else if (this.direction === "right") {
            this.id = this.id === "sword-power-right" ? "sword-power-right-flash" : "sword-power-right";
            this.center.x += this.velocity;
        }

        if (this.center.x < 0 || this.center.x > 256 || this.center.y < 0 || this.center.y > 176) {
            this.game.removeBody(this);
        }

    }
};