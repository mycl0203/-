// 导入数据库操作模块
const db = require("../db/index");
// 导入加密包
const bcrypt = require("bcryptjs");
// 导入生成token的包(用这个包来生成 Token 字符串)
const jwt = require("jsonwebtoken");
// 导入全局的配置文件
const config = require("../config");

// 注册用户的处理函数
exports.regUser = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const userinfo = req.body;
  //   定义sql语句，查询用户名是否被占用
  const sqlStr = "select * from ev_users where username=?";
  db.query(sqlStr, userinfo.username, (err, results) => {
    // 基本错误判断
    if (err) {
      return res.cc(err);
    }
    // 判断用户名是否被占用
    if (results.length > 0) {
      return res.cc(
        "用户名被占用，请更换其它用户名!(router_handler/user.js查询用户名是否被占用)"
      );
    }
    // 用户名可以使用：
    // 调用bcrypt.hashSync()方法对密码进行加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10); //bcrypt.hashSync(明文密码, 随机盐的长度)
    // 定义插入新用户的sql语句
    const sql = "insert into ev_users set ?";
    db.query(
      sql,
      { username: userinfo.username, password: userinfo.password },
      (err, results) => {
        // 判断sql语句是否执行成功
        if (err) {
          return res.cc(err);
        }
        //   判断插入是否成功（判断影响行数是否为1）
        if (results.affectedRows !== 1) {
          return res.cc(
            "注册用户失败，请稍后再试！(router_handler/user.js判断插入是否成功)"
          );
        }
        res.cc(" 注册用户成功！");
      }
    );
  });
};

// 登录的处理函数
exports.login = (req, res) => {
  // 接受表单数据
  const userinfo = req.body;
  // 定义sql语句
  const sql = "select * from ev_users where username=?";
  // 执行SQL
  db.query(sql, userinfo.username, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length !== 1) {
      return res.cc("登录失败,查询到的用户名!==1");
    }
    // 判断密码是否正确
    const compareResult = bcrypt.compare(
      userinfo.password,
      results[0].password
    );
    if (!compareResult) {
      return res.cc("登陆失败,明文密码与加密密码匹配失败！");
    }
    // 在服务器端生成token的字符串
    const user = { ...results[0], password: "", user_pic: "" }; //ES6 的高级语法，快速剔除 `密码` 和 `头像` 的值
    //对用户信息加密生成token字符串(加密对象，加密密钥，token有效期)
    // const token = jwt.sign(user, config.jwtSecretKey, { expiresIn: "36000h" });
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn,
    });
    // 调用res.send()将token响应给客户端
    res.send({
      status: 0,
      message: "登陆成功！",
      token: "Bearer " + tokenStr,
    });
  });
};
