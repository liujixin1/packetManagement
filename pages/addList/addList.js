// pages/addVideo/addVideo.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {


    form: {

      sum: 0,
      checked: false,
      show: false,
      img: '',
      uploadImg: true,

    },

  },
  //删除title图片
  remImg() {
    const that = this;
    that.setData({
      [`form.uploadImg`]: true,
      [`form.img`]: ''
    })
    console.log(that.data.form)
  },

  //轮播
  switchChange: function (e) {
    const that = this;
    that.setData({
      ['form.checked']: e.detail.value
    })
  },
  //显示
  switchShowChange(e) {
    const that = this;
    that.setData({
      ['form.show']: e.detail.value
    })
  },


  //上传title图片
  uploadImg() {
    const that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        wx.showLoading({
          title: '上传中...',
        })
        console.log(res, 11111)
        const tempFilePaths = res.tempFilePaths[0];
        //声明图片名字为时间戳和随机数拼接成的，尽量确保唯一性
        let time = Date.now() + parseInt(Math.random() * 999) + parseInt(Math.random() * 2222);
        //拓展名
        var fileExt = tempFilePaths.replace(/.+\./, "");
        //拼接成图片名
        let keepname = time + '.' + fileExt;
        wx.cloud.uploadFile({
          cloudPath: keepname,
          filePath: tempFilePaths, // 文件路径
        }).then(res => {
          // get resource ID
          console.log(res.fileID)
          wx.hideLoading()
          that.setData({
            [`form.uploadImg`]: false,
            [`form.img`]: res.fileID
          })
        }).catch(error => {
          // handle error
        })

      }
    })
  },


  //获取文章字
  getName(e) {
    const that = this;
    that.setData({
      ['form.name']: e.detail.value
    })
  },
  //获取描述
  getMessage(e) {
    const that = this;
    that.setData({
      ['form.message']: e.detail.value
    })
  },
  //测试人数
  getsum(e) {
    const that = this;
    that.setData({
      ['form.sum']: e.detail.value
    })
  },
  //获取ID
  getId(e) {
    const that = this;
    that.setData({
      ['form.itemId']: e.detail.value
    })
  },

  //提交
  btn() {
    const that = this;
    const form = that.data.form;

    if (form.img != '') {
      if (that.data.modification) {
        wx.showLoading({
          title: '加载中...',
        })
        db.collection('test').doc(that.data.form._id).update({
          data: {

            sum: form.sum,
            img: form.img,

            checked: form.checked,
            show: form.show,
            banner: form.checked,
            status: 1,
            date: new Date()
          }

        })
        setTimeout(() => {
          wx.hideLoading()
          wx.navigateTo({
            url: '/pages/index/index?id=1'
          })
        }, 500)

      } else {
        db.collection('test').add({
          data: {

            sum: form.sum,
            img: form.img,
            checked: form.checked,
            show: form.show,
            banner: form.checked,
            testList: form.testList,
            status: 1,
            date: new Date()
          }
        })
        setTimeout(() => {
          wx.hideLoading()
          wx.navigateTo({
            url: '/pages/index/index?id=1'
          })
        }, 500)
      }

    } else {
      wx.showToast({
        icon: 'none',
        title: '内容填写不完整'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.showLoading({
      title: '加载中...',
    })
    // wx.loadFontFace({
    //   family: 'Pacifico',
    //   source: 'url("https://sungd.github.io/Pacifico.ttf")',
    //   success: console.log
    // })
    if (options.id) {
      db.collection('test').doc(options.id).get().then(res => {
        console.log(res)
        wx.hideLoading()
        that.setData({
          form: res.data,
          modification: true
        })
        switch (res.data.author) {
          case 1:
            that.setData({
              author: '情感'
            })
            return;
          case 2:
            that.setData({
              author: '心理'
            })
            return;
          case 3:
            that.setData({
              author: 'IQ'
            })
            return;
        }
      })
    } else {
      wx.hideLoading()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})