var util = require('utils/util.js');
var that;
//app.js
App({
  onLaunch: function() {
    that = this;
    that.globalData.uid = wx.getStorageSync('uid');
    util.log('local uid:' + that.globalData.uid);
    // 登录
    wx.login({
      success: res => {
        util.requestApi(`/api/login/${res.code}`, {}).then((data) => {
          util.log('login result', data);
          if (data.data && data.data.uid) {
            that.globalData.uid = data.data.uid;
            if (that.globalData.loginListener != null) {
              that.globalData.loginListener(data.data.uid);
            }
            try {
              wx.setStorageSync('uid', data.data.uid)
            } catch (e) {}
          }
        }, (error) => {})
      }
    })
  },
  globalData: {
    userInfo: null,
    uid: null,
    loginListener: null
  }
})