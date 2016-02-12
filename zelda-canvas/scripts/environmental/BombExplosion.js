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