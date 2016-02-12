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