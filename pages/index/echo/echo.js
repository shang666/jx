var address = require('../../../utils/address.js');
Page({
  data:{
    box:'hide',
    hasEmptyGrid: false,
    arr_list:'hide',
    arr_data:address.addressData,
    shadow:'hide',
    city_list:'',
    city:'hide',
    detail_arr:'',
    xian:'hide',
    xian_list:'',
    worktype:'hide',
    worktype_list:'',
    typename:'',
    textnum:'0',
    time_box:'true',
    dirs:'hide',
    dirs_l:'show',
    icon_1:'hide',
    icon_2:'hide',
    icon_3:'hide',
    icon_4:'hide',
    icon_5:'hide',
    icon_6:'hide',
    icon_7:'hide',
    icon_8:'hide',
    img_list:[],
  },
  onLoad:function(options){
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const to_month = date.getMonth() + 1;
    const cur_data = date.getDate();
    const click_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.setData({
      cur_year,
      cur_month,
      to_month,
      click_month,
      cur_data,
      weeks_ch,
      sub:'submit'
    })
  },
  onUnload:function(){
    wx.removeStorageSync('shicode');
    wx.removeStorageSync('shengcode');
    wx.removeStorageSync('worktypecode');
    // 页面关闭
  },
  inventWork:function(){
    wx.showModal({
      title: '确定邀约?',
      content: '',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  xwRequest:function(postdata,url){
    wx.request({
      url: url,
      data:postdata,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
          'content-type':'application/x-www-form-urlencoded'
      },
      success: function(res){
        if(res.data.success){
          wx.showToast({
            title: '成功',
            icon: 'success',
           duration: 2000,
           success:function(){
             setTimeout(function(){
                wx.redirectTo({
                  url: '../mypro/mypro'
                })
             },1500)
           }
          })
        }else{
          wx.showToast({
            title: '失败',
            image: '../../img/wrong.png',
           duration: 2000
          })
        }
      }
    })
  },
  formSubmit:function(e){
    // console.log()
    let _index = e.detail.target.dataset.index;
    console.log(this.data.img_list);
    let tempAttaId = [];
    for(let i=0;i<this.data.img_list.length;i++){
      console.log(this.data.img_list[i].id)
      tempAttaId.push(this.data.img_list[i].id)
    }
    this.setData({
      box:'hide'
    })
    var that = this;
    var data =  [{'workStartDate':e.detail.value.workStartDate,
      'workTypeCode':wx.getStorageSync('worktypecode'),
      'workEndDate':e.detail.value.workEndDate,
      'workerNum':'1',
      'totalAmount':e.detail.value.totalAmount,
      'detailContent':e.detail.value.projectContent}]
    e.detail.postDate = {
      'projectType':3,
      'projectContent':e.detail.value.projectContent,
      'projectTitle':e.detail.value.projectTitle,
      'payType':e.detail.value.payType,
      'workProvince':wx.getStorageSync('shengcode'),//工作省
      'workCity':wx.getStorageSync('shicode'),
      'workCounty':wx.getStorageSync('xiancode'),
      'workAddr':e.detail.value.workAddr,
      'longitude':'0',//经度
      'latitude':'0',//纬度
      'jsonStr':JSON.stringify(data),
      'userId':wx.getStorageSync('userId'),
      'tempAttaId':tempAttaId,
      'source':3
    }
    console.log(e.detail.value.projectContent!=''&&e.detail.value.projectTitle!=''&&e.detail.value.payType!=''&&e.detail.value.workStartDate!=''&&e.detail.value.workEndDate!=''&&wx.getStorageSync('worktypecode')!=''&&e.detail.value.totalAmount!=''&&e.detail.value.totalAmount!='0'&&wx.getStorageSync('shicode')!=''&&wx.getStorageSync('shengcode')!=''&&e.detail.value.workAddr!=''&&e.detail.value.projectTitle.length>=5&&e.detail.value.projectContent.length>=10)
    //
    if(e.detail.value.projectContent!=''&&e.detail.value.projectTitle!=''&&e.detail.value.payType!=''&&e.detail.value.workStartDate!=''&&e.detail.value.workEndDate!=''&&wx.getStorageSync('worktypecode')!=''&&e.detail.value.totalAmount!=''&&e.detail.value.totalAmount!='0'&&wx.getStorageSync('shicode')!=''&&wx.getStorageSync('shengcode')!=''&&e.detail.value.workAddr!=''&&e.detail.value.projectTitle.length>=5&&e.detail.value.projectContent.length>=10){
      that.setData({
        sub:''
      })
      if(_index=='1'){
        this.xwRequest(e.detail.postDate,wx.getStorageSync('host')+'/user/projectinfo!saveProject.jhtml')
      }else{
        this.xwRequest(e.detail.postDate,wx.getStorageSync('host')+'/user/projectinfo!releaseProject.jhtml')
      }

    }else{
      console.log(e)
      if(e.detail.value.projectTitle==''||e.detail.value.projectTitle.length<5){that.setData({icon_8:'show'})}else{that.setData({icon_8:'hide'})};
      if(wx.getStorageSync('worktypecode')==''){that.setData({icon_1:'show'})}else{that.setData({icon_1:'hide'})};
      if(e.detail.value.workStartDate==''){that.setData({icon_2:'show'})}else{that.setData({icon_2:'hide'})};
      if(e.detail.value.workEndDate==''){that.setData({icon_3:'show'})}else{that.setData({icon_3:'hide'})};
      if(e.detail.value.totalAmount==''||e.detail.value.totalAmount=='0'){that.setData({icon_4:'show'})}else{that.setData({icon_4:'hide'})};
      if((wx.getStorageSync('shicode')||wx.getStorageSync('shengcode'))==''){that.setData({icon_5:'show'})}else{that.setData({icon_5:'hide'})};
      if(e.detail.value.workAddr==''){that.setData({icon_6:'show'})}else{that.setData({icon_6:'hide'})};
      if(e.detail.value.projectContent==''||e.detail.value.projectContent.length<10){that.setData({icon_7:'show'})}else{that.setData({icon_7:'hide'})};
      wx.showToast({
        title: '请填入完整信息',
        icon: 'loading',
        duration: 1000
      })
    }
  },
showhide:function(){
  this.setData({
      box:'hide',
      shadow:'hide'
  })
},
showarr:function(){
    var that = this;
    wx.request({
      url: wx.getStorageSync('host')+'/systemcode!listByCodeType.jhtml?sysCodeType=QYSHENG ',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
          'content-type':'application/x-www-form-urlencoded'
      },
      success: function(res){
        that.setData({
          arr_list:'show',
          // arr_data:res.data,
          shadow:'show',
          dirs:'show',
          dirs_l:'hide'
        })
      }
    })
},
getcity:function(e){
    var code =  e.currentTarget.dataset.index;
    var name = e.currentTarget.dataset.name;
    wx.setStorageSync('arr_city', name)
    wx.setStorageSync('shengcode', code)
    var that = this;
    wx.request({
      url: wx.getStorageSync('host')+'/systemcode!listByCodeType.jhtml?sysCodeType=QYSHI&parentId='+code,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
          'content-type':'application/x-www-form-urlencoded'
      },
      success: function(res){
        console.log(res.data)
          that.setData({
              arr_list:'hide',
              city:'show',
              city_list:res.data,
              detail_arr:name
          })
      }
    })
},
getxian:function(e){
    var code =  e.currentTarget.dataset.index;
    var name = e.currentTarget.dataset.name;
    var old_name = wx.getStorageSync('arr_city')
    wx.setStorageSync('arr_city', old_name+name)
    wx.setStorageSync('shicode', code)
    var that = this;
    wx.request({
      url: wx.getStorageSync('host')+'/systemcode!listByCodeType.jhtml?sysCodeType=QYXIAN&parentId='+code,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
          'content-type':'application/x-www-form-urlencoded'
      },
      success: function(res){
        that.setData({
            arr_list:'hide',
            city:'hide',
            xian:'show',
            xian_list:res.data,
            detail_arr:wx.getStorageSync('arr_city')
        })
      }
    })
},
xiancode:function(e){
  var that = this;
  var code =  e.currentTarget.dataset.index;
  var name = e.currentTarget.dataset.name;
  var old_name = wx.getStorageSync('arr_city')
  wx.setStorageSync('arr_city', old_name+name)
  wx.setStorageSync('xiancode', code)
    that.setData({
        xian:'hide',
        shadow:'hide',
        dirs:'hide',
        dirs_l:'show',
        detail_arr:wx.getStorageSync('arr_city')
    })
},
gettype:function(){
    var that = this;
    wx.request({
      url: wx.getStorageSync('host')+'/systemcode!listByCodeType.jhtml?sysCodeType=GZ',
      data: {},
      method: 'GET',
      header: {
          'content-type':'application/x-www-form-urlencoded'
      },
      success: function(res){
        that.setData({
          worktype:'show',
          worktype_list:res.data,
          shadow:'show',
          dirs:'show',
          dirs_l:'hide'
        })
      }
    })
},
gettypecode:function(e){
    var name  = e.currentTarget.dataset.name;
    var code = e.currentTarget.dataset.index;
    wx.setStorageSync('worktypecode', code);
    this.setData({
      typename:name,
      shadow:'hide',
      worktype:'hide',
      dirs:'hide',
      dirs_l:'show'
    })
},
bindChange: function(e) {
  const val = e.detail.value
  this.setData({
    year: this.data.years[val[0]],
    month: this.data.months[val[1]],
    day: this.data.days[val[2]],
  })
},
bindChange2: function(e) {
  const val = e.detail.value
  this.setData({
    year1: this.data.years[val[0]],
    month1: this.data.months[val[1]],
    day1: this.data.days[val[2]],
  })
},
workStartDate:function(e){
  let index = e.currentTarget.dataset.index;
  this.setData({
    time_box:'',
    starOrend:index,
    shadow:'show',
    dirs:'show',
    dirs_l:'hide'
  })
},
getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {
    let days = [];

    const thisMonthDays = this.getThisMonthDays(year, month);

    for (let i = 1; i <= thisMonthDays; i++) {
      days.push(i);
    }

    this.setData({
      days
    });
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      if((cur_year==new Date().getFullYear())&&(cur_month==new Date().getMonth()+1)){
        return;
      }
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth,
        click_month:newMonth
      })

    } else {//这是下个月
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }
      console.log(newMonth)
      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);
      this.setData({
        cur_year: newYear,
        cur_month: newMonth,
        click_month:newMonth
      })
    }
  },
  addColor:function(e){
    //判断是开始还是结束
    console.log('zhangmengpingaaa')
    let data_idx = e.currentTarget.dataset.idx;  //开始时间
    console.log('得到现在的月份'+this.data.cur_month+'得到的点击的月份'+data_idx)
     function getTime2Time($time1, $time2){
        var time1 = arguments[0], time2 = arguments[1];
        time1 = Date.parse(time1)/1000;
        time2 = Date.parse(time2)/1000;
        var time_ = (time1 - time2);
        return (time_/(3600*24));
    };
      function supplement(time){
        let  time_l = time;
        let time_arr=time_l.split('-');
        time_arr[1].length<2? time_arr[1]='0'+time_arr[1]:'';
        time_arr[2].length<2? time_arr[2]='0'+time_arr[2]:'';
        return time = time_arr.join('-');
      }

    let dis_start = getTime2Time(data_idx,this.data.bg);//距离开始时间
    // if((this.data.cur_month==this.data.click_month)){
      if(data_idx.substr(8)<this.data.cur_data&&(this.data.cur_month==this.data.to_month)){
        return;
      }else{

        if(this.data.starOrend=='1'){//这是开始   此处有一个bug,结束日期应该删掉;
            if(Number(data_idx.substr(5,1))>Number(this.data.mo_num)){
              //如果新选的开工日日大于已有的完工日期,完工日期应该被重置,
            // //并且当前的月份小月等于结束日期的月份
                this.setData({
                  bg:data_idx,
                  bg_num:data_idx.substr(7),
                  bg_moth:data_idx.substr(5,1),
                  end_bg:'',
                  end_bg_num:'',
                })
            }else{
              if(Number(data_idx.substr(7))>Number(this.data.end_bg_num)){
                this.setData({
                  bg:data_idx,
                  bg_num:data_idx.substr(7),
                  bg_moth:data_idx.substr(5,1),
                  end_bg:'',
                  end_bg_num:'',
                })
              }else{
                this.setData({
                  bg:data_idx,
                  bg_num:data_idx.substr(7),
                  bg_moth:data_idx.substr(5,1)
                })
              }
            }
        }else{//这是结束
            if(!this.data.bg){//点击结束但是没有开始日期
              this.setData({
                  bg:data_idx,
                  bg_moth:data_idx.substr(5,1),
                  bg_num:data_idx.substr(7),
                })
            }else if(this.data.bg){
                if((getTime2Time(supplement(data_idx), supplement(this.data.bg)))<0){
                  return;
                }
                console.log('结束月份'+data_idx.substr(5,1))
                this.setData({
                    end_bg:data_idx,
                    end_bg_num:data_idx.substr(7),
                    mo_num:data_idx.substr(5,1),
                })
         }else{
              this.setData({
                bg:data_idx,
                bg_num:data_idx.substr(7),
                bg_moth:data_idx.substr(5,1),
              })
          }
        }
      }
    // }
  },
  close_time:function(){
    this.setData({
      shadow:'hide',
      time_box:'hide',
      dirs:'hide',
      dirs_l:'show'
    })
  },
  textnum:function(e){
  //工程详情的字数显示
    this.setData({
      textnum:e.detail.value.length
    })
  },
  hidetost:function(){
    this.setData({
      shadow:'hide',
      worktype:'hide',
      time_box:'hide',
      arr_list:'hide',
      city:'hide',
      xian:'hide'
    })
  },
  uploadImg:function(){
    let that = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res){
        console.log(res.tempFilePaths[0])
        wx.uploadFile({
          url: 'https://www.dianjiang99.com/uploadimg.do',
          filePath:res.tempFilePaths[0],
          name:'file',
          method: 'POST',
          header: {
            'Content-Type': 'multipart/form-data'// 固定值
          },
          formData: {
            'attaType4':'attaType4'
          }, // HTTP 请求中其他额外的 form data
          success: function(res){
            console.log(JSON.parse(res.data).data)
            //let data = JSON.parse(res.data).data
            //JSON.parse(res.data).data.idx = index;
            that.data.img_list.push(JSON.parse(res.data).data)
            // that.data.img_id.push(JSON.parse(res.data).data.id)
            // console.log(that.data.img_id)
            that.setData({
              img_list1:that.data.img_list
            })
          }
        })
      }
    });

  },
  remove_list:function(e){
    let that = this;
    //console.log()
    that.data.img_list.splice(e.target.dataset.index,1)
    that.setData({
      img_list1:that.data.img_list
    })
  },
  get_icon:function(e){//失焦
    console.log(e);
    var that =this
    var index = e.target.dataset.index;
    if(index==8){
      if(e.detail.value==''||e.detail.value.length<5){
        wx.showToast({
          title: '工程名称需在5到25个字之间',
          icon: 'loading',
          duration: 500
        })
        that.setData({icon_8:'show'});
        return;
        }else{that.setData({icon_8:'hide'})};
    }
    if(index==1){
      if(wx.getStorageSync('worktypecode')==''){that.setData({icon_1:'show'})}else{that.setData({icon_1:'hide'})};
    }
    if(index==2){
      if(e.detail.value==''){that.setData({icon_2:'show'})}else{that.setData({icon_2:'hide'})};
    }
   if(index==3){
      if(e.detail.value==''){that.setData({icon_3:'show'})}else{that.setData({icon_3:'hide'})};
    }
    if(index==4){
      if(e.detail.value==''){that.setData({icon_4:'show'})}else{that.setData({icon_4:'hide'})};
    }
    if(index==5){
      if((wx.getStorageSync('shicode')||wx.getStorageSync('shengcode'))==''){that.setData({icon_5:'show'})}else{that.setData({icon_5:'hide'})};
    }
    if(index==6){
      if(e.detail.value==''){that.setData({icon_6:'show'})}else{that.setData({icon_6:'hide'})};
    }
    if(index==7){
      if(e.detail.value==''||e.detail.value.length<10){
        wx.showToast({
          title: '工作描述需在15到150个字之间',
          icon: 'loading',
          duration: 500
        })
        that.setData({icon_7:'show'});
        return;
        }else{that.setData({icon_7:'hide'})};
    }
  }
})
