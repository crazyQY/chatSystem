var index = require('./index'),
    admin = require('./adminController'),
    home = require('./homeController'),
    filter = require('../filters/adminAuthFilter');
// 路由注册
exports.registerRouter = function (app) {
  app.get('/', index);
  // 注册admin的路由信息
  app.get('/admin/login', admin.login);
  app.post('/admin/login', admin.dologin);
  // 后台管理页面
  app.get('/admin/', filter.authorize, admin.index);
  app.get('/admin/index', filter.authorize, admin.index);
  app.get('/admin/roomList', filter.authorize, admin.roomList);
  app.post('/admin/addRoom',filter.authorize, admin.addRoom);
  app.get('/admin/editRoom',filter.authorize, admin.editRoom);
  app.post('/admin/editRoom',filter.authorize, admin.doEditRoom);
  app.post('/admin/delRoom',filter.authorize, admin.doDelRoom)
  //***************************注册聊天室首页路由信息
  // 聊天室首页
  app.get('/', home.index);
  app.get('/home',home.index);
  app.get('/home/',home.index);
  app.get('/home/index',home.index);
  // 聊天室首页登录
  app.post('/home/login',home.doLogin);
  // 注册页面
  app.get('/home/register',home.register);
  app.post('/home/register',home.doRegister);
  //聊天室列表
  app.get('/home/room',home.roomList);
  //进入聊天室
  app.get('/home/room/:id',home.joinRoom);
};

