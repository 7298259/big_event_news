$(function () {
  const layer = layui.layer
  const form = layui.form
  const laypage = layui.laypage
  let qs = {
    pagenum: 1, //当前页码值（表示当前是第几页）
    pagesize: 2, //当前每页显示多少条
    cate_id: '', //当前选择的文章分类
    state: '' //当前文章所处的状态，可选值： 已发布，操作，都是字符串类型
  }

  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    let y = dt.getFullYear()
    let m = (dt.getMonth() + 1 + '').padStart(2, '0')
    let d = (dt.getDate() + '').padStart(2, '0')

    let yy = (dt.getHours() + '').padStart(2, '0')
    let mm = (dt.getMinutes() + '').padStart(2, '0')
    let ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d} ${yy}:${mm}:${ss}`
  }

  // 获取文章分类
  loadCateList()
  function loadCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/cate/list',
      success(res) {
        if (res.code !== 0) return layer.msg('获取文章分类列表失败')
        const html = template('tpl-cate', res)
        $('[name=cate_id]').html(html)
        // layui本身的特性，需要多走一步
        form.render()

      }
    })
  }

  // 加载文章列表
  loadArticleList()

  function loadArticleList() {
    $.ajax({
      method: 'GET',
      url: `/my/article/list?pagenum=${qs.pagenum}&pagesize=${qs.pagesize}&cate_id=${qs.cate_id}&state=${qs.state}`,
      success(res) {
        if (res.code !== 0) return layer.msg('获取文章列表失败')
        const htmlStr = template('tpl-list', res)
        $('tbody').html(htmlStr)

        // 调用渲染分页的方法
        renderPage(res.total)
      }

    })
  }

  $('#choose-form').on('submit', function (e) {
    e.preventDefault()
    const cate_id = $('[name=cate_id]').val()
    const state = $('[name=state]').val()

    qs.cate_id = cate_id
    qs.state = state

    loadArticleList()
  })

  function renderPage(total) {
    laypage.render({
      elem: document.getElementById('pageWrapper'),
      count: total,
      limit: qs.pagesize,
      curr: qs.pagenum,
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2,3,5,10],
      // 分页发生切换的时候，触发 jump 回调
      // 只要调用了laypage.render() 方法就会触发 jump 回调
      jump: function (obj, first) {
        //obj包含了当前分页的所有参数
        // console.log(obj)
        //得到当前页和得到每页显示的条数
        // console.log(obj.curr, obj.limit)    
        qs.pagenum = obj.curr
        qs.pagesize = obj.limit

        //用户主动切换页码值的时候去加载列表，首次不执行
        if (!first) {
          loadArticleList()
        }
        // if (typeof first === 'undefined') {
        //   loadArticleList()
        // }
      }
    })

  }

  // 通过代理的形式给删除按钮绑定点击事件 
  $('tbody').on('click', '.btnDelete', function () {
    const len = $('.btnDelete').length
    const result = confirm('您确定要删除改文章吗？')
    if (result) {
      const id = $(this).attr('data-id')
      $.ajax({
        method: 'DELETE',
        url: `/my/article/info?id=${id}`,
        success(res) {
          if (res.code !== 0) return layer.msg('删除文章失败！')
          layer.msg('删除文章成功！')
          if (len === 1) {
            qs.pagenum = qs.pagenum === 1 ? 1 : qs.pagenum -1
           }
          loadArticleList()
          }
      })
     }
   })
})