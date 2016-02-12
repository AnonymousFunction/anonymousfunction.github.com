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