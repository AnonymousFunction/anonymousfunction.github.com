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


        // Add the player to the bodies array.
        this.player = new Player(this, gameSize);

        this.ball = null;

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

            this.player.update();
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
                drawRect(screen, this.bodies[i]);
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
        }
    };

    // Player
    // ------

    // **new Player()** creates a player.
    var Player = function (game, gameSize) {
        this.game = game;
        this.size = { x: 50, y: 50 };
        this.color = "white";
        this.center = { x: gameSize.x / 2, y: gameSize.y / 2 };

        // Create a keyboard object to track button presses.
        this.keyboarder = new Keyboarder();
    };

    Player.prototype = {

        // **update()** updates the state of the player for a single tick.
        update: function () {
            // If left cursor key is down...
            if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
                rotateDirection = "left";
            } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
                rotateDirection = "right";
            } else {
                rotateDirection = "";
            }
            
            if (this.keyboarder.isDown(this.keyboarder.KEYS.UP)) {
                this.center.y -= 1;
            } else if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN)) {
                this.center.y += 1;
            }


            // If Space key is down...
            if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE) || fingerDown) {
                if (this.game.lives == 0) {
                    return;
                }

                // ... add the ball to the game...
                if (this.game.getBallCount() < 1) {
                    // ... create a ball just above the player that will move upwards...
                    var ball = new Ball({ x: this.center.x, y: this.center.y - this.size.y - 10 },
                        { x: 2, y: -2 });

                    this.game.ball = ball;
                    this.game.addBody(ball);
                }
            }
        }
    };

    // Ball
    // ------

    // **new Ball()** creates a new ball.
    var Ball = function (center, velocity) {
        this.center = center;
        this.size = { x: 10, y: 10 };
        this.velocity = velocity;
    };

    Ball.prototype = {

        // **update()** updates the state of the ball for a single tick.
        update: function () {

            // Add velocity to center to move ball.
            this.center.x += this.velocity.x;

            if (this.center.x >= 595 || this.center.x <= 5) {
                this.flipX();
            }

            this.center.y += this.velocity.y;

            if (this.center.y >= 595 || this.center.y <= 5) {
                this.flipY();
            }
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
    
    var rotateRight = function(screen){
//        // Move registration point to the center of the canvas
//        screen.translate(300, 300);
//
//        // Rotate 1 degree
//        screen.rotate(4 * Math.PI / 180);
//
//        // Move registration point back to the top left corner of canvas
//        screen.translate(-300, -300);


    };    
    
    var rotateLeft = function(screen){
        // Move registration point to the center of the canvas
        screen.translate(300, 300);

        // Rotate 1 degree
        screen.rotate(-4 * Math.PI / 180);

        // Move registration point back to the top left corner of canvas
        screen.translate(-300, -300);
    };

    // Other functions
    // ---------------

    // **drawRect()** draws passed body as a rectangle to `screen`, the drawing context.
    var drawRect = function (screen, body) {
//        screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
//            body.size.x, body.size.y);
            
//        screen.beginPath();
        var x = body.center.x + body.size.x / 2;
        var y = body.center.y - body.size.y / 2;
//        screen.moveTo(x, y);
//        screen.lineTo(x - body.size.x, y);
//        screen.lineTo(x - body.size.x / 2, y - body.size.y / 2 );

        var img=document.getElementById("ship");


        if (rotateDirection === "left") {
            rotateAngle -= 4;
            screen.save();
            screen.translate(300,300);
            screen.translate(img.width/2, img.height/2);
            screen.rotate(rotateAngle * Math.PI / 180);
        } else if (rotateDirection === "right") {
            rotateAngle += 4;
            screen.save();
            screen.translate(300,300);
            screen.translate(img.width/2, img.height/2);
            screen.rotate(rotateAngle * Math.PI / 180);
        } else {
            screen.save();
            screen.translate(300,300);
            screen.translate(img.width/2, img.height/2);
            screen.rotate(rotateAngle * Math.PI / 180);
        }

        screen.drawImage(img, -img.width/2, -img.height/2);

        screen.restore();


//        screen.drawImage(img, x, y);


        screen.fill();
    };

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

    var isSideHit = function (b1, b2) {
        return b1.center.x + b1.size.x / 2 == b2.center.x - b2.size.x / 2 ||
            b1.center.x - b1.size.x / 2 == b2.center.x + b2.size.x / 2;
    };

    var isTopBottomHit = function (b1, b2) {
        return b1.center.y + b1.size.y / 2 == b2.center.y - b2.size.y / 2 ||
            b1.center.y - b1.size.y / 2 == b2.center.y + b2.size.y / 2;

    };

    // Start game
    // ----------

    // When the DOM is ready, create (and start) the game.
    window.addEventListener('load', function () {
        new Game();
    });
})();