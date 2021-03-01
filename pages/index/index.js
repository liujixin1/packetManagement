// pages/index/index.js
const db = wx.cloud.database();
const time = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    isEnd: false,
    page: 0,
    model: '',
    modelId: ''
  },

  delete(e) {
    const that = this;
    console.log(e)
    wx.showModal({
      content: '是否删除该条数据？',
      success(res) {
        wx.showLoading({
          title: '删除中...',
        })
        if (res.confirm) {
          console.log()
          db.collection('idiom').doc(e.currentTarget.dataset.id).remove()
            .then(res => {
              wx.hideLoading()
              console.log(res)
              that.getData(that.data.navid)
            })
            .catch(console.error)
        } else if (res.cancel) {
          wx.hideLoading()
          console.log('用户点击取消')
        }
      }
    })

  },
  //切换审核状态
  switchShowChange(e) {
    const that = this;
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('model').doc(that.data.modelId).update({
        data: {
          bool: e.detail.value
        }
      })
      .then(res => {
        if (res.stats.updated == 1) {
          wx.showToast({
            icon: 'success',
            title: '切换成功'
          })
        }
        wx.hideLoading()

      })
  },
  getData() {
    const that = this;
    const PAGE = 15;
    let page = that.data.page;

    db.collection('idiom').skip(page * PAGE).limit(PAGE).orderBy('date', 'desc').get().then(res => {
      res.data.forEach((data, index) => {
        data.index = index + 1;
      })
      that.setData({
        listData: res.data
      })
      wx.hideLoading()
    })
  },
  load() {
    const that = this;

    if (!that.data.isEnd) {
      wx.showLoading({
        title: '加载中...',
      })
    }
    let page = that.data.page;
    page++;
    const PAGE = 15;

    db.collection('idiom').skip(page * PAGE).limit(PAGE).orderBy('date', 'desc').get().then(res => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
      if (res.data.length == 0) {
        that.setData({
          isEnd: true
        })
      } else {
        const listData = that.data.listData;
        let pageIndex = page * 15;
        res.data.forEach((res, index) => {
          res.index = pageIndex + index + 1;
          listData.push(res)
        })
        that.setData({
          page,
          listData
        })
      }

      wx.hideLoading()
    })


  },
  //点击新增
  addData(e) {
    const that = this;
    let id = e.currentTarget.dataset.id;
    if (id) {
      wx.navigateTo({
        url: `/pages/addList/addList?id=${id}`
      })
    } else {
      wx.navigateTo({
        url: `/pages/addList/addList`
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    db.collection('model').get().then(res => {
      console.log(res, 9999)
      that.setData({
        model: res.data[0].bool,
        modelId: res.data[0]._id
      })
    })

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
    const that = this;
    that.getData()
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
    const that = this;
    that.load()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})