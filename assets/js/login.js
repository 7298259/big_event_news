$(function () {

  // 需要从 layui 对象身上取到 form
  let form = layui.form
  let layer = layui.layer


  // 点击去注册
  $('#go2Reg').on('click', function () {
    $('.login-wrap').hide()
    $('.reg-wrap').show()
  })
  // 点击去登
  $('#go2Log').on('click', function () {
    $('.login-wrap').show()
    $('.reg-wrap').hide()
  })


  form.verify({
    // 添加自定义规则
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
    // 确认密码框
    repwd: function (value) {
      // 拿到密码框和再次确认密码作比较
      if ($('#repassword').val() !== value) return '两次密码输入不一致,请重新输入'
    }
  })



  // 给注册表单添加提交事件（会刷新浏览器）
  $('#formReg').on('submit', function (e) {
    e.preventDefault()
    // 发请求 ajax
    // 经过分析：1、 修改 Content-Type 2、需要将参数转成 json 格式
    $.ajax({
      method: 'POST',
      url: '/api/reg',
      // data: JSON.stringify({
      // 可将对象转成json格式的字符串
      // username:$('#formReg [name=username]').val(),
      // password:$('#formReg [name=password]').val(),
      // repassword:$('#formReg [name=repassword]').val()
      // }),
      data: $(this).serialize(),
      success(res) {
        if (res.code !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('注册成功')
        // 模拟点击行为
        $('#go2Log').click()
      }
    })

  })

  // 给登录表单添加提交事件
  $('#formLogin').submit(function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/api/login',
      data: $(this).serialize(),
      success(res) {
        if (res.code !== 0) return layer.msg(res.message)

        localStorage.setItem('big_news_token', res.token)
        location.href = '/home.html'        
      }
    })

   })
})

// 说明一下；video里面的请求地址不用了，用新的 http://big-event-vue-api-t.itheima.net
// 原来的：Content-Type: 'application/x-www-form-urlencoded' -> key1=value1&key2=value2
// 现在的：Content-Type需要指定：'application/json' -> '{ "key1": "value1", "key2": "value2" }'

// username=qd51&password=qd51qd51&repassword=qd51qd51
// '{ "username": "qd51", "password": "qd51qd51", "repassword": "qd51qd51" }'

// let str1 = 'username=qd51&password=qd51qd51&repassword=qd51qd51'
// console.log(format2Json(str1))