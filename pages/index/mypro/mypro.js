// pages/mine/mypro/mypro.js
Page({
  data:{
    
  },
  onLoad:function(options){
    this.getUrl(wx.getStorageSync('host')+'/user/projectinfo!getMyProjectByEmployer.jhtml')
    // 页面初始化 options为页面跳转所带来的参数
  },
  getUrl:function(url){
    var that =this;
    wx.request({
      url: url,
      data: {
         'limit':'80',
         'start':'0',
         'userId':wx.getStorageSync('userId')
      },
      method: 'POST', 
      header: {
          'content-type':'application/x-www-form-urlencoded'
      },
      success: function(res){
        console.log(res.data.data)
        that.setData({
            list:res.data.data
        })
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
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
  getDetail:function(e){  
      wx.setStorageSync('projectId', e.currentTarget.dataset.projectid)
      var $projectType = e.currentTarget.dataset.index;
      if($projectType==3){//一呼百应
          wx.navigateTo({
          url: './mypro/prodetail'
          })
        }else if($projectType==2){//点匠台
          wx.navigateTo({
          url: './djtdetail/detail'
          })
        }   
  }
})