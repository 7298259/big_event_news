$(function () {

  getUserInfo()
})

let layer = layui.layer
const getUserInfo = () => {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // headers: {
    //   Authorization: localStorage.getItem('big_news_token') || ''
    // },
    success(res) {
      // console.log(res)
      if (res.code !== 0) return layer.msg(res.message)
      // 按需渲染头像
      renderAvatar(res.data)
    }
    //  error(err) {
    //   // console.log(err)
    //   if(err.responseJSON?.code === 1 && err.responseJSON?.message === '身份认证失败！') {
    //     // 进此处的话，说明
    //     localStorage.clear()
    //     location.href = '/login.html'
    //    }
    //  }
  })
}

const renderAvatar = (user) => {
  if (user.user_pic) {
    $('.text-avatar').hide()
    $('.userinfo img').attr('src', user.user_pic)
  } else { 
    $('.layui-nav-img').hide()
    const name = user.nickname || user.username
    // const char = user.username.charAt(0).toUpperCase()
    const char = name[0].toUpperCase()
    $('.text-avatar').html(char)
  }
  $('#welcome').html(`欢迎&nbsp;&nbsp;${user.username}`)  
 }


// 点击按钮实现退出功能 
$('#btnLogout').on('click', function () {
  layer.confirm('您确认要退出吗？', {icon: 3, title:'提示'}, function(index){
    //从本地删除 token
    localStorage.removeItem('big_news_token')
    // 页面需要跳转到登录页
    location.href = '/login.html'
    layer.close(index)
  })
 })