// pages/mine/login/login.js
Page({
  data:{
    userName:"",
    open:'hide',
    close:'show',
    value:'',
    show:'hide', 
  },
  onLoad:function(options){
    this.setData({
       value:wx.getStorageSync('restpassword'),
       show:'show'
    })
  },
  inputUser:function(e){
    this.setData({
      show:'show'
    })
  },
  getRegister:function(){
    wx.navigateTo({
        url: '../register/register'
     })
  },
  getvalue:function(e){
    this.setData({
      blurvalue:e.detail.value,
    })
  },
  getUserInfo:function(e){
    wx.setStorageSync('host', 'https://www.dianjiang99.com')
    if(e.detail.value.userName==''){
        wx.showToast({
          title: '请输入电话号码',
          icon: 'loading',
          duration: 2000
        })
        return;
    }
    if(!(/^1[34578]\d{9}$/.test(e.detail.value.userName))){
        wx.showToast({
          title: '请输入正确的电话号码',
          icon: 'loading',
          duration: 2000
        })  
        return;     
    }
    if(e.detail.value.password!=''){
      wx.request({
          url: wx.getStorageSync('host')+'/logon!login.jhtml',
          data: {
            'userName':e.detail.value.userName,//  15103585135  18963421568
            'password':e.detail.value.password,
            'userType': '2'
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type':'application/x-www-form-urlencoded'
          },
          success: function(res){
            if(res.data.success){
                wx.removeStorageSync('restpassword')
                wx.setStorageSync('userId',res.data.data.id);
                wx.setStorageSync('username',res.data.data.userName);
                wx.setStorageSync('relationId',res.data.data.relationId);
                var getUrl = wx.getStorageSync('getUrl');
                if(getUrl=='echo/echo'){
                  wx.redirectTo({
                    url: '../index/echo/echo'
                  })
                }else if(getUrl=='mine/mine'){
                  wx.switchTab({
                    url: '../mine/mine'
                  })
                }else{
                   wx.redirectTo({
                    url: '../index/djt/invent'
                  })
                }
            }else{
              var data = res.data.data;
              wx.showToast({
                  title: data,
                  icon: 'loading',
                  duration: 2000
              })
            }
          }
      })
    }else{
        wx.showToast({
          title: '请填写由数字字母下划线组成的6-15位密码',
          icon: 'loading',
          duration: 2000
        }) 
        return;
    }
  },
  goRegister:function(){
      wx.redirectTo({
          url: '/register/register'
      })
  },
  aboutEye:function(){
    if(this.data.close=='show'){
      this.setData({
        open:'show',
        close:'hide'
      })
    }else{
      this.setData({
        open:'hide',
        close:'show'
      })
    }
  },
  clearInput:function(){
    this.setData({
      value:'',
      show:'hide'
    })
  },
  forgetpassword:function(){
    wx.navigateTo({
      url: '../forgetpassword/forgetpassword'
    })
  }
})
