var fingerDown = false;
var fingerX = 300;

var rotateDirection = "";
var rotateAngle = 0;

(function () {

    // Main game object
    // ----------------

    // **new Game()** Creates the game object with the game state and logic.
    var Game = function () {

        // In index.html, there is a canvas tag that the game will be drawn in.
        // Grab that canvas out of the DOM.
        var canvas = document.getElementById("asteroids");

        // Get the drawing context.  This contains functions that let you draw to the canvas.
        var screen = canvas.getContext('2d');

        // Note down the dimensions of the canvas.  These are used to
        // place game bodies.
        var gameSize = { x: canvas.width, y: canvas.height };

        this.lives = 3;

        this.score = 0;

        // Create the bodies array to hold the player and balls.
        this.bodies = [];

        this.bodies = this.bodies.concat(createAsteroids(this));


        // Add the player to the bodies array.
        this.player = new Player(this, gameSize);

        this.ball = null;

        this.shotRecharge = 0;

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

            self.bodies = self.bodies.filter(function (b1) {
                return !(b1 instanceof Ball && b1.framesRemaining === 0);
            });

            for (var i = 0; i < self.bodies.length; i++) {
                self.bodies[i].update();
            }

            if (self.shotRecharge > 0) {
                self.shotRecharge--;
            }

            var hitAsteroids = [];

            // `notCollidingWithAnything` returns true if passed body
            // is not colliding with anything.
            var notCollidingWithAnything = function (b1) {
                return self.bodies.filter(function (b2) {
                    if ((b1 instanceof Ball && b2 instanceof Player) ||(b2 instanceof Ball && b1 instanceof Player)) {
                        return false;
                    }
                    if (b1 instanceof Asteroid && b2 instanceof Asteroid) {
                        return false;
                    }
                    var isColliding = colliding(b1, b2);

                    if (isColliding) {
                        var hasAsteroid = false;
                        for (var i = 0; i < hitAsteroids.length; i ++) {
                            if (hitAsteroids[i] == b1 || hitAsteroids[i] == b2) {
                                hasAsteroid = true;
                            }
                        }

                        if (!hasAsteroid) {
                            console.log("asteroid hit");

                            if (b1 instanceof Asteroid) {
                                hitAsteroids.push(b1);
                            }

                            if (b2 instanceof Asteroid) {
                                hitAsteroids.push(b2);
                            }
                        }
                    }

                    return isColliding;
                }).length === 0;
            };

            // Throw away bodies that are colliding with something. They
            // will never be updated or draw again.
            this.bodies = this.bodies.filter(notCollidingWithAnything);

            if (hitAsteroids.length) {
                for (var i = 0; i < hitAsteroids.length; i++) {
                    if (hitAsteroids[i].size.x === 32) {
                        console.log("new Asteroids built");
                        self.bodies.push(new Asteroid(self, 16, { x: hitAsteroids[i].center.x, y: hitAsteroids[i].center.y}, { x: -hitAsteroids[i].velocity.x * 2, y: -hitAsteroids[i].velocity.y * 2}));
                        self.bodies.push(new Asteroid(self, 16, { x: hitAsteroids[i].center.x, y: hitAsteroids[i].center.y}, { x: hitAsteroids[i].velocity.x * 2, y: hitAsteroids[i].velocity.y * 2}));
                    }
                }
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
        },

        getBallCount: function () {
            var ballCount = 0;

            for (var i = 0; i < this.bodies.length; i++) {
                if (this.bodies[i] instanceof Ball) {
                    ballCount++;
                }
            }

            return ballCount;
        },

        canShoot: function () {
            return this.shotRecharge === 0;
        },

        resetShotRecharge: function () {
            this.shotRecharge = 60;
        }

    };

    // Player
    // ------

    // **new Player()** creates a player.
    var Player = function (game, gameSize) {
        this.game = game;
        this.size = { x: 5, y: 5 };
//        this.size = { x: 19, y: 25 };
        this.color = "white";
        this.center = { x: gameSize.x / 2, y: gameSize.y / 2 };
        this.velocity = { x: 0, y: 0 };
        this.id = "ship";

        // Create a keyboard object to track button presses.
        this.keyboarder = new Keyboarder();
    };

    Player.prototype = {

        draw: function (screen) {
            var x = this.center.x - this.size.x / 2;
            var y = this.center.y - this.size.y / 2;

            var img = document.getElementById(this.id);

            if (rotateDirection === "left") {
                rotateAngle -= 5;
                if (rotateAngle < 0) {
                    rotateAngle += 360;
                }
                console.log("angle", rotateAngle);
                screen.save();
                screen.translate(x, y);
                screen.rotate(rotateAngle * Math.PI / 180);
            } else if (rotateDirection === "right") {
                rotateAngle += 5;
                if (rotateAngle > 360) {
                    rotateAngle -= 360;
                }
                console.log("angle", rotateAngle);

                screen.save();
                screen.translate(x, y);
                screen.rotate(rotateAngle * Math.PI / 180);
            } else {
                screen.save();
                screen.translate(x, y);
                screen.rotate(rotateAngle * Math.PI / 180);
            }

            screen.drawImage(img, -img.width / 2, -img.height / 2);

            screen.restore();

            screen.fill();
        },

        // **update()** updates the state of the player for a single tick.
        update: function () {
            var MAX_VELOCITY = 2.0;
            var BASE_VELOCITY_DELTA = 0.05;
            var delta = 0;

            // If left cursor key is down...
            if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
                rotateDirection = "left";
            } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
                rotateDirection = "right";
            } else {
                rotateDirection = "";
            }

            if (this.keyboarder.isDown(this.keyboarder.KEYS.UP)) {
                if (rotateAngle === 0 || rotateAngle === 360) {
                    this.velocity.x += 0;
                } else if (rotateAngle > 0 && rotateAngle < 90) {
                    delta = parseFloat(rotateAngle / 90 * BASE_VELOCITY_DELTA);
                    this.velocity.x += delta;
                } else if (rotateAngle === 90) {
                    this.velocity.x += BASE_VELOCITY_DELTA;
                } else if (rotateAngle > 90 && rotateAngle < 180) {
                    delta = parseFloat((90 - (rotateAngle - 90)) / 90 * BASE_VELOCITY_DELTA);
                    this.velocity.x += delta;
                } else if (rotateAngle === 180) {
                    this.velocity.x += 0;
                } else if (rotateAngle > 180 && rotateAngle < 270) {
                    delta = parseFloat((rotateAngle - 180) / 90 * BASE_VELOCITY_DELTA);
                    this.velocity.x -= delta;
                } else if (rotateAngle === 270) {
                    this.velocity.x -= BASE_VELOCITY_DELTA;
                } else {
                    delta = parseFloat((180 - (rotateAngle - 180)) / 90 * BASE_VELOCITY_DELTA);
                    this.velocity.x -= delta;
                }

                if (rotateAngle === 0 || rotateAngle === 360) {
                    this.velocity.y -= BASE_VELOCITY_DELTA;
                } else if (rotateAngle > 0 && rotateAngle < 90) {
                    delta = parseFloat((90 - rotateAngle) / 90 * BASE_VELOCITY_DELTA);
                    this.velocity.y -= delta;
                } else if (rotateAngle === 90) {
                    this.velocity.y -= 0;
                } else if (rotateAngle > 90 && rotateAngle < 180) {
                    delta = parseFloat((rotateAngle - 90) / 90 * BASE_VELOCITY_DELTA);
                    this.velocity.y += delta;
                } else if (rotateAngle === 180) {
                    this.velocity.y += BASE_VELOCITY_DELTA;
                } else if (rotateAngle > 180 && rotateAngle < 270) {
                    delta = parseFloat((90 - (rotateAngle - 180)) / 90 * BASE_VELOCITY_DELTA);
                    this.velocity.y += delta;
                } else if (rotateAngle === 270) {
                    this.velocity.y -= 0;
                } else {
                    delta = parseFloat((rotateAngle - 270) / 90 * BASE_VELOCITY_DELTA);
                    this.velocity.y -= delta;
                }

                if (this.velocity.x > MAX_VELOCITY) {
                    this.velocity.x = MAX_VELOCITY;
                } else if (this.velocity.x < -MAX_VELOCITY) {
                    this.velocity.x = -MAX_VELOCITY;
                }

                if (this.velocity.y > MAX_VELOCITY) {
                    this.velocity.y = MAX_VELOCITY;
                } else if (this.velocity.y < -MAX_VELOCITY) {
                    this.velocity.y = -MAX_VELOCITY;
                }

                this.id = "ship-move";
            } else {
                this.id = "ship";
            }

            this.center.x += this.velocity.x;

            if (this.center.x > 600) {
                this.center.x = 1;
            } else if (this.center.x < 0) {
                this.center.x = 599;
            }

            this.center.y += this.velocity.y;

            if (this.center.y > 600) {
                this.center.y = 1;
            } else if (this.center.y < 0) {
                this.center.y = 599;
            }

            // If Space key is down...
            if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE) || fingerDown) {
                if (this.game.canShoot() && this.game.getBallCount() < 5) {
                    var ball = new Ball(this);

                    this.game.ball = ball;
                    this.game.addBody(ball);
                    this.game.resetShotRecharge();
                }
            }
        }
    };

    // Asteroids
    // --------

    // **new Asteroid()** creates an brick.
    var Asteroid = function (game, size, center, velocity) {
        this.game = game;
        this.center = center;
        this.id = "asteroid-" + size;
        this.size = { x: size, y: size };
        this.velocity = velocity;
    };

    Asteroid.prototype = {

        draw: function (screen) {
            var x = this.center.x - this.size.x / 2;
            var y = this.center.y - this.size.y / 2;

            var img = document.getElementById(this.id);

            screen.drawImage(img, x, y);

        },

        // **update()** updates the state of the brick for a single tick.
        update: function () {
            this.center.x += this.velocity.x;

            if (this.center.x >= 598) {
                this.center.x = 2;
            } else if (this.center.x <= 2) {
                this.center.x = 598;
            }

            this.center.y += this.velocity.y;

            if (this.center.y >= 598) {
                this.center.y = 2;
            } else if (this.center.y <= 2) {
                this.center.y = 598;
            }

        }
    };

    var createAsteroids = function (game) {
        var asteroids = [];

        asteroids.push(new Asteroid(game, 32, { x: 50, y: 200}, { x: 0.2, y: 0.2}));
        asteroids.push(new Asteroid(game, 32, { x: 300, y: 50}, { x: -0.2, y: 0.2}));
        asteroids.push(new Asteroid(game, 32, { x: 50, y: 550}, { x: 0.2, y: -0.2}));
        asteroids.push(new Asteroid(game, 32, { x: 400, y: 400}, { x: 0.2, y: -0.2}));

        return asteroids;
    };

    // Ball
    // ------

    // **new Ball()** creates a new ball.
    var Ball = function (ship) {
        var MAX_VELOCITY = 5.0;
        var delta = 0;

        this.center = {x: ship.center.x - ship.size.x / 2, y: ship.center.y - ship.size.y / 2};
        this.size = { x: 2, y: 2 };
        this.framesRemaining = 200;

        this.velocity = { x: 0, y: 0 };

        if (rotateAngle === 0 || rotateAngle === 360) {
            this.velocity.x += 0;
        } else if (rotateAngle > 0 && rotateAngle < 90) {
            delta = parseFloat(rotateAngle / 90 * MAX_VELOCITY);
            this.velocity.x += delta;
        } else if (rotateAngle === 90) {
            this.velocity.x += MAX_VELOCITY;
        } else if (rotateAngle > 90 && rotateAngle < 180) {
            delta = parseFloat((90 - (rotateAngle - 90)) / 90 * MAX_VELOCITY);
            this.velocity.x += delta;
        } else if (rotateAngle === 180) {
            this.velocity.x += 0;
        } else if (rotateAngle > 180 && rotateAngle < 270) {
            delta = parseFloat((rotateAngle - 180) / 90 * MAX_VELOCITY);
            this.velocity.x -= delta;
        } else if (rotateAngle === 270) {
            this.velocity.x -= MAX_VELOCITY;
        } else {
            delta = parseFloat((180 - (rotateAngle - 180)) / 90 * MAX_VELOCITY);
            this.velocity.x -= delta;
        }

        if (rotateAngle === 0 || rotateAngle === 360) {
            this.velocity.y -= MAX_VELOCITY;
        } else if (rotateAngle > 0 && rotateAngle < 90) {
            delta = parseFloat((90 - rotateAngle) / 90 * MAX_VELOCITY);
            this.velocity.y -= delta;
        } else if (rotateAngle === 90) {
            this.velocity.y -= 0;
        } else if (rotateAngle > 90 && rotateAngle < 180) {
            delta = parseFloat((rotateAngle - 90) / 90 * MAX_VELOCITY);
            this.velocity.y += delta;
        } else if (rotateAngle === 180) {
            this.velocity.y += MAX_VELOCITY;
        } else if (rotateAngle > 180 && rotateAngle < 270) {
            delta = parseFloat((90 - (rotateAngle - 180)) / 90 * MAX_VELOCITY);
            this.velocity.y += delta;
        } else if (rotateAngle === 270) {
            this.velocity.y -= 0;
        } else {
            delta = parseFloat((rotateAngle - 270) / 90 * MAX_VELOCITY);
            this.velocity.y -= delta;
        }

    };

    Ball.prototype = {

        draw: function (screen) {
            screen.fillRect(this.center.x - this.size.x / 2, this.center.y - this.size.y / 2,
                this.size.x, this.size.y);
        },

        // **update()** updates the state of the ball for a single tick.
        update: function () {

            // Add velocity to center to move ball.
            this.center.x += this.velocity.x;

            if (this.center.x >= 598) {
                this.center.x = 2;
            } else if (this.center.x <= 2) {
                this.center.x = 598;
            }

            this.center.y += this.velocity.y;

            if (this.center.y >= 598) {
                this.center.y = 2;
            } else if (this.center.y <= 2) {
                this.center.y = 598;
            }

            this.framesRemaining--;
        },

        flipX: function () {
            var oldVelocity = this.velocity;
            this.velocity = { x: -1 * oldVelocity.x, y: oldVelocity.y }
        },

        flipY: function () {
            var oldVelocity = this.velocity;
            this.velocity = { x: oldVelocity.x, y: -1 * oldVelocity.y }
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
    });
})();