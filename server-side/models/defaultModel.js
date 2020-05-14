var mysql = require('mysql');
var Password = require("node-php-password");
var envConfig = require("../config/config");
var firebaseadmin = require("firebase-admin");
var dataValidation = require("./dataValidation");
var databaseOperation = require("./dataBaseOperations");

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

//Home Page
module.exports.homePage = function homePage(app, callback) {
    db_connect.query(
        "SELECT * FROM `walker_gig` ORDER BY Page_View_Count DESC, Total_Rating DESC LIMIT 8",
        function(err, result) {
            if (err) throw err;
            //console.log(result);
            return callback(result);
        }
    );

};


// if (Password.verify("password123", hash)) {
//   //Authentication OK
// } else {
//   //Authentication FAILED
// }

//Register Post
module.exports.Register = function Register(app, data, responsecallback) {

    if (!dataValidation.validateEmail(data.emailaddress_register)) {
        message = "Email is not valid!!!, Please Try Again";
        error = true;
        response = { message: message, error: error };
        return responsecallback(response);
    }

    username_email_data = { username: data.username, email: data.emailaddress_register };


    dataValidation.userVerification(username_email_data, function(res) {


        if (res[0].user_error === true) {
            return responsecallback(res[0].user_message);
        } else if (res[0].email_error === true) {
            return responsecallback(res[0].email_message);
        } else {

            if (data.password_register === data.password_repeat_register) {
                var hash_password = Password.hash(data.password_register, "PASSWORD_DEFAULT");
                var user_id = dataValidation.random_string(8);
                var transaction_id = dataValidation.order_id_generator(8);
                var web_id = dataValidation.order_id_generator(5);


                dataValidation.website_data(function(web_response) {

                    transaction_id = web_response[1][0].Web_Name + "_" + transaction_id;
                    var base_url = web_response[1][0].Base_Url;
                    var referral_url = base_url + 'ref/_/' + dataValidation.url_string(10);

                    var instant_earning_amt = web_response[0][0].Instant_Earning;
                    var referral_earning_input = web_response[0][0].Referral_Earning;

                    register_data = {
                        User_id: user_id,
                        Username: data.username,
                        Email: data.emailaddress_register,
                        Password: hash_password,
                        Account_Type: data.account_type,
                        Level: 'No Level',
                        Register_Date: _date,
                        Status: 'Active',
                        Status_Progress_Count: '20',
                        Last_Activity: current_time,
                        Online_Visibility: 'Online',
                        Referral_Url: referral_url,
                        Instant_Earning: instant_earning_amt,
                        Web_Id: web_id,
                        Transaction_Id: transaction_id,
                        Fund_Method: 'Instant Earning',
                        Mode: 'Earning',
                        Referral_Url_Input: data.referral_url_input == undefined ? '' : data.referral_url_input,
                        Referral_Earning_Input: referral_earning_input,
                        Web_Token: '',
                    };

                    databaseOperation.RegistrationOperation(register_data, function(registration_response) {
                        //console.log(registration_response);
                        return responsecallback(registration_response);
                    });

                });



            } else {
                return responsecallback("Password Mis-Match");
            }

        }
        //console.log(res[0].user_error);
    });
};


//All Validation
module.exports.Validations = function Validations(app, data, callback) {
    if (data.user_availability) {

        dataValidation.userAvailability(data, function(err, res) {
            return callback(err);
        });
    }


};















//FCM Function