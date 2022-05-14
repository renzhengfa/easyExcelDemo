// 获取登录记录
function loginRecord() {
    var token = window.localStorage.getItem('token')
    console.log(token)
    // app.get("authmodule/AuthTbUserloginLog/selectLog",{},function(msg){
    //     console.log(msg);
    // });
    var table = layui.table
    table.render({
        elem: '#login_record',
        url: baseurl + 'authmodule/AuthTbUserloginLog/selectLog?field=id&sort=desc', //数据接口
        page: true, //开启分页
        loading: true,
        cellMinWidth: 80,
        even: true, // 开启隔行背景
        headers: { authorization: token },
        request: {
            pageName: 'currentPage', //页码的参数名称，默认：page
            limitName: 'pageSize' //每页数据量的参数名，默认：limit
        },
        response: {
            statusName: 'code',
            statusCode: 1,
            msgName: 'msg', // 对应 msg
            countName: 'total', // 对应 count
            dataName: 'rows' // 对应 data
      },
      // ,initSort: {
      //      field: 'id' //排序字段，对应 cols 设定的各字段名
      //     ,type: 'desc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
      // }
      cols: [
          [
            //表头
            { field: '', title: '序号',width: 60,templet:'<div>{{d.LAY_TABLE_INDEX+1}}</div>'},
            { field: 'loginName', title: '登录名' },
            { field: 'loginSource', title: '登录方式' },
            { field: 'loginTime', title: '时间' },
            { field: 'loginIp', title: 'IP地址' },
            { field: 'loginMsg', title: '登录消息' }
          ]
        ]
    })
} 

// 个人详细信息
var idNum = ''
function userInfo() {
  app.get('authmodule/authTbUser/selectCurrentUser', {}, function(msg) {
    console.log(msg)
    if (msg.state == true) {
      	idNum = msg.row.id
		$('.loginAct').val(msg.row.account)
		$('.login-account').val(msg.row.account)
		$('.name').val(msg.row.username)
		var radios_sex = $('input:radio[name="sex"]')
		//console.log(radios_sex);
		//msg.row.sex == 0 ? radios_sex.eq(0).attr("checked", true) : radios_sex.eq(1).attr("checked", true);
		//msg.row.sex == 0 ? $("#nan").addClass("layui-form-radioed") : $("#nv").addClass("layui-form-radioed");
		$('.idCard').val(msg.row.idCard)
		$('.jobNum').val(msg.row.jobNumber)
		$('.phone').val(msg.row.phone)
		$('.email').val(msg.row.email)
		$('#head_img').attr('src',imgurl +  msg.row.headImgAddress).show(1000)
    } else {
     	layer.msg(msg.msg)
    }
  })
}

// 上传头像

var picUrl = '';
function uploadfile() {
  	layui.use('upload', function() {
    var upload = layui.upload
    var uploadInst = upload.render({
      elem: '#uploadfile',
      url: imgurl + 'filemodule/file/uploadHeadImg',
      done: function(res) {
        if (res.state == true) {
          console.log(res)
          console.log(res.msg)
          //$(".ok").fadeIn();
          layer.tips(res.msg, '#uploadfile')
          $('#head_img').attr('src',imgurl + res.row).show(1000)
          picUrl = res.row
        } else {
          layer.msg(res.msg)
          console.log(res.msg)
        }
      },
      error: function(err) {
        console.log(err)
      }
    })
  })
}

function check() {
  $('#name').blur(function() {
    console.log($('#name').val())
    var val = $('#name').val()
    var pattern = /^[a-zA-Z0-9]{4,18}$/
    if (val) {
      var res = pattern.test(val)
      console.log(res)
      //layer.tips(res.msg, '#filedName');
      if (res === false) {
        layer.tips('请输入4-18位字母或数字', '#name', {
          tips: [3, '#ff0000'],
          time: 1000
        })
        return false
        $('#name')[0].focus()
      }
    } else {
      layer.tips('输入不能为空', '#name', {
        tips: [3, '#ff0000'],
        time: 1000
      })
      return false
      $('#account')[0].focus()
    }
  })
  $('#card').blur(function() {
    var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    var val = $('#card').val()
    if (val) {
      var res = pattern.test(val)
      console.log(res)
      //layer.tips(res.msg, '#filedName');
      if (res === false) {
        layer.tips('身份证输入不合法', '#card', {
          tips: [3, '#ff0000'],
          time: 1000
        })
        return false
        $('#card')[0].focus()
      }
      // else{
      //     app.get("authmodule/authTbUser/testcardIfExist",{
      //         card:  val
      //     },function(msg){
      //         console.log(msg);
      //         if(msg.state == false){
      //             alert(msg.msg);
      //             $("#card").val("");
      //             $("#card")[0].focus();
      //             return false;
      //         }
      //     });
      // }
    } else {
      layer.tips('输入不能为空', '#card', {
        tips: [3, '#ff0000'],
        time: 1000
      })
      return false
      $('#idCard')[0].focus()
    }
  })

  $('#phoneNum').blur(function() {
    var pattern = /^1(3|4|5|7|8)\d{9}$/
    var val = $('#phoneNum').val()
    if (val) {
      var res = pattern.test(val)
      console.log(res)
      //layer.tips(res.msg, '#filedName');
      if (res === false) {
        layer.tips('手机号码不合法', '#phoneNum', {
          tips: [3, '#ff0000'],
          time: 1000
        })
        return false
        $('#phoneNum')[0].focus()
      }
      // else{
      //     app.get("authmodule/authTbUser/testPhoneIfExist",{
      //         phone:  val
      //     },function(msg){
      //         console.log(msg);
      //         if(msg.state == false){
      //             alert(msg.msg);
      //             $("#phoneNum").val("");
      //             $("#phoneNum")[0].focus();
      //             return false;
      //         }
      //     });
      // }
    } else {
      layer.tips('输入不能为空', '#phoneNum', {
        tips: [3, '#ff0000'],
        time: 1000
      })
      return false
      $('#phoneNum')[0].focus()
    }
  })
  $('#e_mail').blur(function() {
    var pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    var val = $('#e_mail').val()
    if (val) {
      var res = pattern.test(val)
      console.log(res)
      //layer.tips(res.msg, '#filedName');
      if (res === false) {
        layer.tips('邮箱格式不合法', '#e_mail', {
          tips: [3, '#ff0000'],
          time: 1000
        })
        return false
        $('#e_mail')[0].focus()
      }
    } else {
      layer.tips('输入不能为空', '#e_mail', {
        tips: [3, '#ff0000'],
        time: 1000
      })
      return false
      $('#e_mail')[0].focus()
    }
  })
}
// 提交检查

// 修改个人详细信息
function reditInfo() {
  var token = window.localStorage.getItem('token')
  console.log(token)
  uploadfile()
 
	  $('.btn-save').on('click', function() {
	    //var sex = "";
	  	console.log('巧妙触发')
	    var name = $('.name').val()
	    var gender = $('input:radio[name="sex"]:checked').val()
	    // gender == "男" ? sex = 0 : sex = 1;
	    var idCard = $('.idCard').val()
	    var phone = $('.phone').val()
	    var email = $('.email').val()
	    console.log(picUrl)
	    if (name && gender && idCard && phone && email) {
	      app.post(
	        'authmodule/authTbUser/updateUsers',
	        {
	          authorization: token,
	          id: idNum,
	          username: name,
	          headImgAddress: picUrl,
	          sex: gender,
	          idCard: idCard,
	          phone: phone,
	          email: email
	        },
	        function(msg) {
	          console.log(msg)
	          if (msg.state == true) {
	            layer.msg(msg.msg)
	            userInfo()
	          } else {
	            layer.msg(msg.msg)
	          }
	        }
	      )
	    } else {
	      return false
	    }
	  })
  
  
}

// 修改登录密码
function reditLoginPsd() {
  $('.btn-loginpsd-save').on('click', function() {
    var loginAct = $('.loginAct').val()
    var origin_psd = $('.origin-psd').val()
    var new_psd = $('.new-psd').val()
    var rnew_psd = $('.rnew-psd').val()
    if (new_psd && rnew_psd) {
      if (new_psd !== rnew_psd) {
        $('.new-psd')[0].focus()
        return false
      } else {
        app.post(
          'authmodule/authTbUser/updateLoginPwd',
          {
            loginPassword: new_psd,
            originalLoginPassword: origin_psd
          },
          function(msg) {
            if (msg.state == true) {
              layer.msg(msg.msg)
              $('.origin-psd').val('')
              $('.new-psd').val('')
              $('.rnew-psd').val('')
            } else {
              layer.msg(msg.msg)
            }
          }
        )
      }
    } else {
      //layer.msg('输入不能为空！！！')
    }
  })
  $('.btn-loginpsd-cancel').on('click', function() {
    $('.origin-psd').val('')
    $('.new-psd').val('')
    $('.rnew-psd').val('')
  })
}

// 修改操作密码
function reditOperatePsd() {
  $('.btn-opapsd-save').on('click', function() {
    var origin_opapsd = $('.origin-opapsd').val()
    var new_opapsd = $('.new-opapsd').val()
    var rnew_opapsd = $('.rnew-opapsd').val()
    if (new_opapsd && rnew_opapsd) {
      if (new_opapsd !== rnew_opapsd) {
        $('.new-opapsd')[0].focus()
        return false
      } else {
        app.post(
          'authmodule/authTbUser/updateOperatePwd',
          {
            operatePassword: new_opapsd,
            originalOperatePassword: origin_opapsd
          },
          function(msg) {
            if (msg.state == true) {
              layer.msg(msg.msg)
              $('.origin-opapsd').val('')
              $('.new-opapsd').val('')
              $('.rnew-opapsd').val('')
            } else {
              layer.msg(msg.msg)
            }
          }
        )
      }
    } else {
      //layer.msg('输入不能为空！！！')
    }
  })
  $('.btn-opapsd-cancel').on('click', function() {
    $('.origin-opapsd').val('')
    $('.new-opapsd').val('')
    $('.rnew-opapsd').val('')
  })
}


// 我的信息
function getMyInfo(data){ 
    var token = window.localStorage.getItem('token');
    var table = layui.table
    table.render({
        elem: '#my_info',
        url: baseurl + 'message/getMessage?state='+data.state+'&isDelete='+data.isDelete, //数据接口
        page: true, //开启分页
        loading: true,
        cellMinWidth: 80,
        even: true, // 开启隔行背景
        headers: { authorization: token },
        request: {
            pageName: 'currentPage', //页码的参数名称，默认：page
            limitName: 'pageSize' //每页数据量的参数名，默认：limit
        },
        response: {
            statusName: 'code',
            statusCode: 1,
            msgName: 'msg', // 对应 msg
            countName: 'total', // 对应 count
            dataName: 'rows' // 对应 data
      }, 
      cols: [
          [
            //表头 
            {checkbox: true},
            { field: 'content', title: '内容' },
            { field: 'state',title: '状态', templet:'#isread'},
            { field: 'updateTime', title: '日期' },
            { field: 'right', title: '操作', toolbar: '#info_operation' }
          ]
        ]
    });

    table.on('tool(my_info_recode)', function (obj) {
      var data = obj.data; //获得当前行数据
      var layEvent = obj.event;
      if (layEvent === 'delete') { 
        delInfo(0,[data.id]); 
      }
      if (layEvent === 'isread') { 
        isreadInfo(0,[data.id]);
      }
  });

  // 多选
  table.on('checkbox(my_info_recode)', function (obj) {
    var checkStatus = table.checkStatus('my_info');
    var data = checkStatus.data;
    tableData = [];
    for (var item of data) {
      tableData.push(item.id);
    }
  });
  }
// 删除信息
function delInfo(type, data) { 
    var parm = {messageIds: data}; 
  window.parent.layer.confirm('确认删除信息吗？', {
    btnAlign: 'c',
    anim: 5,
    title: '提示',
    shade: [0.01, '#fff']
  }, function (index, layero) {
    app.post('message/delMessages', parm, function (res) {
      if (res.state) {
        layui.table.reload('my_info', {});
        getRecycleInfo();
        parent.layer.close(index);
      }
      parent.layer.msg(res.msg);
    })
  }, function (index) {
    parent.layer.close(index);
  });
};
// 标记信息已读
function isreadInfo(type, data) { 
    var parm = {messageIds: data}; 
  window.parent.layer.confirm('确认标记信息为已读吗？', {
    btnAlign: 'c',
    anim: 5,
    title: '提示',
    shade: [0.01, '#fff']
  }, function (index, layero) {
    app.post('message/hasRead', parm, function (res) {
      if (res.state) {
        layui.table.reload('my_info', {});
        parent.layer.close(index);
      }
      parent.layer.msg(res.msg);
    })
  }, function (index) {
    parent.layer.close(index);
  });
};
// 回收站
function getRecycleInfo(){
  var token = window.localStorage.getItem('token'); 
  var table = layui.table;
  table.render({
      elem: '#recycle_info',
      url: baseurl + 'message/getMessage?isDelete=1', //数据接口
      page: true, //开启分页
      loading: true,
      cellMinWidth: 80,
      even: true, // 开启隔行背景
      headers: { authorization: token },
      request: {
          pageName: 'currentPage', //页码的参数名称，默认：page
          limitName: 'pageSize' //每页数据量的参数名，默认：limit
      },
      response: {
          statusName: 'code',
          statusCode: 1,
          msgName: 'msg', // 对应 msg
          countName: 'total', // 对应 count
          dataName: 'rows' // 对应 data 
    }, 
    cols: [
        [
          //表头  
          { field: 'content', title: '内容' },
          { field: 'state',title: '状态', templet:'#isread'},
          { field: 'updateTime', title: '删除日期' } 
        ]
      ]
  });
}
$(function () {
  layui.use(['element', 'form', 'table'], function () {
    var element = layui.element
    var form = layui.form
    var table = layui.table
    loginRecord()
    userInfo()
    reditInfo()
    reditLoginPsd()
    reditOperatePsd()
 
    //我的消息
    // 全部
    var data = {
      state: '',
      isDelete: 0
    };
    getMyInfo(data);
    $('#getAllInfo').on('click', function (event) {
      $(this).addClass('active_item').siblings().removeClass('active_item');
      data.state = '';
      getMyInfo(data);
    })
    // 已读
    $('#getRead').on('click', function (event) {
      $(this).addClass('active_item').siblings().removeClass('active_item');
      data.state = 1;
      getMyInfo(data);
    })
    // 未读
    $('#getUnRead').on('click', function (event) {
      $(this).addClass('active_item').siblings().removeClass('active_item');
      data.state = 0;
      getMyInfo(data);
    })

    // 批量已读
    $('.many_isread').on('click', function (event) { 
      isreadInfo(1,tableData);
    })
    // 批量删除
    $('.many_del').on('click', function (event) { 
      delInfo(1,tableData); 
      getRecycleInfo();
    })

    // 回收站
    getRecycleInfo();
  })
})
