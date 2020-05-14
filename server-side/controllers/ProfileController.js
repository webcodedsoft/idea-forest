var ProfileModel = require('../models/ProfileModel');
var bodyParser = require('body-parser');
var session = require('express-session');

var urlencodedParser = bodyParser.urlencoded({ extended: false }); //use bodyparser


module.exports = function(app) {

    app.post("/edit-profile", urlencodedParser, (req, res) => {

        ProfileModel.EditProfile(app, req.body, function(result) {
            if (!result.error) {

                res.json({ editpasswordMessage: result }, 200, 'Content-Type', 'application/json');
            } else {
                res.json({ editpasswordMessage: result }, 300, 'Content-Type', 'application/json');
            }
        });
    });


    app.post("/change-password", urlencodedParser, (req, res) => {

        ProfileModel.ChangePassword(app, req.body, function(result) {
            if (!result.error) {

                res.json({ changepasswordMessage: result }, 200, 'Content-Type', 'application/json');
            } else {
                res.json({ changepasswordMessage: result }, 300, 'Content-Type', 'application/json');
            }
        });
    });




}