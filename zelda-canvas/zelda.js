(function () {

    // Main game object
    // ----------------

    // **new Game()** Creates the game object with the game state and logic.
    var Game = function () {

        // In index.html, there is a canvas tag that the game will be drawn in.
        // Grab that canvas out of the DOM.
        var canvas = document.getElementById("zelda");
        
        this.viewport = $("#zelda");

        // Get the drawing context.  This contains functions that let you draw to the canvas.
        var screen = canvas.getContext('2d');

        // Note down the dimensions of the canvas.  These are used to
        // place game bodies.
        var gameSize = { x: canvas.width, y: canvas.height };

        // Create the bodies array to hold the player, bricks and balls.
        this.bodies = [];

        // Add the player to the bodies array.
        this.player = new Player(this, gameSize);

        this.bodies = this.bodies.concat(this.player);

        var self = this;

        // Main game tick function.  Loops forever, running 60ish times a second.
        var tick = function () {

            // Update game state.
            self.update();

            // Draw game bodies.
            self.draw(screen, gameSize);

            // Queue up the next call to tick with the browser.
            requestAnimationFrame(tick);
        };

        // Run the first game tick.  All future calls will be scheduled by
        // the tick() function itself.
        tick();
    };

    Game.prototype = {

        // **update()** runs the main game logic.
        update: function () {
            var self = this;
            
            if (this.screenTransitionTime) {
                if (this.screenTransitionDir === "up") {
                    var origMapTop = parseInt(this.viewport.css("background-position-y"));

                    if (origMapTop < 0) {
                        var newMapTop = origMapTop + 2;
                        this.viewport.css("background-position-y", newMapTop + "px");

                        this.player.center.y += 2;
                    }

                    this.screenTransitionTime -= 2;
                } else if (this.screenTransitionDir === "down") {
                   var origMapTop = parseInt(this.viewport.css("background-position-y"));

                    if (origMapTop > -1232) {
                        var newMapTop = origMapTop - 2;
                        this.viewport.css("background-position-y", newMapTop + "px");

                        this.player.center.y -= 2;
                    }

                   this.screenTransitionTime -= 2;
                } else if (this.screenTransitionDir === "left") {
                    var origMapLeft = parseInt(this.viewport.css("background-position-x"));

                    if (origMapLeft < 0) {
                        var newMapLeft = origMapLeft + 2;
                        this.viewport.css("background-position-x", newMapLeft + "px");

                        this.player.center.x += 2;
                    }

                    this.screenTransitionTime -= 2;
                } else if (this.screenTransitionDir === "right") {
                    var origMapLeft = parseInt(this.viewport.css("background-position-x"));

                    if (origMapLeft > -3840) {
                        var newMapLeft = origMapLeft - 2;
                        this.viewport.css("background-position-x", newMapLeft + "px");

                        this.player.center.x -= 2;
                    }

                    this.screenTransitionTime -= 2;
                }

                return;
            }

            for (var i = 0; i < self.bodies.length; i++) {
                self.bodies[i].update();
            }

            /* DEBUG */

            $("#link-x").text(Number(this.player.center.x).toFixed(2));
            $("#link-y").text(Number(this.player.center.y).toFixed(2));

            $("#link-x-square").text(Number(Number(this.player.center.x).toFixed(0) / 16).toFixed(0));
            $("#link-y-square").text(Number(Number(this.player.center.y).toFixed(0) / 16).toFixed(0));

        },

        // **draw()** draws the game.
        draw: function (screen, gameSize) {
            // Clear away the drawing from the previous tick.
            screen.clearRect(0, 0, gameSize.x, gameSize.y);

            // Draw each body as a rectangle.
            for (var i = 0; i < this.bodies.length; i++) {
                if (this.bodies[i].color) {
                    screen.fillStyle = this.bodies[i].color;
                } else {
                    screen.fillStyle = "#FFFFFF";
                }
                
                this.bodies[i].draw(screen);
            }
        },

        // **addBody()** adds a body to the bodies array.
        addBody: function (body) {
            this.bodies.push(body);
        },
        
        moveScreenUp: function(){
            this.screenTransitionTime = 176;
            this.screenTransitionDir = "up";
        },
        
        moveScreenDown: function(){
            this.screenTransitionTime = 176;
            this.screenTransitionDir = "down";
        },
                
        moveScreenLeft: function(){
            this.screenTransitionTime = 256;
            this.screenTransitionDir = "left";
        },      
          
        moveScreenRight: function(){
            this.screenTransitionTime = 256;
            this.screenTransitionDir = "right";
        }
    };

    // Player
    // ------

    // **new Player()** creates a player.
    var Player = function (game, gameSize) {
        this.id = "link-down-1";
        this.game = game;
        this.size = { x: 16, y: 16 };
        this.color = "#0088FF";
        this.center = { x: gameSize.x / 2, y: gameSize.y - this.size.y * 10 };
        this.moveRate = 1.3;
        this.spriteChangeCount = 0;
        this.spriteCooldown = 6;

        // Create a keyboard object to track button presses.
        this.keyboarder = new Keyboarder();
    };

    Player.prototype = {
    
        draw: function(screen){
            var x = this.center.x - this.size.x / 2;
            var y = this.center.y - this.size.y / 2;

            var img = document.getElementById(this.id);

            screen.drawImage(img, x, y);
        },

        // **update()** updates the state of the player for a single tick.
        update: function () {
            if (this.keyboarder.isDown(this.keyboarder.KEYS.UP)) {
                if (this.spriteChangeCount === 0 || this.id.indexOf("up") === -1) {
                    this.id = this.id === "link-up-2" ? "link-up-1" : "link-up-2";
                    this.spriteChangeCount = this.spriteCooldown;
                } else {
                    this.spriteChangeCount--;
                }
                
                if (this.center.y > 0) {
                    this.center.y -= this.moveRate;
                } else {
                    this.game.moveScreenUp();
                }
            } else if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN)) {
                if (this.spriteChangeCount === 0 || this.id.indexOf("down") === -1) {
                    this.id = this.id === "link-down-2" ? "link-down-1" : "link-down-2";
                    this.spriteChangeCount = this.spriteCooldown;
                } else {
                    this.spriteChangeCount--;
                }
                
                if (this.center.y < 176) {
                    this.center.y += this.moveRate;
                } else {
                    this.game.moveScreenDown();
                }
            } else if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
                if (this.spriteChangeCount === 0 || this.id.indexOf("left") === -1) {
                    this.id = this.id === "link-left-2" ? "link-left-1" : "link-left-2";
                    this.spriteChangeCount = this.spriteCooldown;
                } else {
                    this.spriteChangeCount--;
                }
                            
                if (this.center.x > 0) {
                    this.center.x -= this.moveRate;
                } else {
                    this.game.moveScreenLeft();
                }
            } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
                if (this.spriteChangeCount === 0 || this.id.indexOf("right") === -1) {
                    this.id = this.id === "link-right-2" ? "link-right-1" : "link-right-2";
                    this.spriteChangeCount = this.spriteCooldown;
                } else {
                    this.spriteChangeCount--;
                }
            
                if (this.center.x < 256) {
                    this.center.x += this.moveRate;
                } else {
                    this.game.moveScreenRight();
                }
            }

            // If Space key is down...
            if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)) {

            }
        }
    };

    // Keyboard input tracking
    // -----------------------

    // **new Keyboarder()** creates a new keyboard input tracking object.
    var Keyboarder = function () {

        // Records up/down state of each key that has ever been pressed.
        var keyState = {};

        // When key goes down, record that it is down.
        window.addEventListener('keydown', function (e) {
            keyState[e.keyCode] = true;
        });

        // When key goes up, record that it is up.
        window.addEventListener('keyup', function (e) {
            keyState[e.keyCode] = false;
        });

        // Returns true if passed key is currently down.  `keyCode` is a
        // unique number that represents a particular key on the keyboard.
        this.isDown = function (keyCode) {
            return keyState[keyCode] === true;
        };

        // Handy constants that give keyCodes human-readable names.
        this.KEYS = { UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39, SPACE: 32 };
    };

    // Other functions
    // ---------------

    // **colliding()** returns true if two passed bodies are colliding.
    // The approach is to test for five situations.  If any are true,
    // the bodies are definitely not colliding.  If none of them
    // are true, the bodies are colliding.
    // 1. b1 is the same body as b2.
    // 2. Right of `b1` is to the left of the left of `b2`.
    // 3. Bottom of `b1` is above the top of `b2`.
    // 4. Left of `b1` is to the right of the right of `b2`.
    // 5. Top of `b1` is below the bottom of `b2`.
    var colliding = function (b1, b2) {
        var isColliding = !(
            b1 === b2 ||
                b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
                b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
                b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
                b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2
            );

        return isColliding;
    };

    // Start game
    // ----------

    // When the DOM is ready, create (and start) the game.
    window.addEventListener('load', function () {
        new Game();

        var widthScale = Number(window.innerWidth/625).toFixed(2);
        var heightScale = Number(window.innerHeight/600).toFixed(2);

        if (widthScale <= heightScale) {
            $("meta[name=viewport]").attr("content", "initial-scale=" + widthScale + ", user-scalable=no");
        } else {
            $("meta[name=viewport]").attr("content", "initial-scale=" + heightScale + ", user-scalable=no");
        }
    });
})();