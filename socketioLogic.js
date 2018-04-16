var mongodb = require('mongodb'),
  ObjectID = mongodb.ObjectID,
  MongoClient = mongodb.MongoClient,
  assert = require('assert');
// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'chatRoom';

function getTime(){
  var now=new Date();
  return now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDay()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
}
var sockets = [],//当前连接列表
    userList=[];//当前在线用户列表，存储的是用户名
exports.registerSocketIOLogic=function(io){
  io.on('connection',function(socket){
    socket.on('server_doJoin',function(data){
      sockets.push({roomId:data.roomId,socket:socket});
      socket.roomId=data.roomId; //标识当前client是属于哪个聊天室的
      socket.nickname = data.userName;
      if (userList.indexOf(data.userName) == -1) {
        userList.push(data.userName);
      }
      // 同一聊天室广播上线通知
      sockets.forEach(function (client) {
        if(client.roomId == socket.roomId&&client.socket!=socket) {
          // 其他人上线通知
          client.socket.emit('client_useronline', {
            userName: socket.nickname
          });
        }
      });
      // 自己上线的通知
      var messages = [];
      MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        const dbname = client.db(dbName);
        const roomlist = dbname.collection('roomlist');
        roomlist.findOne({_id: ObjectID(socket.roomId)}, {fields: {messages: true, _id: false}}, function(err, doc) {
          // console.log(doc.messages);
          socket.emit('client_welcome',{
            msg: data.userName + '加入聊天室',
            userList: userList,
            messages: doc.messages
          });
          client.close();
        });
      });
    });
    // 下线时触发广播下线通知
    socket.on('disconnect', function () {
      sockets.forEach(function (client) {
        if(client.roomId == socket.roomId&&client.socket!=socket) {
          client.socket.emit('client_useroffline', {
            userName: socket.nickname
          });
        }
      });
    })
    socket.on('server_sendmsg',function(data){
      // console.log(data);
      var msgObj = {
        sendTime: getTime(),
        userName: '',
        msg: data.msg
      };
      MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        const dbname = client.db(dbName);
        const roomlist = dbname.collection('roomlist');
        roomlist.updateOne({_id: ObjectID(socket.roomId)}, {'$push': {"messages": msgObj}}, function(err, docs) {
          client.close();
        });
      });
      msgObj.userName = socket.nickname;
      socket.emit('client_printmsg', msgObj);
      // 同一聊天室发送消息
      sockets.forEach(function (client) {
        if(client.roomId == socket.roomId&&client.socket!=socket) {
          client.socket.emit('client_printmsg',msgObj);
        }
      });
    });
  });
};