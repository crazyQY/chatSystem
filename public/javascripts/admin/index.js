var index = {
  /**
   * 注册UI相关事件
   */
  registerUIEvents: function () {
    $('li.submenu').on('click', function (e) {
      e.preventDefault();//阻止默认事件
      var $self = $(this),
        $ul = $self.find('>ul');

      if ($self.hasClass('open')) {
        $ul.slideUp(function () {
          $self.removeClass('open');
        });
      } else {
        $ul.slideDown(function () {
          $self.addClass('open');
        });
      }
    });
    /**
     * 左边二级菜单点击事件
     */
    $('li.submenu>ul>li').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();//阻止事件冒泡
      var $self = $(this),
          $parent = $self.parents('li');
      $parent.siblings().removeClass('active');
      $parent.addClass('active');
      var href = $(this).find('a:eq(0)').attr('href');
      index.common.changeNewPage(href);
    });
    /**
     * 左边一级菜单点击事件
     */
    $('#sidebar>ul>li:not(.submenu)').on('click', function (e) {
      e.preventDefault();
      var $self = $(this);
      $self.siblings().removeClass('active');
      $self.addClass('active')
      var href = $(this).find('a:eq(0)').attr('href');
      index.common.changeNewPage(href);
    });
    /**
     * 注销登录确认框
     */
    $('#logout').on('click', function (e) {
      if (!confirm('确实要注销登录吗？')) {
        e.preventDefault();
      }
    });
    /*
    * 添加聊天室弹框
    * */
    $('#content').on('click', '#addRoom', function () {
      $('#add_room').show();
    });
    $('#content').on('click', '#addClose', function () {
      $('#add_room').hide();
    });
    /*
    * 编辑聊天室
    * */
    $('#content').on('click', '.edit-room', function () {
      // console.log($(this).data('id'));
      $.ajax({
        url: '/admin/editRoom',
        type: 'get',
        data: {'_id': $(this).data('id')}
      }).done(function (data) {
        // console.log(data);
        // console.log(111);
        $('#edit_room').html(data);
        $('#edit_room').show();
      })
    });
    $('#content').on('click', '#editClose', function () {
      $('#edit_room').hide();
    });
    /*
    * 删除聊天室
    * */
    $('#content').on('click', '.del-room', function () {
      var r=confirm("确定要删除该聊天室吗？");
      if(r) {
        $.ajax({
          url: '/admin/delRoom',
          type: 'post',
          data: {'_id': $(this).data('id')}
        }).done(function (data) {
          // console.log(data);
          var jsonData= $.parseJSON(data);
          if(jsonData.isSuccess){
            index.common.changeNewPage('/admin/roomList');
            alert('删除成功');
          }else{
            alert(jsonData.errMsg);
          }
        });
      }
    });
    /*
    * 更新聊天室信息提交事件
    * */
    $(document).on('click','#btn_edit_room',function(e){
      e.preventDefault();
      e.stopPropagation();
      $.ajax({
        url:'/admin/editRoom',
        data:$('#form_edit_room').serialize(),
        type:'post'
      }).done(function(data){
        // console.log(data);
        var jsonData= $.parseJSON(data);
        if(jsonData.isSuccess){
          $('#edit_room').hide();
          alert('更新成功');
          index.common.changeNewPage('/admin/roomList');
        }else{
          alert(jsonData.errMsg);
        }
      });
    });
  },
  /**
   * 页面公共事件
   */
  common: {
    changeNewPage: function (url) {
      $.ajax({
        url: url,
        cache: false,
        type: 'get'
      }).done(function (data) {
        $('#content').html(data);
      });
    }
  },
  /**
   * 页面脚本初始化
   */
  init: function () {
    this.registerUIEvents();
  }
};