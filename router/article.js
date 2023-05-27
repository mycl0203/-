// 这是文章路由模块
const express = require("express");
const router = express.Router();

// 导入需要的处理函数模块
const article_handler = require("../router_handler/article");

// 导入multer和path
const multer = require("multer");
const path = require("path");

// 导入验证规则的中间件
const expressJoi = require("@escook/express-joi");
// 导入需要的验证规则对象
const { add_article_schema } = require("../schema/article");

// 创建multer的实例
const uploads = multer({ dest: path.join(__dirname, "../uploads") });

// 发布文章的路由
router.post(
  "/add",
  uploads.single("cover_img"),
  expressJoi(add_article_schema),
  article_handler.addArticle
);

module.exports = router;
