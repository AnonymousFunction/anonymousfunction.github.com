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