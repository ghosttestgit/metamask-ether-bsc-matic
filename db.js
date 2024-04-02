// const mysql = require("mysql");
const mysql = require("mysql2");

// const dbConfig = require("./db.config.js");

// var connection = mysql.createPool({
//   host: dbConfig.HOST,
//   user: dbConfig.USER,
//   password: dbConfig.PASSWORD,
//   database: dbConfig.DB,
// });

const dbUrl = process.env.DB_URI ?? "mysql://localhost:3306/node_db";
const connection = mysql.createConnection(dbUrl);

module.exports = connection;