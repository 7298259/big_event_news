$(function () {
  // 目的：确保 dom 渲染完毕之后去请求数据
  getUserInfo()
})

let layer = layui.layer
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // headers: {
    //   Authorization: localStorage.getItem('big_news_token') || ''
    // },
    success(res) {
      // console.log(res)
      if (res.status !== 0) return layer.msg(res.message)
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
    $('.userinfo img').attr('src', user.user_pic).show()
  } else {
    $('.layui-nav-img').hide()
    const name = user.nickname || user.username
    // const char = user.username.charAt(0).toUpperCase()
    const char = name[0].toUpperCase()
    $('.text-avatar').html(char).show()
  }
  $('#welcome').html(`欢迎&nbsp;&nbsp;${user.username}`)
}


// 点击按钮实现退出功能 
$('#btnLogout').on('click', function () {
  layer.confirm('您确认要退出吗？', { icon: 3, title: '提示' }, function (index) {
    //从本地删除 token
    localStorage.removeItem('big_news_token')
    // 页面需要跳转到登录页
    location.href = '/login.html'
    layer.close(index)
  })
})

// 问题：你在切换分支的时候：git checkout home
// 如果你切的分支名称和你工程里面某个文件夹的名称一致了，人家给一个报警提示
// git checkout home --      (说明：命令后面加一个 --)

// 获取用户信息，报错状态码 401，就是token问题（要么你没给，要么就是过期了）