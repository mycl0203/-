const mysql = require("mysql");

const db = mysql.createPool({
  post: "127.0.0.1",
  user: "root",
  password: "030111",
  database: "my_db_01",
});
/* // 测试mysql模块是否能正常工作
db.query("select 1", (err, results) => {
  // 模块工作期间报错了
  if (err) return console.log(err.message);
  // 成功了
  console.log(results);
});
 */
module.exports = db;
