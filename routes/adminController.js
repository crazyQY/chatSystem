var mongodb = require('mongodb'),
    ObjectID = mongodb.ObjectID,
    MongoClient = mongodb.MongoClient,
    assert = require('assert'),
    models = require('../models/adminModels');
// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'chatRoom';
// 登录页面展示
exports.login = function (req, res) {
  req.session.destroy();
  res.render('admin/login', {title: '欢迎登录聊天室'});
};
// 登录页面提交
exports.dologin = function (req, res) {
  var name = req.body.username,
      password = req.body.password;

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const dbname = client.db(dbName);
    const collection = dbname.collection('adminInfo');
    collection.count({'name': name, 'password': password}, function (err, count) {
      if(count > 0) {
        req.session.adminInfo = name;
        // console.log(req.session);
        res.redirect('/admin/index');
        // title: '管理页面';
      } else {
        res.render('admin/login', {
          title: '聊天室-登录',
          err: '用户名或密码不正确'
        });
      }
      client.close();
    });
  });
};
// 后台管理首页获取
exports.index = function (req, res) {
  res.render('admin/index', {title: '聊天室管理'});
};
// 后台管理页面-聊天室管理
exports.roomList = function (req, res) {
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const dbname = client.db(dbName);
    const collection = dbname.collection('roomlist');
    collection.find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      // console.log(docs)
      res.render('admin/roomList', {
        data: docs
      });
    });
  });
};
// 后台管理页面，添加聊天室
exports.addRoom = function (req, res) {
  var roomModel = models.roomModel;
  roomModel.photoUrl = req.body.roomphoto;
  roomModel.name = req.body.roomname;
  roomModel.maxSize = req.body.roommaxsize;
  roomModel.subject = req.body.roomsubject;

  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const dbname = client.db(dbName);
    const collection = dbname.collection('roomlist');
    collection.insertOne(roomModel, function (err, result) {
      console.log(roomModel);
      console.log(result);
      res.redirect('/admin/index');
      client.close();
    });
  });
};
// 编辑聊天室
exports.editRoom = function (req, res) {
  // console.log(req.query);
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const dbname = client.db(dbName);
    const collection = dbname.collection('roomlist');
    collection.findOne({'_id': ObjectID(req.query._id)}, function(err, doc) {
      assert.equal(err, null);
      // console.log(doc);
      res.render('admin/editRoom',{
        data:doc
      });
    });
  });
};
// 编辑聊天室信息提交
exports.doEditRoom = function (req, res) {
  // console.log(req.body);
  var params = req.body;
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const dbname = client.db(dbName);
    const collection = dbname.collection('roomlist');
    collection.updateOne({'_id': ObjectID(params.hideid)},{'$set': {name:params.roomname, maxSize:params.roommaxsize,subject:params.roomsubject}}, function(err, doc) {
      if(err){
        res.send(JSON.stringify({isSuccess:false,errMsg:err.message}));
      }else{
        res.send(JSON.stringify({isSuccess:true,errMsg:null}));
      }
    });
  });
};
exports.doDelRoom = function (req, res) {
  // console.log(req);
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const dbname = client.db(dbName);
    const collection = dbname.collection('roomlist');
    collection.removeOne({'_id': ObjectID(req.body._id)}, function(err, doc) {
      assert.equal(err, null);
      // console.log(doc);
      if(err){
        res.send(JSON.stringify({isSuccess:false,errMsg:err.message}));
      }else{
        res.send(JSON.stringify({isSuccess:true,errMsg:null}));
      }
    });
  });
};