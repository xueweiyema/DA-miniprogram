// miniprogram/pages/newPage/newPage.js
const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

Page({

  /**
   * Page initial data
   */
  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherBackground: '',
    hourlyWeather: [],
    todayTemp:'',
    todayDate:''
  },

  /**
   * Lifecycle function--Called when page load
   */


  onLoad: function(options) {
    this.getNow()
  },

  setToday(result){
    let date=new Date()
    this.setData({
      todayTemp:`${result.today.minTemp}° - ${result.today.maxTemp}°`,
      todayDate:`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} 今天`
    })


  },

  setNow(result) {
    let temp = result.now.temp
    let weather = result.now.weather
    this.setData({
      nowTemp: temp + '°',
      nowWeather: weatherMap[weather],
      nowWeatherBackground: '../../images/' + weather + '-bg.png'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },
  setHourlyWeather(result) {
    let hourlyWeather = []
    let nowHour = new Date().getHours()

    let forecast = result.forecast
    for (let i = 0; i < 8; i += 1) {
      hourlyWeather.push({
        time: i * 3 + nowHour % 24 + '时',
        iconPath: '../../images/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + '°'
      })
    }
    hourlyWeather[0].time = '现在'
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },

  getNow(callback) {
    var myThis = this
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now', //仅为示例，并非真实的接口地址
      data: {
        city: '广州市'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        let result = res.data.result
        myThis.setNow(result)
        myThis.setHourlyWeather(result)
        myThis.setToday(result)

      },
      complete() {
        callback && callback()
        // wx.stopPullDownRefresh()
      }
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
    this.getNow(() => {
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

  },
  onTapDayWeather(){
    wx.showToast({
      title: 'hello',
    })
    wx.navigateTo({
      url: '../list/list',
    })
  }
})