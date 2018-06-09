// pages/mine/register/register.js
Page({
  data:{
    password:"",
    // password_l:'password',
    open:'hide',
    close:'show',
    value:'',
  },
  getRegister:function(e){
    var that= this;
    if(e.detail.value.password==''){
        wx.showToast({
          title: '请填写由数字字母下划线组成的6-15位密码',
          icon: 'loading',
          duration: 2000
        })
        return;
    }
    var reg = /^[a-zA-Z0-9_]{6,15}$/; 
    if(!reg.test(e.detail.value.password)){
        wx.showToast({
          title: '请填写由数字字母下划线组成的6-15位密码',
          icon: 'loading',
          duration: 2000
        })
        return;
    }
    wx.request({
      url: wx.getStorageSync('host')+'/sysuser!resetPassword.jhtml',
      data: {
        userType:'2',
        key:wx.getStorageSync('uidKey'),
        password:e.detail.value.password
      },
      method: 'POST', 
      header: {
            'content-type':'application/x-www-form-urlencoded'
      },
      success: function(res){
          wx.showToast({
              title: res.data.data,
              icon: 'loading',
              duration: 2000,
              success:function(){
                setTimeout(function(){
                  wx.redirectTo({
                    url: '../login/login'
                  })
                },2000)
              }
          })
      }
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
  getvalue:function(e){
    this.setData({
      blurvalue:e.detail.value,
    })
  },
  clearInput:function(){
    this.setData({
      value:'',
      show:'hide'
    })
  }
})