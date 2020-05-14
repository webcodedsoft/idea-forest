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

    RegistrationOperation: function RegistrationOperation(data, responsecallback) {
        var registration_response = [];

        insert_data = {
            User_ID: data.User_ID,
            Username: data.Username,
            Email: data.Email,
            Password: data.Password,
            Account_Type: data.Account_Type,
            Created_Date: data.Created_Date,
            Status: data.Status,
            Last_Activity: data.Last_Activity,
        };

        db_connect.query('INSERT INTO user_account SET ? ', insert_data, function(err, result) {
            message = "User Successfully Created";
            error = false;
            console.log(err);
            reg_response = {
                message: message,
                error: error,
                nums_row: result.affectedRows,
                Username: data.Username,
                User_ID: data.User_ID
            };
            registration_response.push(reg_response);
            return responsecallback(registration_response);
        });

    },


    LoginOperation: function LoginOperation(data, responsecallback) {
        var __login_response = [];

        db_connect.query("SELECT * FROM user_account WHERE Username=" + db_connect.escape(data.Username), function(err, result) {

            error = result.length > 0 ? false : true;
            message = result.length > 0 ? "Login Successfully" : "Invalid Username entred, Please Try Again";
            login__response = {
                User_ID: result[0].User_ID,
                login_message: message,
                login_error: error,
                login_nums_row: result.length
            };

            if (result.length > 0) {
                db_connect.query('UPDATE user_account SET Last_Activity = ? WHERE Username = ?', [current_time, result[0].Username], function(error, results, fields) {
                    if (error) throw error;
                });


                __login_response.push(login__response);
                return responsecallback(__login_response);
            }

        });



    },

}