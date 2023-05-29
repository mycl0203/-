// 导入定义验证规则的模块(这个包不是加密的包，也不是解密的包)
const joi = require("joi");

// 定义name和alia的验证规则
const name = joi.string().required();
const alias = joi.string().alphanum().required();
const id = joi.number().integer().min(1).required();

exports.add_cate_schema = {
  body: {
    name,
    alias,
  },
};

// 删除分类的验证规则对象
exports.delete_cate_schema = {
  params: {
    id,
  },
};

// 验证规则对象-根据id获取文章分类
exports.get_cate_schema = {
  params: {
    id,
  },
};

// 验证规则对象-更新分类
exports.update_cate_schema = {
  body: {
    Id: id,
    name,
    alias,
  },
};
