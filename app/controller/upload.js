const moment = require('moment');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const Controller = require('egg').Controller;

class UploadController extends Controller {
  async upload() {
    const file = this.ctx.request.files[0];

    let uploadDir = '';
    try {
      // ctx.request.files[0] 表示获取第一个文件，若前端上传多个文件则可以遍历这个数组对象
      const f = fs.readFileSync(file.filepath);
      // 1.获取当前日期
      const day = moment().format('YYYYMMDD');
      // 2.创建图片保存的路径
      const dir = path.join(this.config.uploadDir, day);
      // 毫秒数
      const date = Date.now();
      // 不存在就创建目录
      await mkdirp(dir);
      // 返回图片保存的路径  path.extname获取后缀名
      uploadDir = path.join(dir, date + path.extname(file.filename));
      // 写入文件夹
      fs.writeFileSync(uploadDir, f);
    } finally {
      // 清除临时文件
      this.ctx.cleanupRequestFiles();
    }

    this.ctx.body = {
      code: 200,
      msg: '上传成功',
      data: {
        path: uploadDir.replace(/app/g, ''),
      },
    };
  }
}

module.exports = UploadController;
