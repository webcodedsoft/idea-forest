var AuthModel = require('../models/AuthModel');
var bodyParser = require('body-parser');
var session = require('express-session');

var urlencodedParser = bodyParser.urlencoded({ extended: false }); //use bodyparser


module.exports = function(app) {

    app.post("/registration", urlencodedParser, (req, res) => {

        AuthModel.Registration(app, req.body, function(result) {
            if (!result.error) {

                res.json({ registrationMessage: result }, 200, 'Content-Type', 'application/json');
            } else {
                res.json({ registrationMessage: result }, 300, 'Content-Type', 'application/json');
            }
        });
    });


    app.post("/login", urlencodedParser, (req, res) => {

        AuthModel.Login(app, req.body, function(result) {
            if (!result.error) {
                res.json({ loginMessage: result }, 200, 'Content-Type', 'application/json');
            } else {
                res.json({ loginMessage: result }, 300, 'Content-Type', 'application/json');
            }
        });
    });


}