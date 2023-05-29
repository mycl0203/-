// 导入数据库操作模块
const db = require("../db/index");

// 导入处理密码的模块
const bcrypt = require("bcryptjs");

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  const sql =
    "select id,username,nickname,email,user_pic from ev_users where id=?";
  db.query(sql, req.user.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length !== 1) {
      return res.cc("获取用户信息失败！");
    }
    res.send({
      status: 0,
      message:
        "获取用户信息成功！(/router_handler/userinfo用户基本信息的处理函数)",
      data: results[0],
    });
  });
};

// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
  const sql = "update ev_users set ? where id=?";
  db.query(sql, [req.body, req.body.id], (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.affectedRows !== 1) {
      return res.cc(
        "更新用户基本信息失败！(更新用户基本信息的处理函数,影响行数不为1)"
      );
    }
    res.cc("更新用户信息成功！", 0);
  });
};

// 更新用户密码的路由
exports.updatePassword = (req, res) => {
  const sql = "select * from ev_users where id=?";

  db.query(sql, req.user.id, (err, results) => {
    // req.user.id为什么不是req.body.id或者req.body.user.id呢？因为身份认证成功req上会挂载一个user属性
    /* 
    因为配置了express-JWT这个中间件，可以将解析出来的用户信息挂载到req.user属性上
    */
    if (err) {
      return res.cc(err);
    }
    if (results.length !== 1) {
      return res.cc("用户不存在(数据库未查询到【更新密码的路由处理函数报错】)");
    }
    // 判断旧密码是否正确
    const compareResult = bcrypt.compareSync(
      req.body.oldPwd,
      results[0].password
    );
    if (!compareResult) {
      return res.cc(
        "旧密码错误！（判断旧密码是否正确【更新用户密码路由router_handler/userinfo】）"
      );
    }
    // 更新密码
    const sql = "update ev_users set password=? where id=?";
    // 对新密码进行处理
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
    db.query(sql, [newPwd, req.user.id], (err, results) => {
      if (err) {
        return res.cc(err);
      }
      if (results.affectedRows !== 1) {
        return res.cc("更新密码失败（影响行数不为1router_handler/userinfo】）");
      }
      res.cc("更新密码成功！", 0);
    });
  });
};

// 更新用户头像
exports.updateAvatar = (req, res) => {
  // 接口验证头像：data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
  const sql = "update ev_users set user_pic=? where id=?";
  db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.affectedRows !== 1) {
      return res.cc(
        "更换头像失败！（影响行数不为一router_handler/userinfo】更新用户头像）"
      );
    }
    res.cc("更换头像成功！", 0);
  });
};
