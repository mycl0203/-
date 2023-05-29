// 导入验证规则的包
const joi = require("joi");
// 定义用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required();
const password = joi
  .string()
  .pattern(/^[\S]{6,12}$/)
  .required(); //[\S]表示非空

//   定义验证注册和登录表单数据的规则对象,并向外暴露
exports.reg_login_schema = {
  // 这里的写法是因为从req.body里面获取到username和password两个参数
  body: {
    username,
    password,
  },
};

// 定义id，nickname，email的验证规则
const id = joi.number().integer().min(1).required();
const nickname = joi.string().required();
const user_email = joi.string().email().required();

exports.update_userinfo_schema = {
  //对req.body里面的数据进行验证
  body: {
    id,
    nickname,
    email: user_email, //表单数据的名字和验证规则的名字一样的时候可以简写
  },
};

// 验证密码
exports.update_password_schema = {
  body: {
    oldPwd: password,
    newPwd: joi.not(joi.ref("oldPwd")).concat(password), //joi.ref('oldPwd')表示newPwd与oldPwd保持一致;concat(password):添加参数内的验证规则
  },
};

// 定义头像的验证规则
const avatar = joi.string().dataUri().required();
exports.update_avatar_schema = {
  body: {
    avatar,
  },
};
