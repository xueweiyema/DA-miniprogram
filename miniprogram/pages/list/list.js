// miniprogram/pages/list/list.js
const dayMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
Page({

  /**
   * Page initial data
   */
  data: {
    weekWeather: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    this.getWeekWeather()
  },

  getWeekWeather(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data: {
        time: new Date().getTime(),
        city: '广州市'
      },
      success: res => {
        let result = res.data.result
        this.setWeekWeather(result)
      },
      complete: () => {
        callback && callback()
      }
    })
  },

  setWeekWeather(result) {
    let weekWeather = []
    for (let i = 0; i < 7; i++) {
      let date = new Date()
      date.setDate(date.getDate() + i)
      weekWeather.push({
        day: dayMap[date.getDay()],
        date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
        temp: `${result[i].minTemp}°-${result[i].maxTemp}°`,
        iconPath: '../../images/' + result[i].weather + '-icon.png'
      })
    }
    weekWeather[0].day = '今天'
    this.setData({
      weekWeather
    })
  },


  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {
    this.getWeekWeather(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {

  }
})