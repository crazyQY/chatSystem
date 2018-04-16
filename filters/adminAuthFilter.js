/*
* 管理员验证权限
* */
// var setLogger = require('../app').setLogger();
exports.authorize = function (req, res, next) {
  // console.log('验证权限');
  if(!req.session.adminInfo) {
    // console.log(setLogger);
    // setLogger('111')
    res.redirect('/admin/login');
  } else {
    next();
  }
}