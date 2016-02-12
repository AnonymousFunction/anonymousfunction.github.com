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