(function () {

    // Main game object
    // ----------------

    // **new Game()** Creates the game object with the game state and logic.
    var Game = function () {

        var canvas = document.getElementById("zelda");
        this.viewport = $("#zelda");

        var screen = canvas.getContext('2d');
        var menuScreen = document.getElementById("menu").getContext("2d");
        var controllerScreen = document.getElementById("controller").getContext("2d");

        var gameSize = { x: canvas.width, y: canvas.height };

        this.bodies = [];

        this.player = new Player(this, gameSize);

        this.bodies = this.bodies.concat(this.player);

        this.map =  { x: 7, y: 7 };

        this.movementMap = getCurrentMap(this.map.x, this.map.y);

        var self = this;

        // Main game tick function.  Loops forever, running 60ish times a second.
        var tick = function () {

            // Update game state.
            self.update();

            // Draw game bodies.
            self.draw(screen, menuScreen, controllerScreen, gameSize);

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

            $("#link-x-square").text(this.player.tile.x);
            $("#link-y-square").text(this.player.tile.y);

            $("#map-x").text(this.map.x);
            $("#map-y").text(this.map.y);

        },

        // **draw()** draws the game.
        draw: function (screen, menuScreen, controllerScreen, gameSize) {
            // Clear away the drawing from the previous tick.
            screen.clearRect(0, 0, gameSize.x, gameSize.y);

            // Draw each body as a rectangle.
            for (var i = 0; i < this.bodies.length; i++) {
                this.bodies[i].draw(screen);
            }
            
            this.drawMenu(menuScreen);
            this.drawController(controllerScreen);
        },
        
        drawMenu: function(menuScreen) {
            menuScreen.clearRect(0, 0, 256, 56);

            //Gray background
            menuScreen.fillStyle = "#616161";
            menuScreen.fillRect(16, 16, 64, 32);

            //Beacon
            menuScreen.fillStyle = "#71D200;";
            menuScreen.fillRect(16 + (this.map.x * 4), 16 + (this.map.y * 4), 4, 4);
            
            var img = document.getElementById("hud-icons");
            menuScreen.drawImage(img, 86, 12, 18, 36);
             
            img = document.getElementById("b-a-boxes");
            menuScreen.drawImage(img, 118, 15, 52, 32); 
            
            if (this.player.hasSword) {
                img = document.getElementById("sword-img");
                menuScreen.drawImage(img, 152, 24, 7, 16);
            }

            img = document.getElementById("life-header");
            menuScreen.drawImage(img, 173, 9, 68, 20);
            
            menuScreen.fillStyle = "white";
            menuScreen.font = "8px 'Press Start 2P'";
            menuScreen.fillText("255", 96, 24);
            menuScreen.fillText("X0", 96, 40);
            menuScreen.fillText("X0", 96, 48);
        },
        
        drawController: function(controllerScreen){

        },

        // **addBody()** adds a body to the bodies array.
        addBody: function (body) {
            this.bodies.push(body);
        },
        
        moveScreenUp: function(){
            this.screenTransitionTime = 176;
            this.screenTransitionDir = "up";
            this.map.y--;
            this.movementMap = getCurrentMap(this.map.x, this.map.y);
        },
        
        moveScreenDown: function(){
            this.screenTransitionTime = 176;
            this.screenTransitionDir = "down";
            this.map.y++;
            this.movementMap = getCurrentMap(this.map.x, this.map.y);
        },
                
        moveScreenLeft: function(){
            this.screenTransitionTime = 256;
            this.screenTransitionDir = "left";
            this.map.x--;
            this.movementMap = getCurrentMap(this.map.x, this.map.y);
        },      
          
        moveScreenRight: function(){
            this.screenTransitionTime = 256;
            this.screenTransitionDir = "right";
            this.map.x++;
            this.movementMap = getCurrentMap(this.map.x, this.map.y);
        },

        enterCave: function(){
            console.log("cave");
            
            this.preCaveMap = this.movementMap;
            this.preCavePlayerX = this.player.center.x;
            this.preCavePlayerY = this.player.center.y;
            this.isInCave = true;
            this.preCaveBackgroundX = this.viewport.css("background-position-x")
            this.preCaveBackgroundY = this.viewport.css("background-position-y")

            this.movementMap = getCaveMap();
            this.player.center.x = 128;
            this.player.center.y = 150;
            
            this.viewport.css("background", "url('images/cave_map.png')");

            this.bodies.push(new Fire(this, { x: 80, y: 72 }));
            this.bodies.push(new Fire(this, { x: 176, y: 72 }));
        },
        
        exitCave: function(){
            console.log("exit cave");
            this.viewport.css("background", "url('images/overworld_map.png')");
            this.viewport.css("background-position-x", this.preCaveBackgroundX);
            this.viewport.css("background-position-y", this.preCaveBackgroundY);

            this.movementMap = this.preCaveMap;
            this.player.center.x = this.preCavePlayerX;
            this.player.center.y = this.preCavePlayerY;
            this.isInCave = false;
            
            this.bodies = _.filter(this.bodies, function(body) {
                return !(body instanceof Fire);
            });
        }
    };
    
    var Fire = function(game, center){
        this.id = "cave-fire";
        this.game = game;
        this.size = { x: 16, y: 16 };
        this.center = { x: center.x, y: center.y };
        this.spriteChangeCount = 0;
        this.spriteCooldown = 10;
    };
    
    Fire.prototype = {
        draw: function(screen){
            var x = this.center.x;
            var y = this.center.y;

            var img = document.getElementById(this.id);
            screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);
        },
        
        update: function() {
            if (this.spriteChangeCount === 0) {
                this.id = this.id === "cave-fire" ? "cave-fire-1" : "cave-fire";
                this.spriteChangeCount = this.spriteCooldown;
            } else {
                this.spriteChangeCount--;
            }
        }
    };

    // Player
    // ------

    // **new Player()** creates a player.
    var Player = function (game, gameSize) {
        this.id = "link-up-1";
        this.game = game;
        this.size = { x: 16, y: 16 };
        this.color = "#0088FF";
        this.center = { x: gameSize.x / 2, y: gameSize.y / 2 };
        this.tile = {x: 8, y: 5};
        this.moveRate = 1.3;
        this.spriteChangeCount = 0;
        this.spriteCooldown = 6;
        this.hasSword = true;
        this.swordCooldown = 10;
        this.swordTimer = 0;
        this.swordWaitCooldown = 20;
        this.swordWait = 0;

        // Create a keyboard object to track button presses.
        this.keyboarder = new Keyboarder();
    };

    Player.prototype = {
    
        draw: function(screen){
            var x = this.center.x;
            var y = this.center.y;

            var img = document.getElementById(this.id);
            screen.drawImage(img, x - this.size.x / 2, y - this.size.y /2);

            //center dot
            //screen.fillStyle = "black";
            //screen.fillRect(x, y, 1, 1);

            //up-down boundaries
            //screen.fillStyle = "red";
            //screen.fillRect(x - 4, y, 1, 1);
            //screen.fillRect(x + 4, y, 1, 1);
            //screen.fillRect(x - 4, y - this.size.y / 2, 1, 1);
            //screen.fillRect(x + 4, y - this.size.y / 2, 1, 1);
            //screen.fillRect(x - 4, y + this.size.y / 2, 1, 1);
            //screen.fillRect(x + 4, y + this.size.y / 2, 1, 1);

            //left-right boundaries
            //screen.fillStyle = "blue";
            //screen.fillRect(x - this.size.x / 2, y, 1, 1);
            //screen.fillRect(x + this.size.x / 2, y, 1, 1);
            //screen.fillRect(x - this.size.x / 2, y + this.size.y / 2, 1, 1);
            //screen.fillRect(x + this.size.x / 2, y + this.size.y / 2, 1, 1);
        },

        // **update()** updates the state of the player for a single tick.
        update: function () {
            if (this.swordWait > 0) {
                this.swordWait--;
            }
            if (this.swordTimer > 0) {
                this.swordTimer--;
                return;
            }
            
            
            // If Space key is down...
            if ((this.keyboarder.isDown(this.keyboarder.KEYS.SPACE) || TOUCH.A) && this.swordTimer === 0 && this.swordWait === 0 && this.swordRelease) {
                if (this.id.indexOf("up") > -1) {
                    this.id = "sword-up";
                    this.center.y -= 12;
                } else if (this.id.indexOf("down") > -1) {
                    this.id = "sword-down";
                } else if (this.id.indexOf("left") > -1) {
                    this.id = "sword-left";
                    this.center.x -= 13;
                }  else if (this.id.indexOf("right") > -1) {
                    this.id = "sword-right";
                }
                this.swordTimer = this.swordCooldown;
                this.swordWait = this.swordWaitCooldown;
                this.swordRelease = false;
                
                return;
            } else {
                if (this.id === "sword-up") {
                    this.id = "link-up-1";
                    this.center.y += 12;
                } else if (this.id == "sword-down") {
                    this.id = "link-down-1";
                } else if (this.id === "sword-left") {
                    this.center.x += 13;
                    this.id = "link-left-1";
                }  else if (this.id === "sword-right") {
                    this.id = "link-right-1";
                }
                this.swordRelease = true;
            }
        
            if (this.keyboarder.isDown(this.keyboarder.KEYS.UP) || TOUCH.UP) {
                if (this.spriteChangeCount === 0 || this.id.indexOf("up") === -1) {
                    this.id = this.id === "link-up-2" ? "link-up-1" : "link-up-2";
                    this.spriteChangeCount = this.spriteCooldown;
                } else {
                    this.spriteChangeCount--;
                }
                
                if (this.center.y > 0) {
                    var newCenterY = this.center.y - this.moveRate;
                    var newTileY = parseInt(Number(newCenterY).toFixed(0) / 16);
                    var leftBoundary = this.center.x - 4;
                    var leftBoundaryTile = parseInt(Number(leftBoundary).toFixed(0) / 16);
                    var rightBoundary = this.center.x + 4;
                    var rightBoundaryTile = parseInt(Number(rightBoundary).toFixed(0) / 16);


                    if (this.game.movementMap[newTileY][leftBoundaryTile] === 0 || this.game.movementMap[newTileY][rightBoundaryTile] === 0) {
                        return;
                    }
                    
                    this.center.y -= this.moveRate;
                    
                    var newTileX = parseInt(Number(this.center.x).toFixed(0) / 16);
                    if (this.game.movementMap[newTileY][newTileX] === 2) {
                        this.game.enterCave();
                    }
                } else {
                    this.game.moveScreenUp();
                }
            } else if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN) || TOUCH.DOWN) {
                if (this.spriteChangeCount === 0 || this.id.indexOf("down") === -1) {
                    this.id = this.id === "link-down-2" ? "link-down-1" : "link-down-2";
                    this.spriteChangeCount = this.spriteCooldown;
                } else {
                    this.spriteChangeCount--;
                }
                
                if (this.center.y < 176) {
                    var newCenterY = this.center.y + this.size.y / 2 + this.moveRate;
                    var newTileY = parseInt(Number(newCenterY).toFixed(0) / 16);
                    var leftBoundary = this.center.x - 4;
                    var leftBoundaryTile = parseInt(Number(leftBoundary).toFixed(0) / 16);
                    var rightBoundary = this.center.x + 4;
                    var rightBoundaryTile = parseInt(Number(rightBoundary).toFixed(0) / 16);

                    if (this.game.movementMap[newTileY] && (this.game.movementMap[newTileY][leftBoundaryTile] === 0 || this.game.movementMap[newTileY][rightBoundaryTile] === 0)) {
                        return;
                    }
                    
                    if (this.game.movementMap[newTileY] && this.game.movementMap[newTileY][leftBoundaryTile] === 3) {
                        this.game.exitCave();
                        return;
                    }

                    this.center.y += this.moveRate;
                } else {
                    this.game.moveScreenDown();
                }
            } else if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT) || TOUCH.LEFT) {
                if (this.spriteChangeCount === 0 || this.id.indexOf("left") === -1) {
                    this.id = this.id === "link-left-2" ? "link-left-1" : "link-left-2";
                    this.spriteChangeCount = this.spriteCooldown;
                } else {
                    this.spriteChangeCount--;
                }
                            
                if (this.center.x > 0) {
                    var newCenterX = this.center.x - this.size.x / 2 + this.moveRate;
                    var newTileX = parseInt(Number(newCenterX).toFixed(0) / 16);
                    var bottomY = this.center.y + this.size.y / 2;
                    var bottomTileY = parseInt(Number(bottomY).toFixed(0) / 16);

                    if (this.game.movementMap[this.tile.y][newTileX] === 0 || this.game.movementMap[bottomTileY][newTileX] === 0) {
                        return;
                    }

                    this.center.x -= this.moveRate;
                } else {
                    this.game.moveScreenLeft();
                }
            } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT) || TOUCH.RIGHT) {
                if (this.spriteChangeCount === 0 || this.id.indexOf("right") === -1) {
                    this.id = this.id === "link-right-2" ? "link-right-1" : "link-right-2";
                    this.spriteChangeCount = this.spriteCooldown;
                } else {
                    this.spriteChangeCount--;
                }
            
                if (this.center.x < 256) {
                    var newCenterX = this.center.x + this.size.x / 2 + this.moveRate;
                    var newTileX = parseInt(Number(newCenterX).toFixed(0) / 16);
                    var bottomY = this.center.y + this.size.y / 2;
                    var bottomTileY = parseInt(Number(bottomY).toFixed(0) / 16);

                    if (this.game.movementMap[this.tile.y][newTileX] === 0 || this.game.movementMap[bottomTileY][newTileX] === 0) {
                        return;
                    }

                    this.center.x += this.moveRate;
                } else {
                    this.game.moveScreenRight();
                }
            }

            this.tile.x = parseInt(Number(this.center.x).toFixed(0) / 16);
            this.tile.y = parseInt(Number(this.center.y).toFixed(0) / 16);
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

    var TOUCH = { UP: false, DOWN: false, LEFT: false, RIGHT: false };

    // Start game
    // ----------

    // When the DOM is ready, create (and start) the game.
    window.addEventListener('load', function () {
        new Game();

        var widthScale = Number(window.innerWidth/256).toFixed(2);
        var heightScale = Number(window.innerHeight/346).toFixed(2);

        if (widthScale <= heightScale) {
            $("meta[name=viewport]").attr("content", "initial-scale=" + widthScale + ", user-scalable=no");
        } else {
            $("meta[name=viewport]").attr("content", "initial-scale=" + heightScale + ", user-scalable=no");
        }
        
        $("#controller").on("touchstart", function(e){
            var x = e.originalEvent.touches[0].pageX;
            var y = e.originalEvent.touches[0].pageY;

            console.log("x", x, "y", y);

            if (x >= 40 && x <= 74 && y >= 240 && y <= 276) {
                TOUCH.UP = true;
            } else if (x >= 40 && x <= 74 && y >= 307 && y <= 340) {
                TOUCH.DOWN = true;
            } else if (x >= 10 && x <= 42 && y >= 274 && y <= 308) {
                TOUCH.LEFT = true;
            } else if (x >= 74 && x <= 104 && y >= 274 && y <= 308) {
                TOUCH.RIGHT = true;
            } else if (x >= 167 && x <= 203 && y >= 270 && y <= 308) {
                TOUCH.B = true;
            } else if (x >= 212 && x <= 248 && y >= 270 && y <= 308) {
                TOUCH.A = true;
            }
        });
        
        $("#controller").on("touchend", function(){
            TOUCH = { UP: false, DOWN: false, LEFT: false, RIGHT: false, B: false, A: false };
        });
    });
})();