var express = require('express'),
  app = express(),
  http = require('http').Server(app),
  path = require('path'),
  fs = require('fs'),
  bodyParser = require('body-parser');

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.use(express.static(__dirname + '/store'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var server = app.listen(process.env.PORT || 3000, function() {
  console.log("Great! Widgets are ready.");
});
