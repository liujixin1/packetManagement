// pages/addVideo/addVideo.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    form: {
      img: '',
      uploadImg: true,
      name:'',
      num:0,
      sum: 0,
      overall:0,
      show: false,
    },
    modification:false
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
        let keepname =  'packetImg/'+time + '.' + fileExt;
        wx.cloud.uploadFile({
          cloudPath: keepname,
          filePath: tempFilePaths, // 文件路径
        }).then(res => {
          // get resource ID
          // console.log(res.fileID)
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
  //获取名字
  getName(e) {
    const that = this;
    that.setData({
      ['form.name']: e.detail.value
    })
  },
  //获取金额
  getNum(e) {
    const that = this;
    that.setData({
      ['form.num']: e.detail.value
    })
  },
  //领数人数
  getSum(e) {
    const that = this;
    that.setData({
      ['form.sum']: e.detail.value
    })
  },
  //获取总数
  getOverall(e) {
    const that = this;
    that.setData({
      ['form.overall']: e.detail.value
    })
  },

  //提交
  btn() {
    const that = this;
    const form = that.data.form;

    if (form.img != ''&&form.author != '') {
      if (that.data.modification) {
        wx.showLoading({
          title: '加载中...',
        })
        db.collection('packet').doc(that.data.form._id).update({
          data: {
            img: that.data.form.img,
            uploadImg:that.data.form.uploadImg,
            name: that.data.form.name,
            num: that.data.form.num,
            sum:  that.data.form.sum,
            overall: that.data.form.overall,
            show:  that.data.form.show,
            date: new Date()
          }

        })
        .then(res => {
          console.log(88)
          wx.switchTab({
            url: '/pages/award/award'
          })
          wx.hideLoading()

        })
      } else {
        db.collection('packet').add({
          data: {
            img: that.data.form.img,
            uploadImg:that.data.form.uploadImg,
            name: that.data.form.name,
            num: that.data.form.num,
            sum:  that.data.form.sum,
            overall: that.data.form.overall,
            show:  that.data.form.show,
            date: new Date()
          }
        }).then(res => {
          console.log(99)
          wx.switchTab({
            url: '/pages/award/award'
          })
          wx.hideLoading()

        })
       
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
      db.collection('packet').doc(options.id).get().then(res => {
        console.log(res)
        wx.hideLoading()
        that.setData({
          form: res.data,
          modification: true
        })
        
       
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