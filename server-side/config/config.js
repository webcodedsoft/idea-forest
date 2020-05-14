var config = require('./config.json');

//Check environment
var env = process.env.NODE_ENV || 'development';
//fetch env. config

var envConfig = config[env];

//add env confi values to process env
Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key]);