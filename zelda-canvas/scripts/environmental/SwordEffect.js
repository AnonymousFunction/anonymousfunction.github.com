var SwordEffectTL = function (game, center) {
    this.id = "sword-effect-1-tl";
    this.game = game;
    this.size = { x: 8, y: 10 };
    this.center = { x: center.x, y: center.y };
    this.lifeCountdown = 10;
    this.velocity = 2;
    this.damage = 1;
};

SwordEffectTL.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);
    },

    update: function () {
        if (this.lifeCountdown === 0) {
            this.game.removeBody(this);
        } else {
            this.center.x-= this.velocity;
            this.center.y-= this.velocity;
        }

        this.lifeCountdown--;

        this.id = this.lifeCountdown % 2 ? "sword-effect-1-tl" : "sword-effect-2-tl";

        if (this.center.x < 0 || this.center.x > 256 || this.center.y < 0 || this.center.y > 176) {
            this.game.removeBody(this);
        }
    }
};

var SwordEffectTR = function (game, center) {
    this.id = "sword-effect-1-tr";
    this.game = game;
    this.size = { x: 8, y: 10 };
    this.center = { x: center.x, y: center.y };
    this.lifeCountdown = 10;
    this.velocity = 2;
    this.damage = 1;
};

SwordEffectTR.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);
    },

    update: function () {
        if (this.lifeCountdown === 0) {
            this.game.removeBody(this);
        } else {
            this.center.x+= this.velocity;
            this.center.y-= this.velocity;
        }

        this.lifeCountdown--;

        this.id = this.lifeCountdown % 2 ? "sword-effect-1-tr" : "sword-effect-2-tr";

        if (this.center.x < 0 || this.center.x > 256 || this.center.y < 0 || this.center.y > 176) {
            this.game.removeBody(this);
        }
    }
};

var SwordEffectBL = function (game, center) {
    this.id = "sword-effect-1-bl";
    this.game = game;
    this.size = { x: 8, y: 10 };
    this.center = { x: center.x, y: center.y };
    this.lifeCountdown = 10;
    this.velocity = 2;
    this.damage = 1;
};

SwordEffectBL.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);
    },

    update: function () {
        if (this.lifeCountdown === 0) {
            this.game.removeBody(this);
        } else {
            this.center.x-= this.velocity;
            this.center.y+= this.velocity;
        }

        this.lifeCountdown--;

        this.id = this.lifeCountdown % 2 ? "sword-effect-1-bl" : "sword-effect-2-bl";

        if (this.center.x < 0 || this.center.x > 256 || this.center.y < 0 || this.center.y > 176) {
            this.game.removeBody(this);
        }
    }
};

var SwordEffectBR = function (game, center) {
    this.id = "sword-effect-1-br";
    this.game = game;
    this.size = { x: 8, y: 10 };
    this.center = { x: center.x, y: center.y };
    this.lifeCountdown = 10;
    this.velocity = 2;
    this.damage = 1;
};

SwordEffectBR.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);
    },

    update: function () {
        if (this.lifeCountdown === 0) {
            this.game.removeBody(this);
        } else {
            this.center.x+= this.velocity;
            this.center.y+= this.velocity;
        }

        this.lifeCountdown--;

        this.id = this.lifeCountdown % 2 ? "sword-effect-1-br" : "sword-effect-2-br";

        if (this.center.x < 0 || this.center.x > 256 || this.center.y < 0 || this.center.y > 176) {
            this.game.removeBody(this);
        }
    }
};

var createSwordEffect = function(game, center){
    game.addBody(new SwordEffectTL(game, {x: center.x - 2, y: center.y - 2}));
    game.addBody(new SwordEffectTR(game, {x: center.x + 2, y: center.y - 2}));
    game.addBody(new SwordEffectBL(game, {x: center.x - 2, y: center.y + 2}));
    game.addBody(new SwordEffectBR(game, {x: center.x + 2, y: center.y + 2}));
};