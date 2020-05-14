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

    RegistrationOperation: function RegistrationOperation(data, responsecallback) {
        var registration_response = [];


        insert_data = {
            User_id: data.User_id,
            Username: data.Username,
            Email: data.Email,
            Password: data.Password,
            Account_Type: data.Account_Type,
            Level: data.Level,
            Register_Date: data.Register_Date,
            Status: data.Status,
            Status_Progress_Count: data.Status_Progress_Count,
            Last_Activity: data.Last_Activity,
            Online_Visibility: data.Online_Visibility,
            Referral_Earning: ' ',
            Referral_Url: data.Referral_Url,
            FCM_Web_Token: ' '
        };

        db_connect.query('INSERT INTO user_account SET ? ', insert_data, function(err, result) {


        });


        var sql_query_acc_bal = "INSERT INTO account_balance (User_id, Amount, Status) VALUES(";
        sql_query_acc_bal += " '" + data.User_id + "', ";
        sql_query_acc_bal += " '" + data.Instant_Earning + "', ";
        sql_query_acc_bal += " 'Active ' )";
        db_connect.query(sql_query_acc_bal, function(err, result) {
            // message = "User Successfully Created";
            // error = false;
            // reg_response = {
            //     message: message,
            //     error: error,
            //     nums_row: result.affectedRows,
            //     Username: data.Username,
            //     User_id: data.User_id
            // };
            //registration_response.push(reg_response);
        });


        var sql_query_tran_his = "INSERT INTO transaction_history (User_id, From_User_id, Transaction_id, Amount, Fund_Method, Mode, Status, Dates) VALUES(";
        sql_query_tran_his += " '" + data.User_id + "', ";
        sql_query_tran_his += " '" + data.Web_Id + "', ";
        sql_query_tran_his += " '" + data.Transaction_Id + "', ";
        sql_query_tran_his += " '" + data.Instant_Earning + "', ";
        sql_query_tran_his += " '" + data.Fund_Method + "', ";
        sql_query_tran_his += " '" + data.Mode + "', ";
        sql_query_tran_his += " ' ', ";
        sql_query_tran_his += " '" + data.Last_Activity + "' )";

        db_connect.query(sql_query_tran_his, function(err, result) {
            message = "User Successfully Created";
            error = false;
            reg_response = {
                message: message,
                error: error,
                nums_row: result.affectedRows,
                Username: data.Username,
                User_id: data.User_id
            };

            return responsecallback(reg_response);
        });


    },


}