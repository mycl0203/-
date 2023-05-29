const mysql = require("mysql");

const db = mysql.createPool({
  post: "127.0.0.1",
  user: "root",
  password: "030111",
  database: "my_db_01",
});

module.exports = db;
