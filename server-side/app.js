var express = require('express');

var path = require('path');
var envConfig = require("./config/config");

var AuthController = require('./controllers/AuthController');
var ProfileController = require('./controllers/ProfileController');

var app = express();


AuthController(app);
ProfileController(app);
//Listen port
app.listen(process.env.PORT);