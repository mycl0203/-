// 导入express
const express = require("express");
//创建服务器实例对象
const app = express();
// const joi = require("@hapi/joi");
// const joi = require("joi");

// 导入并配置cors中间件
const cors = require("cors");
app.use(cors());

// 配置解析表单数据的中间件，注意：这个中间件只能解析application/x-www-form-urlencoded格式的表单数据
app.use(express.urlencoded({ extended: false }));

// 托管静态资源文件
app.use("/uploads", express.static("/uploads"));

// 一定要在路由之前封装res.cc函数
app.use((req, res, next) => {
  // status默认值为1，表示失败的情况，err的值可能是一个错误的对象，也可能是一个错误描述的字符串

  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next(); //这个放在中间件最后面
});

// 这个配置解析token中间件也是一定要在路由之前配置
const expressJWT = require("express-jwt"); //"express-jwt": "^5.3.3",
const config = require("./config");
app.use(
  expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] })
);

// 下面是路由模块

// 导入并使用用户的路由模块(不导入的话postman里测试不了)
const userRouter = require("./router/user");
const { ValidationError } = require("@hapi/joi/lib/errors");
app.use("/api", userRouter);

// 导入并使用用户信息的路由模块
const userinfoRouter = require("./router/userinfo");
// 使用这个路由，并挂载/my访问前缀
app.use("/my", userinfoRouter);

// 导入并使用文章分类的路由模块
const artCateRouter = require("./router/artcate");
app.use("/my/article", artCateRouter);

// 导入并使用文章的路由模块
const articleRouter = require("./router/article");
app.use("/my/article", articleRouter);

// 定义错误级别的中间件
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.cc(err);
  }
  // 身份认证失败的错误
  if (err.name === "UnauthorizedError") {
    return res.cc("身份认证失败！");
  }
  res.cc(err); //未知的错误
});

// 启动服务器
app.listen(3007, () => {
  console.log("api server running at http://127.0.0.1:3007");
});
