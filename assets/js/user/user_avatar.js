$(function () {

  const layer = layui.layer
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  // 上传文件的按钮
  $('#btnChoose').on('click', function () {
    // 打开文件选择框
    // file.click()
    $('#file').trigger('click')
  })

  // 要去选择某个图片（怎么知道用户选择了图片） ：文件选择框的 change 事件
  $('#file').on('change', function (e) {
    const fileList = e.target.files
    if (fileList.length === 0) return layer.msg('请选择图片！')

    // 拿到用户选择的文件
    let file = e.target.files[0]
    // 根据选择的文件，创建一个对应的 URL 地址
    var newImgURL = URL.createObjectURL(file)
    // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })

  
  // 为确定按钮，绑定点击事件
  $('#btnConfirm').on('click', function () {
    // 获取到裁剪区域的图片
    var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

    // 调用接口，把头像上传到服务器
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success(res) {
        if (res.status !== 0) return layer.msg('上传头像失败！')

        layer.msg('上传头像成功')
        window.parent.getUserInfo()
      }
    })
  })
})