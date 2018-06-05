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
  data: {
    nowTemp: 22,
    nowWeather: "Sunny",
    nowWeatherBG: "/images/sunny-bg.png",
    hourlyWeather: [1,2,3,4,5,6,7,8,9],
    todayTemp: '',
    todayDate: ''
  },
  onPullDownRefresh(){
    this.getNow(() => {
      wx.stopPullDownRefresh()
    })
  },
  onLoad(){
    this.getNow()
  },
  getNow(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now', 
      data: {
        city: '武汉市'
      },
      success: res => {
        console.log(res.data)
        let result = res.data.result
        //set now
        this.setNow(result)
        //set forecast
        this.setHourlyWeather(result)
        //get date
        this.setToday(result)
      },
      complete: () => {
        callback && callback()
        console.log("refresh done!")
      }
    })
  },
  setNow(result){
    let temp = result.now.temp
    let weather = result.now.weather
    console.log(temp, weather)
    this.setData({
      nowTemp: temp + '°',
      nowWeather: 　weatherMap[weather],
      nowWeatherBG: "/images/" + weather + "-bg.png"
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },
  setHourlyWeather(result){
    let forecast = result.forecast
    let hourlyWeather = []
    let nowHour = new Date().getHours()
    for (let i = 0; i < 24; i += 3) {
      hourlyWeather.push({
        time: (i + nowHour) % 24 + '时',
        iconPath: '/images/' + 　forecast[i / 3].weather + '-icon.png',
        temp: forecast[i / 3].temp
      })
    }
    hourlyWeather[0].time = '现在'
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },
  setToday(result){
    let date = new Date()
    this.setData({
      todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
      todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`
    })
  },
  onTapDayWeather(){
    wx.navigateTo({
      url: '/pages/list/list',
    })
  }
})