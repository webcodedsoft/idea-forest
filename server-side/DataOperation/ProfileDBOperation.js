var mysql = require('mysql');
var Password = require("node-php-password");
var envConfig = require("../config/config");


var db_connect = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});
db_connect.connect();


var _time = new Date().toTimeString().slice(0, 8);
var _date = new Date().toISOString().slice(0, 10);
var current_time = _date + " " + _time;

var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
var username_regex = new RegExp("^[a-z0-9_]+$");


module.exports = {


    EditProfileOperation: function EditProfileOperation(data, responsecallback) {
        var __profile_response = [];


        profile_data = [data.Phone_Number, data.Image, data.Profile_Description, data.Profile_Title, data.Profile_Certificate, data.Facebook, data.Twitter, data.Instagram, data.User_ID];
        db_connect.query('UPDATE user_account SET Phone_Number = ?, Image = ?, Profile_Description = ?, Profile_Title = ?, Profile_Certificate = ?, Facebook = ?, Twitter = ?, Instagram = ? WHERE User_ID = ?', profile_data, function(error, result, fields) {
            if (error) {
                throw error;
            } else {
                error = result.affectedRows > 0 ? false : true;
                message = result.affectedRows > 0 ? "Profile Successfully Update" : "Invalid Data entred, Please Try Again";
                profile__response = {
                    profile_message: message,
                    profile_error: error,
                    profile_nums_row: result.affectedRows
                };

                __profile_response.push(profile__response);
                return responsecallback(__profile_response);
            }



        });

    },



    ChangePasswordOperation: function ChangePasswordOperation(data, responsecallback) {
        var __response = [];


        db_connect.query('UPDATE user_account SET Password = ? WHERE User_ID = ?', [data.New_Password, data.User_ID], function(error, result, fields) {
            if (error) {
                throw error;
            } else {
                error = result.affectedRows > 0 ? false : true;
                message = result.affectedRows > 0 ? "Password Successfully Changed" : "Invalid Data entred, Please Try Again";
                ___response = {
                    _message: message,
                    _error: error,
                    _nums_row: result.affectedRows
                };

                __response.push(___response);
                return responsecallback(__response);
            }



        });

    },




}