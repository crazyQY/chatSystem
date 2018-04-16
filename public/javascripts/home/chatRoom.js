var chatRoom={
  socket:null,
  regCallback:function(){
    //加入的时候触发的事件
    this.socket.on('client_welcome',function(data){
      var users=[];
      data.userList.forEach(function(obj, i){
        users.push('<li>'+ obj +'</li>');
      });
      // console.log(data.messages);
      // 打印历史聊天记录
      if(data.messages!==undefined) {
        data.messages.forEach(function (obj, i) {
          chatRoom.showChatContent(obj.msg,obj.userName,obj.sendTime)
        });
      }
      $('#userList').html(users.join(''));
      // 上线通知
      chatRoom.showToast(data.msg);
    });
    //收到消息时的回调
    this.socket.on('client_printmsg',function(data){
      chatRoom.showChatContent(data.msg,data.userName,data.sendTime);
    });
    // 他人下线时通知
    this.socket.on('client_useroffline', function (data) {
      chatRoom.showToast(data.userName + '已下线');
      // 下线后移除在线用户列表
      console.log($('#userList li'));
      //下线后移除用户列表（方式一）
      $('#userList li').each(function(i,obj){
        var $self=$(obj);
        if($self.text()==data.userName){
          $self.remove();
          return false;
        }
      });
    });
    // 他人上线时通知
    this.socket.on('client_useronline', function (data) {
      $('#onlineTip').text(data.userName + '已上线').show().fadeOut(1000);
      $('#userList').append('<li>'+data.userName+'</li>');
      chatRoom.showToast(data.userName + '上线了!');
    });
  },
  userJoin:function(){
    this.socket=io.connect('http://127.0.0.1:3000');
    this.socket.emit('server_doJoin', {roomId: $("#roomId").val(), userName: $("#userName").val()});
  },
  registerUIEvents:function(){
    $('#btnSend').on('click',function(){
      var msg=$('#inputContent').val();
      // chatRoom.showChatContent(msg, $('#userName').val(), new Date());
      //发送消息
      chatRoom.socket.emit('server_sendmsg',{
        msg: msg,
        roomId: $('#roomId').val(),
        userName: $('#userName').val()
      });
      $('#inputContent').val('');
    });
  },
  // 显示系统通知
  showToast: function (msg) {
    var $div = $('<div class="toast" />').text(msg);
    $('#divContent').append($div);
  },
  // 显示聊天内容
  showChatContent: function (msg, author, date) {
    var $div=$('<div class="chatContent" />');
    if(date instanceof Date){
      date=(date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds());
    }
    $div.append('<span class="author">'+author+'</span>&nbsp;&nbsp;<span class="date">'+date+'</span>');
    $div.append('<div class="msg">'+msg+'</div>');
    $('#divContent').append($div);
  },
  //初始化
  init:function(){
    this.userJoin();
    this.regCallback();
    this.registerUIEvents();
  }
};