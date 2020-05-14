var defaultModel = require('../models/defaultModel');
var bodyParser = require('body-parser');
var session = require('express-session');

var urlencodedParser = bodyParser.urlencoded({ extended: false }); //use bodyparser


//console.log(defaultModel.homePage);
module.exports = function(app) {

    app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));

    //Homepage
    app.get('/', function homePage(req, res) {
        defaultModel.homePage(app, function(result) {
            //console.log(result);
            res.render("pages/index", { home_data: result });
        });

    });

    //General Validation
    app.post("/validations", urlencodedParser, function Validations(req, res) {
        defaultModel.Validations(app, req.body, function(result) {
            res.json({ availability_res: result });
            //console.log(result);
        });
    });


    // Register Page
    app.get("/register.web", (req, res) => {
        console.log(res);
        res.render("pages/sign-up", { ref_id: '' });
    });

    //Referral Url
    app.get('/ref/_/:referral_url', (req, res) => {
        res.render('pages/sign-up', { ref_id: req.params.referral_url });
    });



    //Submit Register Form
    app.post("/registeration", urlencodedParser, function Register(req, res) {
        defaultModel.Register(app, req.body, function(result) {
            //console.log(result.Username);
            if (!result.error) {
                req.session.loggedin = true;
                req.session.Username = result.Username;
                res.json({ registrationMessage: result });
                //res.redirect('/user-dashboard');
            } else {
                res.json({ registrationMessage: result });
            }

        });
    });

    //Dashboard When Login
    app.get('/user-dashboard', (req, res) => {
        // if (req.session.loggedin) {
        //     res.render('users/general-dashboard');
        //     //console.log(session);
        // } else {
        //     res.redirect('/register.web');
        // }
        res.render('users/general-dashboard');
    });



};