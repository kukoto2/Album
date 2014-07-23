'use strict';
//mastre-branch1 test2
var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./lib/config/config');

var db = mongoose.connect(config.mongo.uri, config.mongo.options);

var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});

require('./lib/config/passport')();

var app = express();
var http = require('http'),
	server = http.createServer(app);

global.io = require('socket.io').listen(server);

require('./lib/config/express')(app);

require('./lib/routes')(app);

server.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

exports = module.exports = app;