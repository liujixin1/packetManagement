// pages/addVideo/addVideo.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    author: '请选择级别',
    answer: '请选择答案',
    form: {
      img: '',
      uploadImg: true,
      idiom: ['', '', '', ''],
      choose: [{
          text: '',
          bool: false
        },
        {
          text: '',
          bool: false
        },
        {
          text: '',
          bool: false
        },
        {
          text: '',
          bool: false
        },
      ],
      answer: null,
      author: '',
      show: false,
      sum: null
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

  //显示
  switchShowChange(e) {
    const that = this;
    that.setData({
      ['form.show']: e.detail.value
    })
  },
  getIdiom(e) {
    const that = this;
    let index = parseInt(e.currentTarget.dataset.inputid)
    let val = e.detail.value;
    that.setData({
      [`form.idiom[${index}]`]: val,
    })
  },
  getChoose(e) {
    const that = this;
    let index = parseInt(e.currentTarget.dataset.inputid)
    let val = e.detail.value;
    that.setData({
      [`form.choose[${index}].text`]: val,
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
        let keepname =  'idiomImg/'+time + '.' + fileExt;
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
    console.log(form,8888)
    if (form.img != '' && form.author != '') {
      if (that.data.modification) {
        wx.showLoading({
          title: '加载中...',
        })
        db.collection('idiom').doc(that.data.form._id).update({
            data: {
              img: that.data.form.img,
              uploadImg: that.data.form.uploadImg,
              idiom: that.data.form.idiom,
              choose: that.data.form.choose,
              answer: that.data.form.answer,
              author: that.data.form.author,
              show: that.data.form.show,
              sum: that.data.form.sum,
              date: new Date()
            }
          })
          .then(res => {
            console.log(88)
            wx.switchTab({
              url: '/pages/index/index'
            })
            wx.hideLoading()

          })
      } else {
        db.collection('idiom').add({
          data: {
            img: that.data.form.img,
            uploadImg: that.data.form.uploadImg,
            idiom: that.data.form.idiom,
            choose: that.data.form.choose,
            answer: that.data.form.answer,
            author: that.data.form.author,
            show: that.data.form.show,
            sum: that.data.form.sum,
            date: new Date()
          }
        }).then(res => {
          console.log(99)
          wx.switchTab({
            url: '/pages/index/index'
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
  //选择答案
  answer() {
    const that = this;
    that.data.form.choose.forEach((item,index) => {
      that.setData({
        [`form.choose[${index}].bool`]: false
      })
    })
    wx.showActionSheet({
      itemList: ['1', '2', '3', '4'],
      success(res) {
        let author = '';
        switch (res.tapIndex + 1) {
          case 1:
            that.setData({
              [`form.choose[${res.tapIndex}].bool`]: true,
              ['form.answer']: res.tapIndex + 1,
              answer: '1'
            })
            return;
          case 2:
            that.setData({
              [`form.choose[${res.tapIndex}].bool`]: true,
              ['form.answer']: res.tapIndex + 1,
              answer: '2'
            })
            return;
          case 3:
            that.setData({
              [`form.choose[${res.tapIndex}].bool`]: true,
              ['form.answer']: res.tapIndex + 1,
              answer: '3'
            })
            return;
          case 4:
            that.setData({
              [`form.choose[${res.tapIndex}].bool`]: true,
              ['form.answer']: res.tapIndex + 1,
              answer: '4'
            })
            return;
        }

      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  //选着分类
  opction() {
    const that = this;
    wx.showActionSheet({
      itemList: ['0-20', '20-25', '25-28', '>28'],
      success(res) {
        let author = '';
        switch (res.tapIndex + 1) {
          case 1:
            that.setData({
              ['form.author']: res.tapIndex + 1,
              author: '0-20'
            })
            return;
          case 2:
            that.setData({
              ['form.author']: res.tapIndex + 1,
              author: '20-25'
            })
            return;
          case 3:
            that.setData({
              ['form.author']: res.tapIndex + 1,
              author: '25-28'
            })
            return;
          case 4:
            that.setData({
              ['form.author']: res.tapIndex + 1,
              author: '>28'
            })
            return;
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.showLoading({
      title: '加载中...',
    })

    if (options.id) {
      db.collection('idiom').doc(options.id).get().then(res => {
        console.log(res)
        wx.hideLoading()
        that.setData({
          form: res.data,
          modification: true,
          answer:res.data.answer
        })

        switch (res.data.author) {
          case 1:
            that.setData({
              author: '0-20'
            })
            return;
          case 2:
            that.setData({
              author: '20-25'
            })
            return;
            case 3:
              that.setData({
                author: '25-28'
              })
              return;
              case 4:
                that.setData({
                  author: '>28'
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