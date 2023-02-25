const Controller = require('egg').Controller;

const defaultAvatar =
  'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png';

class UserController extends Controller {
  // 注册
  async register() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;

    if (!username || !password) {
      ctx.body = {
        code: '500',
        msg: '账号密码不能为空',
        data: null,
      };
      return;
    }

    const userInfo = await ctx.service.user.getUserByName(username);

    if (userInfo && userInfo.id) {
      ctx.body = {
        code: '500',
        msg: '账户名已被注册，请重新输入',
        data: null,
      };
      return;
    }

    const result = await ctx.service.user.register({
      username,
      password,
      signature: '',
      avatar: defaultAvatar,
    });

    if (result) {
      ctx.body = {
        code: '200',
        msg: '注册成功',
        data: null,
      };
    } else {
      ctx.body = {
        code: '500',
        msg: '注册失败',
        data: null,
      };
    }
  }

  // 登录
  async login() {
    const { username, password } = this.ctx.request.body;

    const userInfo = await this.ctx.service.user.getUserByName(username);

    if (!userInfo || !userInfo.id) {
      this.ctx.body = {
        code: '500',
        msg: '账户未注册，请先注册',
        data: null,
      };
      return;
    }

    if (userInfo.password !== password) {
      this.ctx.body = {
        code: '500',
        msg: '账号密码错误',
        data: null,
      };
      return;
    }

    const token = this.app.jwt.sign(
      {
        id: userInfo.id,
        username,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      },
      this.app.jwt.secret
    );

    this.ctx.body = {
      code: '200',
      msg: '登录成功',
      data: {
        token,
        userId: userInfo.id,
      },
    };
  }

  // 获取用户信息
  async getUserInfo() {
    const id = this.ctx.request.body.id;
    const userInfo = await this.ctx.service.user.getUserById(id);
    this.ctx.body = {
      code: 200,
      msg: '成功',
      data: { userInfo },
    };
  }

  // 修改用户信息
  async editUserInfo() {
    const { signature = '', id, avatar = '' } = this.ctx.request.body;
    try {
      const result = await this.ctx.service.user.editUserInfo({
        signature,
        avatar,
        id,
      });

      let newInfo;
      if (result) {
        newInfo = await this.ctx.service.user.getUserById(id);
      }

      this.ctx.body = {
        code: '200',
        msg: '修改成功',
        data: newInfo,
      };
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = UserController;
