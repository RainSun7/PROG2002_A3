/* const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'crowdfunding_db'
  });

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
  }); */

var dbDetails = require("./db-details");

var mysql = require('mysql2');
var bodyParser = require('body-parser');
var http = require('http');

module.exports = {
	getconnection: ()=>{
	return mysql.createConnection({
		host:dbDetails.host,
		user:dbDetails.user,
		password:dbDetails.password,
		database:dbDetails.database	
	});
}
}