
// Main game object
// ----------------

// **new Game()** Creates the game object with the game state and logic.
var Game = function () {

    var canvas = document.getElementById("zelda");
    this.viewport = $("#zelda");

    var screen = canvas.getContext('2d');
    this.screen = screen;

    var menuScreen = document.getElementById("menu").getContext("2d");
    var controllerScreen = document.getElementById("controller").getContext("2d");

    var gameSize = { x: canvas.width, y: canvas.height };

    this.size = gameSize;

    this.bodies = [];

    this.player = new Player(this, gameSize);

    this.itemCursor = new ItemCursor(this);

    this.bodies = this.bodies.concat(this.player);

    this.map = { x: 7, y: 7 };

    this.movementMap = getCurrentMap(this.map.x, this.map.y);

    this.isPaused = false;

    var self = this;

    // Start Game Genie
    $("#toggle-game-genie").click(function () {
        $("#game-genie").toggleClass("hidden");
    });
    $("#sword-checkbox").click(function () {
        self.player.hasSword = !self.player.hasSword;
    });
    $("#invincible-checkbox").click(function () {
        self.player.gameGenieInvincible = !self.player.gameGenieInvincible;
    });
    $("#no-collision-checkbox").click(function () {
        self.player.gameGenieNoCollision = !self.player.gameGenieNoCollision;
    });
    $("#boomerang-checkbox").click(function () {
        self.player.hasBoomerang = !self.player.hasBoomerang;
    });
    $("#blue-candle-checkbox").click(function () {
        self.player.hasBlueCandle = !self.player.hasBlueCandle;
    });

    $("#equip-select").on("change", function () {
        var item = $(this).val();
        switch (item) {
            case "Arrow":
                self.player.equipArrow();
                break;
            case "BlueCandle":
                self.player.equipBlueCandle();
                break;
            case "Bomb":
                self.player.equipBomb();
                break;
            case "Boomerang":
                self.player.equipBoomerang();
                break;
            default:
                self.player.equippedItem = "";
                break;
        }
    });

    $("#link-speed-input").val(self.player.moveRate).on("change", function () {
        self.player.moveRate = Number($(this).val());
    });

    $("#link-rupees-input").val(self.player.rupees).on("change", function () {
        self.player.rupees = Number($(this).val());
    });

    $("#link-bombs-input").val(self.player.bombs).on("change", function () {
        self.player.bombs = Number($(this).val());
    });
    // End Game Genie

    var buttonPressed = function (b) {
        if (typeof(b) == "object") {
            return b.pressed;
        }
        return b == 1.0;
    };

    var checkWiimoteControls = function () {
        var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);

        var wiimote = _.find(gamepads, function (gamepad) {
            return gamepad && gamepad.id && gamepad.id.indexOf("Wiimote") > -1;
        });

        var nesController = _.find(gamepads, function (gamepad) {
            return gamepad && gamepad.id && gamepad.id.indexOf("USB Gamepad") > -1;
        });

        if (wiimote) {
            TOUCH = { UP: false, DOWN: false, LEFT: false, RIGHT: false, B: false, A: false, START: false };

            var gp = gamepads[0];
            if (buttonPressed(gp.buttons[1]) || buttonPressed(gp.buttons[18])) {
                TOUCH.UP = true;
            } else if (buttonPressed(gp.buttons[0]) || buttonPressed(gp.buttons[19])) {
                TOUCH.DOWN = true;
            } else if (buttonPressed(gp.buttons[2]) || buttonPressed(gp.buttons[20])) {
                TOUCH.LEFT = true;
            } else if (buttonPressed(gp.buttons[3]) || buttonPressed(gp.buttons[21])) {
                TOUCH.RIGHT = true;
            }

            if (buttonPressed(gp.buttons[10]) || buttonPressed(gp.buttons[11])) {
                TOUCH.A = true;
            } else if (buttonPressed(gp.buttons[9]) || buttonPressed(gp.buttons[12])) {
                TOUCH.B = true;
            } else if (buttonPressed(gp.buttons[7]) || buttonPressed(gp.buttons[15])) {
                TOUCH.START = true;
            }
        }

        if (nesController) {
            TOUCH = { UP: false, DOWN: false, LEFT: false, RIGHT: false, B: false, A: false, START: false };

            var gp = gamepads[0];
            if (gp.axes[1] == -1) {
                TOUCH.UP = true;
            } else if (gp.axes[1] == 1) {
                TOUCH.DOWN = true;
            } else if (gp.axes[0] == -1) {
                TOUCH.LEFT = true;
            } else if (gp.axes[0] == 1) {
                TOUCH.RIGHT = true;
            }

            if (buttonPressed(gp.buttons[1])) {
                TOUCH.A = true;
            } else if (buttonPressed(gp.buttons[2])) {
                TOUCH.B = true;
            } else if (buttonPressed(gp.buttons[9])) {
                TOUCH.START = true;
            }
        }
    };

    // Main game tick function.  Loops forever, running 60ish times a second.
    var tick = function () {

        checkWiimoteControls();

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

    Sound.overworld.play();
};

Game.prototype = {

    // **update()** runs the main game logic.
    update: function () {
        var self = this;
        var link = self.player;

        if (this.pauseTransitionTime) {
            this.pauseTransitionTime -= 2;
            return;
        }

        if (this.unpauseTransitionTime) {
            this.unpauseTransitionTime -= 2;
        }

        if (this.isPaused) {
            this.itemCursor.update();

            if (this.player.keyboarder.isDown(this.player.keyboarder.KEYS.ENTER) || TOUCH.START) {
                this.unpause();
            } else if (this.player.keyboarder.isDown(this.player.keyboarder.KEYS.LEFT) || TOUCH.LEFT) {
                this.itemCursor.moveLeft();
            } else if (this.player.keyboarder.isDown(this.player.keyboarder.KEYS.RIGHT) || TOUCH.RIGHT) {
                this.itemCursor.moveRight();
            }

            return;
        }

        if (this.screenTransitionTime) {
            if (this.screenTransitionDir === "up") {
                var origMapTop = parseInt(this.viewport.css("background-position-y"));

                if (origMapTop < 0) {
                    var newMapTop = origMapTop + 4;
                    this.viewport.css("background-position-y", newMapTop + "px");

                    this.player.center.y += 4;
                }

                this.screenTransitionTime -= 4;

                //shuffle link's feet during screen transition
                this.player.id = this.screenTransitionTime % 64 < 32 ? "link-up-1" : "link-up-2";

                if (this.screenTransitionTime === 0) {
                    this.player.center.y -= 9;
                }
            } else if (this.screenTransitionDir === "down") {
                var origMapTop = parseInt(this.viewport.css("background-position-y"));

                if (origMapTop > -1232) {
                    var newMapTop = origMapTop - 4;
                    this.viewport.css("background-position-y", newMapTop + "px");

                    this.player.center.y -= 4;
                }

                this.screenTransitionTime -= 4;

                this.player.id = this.screenTransitionTime % 64 < 32 ? "link-down-1" : "link-down-2";

                if (this.screenTransitionTime === 0) {
                    this.player.center.y += 8;
                }
            } else if (this.screenTransitionDir === "left") {
                var origMapLeft = parseInt(this.viewport.css("background-position-x"));

                if (origMapLeft < 0) {
                    var newMapLeft = origMapLeft + 4;
                    this.viewport.css("background-position-x", newMapLeft + "px");

                    this.player.center.x += 4;
                }

                this.screenTransitionTime -= 4;

                this.player.id = this.screenTransitionTime % 64 < 32 ? "link-left-1" : "link-left-2";

                if (this.screenTransitionTime === 0) {
                    this.player.center.x -= 8;
                }
            } else if (this.screenTransitionDir === "right") {
                var origMapLeft = parseInt(this.viewport.css("background-position-x"));

                if (origMapLeft > -3840) {
                    var newMapLeft = origMapLeft - 4;
                    this.viewport.css("background-position-x", newMapLeft + "px");

                    this.player.center.x -= 4;
                }

                this.screenTransitionTime -= 4;

                this.player.id = this.screenTransitionTime % 64 < 32 ? "link-right-1" : "link-right-2";

                if (this.screenTransitionTime === 0) {
                    this.player.center.x += 8;
                }
            }

            return;
        }

        if (this.needToSpawnEnemies) {
            this.spawnEnemies();
            this.needToSpawnEnemies = false;
        }

        for (var i = 0; i < self.bodies.length; i++) {
            self.bodies[i].update();
        }

        //Check to see if Link is colliding with any objects
        _.each(self.bodies, function (body) {
            if (!(body instanceof Player)) {
                if (doBodiesCollide(link, body)) {
                    //ITEMS
                    if (body instanceof Sword) {
                        link.hasSword = true;
                        self.removeBody(body);
                        $("#cave-text").text("");
                        self.removeBodyByType(OldMan)
                        Sound.fanfare.play();
                    } else if (body instanceof BlueCandle) {
                        if (link.rupees >= body.price) {
                            link.hasBlueCandle = true;
                            link.rupees -= body.price;
                            self.removeBody(body);
                        }
                    }

                    //ENEMIES
                    if (body instanceof RedOctorok) {
                        if (link.isSwingingSword()) {
                            body.kill();
                        } else {
                            if (!link.isInvincible) {
                                link.takeDamage(body)
                            }
                        }
                    }
                }
            }
        });

        var swordPower = this.getFirstBodyByType(SwordPower);

        if (swordPower) {
            _.each(self.bodies, function (body) {
                if (!(body instanceof Player) && !(body instanceof SwordPower)) {
                    if (doBodiesCollide(swordPower, body)) {
                        if (body instanceof RedOctorok) {
                            swordPower.remove();
                            body.kill();
                        }
                    }
                }
            });
        }

        var candleFire = this.getFirstBodyByType(CandleFire);

        if (candleFire) {
            _.each(self.bodies, function (body) {
                if (!(body instanceof Player) && !(body instanceof CandleFire)) {
                    if (doBodiesCollide(candleFire, body)) {
                        if (body instanceof RedOctorok) {
                            body.kill();
                        }
                    }
                }
            });
        }

        var bombExplosion = this.getFirstBodyByType(BombExplosion);

        if (bombExplosion) {
            _.each(self.bodies, function (body) {
                if (!(body instanceof BombExplosion)) {
                    if (doBodiesCollide(bombExplosion, body)) {
                        if (body instanceof CaveEntrance) {
                            body.show();
                        } else if (body instanceof Player) {
                            if (!link.isInvincible) {
                                link.takeDamage(bombExplosion)
                            }
                        } else if (body instanceof RedOctorok) {
                            body.kill();
                        }
                    }
                }
            });
        }


        /* DEBUG */

//            $("#link-x").text(Number(this.player.center.x).toFixed(2));
//            $("#link-y").text(Number(this.player.center.y).toFixed(2));
//
//            $("#link-x-square").text(this.player.tile.x);
//            $("#link-y-square").text(this.player.tile.y);
//
//            $("#map-x").text(this.map.x);
//            $("#map-y").text(this.map.y);

    },

    pause: function () {
        if (!this.pauseTransitionTime) {
            this.isPaused = true;
            this.pauseTransitionTime = 50;
            this.viewport.addClass("paused");
            $("#about").removeClass("hidden");
            $("#cave-text").addClass("hidden");
        }
    },

    unpause: function () {
        if (!this.pauseTransitionTime) {
            this.isPaused = false;
            this.viewport.removeClass("paused");
            this.unpauseTransitionTime = 50;
            $("#about").addClass("hidden");
            $("#cave-text").removeClass("hidden");

            this.itemCursor.selectActive();
        }
    },

    // **draw()** draws the game.
    draw: function (screen, menuScreen, controllerScreen, gameSize) {
        // Clear away the drawing from the previous tick.
        screen.clearRect(0, 0, gameSize.x, gameSize.y);
        var img;

        if (this.isPaused) {
            this.itemCursor.draw(screen);

            if (this.player.hasBoomerang) {
                img = document.getElementById("boomerang");
                screen.drawImage(img, 134, 29, 5, 8);
            }
            if (this.player.bombs) {
                img = document.getElementById("bomb");
                screen.drawImage(img, 156, 26, 8, 14);
            }
            if (this.player.hasBlueCandle) {
                img = document.getElementById("blue-candle");
                screen.drawImage(img, 204, 25, 8, 16);
            }
        } else {
            var bodiesNotLink = _.filter(this.bodies, function (body) {
                return !(body instanceof Player);
            });

            //draw Link last
            _.each(bodiesNotLink, function (body) {
                body.draw(screen);
            });

            this.player.draw(screen);

            this.drawMenu(menuScreen);
            this.drawController(controllerScreen);

            if (this.isWriteText) {
                this.printText();
            }
        }
    },

    drawMenu: function (menuScreen) {
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

        if (this.player.equippedItem) {
            var item = this.player.equippedItem;
            img = document.getElementById(item.id);
            menuScreen.drawImage(img, item.menu.x, item.menu.y, item.size.x, item.size.y);
        }

        img = document.getElementById("life-header");
        menuScreen.drawImage(img, 173, 9, 68, 20);

        menuScreen.fillStyle = "white";
        menuScreen.font = "8px 'Press Start 2P'";
        $("#rupees").text(this.player.rupees < 100 ? "X" + this.player.rupees : this.player.rupees);
        $("#keys").text("X0");
        $("#bombs").text("X" + this.player.bombs);

        //hearts
        var heartsX = 175;
        var heartsY = 37;
        if (this.player.hearts <= 8) {
            for (var i = 0; i < this.player.hearts; i++) {
                img = document.getElementById("full-heart");
                menuScreen.drawImage(img, heartsX, heartsY, 9, 10);
                heartsX += 8;
            }
            for (var i = 0; i < this.player.maxHearts - this.player.hearts; i++) {
                img = document.getElementById("empty-heart");
                menuScreen.drawImage(img, heartsX, heartsY, 9, 10);
                heartsX += 8;
            }
        }
    },

    drawController: function (controllerScreen) {

    },

    printText: function () {
        var player = this.player;
        player.canMove = false;
        var caveText = this.caveProperties.text;

        var texty = "";

        function getNextLetter() {
            if (caveText.length) {
                var toReturn = caveText[0];
                var chopped = caveText.substring(1);
                caveText = chopped;
                return toReturn;
            }

            caveTextInterval.stop();
            player.canMove = true;
            return "";
        }

        caveTextInterval = $.timer(function () {
            texty = $("#cave-text").text();
            texty += getNextLetter();
            $("#cave-text").text(texty);
        }, 100);

        Sound.text.play();

        caveTextInterval.play();
        this.isWriteText = false;
    },

    // **addBody()** adds a body to the bodies array.
    addBody: function (body) {
        this.bodies.push(body);
    },

    getFirstBodyByType: function (type) {
        return _.find(this.bodies, function (body) {
            return body instanceof type;
        });
    },

    removeBody: function (b2) {
        this.bodies = _.filter(this.bodies, function (b1) {
            return b1 != b2;
        })
    },

    removeBodyByType: function (type) {
        this.bodies = _.filter(this.bodies, function (b1) {
            return !(b1 instanceof type);
        })
    },

    hasBodyByType: function (type) {
        return Boolean(_.find(this.bodies, function (body) {
            return body instanceof type;
        }));
    },

    clearObjectsOnScreenTransition: function () {
        var self = this;
        var clearArray = [SwordPower, CandleFire, RedOctorok, Bomb, Cloud, Boomerang, CaveEntrance];

        _.each(clearArray, function (type) {
            self.removeBodyByType(type);
        });
    },

    spawnEnemies: function () {
        var self = this;
        this.enemies = getEnemyLocations(this)[this.map.x + "_" + this.map.y] || { bodies: [] };

        _.each(this.enemies.bodies, function (body) {
            self.addBody(body);
        });
    },

    moveScreenUp: function () {
        this.screenTransitionTime = 176;
        this.screenTransitionDir = "up";
        this.map.y--;
        this.movementMap = getCurrentMap(this.map.x, this.map.y);
        this.clearObjectsOnScreenTransition();
        this.needToSpawnEnemies = true;
    },

    moveScreenDown: function () {
        this.screenTransitionTime = 176;
        this.screenTransitionDir = "down";
        this.map.y++;
        this.movementMap = getCurrentMap(this.map.x, this.map.y);
        this.clearObjectsOnScreenTransition();
        this.needToSpawnEnemies = true;
    },

    moveScreenLeft: function () {
        this.screenTransitionTime = 256;
        this.screenTransitionDir = "left";
        this.map.x--;
        this.movementMap = getCurrentMap(this.map.x, this.map.y);
        this.clearObjectsOnScreenTransition();
        this.needToSpawnEnemies = true;
    },

    moveScreenRight: function () {
        this.screenTransitionTime = 256;
        this.screenTransitionDir = "right";
        this.map.x++;
        this.movementMap = getCurrentMap(this.map.x, this.map.y);
        this.clearObjectsOnScreenTransition();
        this.needToSpawnEnemies = true;
    },

    enterCave: function () {
        var self = this;
        this.preCaveMap = this.movementMap;
        this.preCavePlayerX = this.player.center.x;
        this.preCavePlayerY = this.player.center.y;
        this.isInCave = true;
        this.preCaveBackgroundX = this.viewport.css("background-position-x");
        this.preCaveBackgroundY = this.viewport.css("background-position-y");

        this.movementMap = getCaveMap();
        this.player.center.x = 128;
        this.player.center.y = 150;

        this.viewport.addClass("cave");

        this.bodies = _.filter(this.bodies, function (body) {
            return body instanceof Player;
        });

        this.caveProperties = getCaveProperties(this)[self.map.x + "_" + self.map.y] || { bodies: [], text: "FINISH THIS CAVE, RICH!" };

        _.each(this.caveProperties.bodies, function (body) {
            self.addBody(body);
        });

        this.isWriteText = true;

        Sound.overworld.stop();
        Sound.cave.play();
    },

    exitCave: function () {
        this.viewport.removeClass("cave");
        this.viewport.css("background-position-x", this.preCaveBackgroundX);
        this.viewport.css("background-position-y", this.preCaveBackgroundY);

        this.movementMap = this.preCaveMap;
        this.player.center.x = this.preCavePlayerX;
        this.player.center.y = this.preCavePlayerY;
        this.isInCave = false;

        this.bodies = _.filter(this.bodies, function (body) {
            return body instanceof Player;
        });

        $("#cave-text").text("");
        this.needToSpawnEnemies = true;

        Sound.overworld.play();
    },

    enterDungeon: function () {
        var self = this;
        this.preCaveMap = this.movementMap;
        this.preCavePlayerX = this.player.center.x;
        this.preCavePlayerY = this.player.center.y;
        this.isInCave = true;
        this.preCaveBackgroundX = this.viewport.css("background-position-x");
        this.preCaveBackgroundY = this.viewport.css("background-position-y");

        this.player.center.x = 128;
        this.player.center.y = 150;

        this.dungeonProperties = getDungeonProperties(this)[self.map.x + "_" + self.map.y] || { bodies: [] };

        this.viewport.css({
            "background-position-x": this.dungeonProperties.startBackgroundX,
            "background-position-y": this.dungeonProperties.startBackgroundY
        });

        this.viewport.addClass("dungeon");
    }
};

var getCaveProperties = function (game) {
    var player = game.player;
    var _6_6 = {
        text: "BUY SOMETHIN' WILL YA!",
        bodies: [
            new CaveFire(game, { x: 80, y: 72 }),
            new CaveFire(game, { x: 176, y: 72 }),
            new Merchant(game, { x: 128, y: 72 }),
            new ItemPrice(game, { x: 45, y: 115 }),
            new MagicShield(game, 160, { x: 80, y: 100 }),
            new KeyItem(game, 100, { x: 128, y: 100 }),
            new BlueCandle(game, 60, { x: 176, y: 100 })
        ]
    };

    var _7_6 = {
        text: "IT'S A SECRET\nTO EVERYBODY.",
        bodies: [
            new CaveFire(game, { x: 80, y: 72 }),
            new CaveFire(game, { x: 176, y: 72 }),
            new CaveMoblin(game, { x: 128, y: 72 })
        ]
    };

    var _7_7;
    if (player.hasSword) {
        _7_7 = {
            text: "",
            bodies: [
                new CaveFire(game, { x: 80, y: 72 }),
                new CaveFire(game, { x: 176, y: 72 })
            ]
        }
    } else {
        _7_7 = {
            text: "IT'S DANGEROUS TO GO\nALONE! TAKE THIS.",
            bodies: [
                new CaveFire(game, { x: 80, y: 72 }),
                new CaveFire(game, { x: 176, y: 72 }),
                new OldMan(game, { x: 128, y: 72 }),
                new Sword(game, { x: 128, y: 100 })
            ]
        }
    }

    return {
        "6_6": _6_6,
        "7_6": _7_6,
        "7_7": _7_7
    }
};

var getDungeonProperties = function (game) {
    var player = game.player;
    var _7_3 = {
        bodies: [

        ],
        startBackgroundX: "-768px",
        startBackgroundY: "-1232px"
    };

    return {
        "7_3": _7_3
    }
};

var getEnemyLocations = function (game) {
    var player = game.player;

    var _7_6 = {
        bodies: [
            new CaveEntrance(game, { x: 120, y: 24 })
        ]
    };

    var _8_7 = {
        bodies: [
            new RedOctorok(game, "up", { x: 200, y: 100 }),
            new RedOctorok(game, "down", { x: 86, y: 40 }),
            new RedOctorok(game, "down", { x: 86, y: 134 })
        ]
    };

    return {
        "7_6": _7_6,
        "8_7": _8_7
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
    this.hasBoomerang = false;
    this.hasBlueCandle = false;
    this.hasSword = false;
    this.swordCooldown = 10;
    this.swordTimer = 0;
    this.swordWaitCooldown = 20;
    this.swordWait = 0;
    this.equippedItem = null;
    this.canMove = true;
    this.maxHearts = 3;
    this.hearts = 3;
    this.rupees = 255;
    this.bombs = 4;
    this.gameGenieInvincible = false;
    this.gameGenieNoCollision = false;
    this.isInvincible = false;
    this.invincibleCooldown = 60;
    this.invincibleTimer = 0;
    this.attackOffsetY = 6;
    this.attackOffsetX = 6;

    // Create a keyboard object to track button presses.
    this.keyboarder = new Keyboarder();
};

Player.prototype = {

    draw: function (screen) {
        var x = this.center.x;
        var y = this.center.y;

        var img = document.getElementById(this.id);
        screen.drawImage(img, x - this.size.x / 2, y - this.size.y / 2);

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

    isSwingingSword: function () {
        return Boolean(this.swordTimer);
    },

    takeDamage: function (enemy) {
        if (this.gameGenieInvincible) {
            return;
        }

        this.isInvincible = true;

        this.hearts -= enemy.damage;
        if (this.hearts < 0) {
            this.hearts = 0;
        }

        //Knock link back when he gets hit.  Needs to take into account the screen edges and obstacles
        switch (this.getDirection()){
            case "up":
                this.center.y += 16;
                break;
            case "down":
                this.center.y -= 16;
                break;
            case "left":
                this.center.x += 16;
                break;
            case "right":
                this.center.x -= 16;
                break;
        }

        this.invincibleTimer = this.invincibleCooldown;
    },

    getDirection: function () {
        if (this.id.indexOf("up") > -1) {
            return "up";
        } else if (this.id.indexOf("down") > -1) {
            return "down";
        } else if (this.id.indexOf("left") > -1) {
            return "left";
        } else if (this.id.indexOf("right") > -1) {
            return "right";
        }
    },

    equipArrow: function () {
        this.equippedItem = new EquippedArrow(this.game, {x: 0, y: 0});
    },

    equipBlueCandle: function () {
        if (this.hasBlueCandle) {
            this.equippedItem = new BlueCandle(this.game, 0, {x: 0, y: 0});
        }
    },

    equipBomb: function () {
        if (this.bombs) {
            this.equippedItem = new EquippedBomb(this.game, {x: 0, y: 0 });
        }
    },

    equipBoomerang: function () {
        if (this.hasBoomerang) {
            this.equippedItem = new Boomerang(this.game, this);
        }
    },

    // **update()** updates the state of the player for a single tick.
    update: function () {
        if (!this.canMove) {
            return;
        }

        if (this.swordWait > 0) {
            this.swordWait--;
        }
        if (this.swordTimer > 0) {
            this.swordTimer--;
            return;
        }

        if (this.invincibleTimer > 0) {
            this.invincibleTimer--;

            if (this.invincibleTimer % 5 < 3) {
                if (this.id.indexOf("up") > -1) {
                    this.id = "link-blink-up";
                } else if (this.id.indexOf("down") > -1) {
                    this.id = "link-blink-down";
                } else if (this.id.indexOf("left") > -1) {
                    this.id = "link-blink-left";
                } else if (this.id.indexOf("right") > -1) {
                    this.id = "link-blink-right";
                }
            } else {
                if (this.id.indexOf("up") > -1) {
                    this.id = "link-up-1";
                } else if (this.id.indexOf("down") > -1) {
                    this.id = "link-down-1";
                } else if (this.id.indexOf("left") > -1) {
                    this.id = "link-left-1";
                } else if (this.id.indexOf("right") > -1) {
                    this.id = "link-right-1";
                }
            }

            return;
        } else {
            this.isInvincible = false;

            // If Link is done blinking and ended up in a blink state, reset him
            if (this.id.indexOf("blink") > -1) {
                if (this.id.indexOf("up") > -1) {
                    this.id = "link-up-1";
                } else if (this.id.indexOf("down") > -1) {
                    this.id = "link-down-1";
                } else if (this.id.indexOf("left") > -1) {
                    this.id = "link-left-1";
                } else if (this.id.indexOf("right") > -1) {
                    this.id = "link-right-1";
                }
            }
        }


        // If Space key is down...
        if ((this.keyboarder.isDown(this.keyboarder.KEYS.SPACE) || TOUCH.A) && this.hasSword && this.swordTimer === 0 && this.swordWait === 0 && this.swordRelease) {
            if (this.id.indexOf("up") > -1) {
                this.id = "sword-up";
                this.center.y -= this.attackOffsetY;
                this.size = { x: 16, y: 28 };
            } else if (this.id.indexOf("down") > -1) {
                this.id = "sword-down";
                this.center.y += this.attackOffsetY;
                this.size = { x: 16, y: 28 };
            } else if (this.id.indexOf("left") > -1) {
                this.id = "sword-left";
                this.center.x -= this.attackOffsetX;
                this.size = { x: 28, y: 16 };
            } else if (this.id.indexOf("right") > -1) {
                this.id = "sword-right";
                this.center.x += this.attackOffsetX;
                this.size = { x: 28, y: 16 };
            }
            this.swordTimer = this.swordCooldown;
            this.swordWait = this.swordWaitCooldown;
            this.swordRelease = false;

            if (!this.game.hasBodyByType(SwordPower) && this.hearts === this.maxHearts) {
                this.game.addBody(new SwordPower(this.game, this.center, this.id));
            }

            Sound.sword.play();

            return;
        } else {
            if (this.id === "sword-up") {
                this.id = "link-up-1";
                this.center.y += this.attackOffsetY;
            } else if (this.id == "sword-down") {
                this.id = "link-down-1";
                this.center.y -= this.attackOffsetY;
            } else if (this.id === "sword-left") {
                this.id = "link-left-1";
                this.center.x += this.attackOffsetX;
            } else if (this.id === "sword-right") {
                this.id = "link-right-1";
                this.center.x -= this.attackOffsetX;
            }

            //reset size because link's hitbox grows when attacking
            this.size = { x: 16, y: 16 };
            this.swordRelease = true;
        }

        if (this.keyboarder.isDown(this.keyboarder.KEYS.C) || TOUCH.B) {
            if (this.equippedItem instanceof Boomerang) {
                if (!this.game.hasBodyByType(Boomerang)) {
                    this.game.addBody(new Boomerang(this.game, this));
                }
            } else if (this.equippedItem instanceof BlueCandle) {
                if (!this.game.hasBodyByType(CandleFire)) {
                    this.game.addBody(new CandleFire(this.game, this));
                }
            } else if (this.equippedItem instanceof EquippedArrow) {
                if (!this.game.hasBodyByType(Arrow)) {
                    if (this.rupees) {
                        this.game.addBody(new Arrow(this.game, this));
                        this.rupees--;
                    }
                }
            } else if (this.equippedItem instanceof EquippedBomb) {
                if (!this.game.hasBodyByType(Bomb)) {
                    if (this.bombs) {
                        this.game.addBody(new Bomb(this.game, this));
                        this.bombs--;
                    }
                }
            }
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


                if (!this.gameGenieNoCollision && (this.game.movementMap[newTileY][leftBoundaryTile] === 0 || this.game.movementMap[newTileY][rightBoundaryTile] === 0)) {
                    return;
                }

                //Is Link trying to enter a secret cave that hasn't been blown up yet?
                var caveEntrance = this.game.getFirstBodyByType(CaveEntrance);
                if (caveEntrance && caveEntrance.isHidden() && doBodiesCollide(this, caveEntrance)) {
                    return;
                }

                //invisible cave 'ceiling', needs to chop off the y-axis forgiveness
                if (this.game.isInCave && this.center.y - this.moveRate <= 88) {
                    return;
                }

                this.center.y -= this.moveRate;

                var newTileX = parseInt(Number(this.center.x).toFixed(0) / 16);
                if (this.game.movementMap[newTileY][newTileX] === 2) {
                    this.game.enterCave();
                } else if (this.game.movementMap[newTileY][newTileX] === 4) {
                    this.game.enterDungeon();
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

                if (!this.gameGenieNoCollision && (this.game.movementMap[newTileY] && (this.game.movementMap[newTileY][leftBoundaryTile] === 0 || this.game.movementMap[newTileY][rightBoundaryTile] === 0))) {
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

                if (!this.gameGenieNoCollision && (this.game.movementMap[this.tile.y][newTileX] === 0 || this.game.movementMap[bottomTileY][newTileX] === 0)) {
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

                if (!this.gameGenieNoCollision && (this.game.movementMap[this.tile.y][newTileX] === 0 || this.game.movementMap[bottomTileY][newTileX] === 0)) {
                    return;
                }

                this.center.x += this.moveRate;
            } else {
                this.game.moveScreenRight();
            }
        }

        if (this.keyboarder.isDown(this.keyboarder.KEYS.ENTER) || TOUCH.START) {
            if (!this.game.unpauseTransitionTime) {
                this.game.pause();
            }
        }

        this.tile.x = parseInt(Number(this.center.x).toFixed(0) / 16);
        this.tile.y = parseInt(Number(this.center.y).toFixed(0) / 16);
    }
};

var createBombExplosion = function (game, center) {
    //The BombExplosion actually does the damage, not the Cloud, I want to be able to easily
    //reuse the Cloud for enemy spawning without them causing damage to anything.
    game.addBody(new BombExplosion(game, center));
    game.addBody(new Cloud(game, center));
    game.addBody(new Cloud(game, { x: center.x - 12, y: center.y }));
    game.addBody(new Cloud(game, { x: center.x + 12, y: center.y }));
    game.addBody(new Cloud(game, { x: center.x - 6, y: center.y + 12 }));
    game.addBody(new Cloud(game, { x: center.x + 6, y: center.y + 12}));
    game.addBody(new Cloud(game, { x: center.x - 6, y: center.y - 12 }));
    game.addBody(new Cloud(game, { x: center.x + 6, y: center.y - 12}));
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
    this.KEYS = { UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39, SPACE: 32, ENTER: 13, C: 67 };
};

var TOUCH = { UP: false, DOWN: false, LEFT: false, RIGHT: false, B: false, A: false, START: false };

// **colliding()** returns true if two passed bodies are colliding.
// The approach is to test for five situations.  If any are true,
// the bodies are definitely not colliding.  If none of them
// are true, the bodies are colliding.
// 1. b1 is the same body as b2.
// 2. Right of `b1` is to the left of the left of `b2`.
// 3. Bottom of `b1` is above the top of `b2`.
// 4. Left of `b1` is to the right of the right of `b2`.
// 5. Top of `b1` is below the bottom of `b2`.
var doBodiesCollide = function (b1, b2) {
    var isColliding = !(
        b1 === b2 ||
            b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
            b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
            b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
            b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2
        );

    return isColliding;
};

var getRandomDirection = function () {
    var random = Math.floor(Math.random() * (4)) + 1;

    switch (random) {
        case 1:
            return "up";
            break;
        case 2:
            return "down";
            break;
        case 3:
            return "left";
            break;
        case 4:
            return "right";
            break;
        default:
            return "up";
    }
};

// Start game
// ----------

// When the DOM is ready, create (and start) the game.
window.addEventListener('load', function () {
    new Game();

    var widthScale = Number(window.innerWidth / 256).toFixed(2);
    var heightScale = Number(window.innerHeight / 346).toFixed(2);

    if (widthScale <= heightScale) {
        $("meta[name=viewport]").attr("content", "initial-scale=" + widthScale + ", user-scalable=no");
//            $('body').css('zoom', widthScale * 100 + "%");
    } else {
        $("meta[name=viewport]").attr("content", "initial-scale=" + heightScale + ", user-scalable=no");
//            $('body').css('zoom', heightScale * 100 + "%");
    }

    $("#controller").on("touchstart", function (e) {
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
        } else if (x >= 109 && x <= 152 && y >= 314 && y <= 344) {
            TOUCH.START = true;
        }
    });

    $("#controller").on("touchend", function () {
        TOUCH = { UP: false, DOWN: false, LEFT: false, RIGHT: false, B: false, A: false, START: false };
    });
});