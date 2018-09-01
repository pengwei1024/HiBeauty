const debug = true;
const host = debug ? 'http://192.168.0.9/BeautifulGirl/index.php' : 'https://beauty.apkfuns.com';
const utilMd5 = require('md5.js');
const tokenCache = {
  time: 0,
  token: null
};

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const log = function() {
  if (debug) {
    console.log(arguments);
  }
}

function requestApi(path, data) {
  return new Promise(function(resolve, reject) {
    wx.showLoading({
      title: '请求中...',
    })
    wx.request({
      url: host + path,
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      complete: function(res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (res.data && res.data.code == 200) {
          resolve(res.data)
        } else {
          if (res.data && res.data.msg) {
            reject(res.data.msg);
          } else {
            reject('操作失败');
          }
        }
      }
    })
  });
}

function getDateDiff(dateTimeStamp) {
  var result = '';
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();
  var diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    return;
  }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  if (monthC >= 1) {
    result = "" + parseInt(monthC) + "月前";
  } else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else
    result = "刚刚";
  return result;
}

/**
 * 缓存和获取token
 */
function getToken(uid) {
  if (!uid) {
    return null;
  }
  var now = new Date().getTime();
  if (now - tokenCache.time <= 3600000 && tokenCache.token) {
    log('cache token', tokenCache.token);
    return tokenCache.token;
  }
  var minute = parseInt(new Date().getTime() / 60000);
  const hash_md5 = utilMd5.hexMD5('' + minute + uid);
  tokenCache.token = `${hash_md5}-${minute}`;
  tokenCache.time = now;
  return tokenCache.token;
}

module.exports = {
  formatTime: formatTime,
  log: log,
  requestApi: requestApi,
  getDateDiff: getDateDiff,
  getToken: getToken
}