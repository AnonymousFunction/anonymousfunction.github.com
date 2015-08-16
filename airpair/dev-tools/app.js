console.log("Hello World!");

/**
 * Handles the button click event and resets the input values.
 */
function buttonClick(){
    var consoleText = document.getElementById("game-console").value;
    var titleText = document.getElementById("game-title").value;

    addNewGame(consoleText, titleText);

    // Reset the inputs
    document.getElementById("game-console").value = "";
    document.getElementById("game-title").value = "";
}

/**
 * Creates the HTML for the game and adds it to the table.
 *
 * @param consoleText - name of the console, ex: 'NES'
 * @param titleText - name of the game, ex: 'Super Mario 2'
 */
function addNewGame(consoleText, titleText) {
    var gameTable = document.getElementById("game-table");

    var el =  document.createElement("tr");
    el.innerHTML = "<td>" + consoleText + "</td><td>" + titleText + "</td>";
    gameTable.appendChild(el);
}

