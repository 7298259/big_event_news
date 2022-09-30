// 每次发起真正的请求之前，都会经过的地方
$.ajaxPrefilter(function (config) {
  // 将 key=value形式的数据，转成json格式的字符串
  const format2Json = (source) => {
    let target = {}
    source.split('&').forEach((el) => {
      let kv = el.split('=')
      target[kv[0]] = kv[1]
    })
    return JSON.stringify(target)
  }
  // 统计设置基准地址
  config.url = 'http://big-event-vue-api-t.itheima.net' + config.url
  // 同意设置请求头 Content-Type
  config.contentType = 'application/json'
  // 统一设置请求的参数 - post 请求
  config.data = config.data && format2Json(config.data)

  // 统一设置请求头
  // 请求路径中有 /my 这样字符串的需要添加
  // indexOf startsWith endWith includes 
  if (config.url.includes('/my')) {
    config.headers = {
      Authorization : localStorage.getItem('big_news_token') || ''
    }
  }


  // 统一添加错误回调 或者 complete 回调
  config.error = function (err) {
    if(err.responseJSON?.code === 1 && err.responseJSON?.message === '身份认证失败！') {
      // 进此处的话，说明有误
      localStorage.clear()
      location.href = '/login.html'
     }

   }
})