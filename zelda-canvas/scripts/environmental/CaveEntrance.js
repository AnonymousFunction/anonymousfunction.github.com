var CaveEntrance = function (game, center) {
    this.id = "cave-entrance";
    this.hidden = true;
    this.game = game;
    this.size = { x: 16, y: 2 };
    this.center = { x: center.x, y: center.y };
    this.timer = 0;
};

CaveEntrance.prototype = {
    draw: function (screen) {
        if (this.hidden) {
            return;
        }

        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - 8);
    },

    isHidden: function(){
        return this.hidden;
    },

    show: function(){
        this.hidden = false;
    },

    update: function () {
    }
};