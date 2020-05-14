var mysql = require('mysql');
var Password = require("node-php-password");
var envConfig = require("../config/config");
var firebaseadmin = require("firebase-admin");


var db_connect = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});
db_connect.connect();




var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
var username_regex = new RegExp("^[a-z0-9_]+$");


module.exports = {


    userVerification: function userVerification(data, responsecallback) {
        var message = "";
        var error = "";
        var general_response = [];

        db_connect.query("SELECT Email FROM user_account where Username= " + db_connect.escape(data.username), function(err, result) {
            error = result.length > 0 ? true : false;
            message = result.length > 0 ? "Username already taken!, Please Try Again" : "Valid";
            user_response = {
                user_message: message,
                user_error: error,
                user_nums_row: result.length
            };
            //console.log(result.length);
            general_response.push(user_response);
        });


        db_connect.query("SELECT Email FROM user_account where Email= " + db_connect.escape(data.email), function(err, result) {
            error = result.length > 0 ? true : false;
            message = result.length > 0 ? "Email already registered with another account!, Please Try Again" : "Valid";
            email_response = {
                email_message: message,
                email_error: error,
                email_nums_row: result.length
            };

            general_response.push(email_response);

            // console.log(general_response);
            return responsecallback(general_response);
        });



    },




    //User Availability Validation Function
    userAvailability: function userAvailability(data, responsecallback) {
        var first_input = data.username.charAt(0);
        var message = "";
        var error = "";


        if (data.username.length < 4) {
            message = "Enter 4 - 15 characters please";
            error = true;
            response = { message: message, error: error };

            //console.log(response);
            return responsecallback(response);

        } else if (!username_regex.test(data.username)) {

            message = "Invalid input";
            error = true;
            response = { message: message, error: error };
            //console.log(response);
            return responsecallback(response);

        } else if (!isNaN(first_input)) {

            message = "First character must be a letter";
            error = true;
            response = { message: message, error: error };
            //console.log(response);
            return responsecallback(response);

        } else {

            db_connect.query(
                "SELECT * FROM user_account WHERE Username=" + db_connect.escape(data.username),
                function(err, result) {
                    //if (err) throw err;
                    message = "Valid";
                    //error = false;
                    error = result.length > 0 ? true : false;
                    message = result.length > 0 ? "User Exist" : "Valid";

                    response = {
                        message: message,
                        error: error,
                        nums_row: result.length
                    };
                    //console.log(result.length);
                    return responsecallback(response);
                }
            );

        }

        //return responsecallback(response);


    },

    //Email validator
    validateEmail: function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },


    random_string: function random_string(length) {
        var result = '';
        var characters = '012345678901234567890123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

    order_id_generator: function order_id_generator(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

    url_string: function url_string(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },




    website_data: function website_data(web_response) {
        var general_website_data = [];


        db_connect.query(
            "SELECT * FROM `system_settings` WHERE ID='1'",
            function(err, system_result) {
                //console.log(result.length);
                general_website_data.push(system_result);
            }
        );


        db_connect.query(
            "SELECT * FROM `web_settings` WHERE ID='1'",
            function(err, web_result) {
                //console.log(result.length);
                general_website_data.push(web_result);

                return web_response(general_website_data);
            });
        // console.log(general_response);

    }




}