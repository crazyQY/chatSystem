var mongodb = require('mongodb'),
  ObjectID = mongodb.ObjectID,
  MongoClient = mongodb.MongoClient,
  assert = require('assert'),
  models = require('../models/adminModels');
// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'chatRoom';
exports.index=function(req,res){
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const dbname = client.db(dbName);
    const roomlist = dbname.collection('roomlist');
    const users = dbname.collection('users');
    roomlist.find({'isEnable': true}).limit(9).toArray(function(err, docs) {
      users.findOne({'_id':ObjectID(req.session.user_id)},function(err,user){
        // console.log(user);
        res.render('home/index',{
          title:'欢迎进入匿名聊天室',
          data:docs,
          user:user
        });
      });
      client.close();
    });
  });
};
// 聊天室首页用户登录
exports.doLogin = function (req, res) {
  // console.log(req.body.logout);
  if(req.body.logout) {
    req.session.destroy();
    res.redirect('/home/index');
    return false;
  }
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const dbname = client.db(dbName);
    const collection = dbname.collection('users');
    collection.findOne({'name': req.body.username, 'pass': req.body.userpass}, function (err, doc) {
      if(doc) {
        req.session.user_id=doc._id;
        res.redirect('/home/index');
      }else{
        res.redirect('/home/index?le=登录失败');
      }
      client.close();
    });
  });
};
// 用户注册
exports.register = function (req, res) {
  res.render('home/register');
};
exports.doRegister = function (req, res) {
  var user = models.userModel;
      user._id = new ObjectID();
      user.name = req.body.account;
      user.nick = req.body.nick;
      user.pass = req.body.pw2;
  // console.log(user);
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const dbname = client.db(dbName);
    const collection = dbname.collection('users');
    collection.insertOne(user, function (err, doc) {
      if (err)
        throw err;
      req.session.user_id = user._id;
      res.redirect('/home/index');
      client.close();
    });
  });
};
//聊天室列表
exports.roomList=function(req, res){
  res.render('home/roomList');
};

//进入聊天室
exports.joinRoom=function(req, res){
  if(!req.session.user_id){
    res.render('home/customError',{
      type:'notLogin'
    });
  }
  var roomId = req.params.id;
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const dbname = client.db(dbName);
    const roomlist = dbname.collection('roomlist');
    const users =  dbname.collection('users');
    try{
      ObjectID(roomId)
    }catch (e){
      res.render('home/500',{
        msg: e.message
      });
      return false;
    }
    roomlist.findOne({_id: ObjectID(roomId), isEnable: true}, function (err, doc) {
      if (doc) {//查询到房间，读取房间信息
        users.findOne({_id: ObjectID(req.session.user_id)}, function (error, result) {
          if(result) {
            res.render('home/room', {
              roomTitle: doc.name,
              roomSubject: doc.subject,
              roomId: doc._id,
              userName: result.name
            });
          }
        })
      } else {//未查询到房间，显示错误信息
        res.render('home/404');
      }
    });
  });
};
