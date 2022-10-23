$(function () {

  const layer = layui.layer
  const form = layui.form

  // 加载分类列表

  loadCateList()
  function loadCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success(res) {
        if (res.status !== 0) return layer.msg('获取文章分类列表失败')
        const html = template('tpl-cate', res)
        $('tbody').empty().append(html)
      }
    })
  }

  let index = null

  // 为添加类别按钮绑定点击事件
  $('#btnAdd').on('click', function () {
    // 打开弹窗
    index = layer.open({
      type: 1,
      title: '添加文章分类',
      area: ['500px', '260px'],
      content: $('#addDialog').html()
    })
  })

  let isEdit = false //用来记录当前是什么状态

  // 需要通过代理的形式（你要监听的元素，是后来动态创建的）
  $('body').on('submit', '#addForm', function (e) {
    e.preventDefault()

    if (isEdit) {
      $.ajax({
        method: 'POST',
        url: '/my/article/updatecate',
        data: $(this).serialize(),
        success(res) {
          if (res.status !== 0) return layer.msg('编辑分类失败')
          layer.msg('编辑分类成功')
          // 刷新列表        
          loadCateList()
        }
      })

    } else {
      $.ajax({
        method: 'POST',
        url: '/my/cate/add',
        // data: $(this).serialize()
        data: form.val('addFormFilter'),
        success(res) {
          if (res.status !== 0) return layer.msg('添加分类失败')
          layer.msg('添加分类成功')
          // 刷新列表        
          loadCateList()
        }
      })
    }

    isEdit = false
    // 关闭弹框
    layer.close(index)
    // 刷新列表        
    loadCateList()

  })


  // 为编辑按钮添加点击事件
  $('tbody').on('click', '.btnEdit', function () {
    isEdit = true
    // console.log('修改了',$(this).attr('data-id'))
    index = layer.open({
      type: 1,
      title: '修改文章分类',
      area: ['500px', '260px'],
      content: $('#addDialog').html()
    })

    const id = $(this).attr('data-id')
    // 需要回显表单
    $.ajax({
      method: 'GET',
      // url: `/my/cate/info?id=${id}`,
      url: `/my/article/cates/${id}`,
      success(res) {
        if (res.status !== 0) return layer.msg('获取分类详情失败')
        // 快速为表单进行赋值
        form.val('addFormFilter', res.data)
      }
    })
  })

  // 添加删除逻辑
  $('tbody').on('click', '.btnDelete', function () {
    const result = confirm('您确定要删除该分类吗？')
    const id = $(this).attr('data-id')
    if (result) {
      $.ajax({
        method: 'GET',
        // url: `/my/cate/del?id=${id}`,
        url: `/my/article/deletecate/${id}`,
        success(res) {
          if (res.status !== 0) return layer.msg('删除分类详情失败')
          layer.msg('删除分类详情成功')
          loadCateList()
         }
      })
     }
   })
})