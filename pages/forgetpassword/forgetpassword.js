// pages/mine/register/register.js
Page({
  data:{
    mobileNo:"",
    value:'',
    show:'hide',
    tips:'',
    get_num:'show',
    got_num:'hide',
    num:60,
    verifycode:'',
    uidKey:'',
    enougth11:''
  },
  verifycode:function(e){
    var that = this;
    that.setData({
      mobileNo:e.detail.value.mobileNo
    })
    wx.setStorageSync('host', 'https://www.dianjiang99.com')
    if(e.detail.value.mobileNo==''){
        wx.showToast({
          title: '请填写正确的手机号码',
          icon: 'loading',
          duration: 2000
        })
    }
    if(!(/^1[34578]\d{9}$/.test(e.detail.value.mobileNo))){
        wx.showToast({
          title: '请输入正确的电话号码',
          icon: 'loading',
          duration: 2000
        })
    }else{
      wx.request({
          url: wx.getStorageSync('host')+'/sysdxcode!loadDxCode.jhtml',
          data: {
            smsType:'2',
            mobileNo:e.detail.value.mobileNo,
            userType:'2'
          },
          method: 'POST',
          header: {
            'content-type':'application/x-www-form-urlencoded'
          },
          success: function(res){
            if(res.data.success){
              wx.showToast({
                title: '已发送请查收',
                icon: 'loading',
                duration: 2000
              })
              var num = 60
              var timeI =setInterval(function(){
                num = num-1;
                if(num ==0){
                  clearInterval(timeI);
                  that.setData({
                    get_num:'show',
                    got_num:'hide',
                    num:60,
                  })
                }else{
                  wx.setStorageSync('uidKey', res.data.data.uidKey)
                  that.setData({
                    get_num:'hide',
                    got_num:'show',
                    num:num,
                    verifycode:res.data.data.verifyCode,
                    uidKey:res.data.data.uidKey
                  })
                }
              },1000)
            }else{
              wx.showToast({
                title: res.data.data,
                icon: 'loading',
                duration: 2000
              })
            }
          }
      })
    }
    // if(e.detail.value.verifycode)
  },
  getRegister:function(e){
    var that= this;
    if(e.detail.value.mobileNo==''){
       wx.showToast({
          title: '请填写正确的手机号码',
          icon: 'loading',
          duration: 2000
        })
        return;
    }else if(!(/^1[34578]\d{9}$/.test(e.detail.value.mobileNo))){
        wx.showToast({
          title: '请输入正确的电话号码',
          icon: 'loading',
          duration: 2000
        })
        return;
    }
    if(e.detail.value.mobileNo!=that.data.mobileNo){
        wx.request({
          url: wx.getStorageSync('host')+'/sysdxcode!loadDxCode.jhtml',
          data: {
            smsType:'2',
            mobileNo:e.detail.value.mobileNo,
            userType:'2'
          },
          method: 'POST',
          header: {
            'content-type':'application/x-www-form-urlencoded'
          },
          success: function(res){
            if(!res.data.success){
              wx.showToast({
                title: res.data.data,
                icon: 'loading',
                duration: 2000
              })
            }else{
              wx.showToast({
                title: '验证码有误或过期',
                icon: 'loading',
                duration: 2000
              })
            }
          }
      })
      return;
    }
    if(e.detail.value.verifycode==''){
        wx.showToast({
          title: '验证码不能为空',
          icon: 'loading',
          duration: 2000
        })
        return
    }else if(e.detail.value.verifycode!=that.data.verifycode){
        wx.showToast({
          title: '验证码有误或过期',
          icon: 'loading',
          duration: 2000
        })
        return;
    }
    wx.setStorageSync('restpassword', e.detail.value.mobileNo)
    wx.request({
      url: wx.getStorageSync('host')+'/sysdxcode!checkDxCode.jhtml',
      data: {
        verifyCode:that.data.verifycode,
        key:that.data.uidKey
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
            'content-type':'application/x-www-form-urlencoded'
          },
      success: function(res){
        // success
        console.log(res)
        if(res.data.success){
          wx.navigateTo({
            url: '../resetpassword/resetpassword'
          })
        }else{
          wx.showToast({
            title:res.data.data,
            icon: 'loading',
            duration: 2000
          })
        }
      }
    })

  },
  clearInput:function(){
    this.setData({
      value:'',
      show:'hide',
      enougth11:'',
    })
  },
  inputUser:function(e){
      if(e.detail.value.length==11){
        this.setData({
            enougth11:'enougth11',
            show:'show'
        })
      }else{
        this.setData({
          enougth11:'',
          show:'show'
        })
      }
  }
})
