var mysql = require('mysql');
var Password = require("node-php-password");
var envConfig = require("../config/config");
var dataValidation = require("./dataValidation");
var AuthDBOperations = require("../DataOperation/AuthDBOperations");

var db_connect = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});
db_connect.connect();

var current_location_time = /GMT([\-\+]?\d{4})/; //Intl.DateTimeFormat().resolvedOptions().timeZone;

var _time = new Date().toTimeString().slice(0, 8);
var _date = new Date().toISOString().slice(0, 10);
var current_time = _date + " " + _time;



//Register Post
module.exports.Registration = function Register(app, data, responsecallback) {

    if (!dataValidation.validateEmail(data.Email)) {
        message = "Email is not valid!!!, Please Try Again";
        error = true;
        response = { message: message, error: error };
        return responsecallback(response);
    }

    username_email_data = { username: data.Username, email: data.Email };


    dataValidation.userVerification(username_email_data, function(res) {

        // console.log(res);

        if (res[0].user_error === true) {
            return responsecallback(res[0].user_message);
        } else if (res[0].email_error === true) {
            return responsecallback(res[0].email_message);
        } else {

            if (data.Password === data.Confirm_Password) {
                var hash_password = Password.hash(data.Password, "PASSWORD_DEFAULT");
                var user_id = dataValidation.AlphaNumeric(8);

                register_data = {
                    User_ID: user_id,
                    Username: data.Username,
                    Email: data.Email,
                    Password: hash_password,
                    Account_Type: data.Account_Type,
                    Created_Date: _date,
                    Status: 'Active',
                    Last_Activity: current_time,
                };

                AuthDBOperations.RegistrationOperation(register_data, function(registration_response) {
                    //console.log(registration_response);
                    return responsecallback(registration_response);
                });

            } else {
                return responsecallback("Password Mis-Match");
            }

        }
        //console.log(res[0].user_error);
    });
};


//Login Post
module.exports.Login = function Login(app, data, responsecallback) {
    var __login_response = [];

    db_connect.query("SELECT * FROM user_account where Username= " + db_connect.escape(data.Username), function(err, result) {

        if (result.length > 0) {

            if (Password.verify(data.Password, result[0].Password)) {
                login_data = {
                    Username: data.Username,
                };

                AuthDBOperations.LoginOperation(login_data, function(__login_response) {
                    return responsecallback(__login_response);
                });

            } else {
                login__response = {
                    login_message: "Password entered was wrong!, Please Try Again",
                    login_error: true,
                    login_nums_row: result.length
                };

                __login_response.push(login__response);

                return responsecallback(__login_response);
            }

        } else {
            login__response = {
                login_message: "Username entered was wrong!, Please Try Again",
                login_error: true,
                login_nums_row: result.length
            };

            __login_response.push(login__response);

            return responsecallback(__login_response);
        }

    });







};