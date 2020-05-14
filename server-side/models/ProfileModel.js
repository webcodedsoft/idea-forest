var mysql = require('mysql');
var Password = require("node-php-password");
var envConfig = require("../config/config");
var dataValidation = require("./dataValidation");
var ProfileDBOperations = require("../DataOperation/ProfileDBOperation");

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



//Edit Profile Post
module.exports.EditProfile = function EditProfile(app, data, responsecallback) {
    var __profile_response = [];

    profile_data = {
        Phone_Number: data.Phone_Number,
        Image: data.Image,
        Profile_Description: data.Profile_Description,
        Profile_Title: data.Profile_Title,
        Profile_Certificate: data.Profile_Certificate,
        Facebook: data.Facebook,
        Twitter: data.Twitter,
        Instagram: data.Instagram,
        User_ID: data.User_ID,
    };

    ProfileDBOperations.EditProfileOperation(profile_data, function(__profile_response) {
        return responsecallback(__profile_response);
    });

};


module.exports.ChangePassword = function ChangePassword(app, data, responsecallback) {
    var __change_password_response = [];

    db_connect.query("SELECT * FROM user_account WHERE User_ID=" + db_connect.escape(data.User_ID), function(err, result) {

        if (result.length > 0) {

            if (Password.verify(data.Old_Password, result[0].Password)) {

                if (data.New_Password == data.Confirm_Password) {
                    var new_hash_password = Password.hash(data.New_Password, "PASSWORD_DEFAULT");

                    change_password_data = {
                        User_ID: data.User_ID,
                        New_Password: new_hash_password,
                    };

                    ProfileDBOperations.ChangePasswordOperation(change_password_data, function(__change_password_response) {
                        return responsecallback(__change_password_response);
                    });

                } else {

                    login__response = {
                        login_message: "Confirm Password not Match New Password!, Please Try Again",
                        login_error: true,
                        login_nums_row: result.length
                    };

                    __change_password_response.push(login__response);
                    return responsecallback(__change_password_response);
                }

            } else {
                login__response = {
                    login_message: "Old Password entered was wrong!, Please Try Again",
                    login_error: true,
                    login_nums_row: result.length
                };

                __change_password_response.push(login__response);
                return responsecallback(__change_password_response);
            }

        }

    });





};