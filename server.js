var port = 8080;
var express = require('express');

var app = express();

app.configure(function () {
    app.use(express.static(__dirname));
    app.use(express.bodyParser());
});

app.listen(port);
console.log('Listening on port ' + port);