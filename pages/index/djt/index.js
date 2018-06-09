// pages/index/mypro/workdetail/workdetail.js
Page({
  data:{
    workerMsg:'',
    sex:'男',
    impression:'',
  },
  onLoad:function(options){
    this.getUrl(wx.getStorageSync('host')+'/workerinfo!loadData.jhtml');
    // 页面初始化 options为页面跳转所带来的参数
  },
  getUrl:function(url){
    var that = this;
    wx.request({
      url: url,
      data: {
        'id':wx.getStorageSync('workerId')
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type':'application/x-www-form-urlencoded'
      },
      success: function(res){
         wx.setStorageSync('djtWorktype', res.data.data.workTypeCode);
         wx.setStorageSync('totalAmount', res.data.data.daySalary)
        if(res.data.data.sex==2){
          that.setData({
            workerMsg:res.data.data,
            sex:'女'
          })
        }else{
          that.setData({
            workerMsg:res.data.data,
            sex:'男'
          })
        }
        wx.request({
          url: wx.getStorageSync('host')+'/common!getReqIpAddr.jhtml',
          data: {},
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type':'application/x-www-form-urlencoded'
          },
          success: function(res){
            console.log(res.data.data)
            wx.setStorageSync('ip', res.data.data)          
          }
        });
        wx.request({
          url: wx.getStorageSync('host')+'/workerimpressions!getImpres.jhtml',
          data: {
            'workerId':wx.getStorageSync('workerId'),
            'mobileIIpp':wx.getStorageSync('ip'),
            'employerIdCurrent':wx.getStorageSync('relationId'),
            'dateFormat':'yyyy-MM-dd HH:ss',
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type':'application/x-www-form-urlencoded'
          },
          success: function(res){
            for(var i=0;i<res.data.data.length;i++){
                var date=new Date;
                var mo=date.getMonth()+1;
                mo<10?mo = '0'+mo:mo = mo;
                var data = date.getDate();
                data<10?data='0'+data:data=data;
              if(res.data.data[i].createDate.substr(5,2)==mo&&res.data.data[i].createDate.substr(8,2)==data){
                  res.data.data[i].createDate = res.data.data[i].createDate.substr(10,9)
              }else{
                  res.data.data[i].createDate = res.data.data[i].createDate.substr(5,5)
              }
            }
            that.setData({
              impression:res.data.data
            })
          }
        })
      } 
    })
  },
  callNo:function(e){
    var No = e.currentTarget.dataset.index;
    var userId = wx.getStorageSync('userId');
    if(userId){
        wx.navigateTo({
            url: 'invent'
        })
    }else{
      wx.redirectTo({
          url: '../../login/login'
      })
    }
  },
 addZan:function(e){
   var impressionsId = e.currentTarget.dataset.index;
   var that = this;
   wx.request({
     url: wx.getStorageSync('host')+'/workerimpressionszan!addZan.jhtml',
     data: {
         'impressionsId':impressionsId,
         'workerId':wx.getStorageSync('workerId'),
         'mobileIp':wx.getStorageSync('ip'),
         'employerId':wx.getStorageSync('relationId'),
         'fromPath':0,
         'fromPlatform':''
     },
     method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     header: {
            'content-type':'application/x-www-form-urlencoded'
          },
     success: function(res){
        wx.request({
          url: wx.getStorageSync('host')+'/workerimpressions!getImpres.jhtml',
          data: {
            'workerId':wx.getStorageSync('workerId'),
            'mobileIIpp':wx.getStorageSync('ip'),
            'employerIdCurrent':wx.getStorageSync('relationId'),
            'dateFormat':'yyyy-MM-dd HH:ss',
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type':'application/x-www-form-urlencoded'
          },
          success: function(res){
            that.setData({
              impression:res.data.data
            })
          }
        })
     }
   })
 },
deleteZan:function(e){
    var impressionsId = e.currentTarget.dataset.index;
    var that = this;
    wx.request({
     url: wx.getStorageSync('host')+'/workerimpressionszan!deleteZan.jhtml',
     data: {
         'impressionsId':impressionsId,
         'workerId':wx.getStorageSync('workerId'),
         'mobileIp':wx.getStorageSync('ip'),
         'employerId':wx.getStorageSync('relationId'),
         'fromPath':0,
         'fromPlatform':''
     },
     method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     header: {
            'content-type':'application/x-www-form-urlencoded'
          },
     success: function(res){
       wx.request({
          url: wx.getStorageSync('host')+'/workerimpressions!getImpres.jhtml',
          data: {
            'workerId':wx.getStorageSync('workerId'),
            'mobileIIpp':wx.getStorageSync('ip'),
            'employerIdCurrent':wx.getStorageSync('relationId'),
            'dateFormat':'yyyy-MM-dd HH:ss',
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type':'application/x-www-form-urlencoded'
          },
          success: function(res){
            that.setData({
              impression:res.data.data
            })
          }
        })
     }
   })
}
})