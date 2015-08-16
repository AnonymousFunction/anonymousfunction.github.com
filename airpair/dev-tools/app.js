console.log("Hello World!");

function addNewGame(){
    var gameTable = document.getElementById("game-table");
    var consoleText = document.getElementById("game-console").value;
    var titleText = document.getElementById("game-title").value;

    var el =  document.createElement("tr");
    el.innerHTML = "<td>" + consoleText + "</td><td>" + titleText + "</td>";
    gameTable.appendChild(el);

    document.getElementById("game-console").value = "";
    document.getElementById("game-title").value = "";

    console.log("Adding a game");
};