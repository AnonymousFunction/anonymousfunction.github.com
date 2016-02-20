var CaveFire = function (game, center) {
    this.id = "cave-fire";
    this.game = game;
    this.size = { x: 16, y: 16 };
    this.center = { x: center.x, y: center.y };
    this.spriteChangeCount = 0;
    this.spriteCooldown = 6;
};

CaveFire.prototype = {
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
    }
};