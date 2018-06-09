var address = require('../../../utils/address.js');
Page({
  data:{
    priv:address.addressData,
    hide:'0',
    shadow:'hide',
    cityshow:'hide', 
    workertype:'0',
    qunbugongzhong:'全部工种',
    sort:'0',
    xian:'hide',
    sort_name:'智能排序',
    sort_list:address.sortName
  },
  onLoad:function(options){
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height:res.windowHeight
        })
        console.log(res.windowHeight)
      }
    })
    wx.setStorageSync('citycode', '');
    wx.setStorageSync('cityname', '');
    wx.setStorageSync('workertype', '');
    wx.setStorageSync('typename', '');
    wx.setStorageSync('sort', '');
    wx.setStorageSync('dir', '');
    if(wx.getStorageSync('beijing')){
      wx.setStorageSync('workCitycode', '110000');
      this.setData({
        beijing:wx.getStorageSync('beijing'),
      })
    }else{
      this.setData({
        beijing:'北京',
      })
    }
    this.getUrl(wx.getStorageSync('host')+'/workerinfo!pagedQueryTop.jhtml');
    this.loadWorkersCount(wx.getStorageSync('host')+'/workerinfo!loadWorkersCount.jhtml');
  },
  getUrl:function(url){
    var that =this;
    var add_citycode= '';
    if(wx.getStorageSync('workCitycode')){
      add_citycode= wx.getStorageSync('workCitycode')
    }else{
      add_citycode = '110000'
    }
    wx.request({
      url: url,
      data: {
         'limit':'30',
         'start':'0',
         'userId':wx.getStorageSync('userId'),
         'workProvince':add_citycode,
      },
      method: 'POST', 
      header: {
          'content-type':'application/x-www-form-urlencoded'
      },
      success: function(res){
        var data = res.data.data
        for(var i= 0;i<data.length;i++){
          var othertype = data[i].workTypeNameSe;
          othertype = othertype.split(',')
          data[i].othertype = othertype
        }
        that.setData({
            list:data
        })
      }
    })
  },
  loadWorkersCount: function (url) {
    var that = this;
    var add_citycode = '';
    if (wx.getStorageSync('workCitycode')) {
      add_citycode = wx.getStorageSync('workCitycode')
    } else {
      add_citycode = '110000'
    }
    wx.request({
      url: url,
      data: {
        'workProvince': add_citycode
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data
        that.setData({
          workersCount: data
        })
      }
    })
  },
  onUnload:function(){
    // 页面关闭
    wx.setStorageSync('citycode', '');
    wx.setStorageSync('cityname', '');
    wx.setStorageSync('workertype', '');
    wx.setStorageSync('typename', '');
    wx.setStorageSync('sort', '');
    wx.setStorageSync('dir', '');
  },
  getDetail:function(e){  
        wx.setStorageSync('workerId', e.currentTarget.dataset.index) 
        wx.navigateTo({
          url: 'index'
        })
  },
  workerfrom:function(){
    var that = this;
    var animation = wx.createAnimation({
      duration: 100,
        timingFunction: 'linear',
      })
    this.animation = animation
    animation.height(0).step();
    var animation1 = wx.createAnimation({
      duration: 100,
        timingFunction: 'linear',
      })
    this.animation1 = animation1
    animation1.height(303).step();
    var animation2 = wx.createAnimation({
      duration: 100,
        timingFunction: 'linear',
      })
    this.animation2 = animation2
    animation2.height(0).step();
    var animation3 = wx.createAnimation({
      duration: 100,
        timingFunction: 'linear',
      })
    this.animation3 = animation3
    animation3.height(0).step()
    if(that.data.hide=='0'){
        this.setData({
          hide:'1',
          shadow:'show',
          one:'true',
          two:'',
          thr:'',
          animationData:{
            animationData1:animation1.export(),
            animationData2:animation.export(),
            animationData3:animation3.export(),
          }
        })
    }else{
      this.setData({
          hide:'0',
          shadow:'hide',
          cityshow:'hide',
          one:'',
          two:'',
          thr:'',
          animationData:{
            animationData1: animation.export(),
            animationData2:animation2.export(),
            animationData3:animation3.export(),
          }
      })
    }
  },
  getcity:function(e){
    var code =  e.currentTarget.dataset.index;
    var name = e.currentTarget.dataset.name;
    wx.setStorageSync('workProvince', code);
    console.log(e)
    var that = this;
    that.setData({
        quanbuchengshi:name
    })
    wx.request({
      url: wx.getStorageSync('host')+'/systemcode!listByCodeType.jhtml?sysCodeType=QYSHI&parentId='+code,
      data: {},
      method: 'GET',
      header: {
          'content-type':'application/x-www-form-urlencoded'
      },
      success: function(res){
        var typename = wx.getStorageSync('typename')
          if(typename==''){
            typename = '全部工种'
          }
          that.setData({
            city:res.data,
            hide:'0',
            cityshow:'show',
            qunbugongzhong:typename,        
          })
      }
    })
  },
  getxian:function(e){
    var code =  e.currentTarget.dataset.code;
    var name = e.currentTarget.dataset.index;
    var old_name = wx.getStorageSync('arr_city')
    wx.setStorageSync('arr_city', old_name+name)
    wx.setStorageSync('shicode', code)
    var that = this;
    that.setData({
        quanbuchengshi:name
    })
    wx.request({
      url: wx.getStorageSync('host')+'/systemcode!listByCodeType.jhtml?sysCodeType=QYXIAN&parentId='+code,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
          'content-type':'application/x-www-form-urlencoded'
      },
      success: function(res){
        that.setData({
            xian_list:res.data,
            arr_list:'hide',
            cityshow:'hide',
            xian:'show',
            xian_list:res.data,
            detail_arr:wx.getStorageSync('arr_city')
        })
      }
    })
},
  getName:function(e){
    var name = e.currentTarget.dataset.name;
    var code = e.currentTarget.dataset.code;
    wx.setStorageSync('citycode', code);
    wx.setStorageSync('cityname', name)
    var that = this;
    var typename=wx.getStorageSync('typename');
    var sort_name = wx.getStorageSync('sort_name');
    var sort = wx.getStorageSync('sort');
    var dir = wx.getStorageSync('dir');
    var distanceSort = wx.getStorageSync('distanceSort')
    var animation1 = wx.createAnimation({
        duration: 100,
        timingFunction: 'linear',
        })
    this.animation1 = animation1
    animation1.height(303).step()
    var animation = wx.createAnimation({
        duration: 100,
        timingFunction: 'linear',
        })
    this.animation = animation
    animation.height(0).step();
    if(sort_name==''){
      sort_name='智能排序'
    }
    let setDate = {
         'limit':'30',
         'start':'0',
         'userId':wx.getStorageSync('userId'),
         'workCity':wx.getStorageSync('shicode'),
         'workCounty_or':code,
         'sort':sort,
         'dir':dir,
         'distanceSort':distanceSort,
         'distanceKey':'',
         'workProvince':wx.getStorageSync('workProvince')
    }
    let setDate1 = {
         'limit':'30',
         'start':'0',
         'userId':wx.getStorageSync('userId'),
         'workCity':wx.getStorageSync('shicode'),
         'workTypeCode':wx.getStorageSync('workertype'),
         'workCounty_or':code,
         'sort':sort,
         'dir':dir,
         'distanceSort':distanceSort,
         'distanceKey':'',
         'workProvince':wx.getStorageSync('workProvince')
    }
    let post = '';
    wx.getStorageSync('workertype')?post = setDate1:post=setDate;
    wx.request({
      url: wx.getStorageSync('host')+'/workerinfo!pagedQueryTop.jhtml',
      data: post,
      method: 'POST',
      header: {
          'content-type':'application/x-www-form-urlencoded'
      },
      success: function(res){
        if(name){
          console.log(that.data.scrollTop+300)
          that.setData({
            list:res.data.data,
            beijing:name,
            shadow:'hide',
            cityshow:'hide',
            hide:'hide',
            xian:'hide',
            scrollTop:that.data.scrollTop+300,
            animationData:{
                  animationData1:animation.export(),
                  // animationData2:animation.export(),
                  // animationData3:animation.export(),
            }
          })
        }else{
          console.log(that.data.scrollTop+300)
           that.setData({
            list:res.data.data,
            beijing:wx.getStorageSync('cityname'),
            shadow:'hide',
            cityshow:'hide',
            hide:'hide',
            xian:'hide',
            scrollTop:that.data.scrollTop+300,
            animationData:{
                  animationData1:animation.export(),
                  // animationData2:animation.export(),
                  // animationData3:animation.export(),
            }
          })
        }
      }
    });
    let params1 = {
      'workCity': wx.getStorageSync('shicode'),
      'workCounty': code,
      'workProvince': wx.getStorageSync('workProvince')
    }
    wx.request({
      url: wx.getStorageSync('host') + '/workerinfo!loadWorkersCount.jhtml',
      data: params1,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data
        that.setData({
          workersCount: data
        })
      }
    })
  },
  workertype:function(){
    var that = this;
    var animation1 = wx.createAnimation({
      duration: 100,
        timingFunction: 'linear',
      })
    this.animation1 = animation1
    animation1.height(303).step()
    var animation = wx.createAnimation({
      duration: 100,
        timingFunction: 'linear',
      })
    this.animation = animation;
    animation.height(0).step();
    var animation2 = wx.createAnimation({
      duration: 100,
        timingFunction: 'linear',
      })
  
    this.animation2 = animation2
    animation2.height(0).step();
    var animation3 = wx.createAnimation({
      duration: 100,
        timingFunction: 'linear',
      })
  
    this.animation3 = animation3
    animation3.height(0).step();
    if(that.data.workertype=='1'){
      that.setData({
        hide:'0',
        workertype:'0',
        shadow:'hide',
        cityshow:'hide',
        one:'',
        two:'',
        thr:'',
        animationData:{
            animationData1:animation.export(),
            animationData2:animation3.export(),
            animationData3:animation2.export(),
       } 
      })
    }else{
      wx.request({
        url: wx.getStorageSync('host')+'/systemcode!listByCodeType.jhtml?sysCodeType=GZ',
        data: {
        },
        method: 'GET',
        header: {
            'content-type':'application/x-www-form-urlencoded'
        },
        success: function(res){
            that.setData({ 
              hide:'0',          
              shadow:'show',
              workertype:'1',
              cityshow:'hide',
              sort:'0',
              one:'',
              two:'true',
              thr:'',
              workertype_list:res.data,
              animationData:{
                animationData1:animation2.export(),
                animationData3:animation.export(),
                animationData2:animation1.export(),
              } 
            })
        }
      })
    }
  },
  getworkertype:function(e){
    var workertype = e.currentTarget.dataset.index;
    wx.setStorageSync('workertype', workertype);
    var typename  = e.currentTarget.dataset.name;
    wx.setStorageSync('typename', typename);
    var that = this;
    var sort = wx.getStorageSync('sort');
    var dir = wx.getStorageSync('dir');
    var animation1 = wx.createAnimation({
        duration: 100,
          timingFunction: 'linear',
        })
    this.animation1 = animation1
    animation1.height(303).step()
    var animation = wx.createAnimation({
        duration: 100,
          timingFunction: 'linear',
        })
    this.animation = animation
    animation.height(0).step()
    var distanceSort = wx.getStorageSync('distanceSort')
    // if(typename==''){
    //       typename = '全部工种'
    //     }
    var code1 = '';
    wx.getStorageSync('shicode')?code1=wx.getStorageSync('shicode'):code1='110100';
    let setDate = {//全部工种
      'limit':'30',
         'start':'0',
         'userId':wx.getStorageSync('userId'),
         'workCity':code1,
         'sort':sort,
         'dir':dir,
         'distanceSort':distanceSort,
         'distanceKey':'',
         'workProvince':wx.getStorageSync('workProvince')
    }
    let setDate1 = {
         'limit':'30',
         'start':'0',
         'userId':wx.getStorageSync('userId'),
         'workCity':code1,
         'workTypeCode':workertype,
         'sort':sort,
         'dir':dir,
         'distanceSort':distanceSort,
         'distanceKey':'',
         'workProvince':wx.getStorageSync('workProvince')
    }
    let post = '';
    workertype?post=setDate1:post=setDate;
    wx.request({
      url: wx.getStorageSync('host')+'/workerinfo!pagedQueryTop.jhtml',
      data:post,
      method: 'POST', 
      header: {
          'content-type':'application/x-www-form-urlencoded'
      },
      success: function(res){
        var cityname ='';
        wx.getStorageSync('cityname')?cityname=wx.getStorageSync('cityname'):cityname='北京市'
       console.log(that.data.scrollTop+300)
        that.setData({
          list:res.data.data,
          beijing:cityname,
          shadow:'hide',
          cityshow:'hide',
          hide:'0',
          workertype:'0',
          scrollTop:that.data.scrollTop+300,
          qunbugongzhong:typename,
          animationData:{
                //animationData1:animation.export(),
                animationData2:animation.export(),
                //animationData3:animation.export(),
          } 
        })
      }
    })
    let params1 = {
      'workCity': code1,
      'workProvince': wx.getStorageSync('workProvince')
    }
    wx.request({
      url: wx.getStorageSync('host') + '/workerinfo!loadWorkersCount.jhtml',
      data: params1,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data
        that.setData({
          workersCount: data
        })
      }
    })
  },
  sort:function(){
    var animation1 = wx.createAnimation({
      duration: 100,
        timingFunction: 'linear',
      })
    this.animation1 = animation1;
    animation1.height(303).step();
    var animation = wx.createAnimation({
      duration: 100,
        timingFunction: 'linear',
      })
    this.animation = animation;
    animation.height(0).step();
    var animation2 = wx.createAnimation({
      duration: 100,
        timingFunction: 'linear',
      })
    this.animation2 = animation2;
    animation2.height(0).step();
    var animation3 = wx.createAnimation({
      duration: 100,
        timingFunction: 'linear',
      })
    this.animation3 = animation3;
    animation3.height(0).step();
    if(this.data.sort=='0'){
      this.setData({     
        shadow:'show',
        sort:'1' ,
        hide:'0',
        cityshow:'hide',
        workertype:'0',
        one:'',
        two:'',
        thr:'true',
        animationData:{
            animationData1:animation.export(),
            animationData2:animation2.export(),
            animationData3:animation1.export(),
          }
      })
    }else{
      this.setData({     
        shadow:'hide',
        sort:'0' ,
        cityshow:'hide',
        one:'',
        two:'',
        thr:'',
        animationData:{
            animationData1:animation.export(),
            animationData2:animation2.export(),
            animationData3:animation3.export(),
          }
      })
    }   
  },
  getsort:function(e){
      var sort  = e.currentTarget.dataset.sort;
      var dir  = e.currentTarget.dataset.dir;
      var distanceSort  = e.currentTarget.dataset.distancesort;
      if(distanceSort){
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
                  wx.setStorageSync('distanceSort', res.data)
                  //wx.setStorageSync('distanceSort', '7718d182628f4379965f338cd443a796')
                }
              })
          }
        })
      }
      var discant = wx.getStorageSync('distanceSort');
      var sort_name  = e.currentTarget.dataset.index;
      var that =this;
      wx.setStorageSync('sort', sort);
      wx.setStorageSync('dir', dir);
      wx.setStorageSync('sort_name', sort_name);
      wx.setStorageSync('distanceSort', distanceSort);
      var animation1 = wx.createAnimation({
          duration: 100,
            timingFunction: 'linear',
          })
      this.animation1 = animation1
      animation1.height(303).step()
      var animation = wx.createAnimation({
          duration: 100,
            timingFunction: 'linear',
          })
      this.animation = animation
      animation.height(0).step();
      let setDate = {//全部工种
        'limit':'30',
          'start':'0',
          'userId':wx.getStorageSync('userId'),
          'workCity':wx.getStorageSync('shicode'),
          'workTypeCode':wx.getStorageSync('workertype'),
          'sort':sort,
          'dir':dir,
          'distanceSort':distanceSort,
          'distanceKey':discant,
          'workProvince':wx.getStorageSync('workProvince')
      }
      let setDate1 = {
          'limit':'30',
          'start':'0',
          'userId':wx.getStorageSync('userId'),
          'workCity':wx.getStorageSync('shicode'),
          'sort':sort,
          'dir':dir,
          'workTypeCode':wx.getStorageSync('workertype'),
          'distanceSort':distanceSort,
          'distanceKey':'',
          'workProvince':wx.getStorageSync('workProvince')
      }
      let post = '';
      sort?post = setDate1:post=setDate;
      wx.request({
        url: wx.getStorageSync('host')+'/workerinfo!pagedQueryTop.jhtml',
        data:post,
        method: 'POST',
        header: {
            'content-type':'application/x-www-form-urlencoded'
        },
        success: function(res){
          var typename = wx.getStorageSync('typename');
          var cityname =''
          if(typename==''){
            typename = '全部工种'
          }
          wx.getStorageSync('cityname')?cityname = wx.getStorageSync('cityname'):cityname='北京';
          var _top = that.data.scrollTop;
          _top==1?_top=0:_top=1;
          that.setData({
            list:res.data.data,
            beijing:cityname,
            shadow:'hide',
            cityshow:'hide',
            hide:'0',
            workertype:'0',
            qunbugongzhong:typename,
            sort_name:sort_name,
            sort:'0',
            scrollTop:_top,
            animationData:{
              animationData3:animation.export(),
            }
          });
        }
      })
      let params1 = {
        'workCity': wx.getStorageSync('shicode'),
        'workProvince': wx.getStorageSync('workProvince')
      }
      wx.request({
        url: wx.getStorageSync('host') + '/workerinfo!loadWorkersCount.jhtml',
        data: params1,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var data = res.data.data
          that.setData({
            workersCount: data
          })
        }
      })
  },
  hideshadow:function(){
    var animation = wx.createAnimation({
        duration: 100,
          timingFunction: 'linear',
        })
    this.animation = animation
    animation.height(0).step();
    var animation1 = wx.createAnimation({
        duration: 100,
          timingFunction: 'linear',
        })
    this.animation1 = animation1
    animation1.height(0).step()
    var animation2 = wx.createAnimation({
        duration: 100,
          timingFunction: 'linear',
        })
    this.animation2 = animation2
    animation2.height(0).step()
    this.setData({
      shadow:'hide',
      cityshow:'hide',
      workertype:'hide',
      sort:'hide',
      animationData:{
        animationData1:animation.export(),
        animationData2:animation1.export(),
        animationData3:animation2.export(),
      }
    })
  },
  goSearch:function(){
    wx.navigateTo({
      url: '../djt/search',
    })
  }
})