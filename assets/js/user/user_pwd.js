$(function () {
  const form = layui.form
  const layer = layui.layer

  form.verify({
    pass: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
    samePwd: function (value) {
      if (value === $('[name = oldPwd]').val()) {
        return '新旧密码不能一样！'
       }
    },
    rePwd: function (value) {
      if (value !== $('[name = newPwd]').val()) {
        return '两次密码不一致！'
       }
     }
  })

  // 监听表单提交事件
  $('.layui-form').submit(function (e) {
    e.preventDefault()    
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      // data: $(this).serialize(),
      data: form.val('pwdForm'),
      success(res) {
        if (res.status !== 0) {
          return layer.msg('修改密码失败！')

        }
        layer.msg('修改密码成功！')
        // 清空表单   
        $('#btnReset').click()
        // 表单元素.reset() 
        // $('.layui-form')[0].reset()
       }
    })
   })
 })