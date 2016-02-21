var CaveRupee = function (game, center, value) {
    this.id = "rupee-one";
    this.game = game;
    this.size = { x: 8, y: 16 };
    this.center = { x: center.x, y: center.y };
    this.spriteChangeCount = 0;
    this.spriteCooldown = 8;
    this.value = value;
    this.pickedUp = false;
};

CaveRupee.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);

        if (this.pickedUp) {
            screen.font = "8px 'Press Start 2P'";
            screen.fillStyle = "white";
            screen.fillText(this.value, x - 15, y + 24);
        }
    },

    update: function () {
        if (this.spriteChangeCount === 0) {
            this.id = this.id === "rupee-one" ? "rupee-five" : "rupee-one";
            this.spriteChangeCount = this.spriteCooldown;
        } else {
            this.spriteChangeCount--;
        }
    },

    pickup: function(){
        this.pickedUp = true;
    }
};