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