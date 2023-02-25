const Service = require('egg').Service;

class UserService extends Service {
  // 用户名数据库查重
  async getUserByName(username) {
    try {
      const result = await this.app.mysql.get('user', { username });
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  // 用户id查询用户信息
  async getUserById(id) {
    try {
      const result = await this.app.mysql.get('user', { id });
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  // 注册
  async register(data) {
    try {
      const result = await this.app.mysql.insert('user', data);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  // 修改签名
  async editUserInfo(data) {
    try {
      const result = await this.app.mysql.update(
        'user',
        { ...data },
        { id: data.id }
      );
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = UserService;
