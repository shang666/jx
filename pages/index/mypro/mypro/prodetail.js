// pages/mine/mypro/mypro/prodetail.js
Page({
  data:{
    workerInfo:'',
  },
  onLoad:function(options){
     var host = wx.getStorageSync('host');
     this.getUrl(
       wx.getStorageSync('host')+'/user/projectinfo!loadProjectAllInfos.jhtml',
        wx.getStorageSync('userId'),
         wx.getStorageSync('projectId')
     )
  },
  onReady:function(){
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  getUrl:function(url,userId,projectId){
    let that = this;
    let arr = [];
    let arr1=[];
    let arr2=[];
    let baoming='';
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
          console.log(res.data.data)
          that.setData({
              // img_list:
              detail:res.data.data,
              workerInfo:res.data.data.detailsSet[0].enrollView,
          }) 
          for(let i=0;i<res.data.data.detailsSet[0].enrollView.length;i++){
            //把每个父级的雇佣状态添加给子级
            res.data.data.detailsSet[0].enrollView[i].workerInfo.isEmploy =res.data.data.detailsSet[0].enrollView[i].isEmploy
            var prosonal= res.data.data.detailsSet[0].enrollView[i].workerInfo.id;   
            var isEmploy = res.data.data.detailsSet[0].enrollView[i].isEmploy
            var leaderId= res.data.data.detailsSet[0].enrollView[i].workerTeam.leaderId;          
            // console.log(res.data.data.detailsSet[0].enrollView[i].workerInfo.isEmploy);
            // console.log(res.data.data)
            if(leaderId){
              wx.request({
                url: wx.getStorageSync('host')+'/workerinfo!loadData.jhtml',
                data: {
                  id:leaderId
                },
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                  //  'content-type':'application/json'
                  'content-type':'application/x-www-form-urlencoded'
                },
                success: function(res){
                  res.data.data.isEmploy = isEmploy
                  arr.push(res.data.data);
                  console.log(arr)
                  that.setData({
                    leaderId:arr
                  })
                }
              })
            }
            if(prosonal){
              arr1.push(prosonal);
              arr2.push(res.data.data.detailsSet[0].enrollView[i].workerInfo);
              // console.log(arr2)
            }
          } 
          arr.length||arr1.length?baoming=1:baoming=0;
          that.setData({        
            baoming:baoming,
            pro:arr2
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