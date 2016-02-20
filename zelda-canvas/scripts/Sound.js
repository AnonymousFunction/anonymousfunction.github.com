var Sound = (function () {
    var isSoundOn = false;
    var cave = new Audio("sounds/cave.wav");
    var fanfare = new Audio("sounds/fanfare.wav");
    var overworld = new Audio("sounds/overworld.mp3");
    var sword = new Audio("sounds/sword.wav");
    var text = new Audio("sounds/text.mp3");

    return {
        cave: {
            play: function () {
                if (isSoundOn) {
                    cave.play();
                }
            }
        },
        fanfare: {
            play: function () {
                if (isSoundOn) {
                    fanfare.play();
                }
            }
        },
        overworld: {
            play: function () {
                if (isSoundOn) {
                    overworld.play();
                }
            },
            stop: function(){
                overworld.pause();
                overworld.currentTime = 0;
            }
        },
        sword: {
            play: function () {
                if (isSoundOn) {
                    sword.play();
                }
            }
        },
        text: {
            play: function () {
                if (isSoundOn) {
                    text.play();
                }
            }
        }
    }
})();