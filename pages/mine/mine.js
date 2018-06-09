Page({
  data:{
    list:'hide',
    login:'show',
    username:'',
    reallyName:''
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    console.log('页面监听加载')
    this.getName(wx.getStorageSync('host')+'/employer/employerinfo!loadData.jhtml')
  }, 
  onShow:function(){
    this.getName(wx.getStorageSync('host')+'/employer/employerinfo!loadData.jhtml')
  },
  getProlist:function(){
    wx.navigateTo({
      url: '../index/mypro/mypro'
    })  
  },
  callSer:function(){
    wx.makePhoneCall({
      phoneNumber: '4008192007',
    })
  },
  getLogin:function(){
    wx.setStorageSync('getUrl', 'mine/mine')
    // wx.redirectTo({
    //     url: '../login/login'
    // })
    wx.navigateTo({
      url: '../login/login'
    })
  },
  outLogin:function(){
    var userId= wx.getStorageSync('userId');
    var that = this;
    if(userId){
      wx.showModal({
        title: '提示',
        content: '确定退出登录?',
        success: function(res) {
          if (res.confirm) {
            wx.clearStorageSync()
            that.setData({
              list:'hide',
              login:'show',
              username:'',
              reallyName:''
            });
           wx.setStorageSync('host', 'https://www.dianjiang99.com')
          } else if (res.cancel) {
          }
        }
      })
    }
  },
  getName:function(url){
    var that = this;
    var userId= wx.getStorageSync('userId');
    var username= wx.getStorageSync('username');
    if(userId){
      wx.request({
        url: url,
        data: {
          'userId':wx.getStorageSync('userId')
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
            'content-type':'application/x-www-form-urlencoded'
        },
        success: function(res){
          that.setData({
            list:'show',
            login:'hide',
            username:username,
            reallyName:res.data.data.reallyName
          })
        }
      })
    }else{
      that.setData({
        list:'hide',
        login:'show',
        username:username
      })
    }
  },
  backFindjob:function(){
   wx.navigateToMiniProgram({
     appId:'wx93c0a7524b163f8d',
     path:''
   })
  }
})
