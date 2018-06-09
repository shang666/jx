// pages/mine/mypro/mypro/prodetail.js
Page({
  data:{
    personal:'hide',
  },
  onLoad:function(options){
     var host = wx.getStorageSync('host')
     this.getUrl(
       wx.getStorageSync('host')+'/user/projectinfo!loadProjectAllInfos.jhtml',
       wx.getStorageSync('userId'),
       wx.getStorageSync('projectId')
     )
  },
  getUrl:function(url,userId,projectId){
    var that = this;
    wx.request({
        url:url,
        data: {
          'userId':userId,
          'projectId':projectId
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
            //  'content-type':'application/json'
            'content-type':'application/x-www-form-urlencoded'
        },
        success: function(res){
          function getTime2Time($time1, $time2){
              var time1 = arguments[0], time2 = arguments[1];
              time1 = Date.parse(time1)/1000;
              time2 = Date.parse(time2)/1000;
              var time_ = time1 - time2;
              return (time_/(3600*24));
          };
          console.log(res.data.data)
          var mount='';
          res.data.data.detailsSet.length?mount=res.data.data.detailsSet[0].totalAmount:mount='';
          // = res.data.data.detailsSet[0].totalAmount||'';//单价
          var day = getTime2Time(res.data.data.workEndDate,res.data.data.workStartDate)+1;//天数
          var workerInfo = '';
          res.data.data.detailsSet.length=='1'?workerInfo=res.data.data.detailsSet[0]:workerInfo=res.data.data.detailsSet[1];    
          that.setData({
              detail:res.data.data,
              allcharge:mount*day,
              projectState:res.data.data.projectState,
              //workerId:res.data.data.detailsSet[0].workerId,
              workerInfo:workerInfo,//个人
              workerLength:res.data.data.detailsSet.length,
              personal:'show',
          })
          
        }
    })
  },
   
  linkWorker:function(e){
    var $workerNo = e.currentTarget.dataset.index;
    wx.makePhoneCall({
      phoneNumber: $workerNo //仅为示例，并非真实的电话号码
    })
  },
  getWorkdetail:function(e){
    wx.setStorageSync('workerId', e.currentTarget.dataset.index)
    wx.navigateTo({
      url: '../workdetail/workdetail'
    })
  }
})