const mysql = require("mysql");

const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "030111",
  database: "my_db_01",
});
// 测试mysql模块能否正常工作
/* db.query("SELECT 1", (err, res) => {
  if (err) {
    console.log(err.message);
  }
  console.log(res);
});
 */
module.exports = db;
