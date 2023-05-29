const express = require("express");

const app = express();
// 这是验证规则的包(为了定义错误级别的中间件)
const joi = require("joi");

// 配置cors跨域
let cors = require("cors");
// 将cors注册为全局可用的中间件
app.use(cors());

// 配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false })); //只能配置解析 `application/x-www-form-urlencoded` 格式的表单数据的中间件

// 托管静态资源文件
app.use("/uploads", express.static("./uploads"));

// 一定要在路由之前封装res.cc()函数
app.use((req, res, next) => {
  // status的默认值为1，表示失败的情况
  //   err的值可能是一个错误的对象也可能是一个错误描述的字符串
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

// 一定是在路由之前配置解析token的中间件，因为需要在登录路由前面将token解析出来
const expressJWT = require("express-jwt");
const config = require("./config");
app.use(
  expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] })
);

// 导入并使用路由模块(这里表示每次访问路由里面的路径的时候需要在前面加上一个api前缀)
const userRouter = require("./router/user");
app.use("/api", userRouter);

// 导入并使用用户信息路由模块
const userinfoRouter = require("./router/userinfo");
app.use("/my", userinfoRouter);

//导入并使用文章分类的路由模块
const artCateRouter = require("./router/artcate");
app.use("/my/article", artCateRouter);

// 导入并使用文章的路由模块
const articleRouter = require("./router/article");
app.use("/my/article", articleRouter);

// 定义错误级别的中间件
app.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof joi.ValidationError) {
    return res.cc(err);
  }
  // 身份认证失败后的错误
  if (err.name === "UnauthorizedError") {
    return res.cc("身份认证失败！(这里app.js错误级别中间件报出错误)");
  }
  //   未知的错误
  res.cc(err);
});

// 启动服务器
app.listen(3007, () => {
  console.log("api server running at http://127.0.0.1:3007");
});
