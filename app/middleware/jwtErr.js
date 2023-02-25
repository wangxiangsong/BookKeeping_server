module.exports = secret => {
  return async function jwtErr(ctx, next) {
    const token = ctx.request.header.token;
    let decode;
    if (token) {
      try {
        // eslint-disable-next-line no-unused-vars
        decode = ctx.app.jwt.verify(token, secret);
        await next();
      } catch (err) {
        console.log(err);
        ctx.status = 200;
        ctx.body = {
          msg: 'token已过期,请重新登录',
          code: 401,
        };
        return;
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 401,
        msg: 'token已过期,请重新登录',
      };
      return;
    }
  };
};
