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