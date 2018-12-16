var Moment = require("../../utils/moment.js");
var DATE_LIST = [];
var DATE_YEAR = new Date().getFullYear();
var DATE_MONTH = new Date().getMonth() + 1;
var DATE_DAY = new Date().getDate();
const app_id = '';
const secret_id = '';
var _id = ''
var mSs = new Array("茂盛围", "横琴", "拱北");
var mTs = new Array("一队", "二队", "三队", "四队", "五队", "六队", "七队", "八队");
var mS = "0";
var mT = "0";
var currentdate = new Date();
var mDuties = new Array("未知", "休息", " 通宵", "早班", "中班", "晚班", "早晚", "下通宵");
var addFlag = false;
Page({
  data: {
    Authorizedlogin: '',
    openid: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    section: mSs[mS] + mTs[mT],
    mDuty: mDuties[0],
    mDutyTeam: '未知',
    maxMonth: 7, //最多渲染月数
    dateList: [],
    systemInfo: {},
    weekStr: ['日', '一', '二', '三', '四', '五', '六'],
    checkInDate: Moment(new Date()).format('YYYY-MM-DD'),
    checkOutDate: Moment(new Date()).add(1, 'day').format('YYYY-MM-DD'),
    markcheckInDate: false, //标记开始时间是否已经选择
    markcheckOutDate: false, //标记结束时间是否已经选择
    sFtv: [{
        month: 1,
        day: 1,
        name: "元旦"
      },
      {
        month: 2,
        day: 14,
        name: "情人节"
      },
      {
        month: 3,
        day: 8,
        name: "妇女节"
      },
      {
        month: 3,
        day: 12,
        name: "植树节"
      },
      {
        month: 3,
        day: 15,
        name: "消费者权益日"
      },
      {
        month: 4,
        day: 1,
        name: "愚人节"
      },
      {
        month: 5,
        day: 1,
        name: "劳动节"
      },
      {
        month: 5,
        day: 4,
        name: "青年节"
      },
      {
        month: 5,
        day: 12,
        name: "护士节"
      },
      {
        month: 6,
        day: 1,
        name: "儿童节"
      },
      {
        month: 7,
        day: 1,
        name: "建党节"
      },
      {
        month: 8,
        day: 1,
        name: "建军节"
      },
      {
        month: 9,
        day: 10,
        name: "教师节"
      },
      {
        month: 9,
        day: 28,
        name: "孔子诞辰"
      },
      {
        month: 10,
        day: 1,
        name: "国庆节"
      },
      {
        month: 10,
        day: 6,
        name: "老人节"
      },
      {
        month: 10,
        day: 24,
        name: "联合国日"
      },
      {
        month: 12,
        day: 24,
        name: "平安夜"
      },
      {
        month: 12,
        day: 25,
        name: "圣诞节"
      }
    ]
  },
  open: function() {
    var mythis = this
    wx.showActionSheet({
      itemList: ['茂盛围', '横琴', '拱北'],
      success: function(res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
          mS = res.tapIndex.toString()
          var teamItemList = []
          switch (mS) {
            case "0":
              teamItemList = mTs.slice(0, 5)
              break;
            case "1":
              teamItemList = mTs.slice(0, 5)
              break;
            case "2":
              teamItemList = mTs.slice(0, 4)
              break;
          }
          wx.showActionSheet({
            itemList: teamItemList,
            success: function(res) {
              if (!res.cancel) {
                console.log(res.tapIndex)
                mT = res.tapIndex.toString()
                console.log(currentdate)
                mythis.uuresult(currentdate)
                mythis.onUpdate()
              }
            }
          });
        }
      }
    });
  },
  onAdd: function() {
    console.log('begin add')
    const db = wx.cloud.database()
    db.collection('user_department').add({
      data: {
        mS: mS,
        mT: mT
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id

        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        _id = res._id
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  onUpdate: function() {
    console.log('begin udpate')
    const db = wx.cloud.database()
    db.collection('user_department').doc(_id).update({
      data: {
        mS: mS,
        mT: mT
      },
      success: res => {
        //update dutyinfo
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },

  onQuery: function() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('user_department').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          queryResult: JSON.stringify(res.data, null, 2)
        })
        console.log('[数据库] [查询记录] 成功: ', res.data[0].mS)
        _id = res.data[0]._id
        mS = res.data[0].mS
        mT = res.data[0].mT
        if (JSON.stringify(res.data, null, 2) == '[]') {
          this.onAdd()
        } else {}
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  uuresult: function(d) {
    this.setData({
      section: mSs[mS] + mTs[mT],
      mDuty: this.getDuty(d),
      mDutyTeam: this.getDutyTeam(d)
    });
  },

  getDuty: function(d) {
    var mDuty = mDuties[0];
    var subtraction = '0';
    switch (mS) {
      case "0":
        subtraction = this.datebetween(d, 5);
        // 茂盛围
        switch (mT) {
          case "0":
            // 1队
            switch (subtraction) {
              case 0:
                mDuty = mDuties[5]; // 晚班
                break;
              case 1:
                mDuty = mDuties[4]; // 中班
                break;
              case 2:
                mDuty = mDuties[3]; // 早班
                break;
              case 3:
                mDuty = mDuties[7]; // 下通宵
                break;
              case 4:
                mDuty = mDuties[1]; // 休息
                break;
              default:
                break;
            }

            break;
          case "1":
            // 2队
            switch (subtraction) {
              case 0:
                mDuty = mDuties[3]; // 早班
                break;
              case 1:
                mDuty = mDuties[7]; // 下通宵
                break;
              case 2:
                mDuty = mDuties[1]; // 休息
                break;
              case 3:
                mDuty = mDuties[5]; // 晚班
                break;
              case 4:
                mDuty = mDuties[4]; // 中班
                break;
              default:
                break;
            }
            break;
          case "2":
            // 3队
            switch (subtraction) {
              case 0:
                mDuty = mDuties[7]; // 下通宵
                break;
              case 1:
                mDuty = mDuties[1]; // 休息
                break;
              case 2:
                mDuty = mDuties[5]; // 晚班
                break;
              case 3:
                mDuty = mDuties[4]; // 中班
                break;
              case 4:
                mDuty = mDuties[3]; // 早班
                break;
              default:
                break;
            }
            break;
          case "3":
            // 4队
            switch (subtraction) {
              case 0:
                mDuty = mDuties[4]; // 中班
                break;
              case 1:
                mDuty = mDuties[3]; // 早班
                break;
              case 2:
                mDuty = mDuties[7]; // 下通宵
                break;
              case 3:
                mDuty = mDuties[1]; // 休息
                break;
              case 4:
                mDuty = mDuties[5]; // 晚班
                break;
              default:
                break;
            }
            break;
          case "4":
            // 5队
            switch (subtraction) {
              case 0:
                mDuty = mDuties[1]; // 休息
                break;
              case 1:
                mDuty = mDuties[5]; // 晚班
                break;
              case 2:
                mDuty = mDuties[4]; // 中班
                break;
              case 3:
                mDuty = mDuties[3]; // 早班
                break;
              case 4:
                mDuty = mDuties[7]; // 下通宵
                break;
              default:
                break;
            }
            break;
          default:
            break;
        }
        break;

      case "1":
        subtraction = this.datebetween(d, 5);
        // Log.i(TAG, "subtraction==" + subtraction);
        // 横琴
        switch (mT) {
          case "0":
            // 1队
            switch (subtraction) {
              case 0:
                mDuty = mDuties[1]; // 休息
                break;
              case 1:
                mDuty = mDuties[4]; // 中班
                break;
              case 2:
                mDuty = mDuties[3]; // 早班
                break;
              case 3:
                mDuty = mDuties[5]; // 晚班
                break;
              case 4:
                mDuty = mDuties[7]; // 下通宵
                break;
              default:
                break;
            }
            break;
          case "1":
            // 2队
            switch (subtraction) {
              case 0:
                mDuty = mDuties[3]; // 早班
                break;
              case 1:
                mDuty = mDuties[5]; // 晚班
                break;
              case 2:
                mDuty = mDuties[7]; // 下通宵
                break;
              case 3:
                mDuty = mDuties[1]; // 休息
                break;
              case 4:
                mDuty = mDuties[4]; // 中班
                break;
              default:
                break;
            }
            break;
          case "2":
            // 3队
            switch (subtraction) {
              case 0:
                mDuty = mDuties[7]; // 下通宵
                break;
              case 1:
                mDuty = mDuties[1]; // 休息
                break;
              case 2:
                mDuty = mDuties[4]; // 中班
                break;
              case 3:
                mDuty = mDuties[3]; // 早班
                break;
              case 4:
                mDuty = mDuties[5]; // 晚班
                break;
              default:
                break;
            }
            break;
          case "3":
            // 4队
            switch (subtraction) {
              case 0:
                mDuty = mDuties[4]; // 中班
                break;
              case 1:
                mDuty = mDuties[3]; // 早班
                break;
              case 2:
                mDuty = mDuties[5]; // 晚班
                break;
              case 3:
                mDuty = mDuties[7]; // 下通宵
                break;
              case 4:
                mDuty = mDuties[1]; // 休息
                break;
              default:
                break;
            }
            break;
          case "4":
            // 5队
            switch (subtraction) {
              case 0:
                mDuty = mDuties[5]; // 晚班
                break;
              case 1:
                mDuty = mDuties[7]; // 下通宵
                break;
              case 2:
                mDuty = mDuties[1]; // 休息
                break;
              case 3:
                mDuty = mDuties[4]; // 中班
                break;
              case 4:
                mDuty = mDuties[3]; // 早班
                break;
              default:
                break;
            }
            break;

          default:
            break;
        }
        break;
      case "2":
        subtraction = this.datebetween(d, 4);
        //拱北
        switch (mT) {
          case "0":
          case "5":
            // 1队和6队
            switch (subtraction) {
              case 0:
                mDuty = mDuties[3]; // 早班
                break;
              case 1:
                mDuty = mDuties[1]; // 休息
                break;
              case 2:
                mDuty = mDuties[5]; // 晚班
                break;
              case 3:
                mDuty = mDuties[4]; // 中班
                break;
              default:
                break;
            }
            break;
          case "1":
          case "6":
            // 2队和7队
            switch (subtraction) {
              case 0:
                mDuty = mDuties[5]; // 晚班
                break;
              case 1:
                mDuty = mDuties[4]; // 中班
                break;
              case 2:
                mDuty = mDuties[3]; // 早班
                break;
              case 3:
                mDuty = mDuties[1]; // 休息
                break;
              default:
                break;
            }
            break;
          case "2":
          case "7":
            // 3队和8队
            switch (subtraction) {
              case 0:
                mDuty = mDuties[1]; // 休息
                break;
              case 1:
                mDuty = mDuties[5]; // 晚班
                break;
              case 2:
                mDuty = mDuties[4]; // 中班
                break;
              case 3:
                mDuty = mDuties[3]; // 早班
                break;
              default:
                break;
            }
            break;
          case "3":
          case "4":
            // 4队和5队
            switch (subtraction) {
              case 0:
                mDuty = mDuties[4]; // 中班
                break;
              case 1:
                mDuty = mDuties[3]; // 早班
                break;
              case 2:
                mDuty = mDuties[1]; // 休息
                break;
              case 3:
                mDuty = mDuties[5]; // 晚班
                break;
              default:
                break;
            }
            break;
          default:
            break;
        }
      default:
        break;
    }
    return mDuty;
  },

  //计算今日执勤队
  getDutyTeam: function(d) {
    var subtraction = 0
    switch (mS) {
      //茂盛围
      case '0':
        {
          subtraction = this.datebetween(d, 5);

          switch (subtraction) {
            case 0:
              return "夜:3 早:2 中:4 晚:1";
            case 1:
              return "夜:2 早:4 中:1 晚:5";
            case 2:
              return "夜:4 早:1 中:5 晚:3";
            case 3:
              return "夜:1 早:5 中:3 晚:2";
            case 4:
              return "夜:5 早:3 中:2 晚:4";
          }
        }
        //横琴
      case '1':
        {
          subtraction = this.datebetween(d, 5);

          switch (subtraction) {
            case 0:
              return "夜:3 早:2 中:4 晚:5";
            case 1:
              return "夜:5 早:4 中:1 晚:2";
            case 2:
              return "夜:2 早:1 中:3 晚:4";
            case 3:
              return "夜:4 早:3 中:5 晚:1";
            case 4:
              return "夜:1 早:5 中:2 晚:3";
          }
        }
        //拱北
      case '2':
        {
          subtraction = this.datebetween(d, 4);
          switch (subtraction) {
            case 0:
              return "1/4/2";
            case 1:
              return "4/2/3";
            case 2:
              return "2/3/1";
            case 3:
              return "3/1/4";
          }
        }
    }
    return "0";
  },

  datebetween: function(d, i) {
    var days = 0;
    var beginDate = '2011-10-30';
    var array = beginDate.split("-");
    var beginTime = new Date(parseInt(array[0]),
      parseInt(array[1]) - 1, parseInt(array[2]));
    var dtime = new Date(parseInt(d.getFullYear()), parseInt(d
      .getMonth()), parseInt(d.getDate()));
    days = (Number(dtime) - Number(beginTime)) / (1000 * 60 * 60 * 24);

    if (days % i < 0) {
      return days % i + i;
    } else {
      return days % i;
    }
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.createDateListData();
    var _this = this;
    // 页面初始化 options为页面跳转所带来的参数

    var checkInDate = options.checkInDate ? options.checkInDate : Moment(new Date()).format('YYYY-MM-DD');
    var checkOutDate = options.checkOutDate ? options.checkOutDate : Moment(new Date()).add(1, 'day').format('YYYY-MM-DD');
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          systemInfo: res,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate
        });
      }
    })
    var currentdate = new Date();
    this.uuresult(currentdate);

    var mythis = this
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    wx.login({
      success(res) {
        if (res.code) {
          var c = res.code
          // 发起网络请求
          wx.request({
            method: 'GET',
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + app_id + '&secret=' + secret_id + '&js_code=' + c + '&grant_type=authorization_code',
            success(res) {
              console.log(res.data.openid)
              mythis.setData({
                openid: res.data.openid
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
              // this.setData({
              //   queryResult: JSON.stringify(res.data, null, 2)
              // })
              wx.showToast({
                title: '已授权',
                icon: 'success',
                duration: 2000
              })
              mythis.onQuery()
            }
          })
        } else {
          console.log('no')
          mythis.setData({
            Authorizedlogin: '登录授权'
          })
        }
      }
    })
  },


  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo == undefined) {
      this.setData({
        Authorizedlogin: '登录授权'
      })
    } else {
      wx.showToast({
        title: '已授权',
        icon: 'success',
        duration: 2000
      })
      this.setData({
        Authorizedlogin: ''
      })
    }
  },

  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {},
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },

  //选择的入住与离店时间段

  createDateListData: function() {
    var dateList = [];
    var now = new Date();
    /*
      设置日期为 年-月-01,否则可能会出现跨月的问题
      比如：2017-01-31为now ,月份直接+1（now.setMonth(now.getMonth()+1)），则会直接跳到跳到2017-03-03月份.
        原因是由于2月份没有31号，顺推下去变成了了03-03
    */
    now = new Date(now.getFullYear(), now.getMonth(), 1);
    for (var i = 0; i < this.data.maxMonth; i++) {
      var momentDate = Moment(now).add(this.data.maxMonth - (this.data.maxMonth - i), 'month').date;
      var year = momentDate.getFullYear();
      var month = momentDate.getMonth() + 1;

      var days = [];
      var totalDay = this.getTotalDayByMonth(year, month);
      var week = this.getWeek(year, month, 1);
      //-week是为了使当月第一天的日期可以正确的显示到对应的周几位置上，比如星期三(week = 2)，
      //则当月的1号是从列的第三个位置开始渲染的，前面会占用-2，-1，0的位置,从1开正常渲染
      for (var j = -week + 1; j <= totalDay; j++) {
        var tempWeek = -1;
        if (j > 0)
          tempWeek = this.getWeek(year, month, j);
        var clazz = '';
        if (tempWeek == 0 || tempWeek == 6)
          clazz = 'week'
        if (j < DATE_DAY && year == DATE_YEAR && month == DATE_MONTH)
          //当天之前的日期不可用
          clazz = 'unavailable ' + clazz;
        else
          clazz = '' + clazz
        days.push({
          day: j,
          class: clazz
        })
      }
      var dateItem = {
        id: year + '-' + month,
        year: year,
        month: month,
        days: days
      }

      dateList.push(dateItem);
    }
    var sFtv = this.data.sFtv;
    for (let i = 0; i < dateList.length; i++) { //加入公历节日
      for (let k = 0; k < sFtv.length; k++) {
        if (dateList[i].month == sFtv[k].month) {
          let days = dateList[i].days;
          for (let j = 0; j < days.length; j++) {
            if (days[j].day == sFtv[k].day) {
              days[j].daytext = sFtv[k].name
            }
          }
        }
      }
    }
    this.setData({
      dateList: dateList
    });
    DATE_LIST = dateList;
  },

  /*
   * 获取月的总天数
   */
  getTotalDayByMonth: function(year, month) {
    month = parseInt(month, 10);
    var d = new Date(year, month, 0);
    return d.getDate();
  },
  /*
   * 获取月的第一天是星期几
   */
  getWeek: function(year, month, day) {
    var d = new Date(year, month - 1, day);
    return d.getDay();
  },
  /**
   * 点击日期事件
   */
  onPressDate: function(e) {
    var {
      year,
      month,
      day
    } = e.currentTarget.dataset;
    //当前选择的日期为同一个月并小于今天，或者点击了空白处（即day<0），不执行
    // if ((day < DATE_DAY && month == DATE_MONTH) || day <= 0) return;

    var tempMonth = month;
    var tempDay = day;

    if (month < 10) tempMonth = '0' + month
    if (day < 10) tempDay = '0' + day

    var date = year + '-' + tempMonth + '-' + tempDay;

    //如果点击选择的日期A小于入住时间，则重新渲染入住时间为A
    // if ((this.data.markcheckInDate && Moment(date).before(this.data.checkInDate) || this.data.checkInDate === date)) {
    //   this.setData({
    //     markcheckInDate: false,
    //     markcheckOutDate: false,
    //     dateList: DATE_LIST.concat()
    //   });
    // };
    this.setData({
      markcheckInDate: false,
      markcheckOutDate: false,
      dateList: DATE_LIST.concat()
    });
    var oDate1 = new Date(date);
    console.log(oDate1)
    currentdate = oDate1
    this.uuresult(oDate1)
    if (!this.data.markcheckInDate) {
      this.setData({
        checkInDate: date,
        markcheckInDate: true,
        dateList: DATE_LIST.concat()
      });
    } else if (!this.data.markcheckOutDate) {
      this.setData({
        checkOutDate: date,
        markcheckOutDate: true,
      });
      //设缓存，返回页面时，可在onShow时获取缓存起来的日期
      wx.setStorage({
        key: 'ROOM_SOURCE_DATE',
        data: {
          checkInDate: this.data.checkInDate,
          checkOutDate: this.data.checkOutDate
        }
      });
      wx.navigateBack({
        delta: 1, // 回退前 delta(默认为1) 页面
      });
    }

    this.renderPressStyle(year, month, day);
  },
  renderPressStyle: function(year, month, day) {
    var dateList = this.data.dateList;
    //渲染点击样式
    for (var i = 0; i < dateList.length; i++) {
      var dateItem = dateList[i];
      var id = dateItem.id;
      if (id === year + '-' + month) {
        var days = dateItem.days;
        for (var j = 0; j < days.length; j++) {
          var tempDay = days[j].day;
          if (tempDay == day) {
            days[j].class = days[j].class + ' active';
            days[j].inday = true;
            break;
          }
        }
        break;
      }
    }
    this.setData({
      dateList: dateList
    });
  }
})