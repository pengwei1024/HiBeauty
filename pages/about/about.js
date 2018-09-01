// pages/about/about.js
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    article: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    WxParse.emojisInit('[]', "../../lib/wxParse/emojis/", {
      "00": "00.gif",
      "01": "01.gif",
      "02": "02.gif",
      "03": "03.gif",
      "04": "04.gif",
      "05": "05.gif",
      "06": "06.gif",
      "07": "07.gif",
      "08": "08.gif",
      "09": "09.gif",
      "09": "09.gif",
      "10": "10.gif",
      "11": "11.gif",
      "12": "12.gif",
      "13": "13.gif",
      "14": "14.gif",
      "15": "15.gif",
      "16": "16.gif",
      "17": "17.gif",
      "18": "18.gif",
      "19": "19.gif",
    });
    util.requestApi('/api/about', {}).then((data) => {
      util.log(data);
      WxParse.wxParse('article', 'html', data.data, that, 5);
    }, (error) => {
      wx.showToast({
        title: error,
        icon: 'none'
      })
    })
  }
})