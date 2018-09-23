// pages/index/index.js
var util = require('../../utils/util.js');
import SafeRenderUtil from '../../utils/SafeRenderUtil.js';
var that;
const app = getApp();
// 最大显示的记录数
const maxCount = 40;
var renderUtil;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    page: 0,
    imageWidth: 0,
    screenWidth: 0,
    author: null,
    setTitle: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.data.author = options.uid;
    renderUtil = new SafeRenderUtil({
      arrName: 'dataList',
      formatItem: (item) => {
        item.create_time = util.getDateDiff(item.create_time * 1000);
        item.thumbnail = item.images.map((item) => {
          return {
            url: item.replace('/large/', '/orj360/'),
            css: item.indexOf('.gif') > 0 ? 'gif' : ''
          };
        })
        item.share = item.thumbnail[0].url;
        return item
      },
      setData: this.setData.bind(this)
    });
    that.setData({
      screenWidth: wx.getSystemInfoSync().windowWidth,
      imageWidth: (wx.getSystemInfoSync().windowWidth - 2) / 3
    })
    that.onPullDownRefresh();
  },
  onPullDownRefresh: function () {
    that.data.page = 0;
    that.request(true);
  },
  onReachBottom: function () {
    that.data.page++;
    that.request(false);
  },
  request: (upward) => {
    util.requestApi(`/api/getGallery/${that.data.page}`, {
      uid: app.globalData.uid,
      author: that.data.author,
      token: util.getToken(app.globalData.uid) 
    }).then((data) => {
      if (!Array.isArray(data.data)) {
        return;
      }
      if (that.data.page == 0) {
        renderUtil.reset(data.data);
      } else {
        renderUtil.addList(data.data);
      }
      if (!that.data.setTitle) {
        wx.setNavigationBarTitle({
          title: that.data.dataList[0].name
        })
        that.data.setTitle = true;
      }
    }, (error) => {
      wx.showToast({
        title: error,
        icon: 'none'
      })
    });
  },
  imageClick: (e) => {
    util.log('imageClick', e);
    const index = e.currentTarget.dataset.index;
    const parent = e.currentTarget.dataset.parent;
    const data = that.data.dataList[parent].images;
    wx.previewImage({
      urls: data,
      current: data[index]
    })
  },
  onShareAppMessage: function (res) { 
    if (res.from == 'button') {
      var target = res.target.dataset;
      if (target && target.id) {
        var title = target.title || '唯美小姐姐';
        return {
          title: title,
          path: `/pages/index/index?start=${target.id}`,
          imageUrl: target.share
        }
      }
    }
  },
  addLikeClick: e => {
    const id = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;
    var entry = that.data.dataList[index];
    if (entry.liked) {
      return;
    }
    util.requestApi(`/api/add_like/${id}`, {}).then((data) => {
      var likeKey = `dataList[${index}].liked`;
      var likeNum = `dataList[${index}].like_num`;
      entry.like_num++;
      that.setData({
        [likeKey]: true,
        [likeNum]: entry.like_num
      })
    }, (error) => {
      util.log(error)
    });
  },
  headClick: (e) => {
  }
})