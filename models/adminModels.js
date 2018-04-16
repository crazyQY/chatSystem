// 聊天室实体
var date = new Date();
exports.roomModel = {
  name: '',
  maxSize: 10,
  currentSize: 0,
  subject: '',
  photoUrl: '',
  createTime: date.getFullYear()+'-'+(date.getMonth()+1) +'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds(),
  isEnable: true
};
//用户实体
exports.userModel={
  _id:'',
  name:'',
  pass:'',
  nick:''
};