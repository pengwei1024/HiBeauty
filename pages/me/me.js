// pages/me/me.js
var util = require('../../utils/util.js');
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync('userInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },
  getUserInfo: function (e) {
    if (!that.data.userInfo && e.detail.userInfo) {
      util.log('getUserInfo', e.detail.userInfo)
      that.setData({
        userInfo: e.detail.userInfo
      })
      try {
        wx.setStorageSync('userInfo', that.data.userInfo)
      } catch (e) {
      }
    }
  },
  commonClick: (e)=> {
    wx.navigateTo({
      url: e.currentTarget.dataset.path,
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: "快来一起看小姐姐",
      path: '/pages/index/index',
      imageUrl: '../images/bg-share.jpeg'
    }
  },
})