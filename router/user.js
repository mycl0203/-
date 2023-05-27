const express = require("express");
// 创建路由对象
const router = express.Router();
// 导入用户路由处理函数对应的模块
const user_handler = require("../router_handler/user");

// 1.导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
// 2.导入需要的验证规则对象(解构赋值)
const { reg_login_schema } = require("../schema/user");

// 注册新用户
router.post(
  "/reguser" /* (req, res) => {
  res.send("reguster ok");
} */,
  expressJoi(reg_login_schema),
  user_handler.regUser //注意这里的处理函数regUser是抽离之后向外导出的名称保持一致
); //将处理函数抽离到router_handler文件夹里面,但是要使用怎么办？在这个文件顶部导入以下就好了

// 用户登录
router.post(
  "/login" /* (req, res) => {
  res.send("login ok");
} */,
  expressJoi(reg_login_schema),
  user_handler.login
); //将处理函数抽离到router_handler文件夹里面

// 将路由对象共享出去
module.exports = router;
