(function () {

    // Main game object
    // ----------------

    // **new Game()** Creates the game object with the game state and logic.
    var Game = function () {

        // In index.html, there is a canvas tag that the game will be drawn in.
        // Grab that canvas out of the DOM.
        var canvas = document.getElementById("hockey");

        // Get the drawing context.  This contains functions that let you draw to the canvas.
        var screen = canvas.getContext('2d');

        // Note down the dimensions of the canvas.  These are used to
        // place game bodies.
        var gameSize = { x: canvas.width, y: canvas.height };

        // Create the bodies array to hold the player and balls.
        this.bodies = [];

        // Add the player to the bodies array.
        this.player = new Player(this, gameSize);
        this.player2 = new Player2(this, gameSize);

        this.bodies = this.bodies.concat(this.player);
        this.bodies = this.bodies.concat(this.player2);

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

            for (var i = 0; i < self.bodies.length; i++) {
                self.bodies[i].update();
            }
        },

        // **draw()** draws the game.
        draw: function (screen, gameSize) {
            // Clear away the drawing from the previous tick.
            screen.clearRect(0, 0, gameSize.x, gameSize.y);

            // Draw each body as a rectangle.
            for (var i = 0; i < this.bodies.length; i++) {
                if (this.bodies[i].center.y < 0) {
                    delete this.bodies[i];
                    continue;
                }

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
        }

    };

    // Player
    // ------

    // **new Player()** creates a player.
    var Player = function (game, gameSize) {
        this.game = game;
        this.size = { x: 55, y: 75 };
        this.center = { x: 200, y: gameSize.y / 2 };
        this.velocity = { x: 0, y: 0 };
        this.id = "player";
        this.punchAnimate = 0;
        this.punchCooldown = 0;
        this.punch = "";

        // Create a keyboard object to track button presses.
        this.keyboarder = new Keyboarder();
    };

    Player.prototype = {

        draw: function (screen) {
            var x = this.center.x - this.size.x / 2;
            var y = 150;

            var img = document.getElementById(this.id);

            screen.drawImage(img, x, y);

            screen.restore();

            screen.fill();
        },

        // **update()** updates the state of the player for a single tick.
        update: function () {
            var MAX_VELOCITY = 2.5;
            var BASE_VELOCITY_DELTA = 0.5;
            var delta = 0;

            // If left cursor key is down...
            movement: if (this.keyboarder.isDown(this.keyboarder.KEYS.A)) {
                this.velocity.x -= BASE_VELOCITY_DELTA;
                
                if (this.velocity.x < -MAX_VELOCITY) {
                    this.velocity.x = -MAX_VELOCITY
                }
                
                this.center.x += this.velocity.x;

                if (this.center.x > 550) {
                    this.center.x = 550;
                } else if (this.center.x < 50) {
                    this.center.x = 50;
                }

            } else if (this.keyboarder.isDown(this.keyboarder.KEYS.D)) {
                this.velocity.x += BASE_VELOCITY_DELTA;

                if (this.velocity.x > MAX_VELOCITY) {
                    this.velocity.x = MAX_VELOCITY
                }

                if (this.center.x + this.size.x / 2 > this.game.player2.center.x) {
                    this.velocity.x = 0;
                    break movement;
                }

                this.center.x += this.velocity.x;

                if (this.center.x > 550) {
                    this.center.x = 550;
                } else if (this.center.x < 50) {
                    this.center.x = 50;
                }
            } else {
                if (this.velocity.x > 0) {
                    this.velocity.x -= .1;

                    if (this.velocity.x < 0) {
                        this.velocity.x = 0;
                    }

                    if (this.center.x + this.size.x / 2 > this.game.player2.center.x) {
                        this.velocity.x = 0;
                        break movement;
                    }

                    this.center.x += this.velocity.x;

                    if (this.center.x > 550) {
                        this.center.x = 550;
                    } else if (this.center.x < 50) {
                        this.center.x = 50;
                    }
                } else if (this.velocity.x < 0) {
                    this.velocity.x += .1;

                    if (this.velocity.x > 0) {
                        this.velocity.x = 0;
                    }

                    this.center.x += this.velocity.x;

                    if (this.center.x > 550) {
                        this.center.x = 550;
                    } else if (this.center.x < 50) {
                        this.center.x = 50;
                    }
                }
            }

            if (this.keyboarder.isDown(this.keyboarder.KEYS.W)) {
                if (this.punchCooldown === 0 && this.punchAnimate === 0) {
                    this.punchAnimate = 30;
                    this.punchCooldown = 50;
                    this.punch = "player-high";
                } else {
                    if (this.punchAnimate > 0) {
                        this.punchAnimate--;
                    }                    
                    if (this.punchCooldown > 0) {
                        this.punchCooldown--;
                    }
                }
            } else if (this.keyboarder.isDown(this.keyboarder.KEYS.S)) {
                if (this.punchCooldown === 0 && this.punchAnimate === 0) {
                    this.punchAnimate = 30;
                    this.punchCooldown = 50;
                    this.punch = "player-low";
                } else {
                    if (this.punchAnimate > 0) {
                        this.punchAnimate--;
                    }
                    if (this.punchCooldown > 0) {
                        this.punchCooldown--;
                    }
                }
            } else {
                if (this.punchAnimate > 0) {
                    this.punchAnimate--;
                }

                if (this.punchCooldown > 0) {
                    this.punchCooldown--;
                }
            }
            

            if (this.punchAnimate > 20 && this.punchAnimate <= 30) {
                this.id = "player-ready";
            } else if (this.punchAnimate >= 10 && this.punchAnimate <= 20) {
                this.id = this.punch;
            } else if (this.punchAnimate > 0 && this.punchAnimate < 10) {
                this.id = "player-ready";
            } else {
                this.id = "player";
            }
        }
    };
    
    // Player2
        // ------

        // **new Player2()** creates a player.
        var Player2 = function (game, gameSize) {
            this.game = game;
            this.size = { x: 55, y: 75 };
            this.center = { x: 400, y: gameSize.y / 2 };
            this.velocity = { x: 0, y: 0 };
            this.id = "player-2";
            this.punchAnimate = 0;
            this.punchCooldown = 0;
            this.punch = "";

            // Create a keyboard object to track button presses.
            this.keyboarder = new Keyboarder();
        };

        Player2.prototype = {

            draw: function (screen) {
                var x = this.center.x - this.size.x / 2;
                var y = 150;

                var img = document.getElementById(this.id);

                screen.drawImage(img, x, y);

                screen.restore();

                screen.fill();
            },

            // **update()** updates the state of the player for a single tick.
            update: function () {
                var MAX_VELOCITY = 2.5;
                var BASE_VELOCITY_DELTA = 0.5;
                var delta = 0;

                // If left cursor key is down...
                movement: if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
                    this.velocity.x -= BASE_VELOCITY_DELTA;

                    if (this.velocity.x < -MAX_VELOCITY) {
                        this.velocity.x = -MAX_VELOCITY
                    }

                    if (this.center.x - this.size.x / 2 < this.game.player.center.x) {
                        this.velocity.x = 0;
                        break movement;
                    }

                    this.center.x += this.velocity.x;

                    if (this.center.x > 550) {
                        this.center.x = 550;
                    } else if (this.center.x < 50) {
                        this.center.x = 50;
                    }

                } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
                    this.velocity.x += BASE_VELOCITY_DELTA;

                    if (this.velocity.x > MAX_VELOCITY) {
                        this.velocity.x = MAX_VELOCITY
                    }

                    this.center.x += this.velocity.x;

                    if (this.center.x > 550) {
                        this.center.x = 550;
                    } else if (this.center.x < 50) {
                        this.center.x = 50;
                    }
                } else {
                    if (this.velocity.x > 0) {
                        this.velocity.x -= .1;

                        if (this.velocity.x < 0) {
                            this.velocity.x = 0;
                        }

                        this.center.x += this.velocity.x;

                        if (this.center.x > 550) {
                            this.center.x = 550;
                        } else if (this.center.x < 50) {
                            this.center.x = 50;
                        }
                    } else if (this.velocity.x < 0) {
                        this.velocity.x += .1;

                        if (this.velocity.x > 0) {
                            this.velocity.x = 0;
                        }

                        if (this.center.x - this.size.x / 2 < this.game.player.center.x) {
                            this.velocity.x = 0;
                            break movement;
                        }

                        this.center.x += this.velocity.x;

                        if (this.center.x > 550) {
                            this.center.x = 550;
                        } else if (this.center.x < 50) {
                            this.center.x = 50;
                        }
                    }
                }

                if (this.keyboarder.isDown(this.keyboarder.KEYS.UP)) {
                    if (this.punchCooldown === 0 && this.punchAnimate === 0) {
                        this.punchAnimate = 30;
                        this.punchCooldown = 50;
                        this.punch = "player-2-high";
                    } else {
                        if (this.punchAnimate > 0) {
                            this.punchAnimate--;
                        }
                        if (this.punchCooldown > 0) {
                            this.punchCooldown--;
                        }
                    }
                } else if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN)) {
                    if (this.punchCooldown === 0 && this.punchAnimate === 0) {
                        this.punchAnimate = 30;
                        this.punchCooldown = 50;
                        this.punch = "player-2-low";
                    } else {
                        if (this.punchAnimate > 0) {
                            this.punchAnimate--;
                        }
                        if (this.punchCooldown > 0) {
                            this.punchCooldown--;
                        }
                    }
                } else {
                    if (this.punchAnimate > 0) {
                        this.punchAnimate--;
                    }

                    if (this.punchCooldown > 0) {
                        this.punchCooldown--;
                    }
                }


                if (this.punchAnimate > 20 && this.punchAnimate <= 30) {
                    this.id = "player-2-ready";
                } else if (this.punchAnimate >= 10 && this.punchAnimate <= 20) {
                    this.id = this.punch;
                } else if (this.punchAnimate > 0 && this.punchAnimate < 10) {
                    this.id = "player-2-ready";
                } else {
                    this.id = "player-2";
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
        this.KEYS = { UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39, SPACE: 32, W: 87, S: 83, A: 65, D: 68 };
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
    });
})();