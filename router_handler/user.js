// 导入数据库操作模块
const db = require("../db/index");
// 导入bcryptjs
const bcrypt = require("bcryptjs");
// 导入生成Token包
const jwt = require("jsonwebtoken");
// 导入全局的配置文件
const config = require("../config");

// 将注册新用户的处理函数抽离到这个文件，并向外导出
exports.regUser = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const userinfo = req.body;
  //   console.log(userinfo);[Object: null prototype] { username: 'zs', password: '123456' }
  //   对表单中的数据进行合法性的校验

  /*  if (!userinfo.username || !userinfo.password) {
    //判断用户填入的数据是否为空
    return res.send({
      status: 1,
      message: "用户名或密码不合法！",
    });
  } */

  //   定义sql语句，查询用户名是否被占用
  const sqlStr = "select * from ev_users where username=?";
  db.query(sqlStr, userinfo.username, (err, results) => {
    if (err)
      /*    return res.send({
        status: 1,
        message: err.message,
      }); */
      return res.cc(err);
    // 判断用户名是否被占用
    if (results.length > 0) {
      /* res.send({
        status: 1,
        message: "用户名被占用，请更换其它用户名！",
      }); */
      return res.cc("用户名被占用，请更换其它用户名！");
    }
    // TODO:用户名可以使用,这个时候需要加密::bcrypt.hashSync(明文密码, 随机盐的长度)
    console.log(userinfo);
    userinfo.password = bcrypt.hashSync(userinfo.password, 10);
    console.log(userinfo);

    // 定义插入新用户的sql语句
    const sql = "insert into ev_users set ?";
    // 调用db.query()执行sql语句
    db.query(
      sql,
      { username: userinfo.username, password: userinfo.password },
      (err, results) => {
        // 判断SQL语句是否执行成功
        if (err)
          /*  return res.send({
            status: 1,
            message: err.message,
          }); */
          return res.cc(err);

        // 判断影响行数是否为1
        if (results.affectedRows !== 1) {
          /*           return res.send({
            status: 1,
            message: "注册用户失败，请稍后再试",
          });
 */
          return res.cc("注册用户失败，请稍后再试");
        }
        // 注册用户成功
        /*  res.send({ status: 0, message: "注册成功！" }); */
        res.cc("注册成功！", 0);
      }
    );
  });
  //   res.send("reguster ok");
};
exports.login = (req, res) => {
  // 接受表单的数据
  const userinfo = req.body;
  // 定义sql语句
  const sql = "select * from ev_users where username=?";
  // 执行sql语句，根据用户名查询用户的信息
  db.query(sql, userinfo.username, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    // 执行sql语句成功,但是获取到的数据条数不等于1
    if (results.length !== 1) {
      return res.cc("登录失败！");
    }
    // res.send("login ok");
    const compareResult = bcrypt.compareSync(
      userinfo.password,
      results[0]
        .password /* 调用 `bcrypt.compareSync(用户提交的密码, 数据库中的密码)` 方法比较密码是否一致,返回值是布尔值（true 一致、false 不一致） */
    );
    if (!compareResult) return res.cc("登录失败！");
    // TODO：在服务器端生成Token字符串
    const user = { ...results[0], password: "", user_pic: "" }; //这个是展开运算符;剔除用户的敏感信息
    // 对用户的信息进行加密，生成Token字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn,
    });
    // 调用res.send()及那个Token响应给客户端
    res.send({
      status: 0,
      message: "登录成功！",
      token: "Bearer " + tokenStr,
    });
  });
};
