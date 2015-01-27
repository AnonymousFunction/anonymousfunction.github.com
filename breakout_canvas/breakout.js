;(function() {

  // Main game object
  // ----------------

  // **new Game()** Creates the game object with the game state and logic.
  var Game = function() {

    // In index.html, there is a canvas tag that the game will be drawn in.
    // Grab that canvas out of the DOM.
    var canvas = document.getElementById("breakout");

    // Get the drawing context.  This contains functions that let you draw to the canvas.
    var screen = canvas.getContext('2d');

    // Note down the dimensions of the canvas.  These are used to
    // place game bodies.
    var gameSize = { x: canvas.width, y: canvas.height };

    // Create the bodies array to hold the player, bricks and bullets.
    this.bodies = [];

    // Add the bricks to the bodies array.
    this.bodies = this.bodies.concat(createBricks(this));

    // Add the player to the bodies array.
    this.bodies = this.bodies.concat(new Player(this, gameSize));

    this.bulletCount = 0;

    var self = this;

    // Main game tick function.  Loops forever, running 60ish times a second.
    var tick = function() {

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
    update: function() {
      var self = this;

      // `notCollidingWithAnything` returns true if passed body
      // is not colliding with anything.
      var notCollidingWithAnything = function(b1) {
        return self.bodies.filter(function(b2) { return colliding(b1, b2); }).length === 0;
      };

      // Throw away bodies that are colliding with something. They
      // will never be updated or draw again.
      this.bodies = this.bodies.filter(notCollidingWithAnything);

      // Call update on every body.
      for (var i = 0; i < this.bodies.length; i++) {
        this.bodies[i].update();
      }
    },

    // **draw()** draws the game.
    draw: function(screen, gameSize) {
      // Clear away the drawing from the previous tick.
      screen.clearRect(0, 0, gameSize.x, gameSize.y);

      // Draw each body as a rectangle.
      for (var i = 0; i < this.bodies.length; i++) {
        if (this.bodies[i].color) {
            screen.fillStyle=this.bodies[i].color;
        } else {
            screen.fillStyle="#FFFFFF";
        }
        drawRect(screen, this.bodies[i]);
      }
    },

    // **addBody()** adds a body to the bodies array.
    addBody: function(body) {
      this.bodies.push(body);
    }
  };

  // Bricks
  // --------

  // **new Brick()** creates an brick.
  var Brick = function(game, color, center) {
    this.game = game;
    this.color = color;
    this.center = center;
    this.size = { x: 50, y: 10 };
  };

  Brick.prototype = {

    // **update()** updates the state of the brick for a single tick.
    update: function() {

    }
  };

  // **createBricks()** returns an array of twenty-four bricks.
  var createBricks = function(game) {
    var bricks = [];
    for (var i = 0; i < 24; i++) {

      // Place bricks in eight columns.
      var x = 100 + (i % 8) * 55;

      // Place bricks in three rows.
      var y = 40 + (i % 3) * 20;
      
      function getColor() {
        switch (i % 3) {
              case 0:
                  return "#B93435";
              case 1:
                  return "#B85922";
              case 2:
                  return "#A46814";
        }
      }
      
        function getColor2() {
          switch (i % 3) {
                case 0:
                    return "#929400";
                case 1:
                    return "#3D932A";
                case 2:
                    return "#302BC5";
          }
        }

      
      // Create brick.
      bricks.push(new Brick(game, getColor(), { x: x, y: y}));
      bricks.push(new Brick(game, getColor2(), { x: x, y: y + 60}));
    }

    return bricks;
  };

  // Player
  // ------

  // **new Player()** creates a player.
  var Player = function(game, gameSize) {
    this.game = game;
    this.size = { x: 50, y: 10 };
    this.color = "#0088FF";
    this.center = { x: gameSize.x / 2, y: gameSize.y - this.size.y * 2 };

    // Create a keyboard object to track button presses.
    this.keyboarder = new Keyboarder();
  };

  Player.prototype = {

    // **update()** updates the state of the player for a single tick.
    update: function() {
      // If left cursor key is down...
      if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {

        // ... move left.
        this.center.x -= 2;

      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
        this.center.x += 2;
      }

      // If S key is down...
      if (this.keyboarder.isDown(this.keyboarder.KEYS.S)) {
        // ... create a bullet just above the player that will move upwards...
        var bullet = new Bullet({ x: this.center.x, y: this.center.y - this.size.y - 10 },
                                { x: 0, y: -7 });

        // ... add the bullet to the game...
        if (this.game.bulletCount < 3) {
          this.game.addBody(bullet);
          this.game.bulletCount++;
        }
      }
    }
  };

  // Bullet
  // ------

  // **new Bullet()** creates a new bullet.
  var Bullet = function(center, velocity) {
    this.center = center;
    this.size = { x: 3, y: 3 };
    this.velocity = velocity;
  };

  Bullet.prototype = {

    // **update()** updates the state of the bullet for a single tick.
    update: function() {

      // Add velocity to center to move bullet.
      this.center.x += this.velocity.x;
      this.center.y += this.velocity.y;
    }
  };

  // Keyboard input tracking
  // -----------------------

  // **new Keyboarder()** creates a new keyboard input tracking object.
  var Keyboarder = function() {

    // Records up/down state of each key that has ever been pressed.
    var keyState = {};

    // When key goes down, record that it is down.
    window.addEventListener('keydown', function(e) {
      keyState[e.keyCode] = true;
    });

    // When key goes up, record that it is up.
    window.addEventListener('keyup', function(e) {
      keyState[e.keyCode] = false;
    });

    // Returns true if passed key is currently down.  `keyCode` is a
    // unique number that represents a particular key on the keyboard.
    this.isDown = function(keyCode) {
      return keyState[keyCode] === true;
    };

    // Handy constants that give keyCodes human-readable names.
    this.KEYS = { LEFT: 37, RIGHT: 39, S: 83 };
  };

  // Other functions
  // ---------------

  // **drawRect()** draws passed body as a rectangle to `screen`, the drawing context.
  var drawRect = function(screen, body) {
    screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
                    body.size.x, body.size.y);
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
  var colliding = function(b1, b2) {
    return !(
      b1 === b2 ||
        b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
        b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
        b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
        b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2
    );
  };

  // Start game
  // ----------

  // When the DOM is ready, create (and start) the game.
  window.addEventListener('load', function() {
    new Game();
  });
})();