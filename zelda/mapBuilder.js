var createMapBuilder = function(){
	var mapBuilder = $("#map-builder");
	var mapBuilderHtml = "";
	for (var y=0; y<11; y++){
        mapBuilderHtml += "<div>";
		for (var x=0; x<16; x++) {
            mapBuilderHtml += "<input type='text' class='mb-input' value='1' onfocus='this.select()' data-mb-x='" + x + "' data-mb-y='" + y + "'/>";
		}
        mapBuilderHtml += "</div>";
    }
	mapBuilder.html(mapBuilderHtml);
};

createMapBuilder();

var buildMap = function(){
    var yArray = [];
    for (var y=0; y<11; y++){
        var xArray = [];
        for (var x=0; x<16; x++) {
            var cellValue = parseInt($("[data-mb-x='" + x + "'][data-mb-y='" + y + "']").val());
            xArray.push(cellValue);
        }
        yArray.push(xArray);
    }

    var str = "[\n";
    for (var y=0; y<11; y++){
        str += "[";
        for (var x=0; x<16; x++) {
            if (x == 15) {
                str += yArray[y][x];
            } else {
                str += yArray[y][x] + ",";
            }
        }
        if (y == 10) {
            str += "]\n];"
        } else {
            str += "],\n"
        }
    }

    var mapX = $("#mapXVal").text();
    var mapY = $("#mapYVal").text();
    console.log("var m" + mapX + mapY + " = ", str);
};

var drawCurrentMapBuilder = function(x, y){
    var mapBuilder = window["m" + x + y];

    if (mapBuilder[y] && mapBuilder[y][x]) {
        for (var y=0; y<11; y++){
            for (var x=0; x<16; x++) {
                $("[data-mb-x='" + x + "'][data-mb-y='" + y + "']").val(mapBuilder[y][x]);
            }
        }
    } else {
        for (var y=0; y<11; y++){
            for (var x=0; x<16; x++) {
                $("[data-mb-x='" + x + "'][data-mb-y='" + y + "']").val(1);
            }
        }
    }

};
