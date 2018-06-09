// pages/mine/register/register.js
Page({
  data:{
    open:'hide',
    close:'show',
    show:'hide',
    tips:'',
    get_num:'show',
    got_num:'hide',
    num:60,
    enougth11:''
  },
  getvalue:function(e){
    this.setData({
      blurvalue:e.detail.value,
    })
  },
  tiaokuan:function(){
    wx.navigateTo({
      url: '../clause/clause'
    })
  },
  verifycode:function(e){
    var that = this;
    wx.setStorageSync('host', 'https://www.dianjiang99.com')
    console.log(e)
    if(e.detail.value.mobileNo==''){
        wx.showToast({
          title: '请输入电话号码',
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
            smsType:'1',
            mobileNo:e.detail.value.mobileNo
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
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
          title: '请输入电话号码',
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
    console.log(1)
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
    if(e.detail.value.verifycode==''){
        wx.showToast({
          title: '请填写验证码',
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
    // if((e.detail.value.mobileNo&&(/^1[34578]\d{9}$/.test(e.detail.value.mobileNo)))&&(e.detail.value.password)&&(e.detail.value.verifycode==that.data.verifycode)
    // ){
    wx.request({
      url: wx.getStorageSync('host')+'/sysuser!registeredUser.jhtml',
      data: {
        userType:'2',
        verifyCode:e.detail.value.verifycode,
        key:that.data.uidKey,
        password:e.detail.value.password

      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
            'content-type':'application/x-www-form-urlencoded'
      },
      success: function(res){
        console.log(res.data)
        if(res.data.success){
          wx.showToast({
              title: '注册成功',
              icon: 'loading',
              duration: 2000,
              success:function(){
                wx.setStorageSync('userId',res.data.data.id);
                wx.setStorageSync('username',res.data.data.userName);
                wx.setStorageSync('relationId',res.data.data.relationId);
                var getUrl = wx.getStorageSync('getUrl')
                if(getUrl=='echo/echo'){
                  wx.redirectTo({
                  url: '../index/echo/echo'
                  })
                }else if(getUrl=='mine/mine'){
                  wx.switchTab({
                    url: '../mine/mine'
                  })
                }
              }
          })

        }
      }
    })
    //}
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
      show:'hide',
      enougth11:'',
    })
  },
  inputUser:function(e){
      //!(/^1[34578]\d{9}$/.test(e.detail.value.mobileNo))
      console.log(e.detail.value.length)
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