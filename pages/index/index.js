Page({
  data: {
    img:'',
    indicatorDots: true,  
    autoplay: true,  
    interval: 5000,  
    duration: 1000,  
    userInfo: {}  ,
  },
  onLoad: function () {
    var that= this;
    //离我最近调用接口/location!setUserLocation.jhtml
    //参数为latitude：纬度
    // longitude：经度
    // userId：工匠端需要传输。雇主登录的话传输没登录不传输
    // 雇主端返回32位的字符串，点将台查询使用，计算工匠距离
    // 工匠端无返回
    // 返回参数：32bdf0fdee1949f0966a5d7b64e50755
      wx.getLocation({
          type: 'gcj02', //返回可以用于wx.openLocation的经纬度
          success: function(res) {
              var latitude = res.latitude
              var longitude = res.longitude
              wx.request({
                url: wx.getStorageSync('host')+'/location!setUserLocation.jhtml',
                data: {
                  latitude:latitude,
                  longitude:longitude
                },
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                  'content-type':'application/x-www-form-urlencoded'
                },
                success: function(res){
                  console.log(1)
                  wx.setStorageSync('distanceSort', res.data)
                  //wx.setStorageSync('distanceSort', '7718d182628f4379965f338cd443a796')
                  wx.request({
                    url: 'http://apis.map.qq.com/ws/geocoder/v1/?location='+latitude+','+longitude+'&key=XXABZ-OL2WU-772VO-2YLZA-J5VJH-EOFSN',
                    data: {},
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    header: {
                        'content-type':'application/x-www-form-urlencoded'
                    },
                    success: function(res){
                      wx.setStorageSync('beijing', res.data.result.address_component.province)
                      wx.setStorageSync('workCitycode', res.data.result.ad_info.adcode.substr(0,2)+'0000');
                      console.log(wx.getStorageSync('workCitycode'))
                    }
                  })
                }
              })
          }
      })
      this.getImg(wx.getStorageSync('host')+'/uploadfile!pagedQueryTop.jhtml')
  },
  getImg:function(url){
      var that = this;
      wx.request({
        url: url,
        data: {
          fileType:13
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
            'content-type':'application/x-www-form-urlencoded'
        },
        success: function(res){
          that.setData({
            img:res.data.data
          })
        }
      })
  },
  getEcho:function(){//点击一呼百应
      var userId = wx.getStorageSync('userId');
      if(userId){
        //一呼百应页面
        wx.navigateTo({
          url: 'echo/echo'
        })
      
      }else{
        //登录页面
        wx.setStorageSync('getUrl', 'echo/echo');
        wx.navigateTo({
          url: '../login/login'
        })      
      }
  },
  getDj:function(){
      wx.navigateTo({
          url: 'djt/djt'
      })  
  },
  text:function(){
      wx.navigateTo({
        url: '../text/text'
      })     
  },
  onShareAppMessage: function () {
      return {
          title: '找工人 上点匠                              30万实名制施工队、班组任你选',
          path: 'pages/index/index'
      }
  },
  upfile:function(){
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res){
        var url = res.tempFilePaths[0];
        console.log(url)
        //判断图片大小不超过2M
        wx.uploadFile({
          url: 'http://192.168.1.100:8181/upload.do',
          filePath:res.tempFilePaths[0],
          name:'file',
          header: {
            'content-type':'multipart/form-data'
          },
          success: function(res){
            console.log(res)
            //传参imgformat：表明现在穿的图片是什么类型的图片
            
          }
        })
      }
    })
  }
})
