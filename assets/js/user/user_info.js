$(function () {
  let form = layui.form
  let layer = layui.layer

  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在 1 ~ 6 个字符之间！'
      }
    }
  })

  const initInfo = () => {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success(res) {
        if (res.status !== 0) return layer.msg('请求用户信息失败！')
        // 给表单进行回显数据
        // form.val('你要指定给哪个表单', '你要指定的那个值')
        form.val('userForm', res.data)
      }
    })
  }

  initInfo()

  // 给重置按钮添加点击事件
  $('#btnReset').on('click', function (e) {
    // 阻止默认的重置行为
    e.preventDefault()
    // 重新刷新用户信息
    initInfo()
  })

  // 监听表单提交事件
  $('.layui-form').submit(function (e) {
    e.preventDefault()

    // 把表单数据打印出来（快速获取表单数据）
    // $(this).serialize() -> key=value&key=value
    // form.val('userForm') -> { key: value, key: value }
    // console.log(form.val('userForm'))
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: form.val('userForm'), // 问题：@ -> %40 这里进行了转义操作 （空格 -> 20%）
      success(res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败！')
        }
        layer.msg('更新用户信息成功！')
        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo()
      }

    })

  })
})