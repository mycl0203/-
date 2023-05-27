// 导入定义验证规则的包
// const joi = require("@hapi/joi");
const joi = require("joi");
// 定义用户名和密码的验证规则
/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */
const username = joi.string().alphanum().min(1).max(10).required();
const password = joi
  .string()
  .pattern(/^[\S]{6,12}$/)
  .required(); //[\S]表示非空

// 定义id，nickname，email的验证规则
const id = joi.number().integer().min(1).required(); //integer:整数
const nickname = joi.string().required();
const user_email = joi.string().email().required();

// 定义验证头像的规则
const avatar = joi.string().dataUri().required();

//   定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
  body: /* 这里的body参数的写法是固定的 */ {
    username,
    password /* 这里的username和password是上面的参数 */,
  },
};

// 验证规则对象-更新用户基本信息
exports.update_userinfo_schema = {
  // 需要对req.body里面的数据进行验证
  body: {
    id, //这里的没有写冒号，说明没有指定验证规则
    nickname,
    email: user_email, //这里是指定验证规则，所以这里的冒号不能省略，如果不指定验证规则那么body里面的冒号可以省略
  },
};

// 验证规则对象-更新密码
exports.update_password_schema = {
  body: {
    oldPwd: password,
    newPwd: joi.not(joi.ref("oldPwd")).concat(password),
  },
};

// 验证规则对象-更新头像的规则
exports.update_avatar_schema = {
  body: {
    avatar,
  },
};
