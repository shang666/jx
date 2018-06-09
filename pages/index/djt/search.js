Page({
  data:{

  },
  onLoad:function(options){
    console.log('获得数据')
    console.log(wx.getStorageSync('workProvince'));
    console.log(wx.getStorageSync('workCitycode'))
  },
  getUrl:function(){
    var that =this;
    var pro = '';
    //workProvince
    wx.getStorageSync('workProvince')?pro = wx.getStorageSync('workProvince'):pro= wx.getStorageSync('workCitycode');
    console.log('获得数据')
    console.log(wx.getStorageSync('workProvince'));
    console.log(wx.getStorageSync('workCitycode'));
    console.log()
    var postData = {    
         'start':'0',
         'workProvince':pro,   
         'workCity':wx.getStorageSync('shicode'),
         'workCounty':wx.getStorageSync('citycode'),
         'searchStr':that.data.value
      }
      console.log(postData)
    wx.request({
      url: wx.getStorageSync('host')+'/workerinfo!searchWorkers.jhtml',
      data: postData,
      method: 'POST', 
      header: {
          'content-type':'application/x-www-form-urlencoded'
      },
      success: function(res){
        var data = res.data.data
        console.log(res)
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
  onUnload:function(){
  },
  getDetail:function(e){  
        wx.setStorageSync('workerId', e.currentTarget.dataset.index) 
        wx.navigateTo({
          url: 'index'
        })
  },
  getvalue:function(e){
    this.setData({
      value:e.detail.value
    })
  }
})