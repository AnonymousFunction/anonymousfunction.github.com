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