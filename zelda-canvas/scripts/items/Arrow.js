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