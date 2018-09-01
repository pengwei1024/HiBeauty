/**
 * @module SafeRenderUtil
 */

/**
 * 安全渲染的工具类
 * 解决的问题：分页加载时，数组拼接起来在渲染，当数据超过 1M 后，无法再加载
 * @example
 * import SafeRenderUtil from '@xxx/lib/safeRenderUtil';
 * // 初始化
 * this.SafeRenderUtil = new SafeRenderUtil({
 *   arrName: 'arrName',
 *   formatItem: (item) => {
 *     //裁剪每一项的图片...
 *     return item;
 *   },
 *   setData: this.setData.bind(this)
 * });
 * // 将数组传递进来进行渲染
 * this.SafeRenderUtil.addList(res.data.data);
 */
class SafeRenderUtil {
  /**
   * @param {String} opts.arrName 数组名称
   * @param {Function} opts.formatItem 处理数组的每一个 item ，并将该 item 返回
   * @param {Function} opts.setData 调用页面的渲染方法
   */
  constructor(opts) {
    this.arrName = opts.arrName;
    this.formatItem = opts.formatItem;
    this.setData = opts.setData;
    this.originLen = 0; //原始数组长度
  }
  /**
   * @param {Array} arr 需要渲染的数组
   */
  addList(arr) {
    if (arr && arr.length) {
      let newList = {};
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        if (typeof(this.formatItem) === 'function') {
          item = this.formatItem(item);
        }
        newList[`${this.arrName}[${this.originLen}]`] = item;
        this.originLen += 1;
      };
      this.setData(newList);
    }
  }
  /**
   * 清空数组数据
   */
  clearArr() {
    this.setData({
      [`${this.arrName}`]: []
    });
    this.originLen = 0;
  }

  reset(arr) {
    this.originLen = arr.length;
    if (arr && arr.length) {
      for (let i = 0; i < arr.length; i++) {
        if (typeof(this.formatItem) === 'function') {
          arr[i] = this.formatItem(arr[i]);
        }
      };
      this.setData({
        [`${this.arrName}`]: arr
      });
    }
  }
}
module.exports = SafeRenderUtil;