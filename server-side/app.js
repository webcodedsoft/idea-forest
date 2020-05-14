var express = require('express');


var ejs = require('ejs');
var path = require('path');
var envConfig = require("./config/config");

var defaultController = require('./controllers/defaultController');

var app = express();


defaultController(app);
userController(app);


//Listen port
app.listen(process.env.PORT);