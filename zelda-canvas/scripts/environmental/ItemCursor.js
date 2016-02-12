var ItemCursor = function (game) {
    this.game = game;
    this.position = 1;
    this.size = { x: 16, y: 16 };
    this.center = { x: 137, y: 33 };
    this.waitTime = 0;
    this.waitCooldown = 15;
};

ItemCursor.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        screen.strokeStyle = "#FF0000";
        screen.strokeRect(x - this.size.x / 2, y - this.size.y / 2,
            this.size.x, this.size.y);

        switch (this.position) {
            case 1:
                this.center = { x: 137, y: 33 };
                break;
            case 2:
                this.center = { x: 137 + (24 * 1), y: 33 };
                break;
            case 3:
                this.center = { x: 137 + (24 * 2), y: 33 };
                break;
            case 4:
                this.center = { x: 137 + (24 * 3), y: 33 };
                break;
            case 5:
                this.center = { x: 137, y: 51 };
                break;
            case 6:
                this.center = { x: 137 + (24 * 1), y: 51 };
                break;
            case 7:
                this.center = { x: 137 + (24 * 2), y: 51};
                break;
            case 8:
                this.center = { x: 137 + (24 * 3), y: 51};
                break;
        }
    },

    update: function () {
        if (this.waitTime) {
            this.waitTime--;
        }
    },

    moveLeft: function () {
        if (!this.waitTime) {
            this.position--;

            if (this.position < 1) {
                this.position = 8;
            }
            this.waitTime = this.waitCooldown;
        }
    },

    moveRight: function () {
        if (!this.waitTime) {
            this.position++;

            if (this.position > 8) {
                this.position = 1;
            }
            this.waitTime = this.waitCooldown;
        }
    },

    selectActive: function () {
        this.game.player.equippedItem = null;
        switch (this.position) {
            case 1: //Boomerang
                this.game.player.equipBoomerang();
                break;
            case 2: //Bomb
                this.game.player.equipBomb();
                break;
            case 3: //Arrow
                this.game.player.equippedItem = null;
                break;
            case 4: //Candle
                this.game.player.equipBlueCandle();
                break;
            case 5: //Whistle
                this.game.player.equippedItem = null;
                break;
            case 6: //Meat grumble grumble...
                this.game.player.equippedItem = null;
                break;
            case 7: //Potion/Map
                this.game.player.equippedItem = null;
                break;
            case 8: //Magic Rod
                this.game.player.equippedItem = null;
                break;
        }
    }
};