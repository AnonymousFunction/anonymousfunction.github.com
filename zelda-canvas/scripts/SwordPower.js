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