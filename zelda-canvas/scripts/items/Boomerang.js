var Boomerang = function (game, player) {
    this.game = game;
    this.id = "boomerang";
    this.velocity = 3;
    this.center = { x: player.center.x, y: player.center.y };
    this.menu = {x: 129, y: 28};
    this.size = { x: 5, y: 8 };
    this.throwDistance = 72;
    this.rotateAngle = 0;
    this.rotateDelta = 18;
    this.returnToLink = false;
    this.direction = player.getDirection();

    switch (this.direction) {
        case "up":
            this.endpoint = { x: this.center.x, y: this.center.y - this.throwDistance };
            break;
        case "down":
            this.endpoint = { x: this.center.x, y: this.center.y + this.throwDistance };
            break;
        case "left":
            this.endpoint = { x: this.center.x - this.throwDistance, y: this.center.y };
            break;
        case "right":
            this.endpoint = { x: this.center.x + this.throwDistance, y: this.center.y };
            break;
    }
};

Boomerang.prototype = {
    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);

        screen.save();
        screen.translate(x, y);
        screen.rotate(this.rotateAngle * Math.PI / 180);

        //Offset from the new translated origin
        screen.drawImage(img, -this.size.x / 2, -this.size.y / 2);

        screen.restore();
        screen.fill();
    },

    update: function () {
        var link = this.game.player;

        this.rotateAngle += this.rotateDelta;

        if (this.returnToLink) {
            if (doBodiesCollide(link, this)) {
                this.game.removeBody(this);
                return;
            }

            //Whichever axis Link throws the boomerang, return along that axis at the same velocity.
            //But if he walks perpendicularly to the throw direction, we need to return along that axis
            //just not as fast as the primary axis
            if (this.direction === "up" || this.direction === "down") {
                if (this.center.x > (link.center.x + link.size.x / 2)) {
                    this.center.x -= this.velocity - 1;
                } else if (this.center.x <= (link.center.x - link.size.x / 2)) {
                    this.center.x += this.velocity - 1;
                }

                if (this.center.y > (link.center.y + link.size.y / 2)) {
                    this.center.y -= this.velocity;
                } else if (this.center.y <= (link.center.y - link.size.y / 2)) {
                    this.center.y += this.velocity;
                }
            } else {
                if (this.center.x > (link.center.x + link.size.x / 2)) {
                    this.center.x -= this.velocity;
                } else if (this.center.x <= (link.center.x - link.size.x / 2)) {
                    this.center.x += this.velocity;
                }

                if (this.center.y > (link.center.y + link.size.y / 2)) {
                    this.center.y -= this.velocity - 1;
                } else if (this.center.y <= (link.center.y - link.size.y / 2)) {
                    this.center.y += this.velocity - 1;
                }
            }

        } else if (this.direction === "up") {
            if ((this.center.y - this.velocity) > this.endpoint.y) {
                this.center.y -= this.velocity;
            } else {
                this.returnToLink = true;
            }
        } else if (this.direction === "down") {
            if ((this.center.y + this.velocity) < this.endpoint.y) {
                this.center.y += this.velocity;
            } else {
                this.returnToLink = true;
            }
        } else if (this.direction === "left") {
            if ((this.center.x - this.velocity) > this.endpoint.x) {
                this.center.x -= this.velocity;
            } else {
                this.returnToLink = true;
            }
        } else if (this.direction === "right") {
            if ((this.center.x + this.velocity) < this.endpoint.x) {
                this.center.x += this.velocity;
            } else {
                this.returnToLink = true;
            }
        }

        if (this.center.x < 0 || this.center.x > 256 || this.center.y < 0 || this.center.y > 176) {
            this.returnToLink = true;
        }
    }
};