var createMapBuilder = function(){
	var mapBuilder = $("#map-builder");
	var mapBuilderHtml = "";
	for (var x=0; x<16; x++){
		for (var y=0; y<8; y++) {
			mapBuilderHtml += "<input type='text' class='mb-input' id='mb" + x + y + "'/>";
		}
	}
	mapBuilder.html(mapBuilderHtml);
}

createMapBuilder();
