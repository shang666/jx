// pages/index/djt/invent.js
var address = require('../../../utils/address.js');
Page({
  data:{
    box:'hide',
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
    textnum:'0',
    totalAmount_box:'hide',
    icon_1:'hide',
    icon_2:'hide',
    icon_3:'hide',
    icon_4:'hide',
    icon_5:'hide',
    icon_6:'hide',
    time_box:'true',
    dirs:'show',
    dirs_l:'hide',
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
    }) 
    
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    console.log('加载完成');
         
  },
  getworkerData:function(url){
 
  },
  inventWork:function(){
    wx.showModal({
      title: '确定邀约?',
      content: '',
      success: function(res) {
        if (res.confirm) {
          var  data = {
                  userId:wx.getStorageSync('userId'),
                  projectId:'',
                  projectType:'2',
                  projectContent:'',//工作描述
                  projectTitle:'',//标题
                  workProvince:'',
                  workCity:'',
                  workCounty:'',
                  workAddr:'',
                  payType:'1',
                  longitude:'',
                  latitude:'',
                  jsonStr:{
                        workTypeCode:'',
                        workStartDate:'',
                        workEndDate:'',
                        totalAmount:'',
                        detailContent:'',
                  }
                };
          wx.request({
            url: wx.getStorageSync('host')+'/user/projectinfo!releaseProject.jhtml',
            data:data,
            method: 'POST', 
            header: {'content-type':'application/x-www-form-urlencoded'},
            success: function(res){
              wx.redirectTo({
                url: '../mypro/mypro'
              })
            }
          })
          
        } else if (res.cancel) {
        }
      }
    })
  },
  showhide:function(){
    this.setData({
      box:'hide'
    })
  },
  xwRequest:function(postdata,url){
    var that = this;
    wx.request({
      url: url,//wx.getStorageSync('host')+'/user/projectinfo!releaseProject.jhtml'
      data:postdata,
      method: 'POST', 
      header: {
          'content-type':'application/x-www-form-urlencoded'
      },
      success: function(res){
        if(res.data.success){
          if(that.data.save==1){
                that.setData({
                  projectId:res.data.data.projectId
                })
             }else{
               wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000,
                  success:function(res){
                      setTimeout(function(){
                        wx.redirectTo({
                            url: '../mypro/mypro'
                          })
                      },1500)
                    }
                })    
             }              
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
    var that =this;
    var data =  [{'workStartDate':e.detail.value.workStartDate,
      'workTypeCode':wx.getStorageSync('djtWorktype'),
      'workEndDate':e.detail.value.workEndDate,
      'workerNum':'1',
      'workerId':wx.getStorageSync('workerId'),
      'totalAmount':wx.getStorageSync('totalAmount')*(that.getTime2Time(e.detail.value.workEndDate,e.detail.value.workStartDate)+1),//
      'detailContent':''}]
        e.detail.postDate = {
        'projectType':2,
        'projectContent':e.detail.value.projectContent,
        'projectTitle':e.detail.value.projectTitle,
        'payType':e.detail.value.payType,
        'workProvince':wx.getStorageSync('shengcode'),//工作省
        'workCity':wx.getStorageSync('shicode'),
        'workCounty':wx.getStorageSync('xiancode'),
        'workAddr':e.detail.value.workAddr,
        'longitude':'0',//经度
        'latitude':'0',//纬度
        'userId':wx.getStorageSync('userId')
      }
       e.detail.postDate1 = {
        'jsonStr':JSON.stringify(data),
        'userId':wx.getStorageSync('userId')
      }
    that.setData({
      save:'1',
    })
    if(e.detail.value.projectTitle&&e.detail.value.workStartDate&&wx.getStorageSync('djtWorktype')&&e.detail.value.workEndDate&&wx.getStorageSync('shicode')&&wx.getStorageSync('shengcode')&&wx.getStorageSync('xiancode')&&e.detail.value.projectContent&&e.detail.value.workAddr&&wx.getStorageSync('userId')){
       that.xwRequest(e.detail.postDate,wx.getStorageSync('host')+'/user/projectinfo!saveProject.jhtml')
      wx.showModal({
        title: '确定邀约?',
        content: '',
        success: function(res) {
          if (res.confirm) {
            that.setData({
              save:'2'
            })
             e.detail.postDate1.projectId = that.data.projectId
             that.xwRequest(e.detail.postDate1,wx.getStorageSync('host')+'/user/projectinfo!releaseProject.jhtml')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      
    }else{
      wx.showToast({
        title: '请输入完整的信息',
        icon: 'loading',
        duration: 1000
      })
      if(e.detail.value.projectTitle==''||e.detail.value.projectTitle.length<5){
        that.setData({
          icon_1:'show'
        })
      }else{
        that.setData({
          icon_1:'hide'
        })
      }
      if(e.detail.value.workStartDate==''){
        that.setData({
          icon_2:'show'
        })
      }else{
        that.setData({
          icon_2:'hide'
        })
      }
      if(e.detail.value.workEndDate==''){
        that.setData({
          icon_3:'show'
        })
      }else{
         that.setData({
          icon_3:'hide'
        })       
      }
      if(e.detail.value.projectContent==''){
          that.setData({
            icon_6:'show'
          })
      }else{
        that.setData({
          icon_6:'hide'
        })
      }
      if(e.detail.value.workAddr==''){
          that.setData({
            icon_5:'show'
          })
      }else{
          that:setData({
            icon_5:'hide'
          })
      }
      if(that.data.detail_arr==''){
          that.setData({
            icon_4:'show'
          })
      }else{
          that.setData({
            icon_4:'hide'
          })
      }
    } 
  },
sendPro:function(){
    this.setData({
      box:'show'
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
          shadow:'show',
          dirs:'hide',
          dirs_l:'show',
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
          that.setData({
              arr_list:'hide',
              city_list:res.data,
              city:'show',
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
        console.log(res.data)
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
  console.log('old'+old_name+'name'+name)
  wx.setStorageSync('arr_city', old_name+name)
  wx.setStorageSync('xiancode', code)
    that.setData({
        xian:'hide',
        shadow:'hide',
        dirs_l:'hide',
        dirs:'show',
        detail_arr:wx.getStorageSync('arr_city')
    })
},
gettype:function(){
    var that = this;
    wx.request({
      url: wx.getStorageSync('host')+'/systemcode!listByCodeType.jhtml?sysCodeType=GZ',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        that.setData({
          worktype:'show',
          worktype_list:res.data,
          shadow:'show'
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
      worktype:'hide'
    })
},
 getTime2Time:function($time1, $time2){
    var time1 = arguments[0], time2 = arguments[1];
    time1 = Date.parse(time1)/1000;
    time2 = Date.parse(time2)/1000;
    var time_ = time1 - time2;
    return (time_/(3600*24));
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
    dirs:'hide',
    dirs_l:'show'
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
      days.push({'index':i});
    }
    // this.setData({
    //   days
    // });
      const arr=[];
      const arr2=[];
      let that = this;
      wx.request({
        url: wx.getStorageSync('host')+'/workerinfo!getWorkTimeByWorkerId.jhtml',
        data: {workerId:wx.getStorageSync('workerId')},
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
         header: {'content-type':'application/x-www-form-urlencoded'}, // 设置请求的 header
        success: function(res){
          console.log(res.data.data.length)      
          for(let i=0;i<res.data.data.length;i++){
              arr.push(res.data.data[i].workStartDate);
              arr2.push(res.data.data[i].workEndDate);
          }  
          console.log(arr)
          console.log(arr2)
          that.setData({
            arr:arr,
            arr2:arr2
          })
          console.log(that.data)
           let start_time = that.data.arr;
          // let end_time =that.data.arr2;
          let days_length =days
          //this.data.arr   开始的全部日期
          //this.data.arr2  结束的全部日期
          //this.data.days 所有的日期
          console.log(that.data.arr)
          //let onload_data=[];
          for(let i=0;i<start_time.length;i++){//先确定月份一样
            if(Number(arr[i].substr(5,2))==that.data.click_month&&that.data.click_month==Number(arr2[i].substr(5,2))){//在当月
                for(let m=0;m<days_length.length;m++){
                  if(Number(days[m].index)>=Number(arr[i].substr(8,2))&&Number(days[m].index)<=Number(arr2[i].substr(8,2))){
                    days[m].active='true';
                  }
                }
            }
            if(Number(arr[i].substr(5,2))<Number(arr2[i].substr(5,2))){//跨月状况---首先判断结束月份和开始月份不是一个月份
              if(Number(arr[i].substr(5,2))==that.data.click_month){//开始月和当前月是相同的
                for(let m=0;m<days_length.length;m++){
                  if(Number(days[m].index)>=Number(arr[i].substr(8,2))){
                    days[m].active='true';
                  }
                }
              }
              if(Number(arr[i].substr(5,2))<that.data.click_month&&Number(arr2[i].substr(5,2))>that.data.click_month){
                for(let m=0;m<days_length.length;m++){ //当前月在结束月和开始月之前
                    days[m].active='true';
                }
              }
              if(Number(arr2[i].substr(5,2))==that.data.click_month){
                for(let m=0;m<days_length.length;m++){//结束月和当前月是相同的
                  if(Number(days[m].index)<=Number(arr2[i].substr(8,2))){
                    days[m].active='true';
                  }
                }
              }
            }
          }
         that.setData({
            days
          })
          for(let m = 0;m<arr.length;m++){
            that.setData({
              bg1:arr[m],
              bg_num1:'28',
              bg_moth1:'6',
              end_bg1:arr2[m],
              end_bg_num1:'29',
              mo_num1:'6',
            }) 
          }      
        }     
      })
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
    console.log(e)
    let data_idx = e.currentTarget.dataset.idx;  //开始时间
    let data_active = e.currentTarget.dataset.active;
    
    if(data_active){
      wx.showToast({
        title: '此人工作档期已被占用，不可选择',
        icon: 'loading',
        duration: 2000
      });
      return;
    }
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
      if(data_idx.substr(7)<this.data.cur_data&&(this.data.cur_month==this.data.to_month)){
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
              console.log('这边是啥')
                if((getTime2Time(supplement(data_idx), supplement(this.data.bg)))<0){           
                  return;
                }
                console.log(this.data)
                //此处是判断结束日期是否跨工期
                //获取当前日期
                let start_month = supplement(this.data.bg).substr(5,2);
                let start_day= supplement(data_idx).substr(8,2);
                //循环获取当前开始日期之前是否有工期
                //if(this.data.arr2)
                console.log(supplement(data_idx))
                for(let i=0;i<this.data.arr2.length;i++){
                  console.log(Number(this.data.arr2[i].substr(5,2))<=supplement(data_idx).substr(5,2));
                  console.log(Number(this.data.arr2[i].substr(5,2)))
                  if(Number(this.data.arr2[i].substr(5,2))<=start_month){//之前有工期&&supplement(data_idx).substr(8,2)>=Number(this.data.arr2[i].substr(8,2))
                      // console.log(Number(supplement(data_idx).substr(5,2))==Number(this.data.arr2[i+1].substr(5,2)))
                      // console.log(Number(supplement(data_idx).substr(8,2))>Number(this.data.arr2[i+1].substr(8,2)))
                      // console.log(Number(supplement(data_idx).substr(8,2)))
                       console.log(this.data.arr2)
                       var _index = '';
                       this.data.arr2.length==1?_index=0:_index=i+1
                      if(Number(supplement(data_idx).substr(5,2))==Number(this.data.arr2[_index].substr(5,2))&&Number(supplement(data_idx).substr(8,2))>Number(this.data.arr2[_index].substr(8,2))){
                        console.log(1111)
                        wx.showToast({
                          title: '档期不可有交叉，请重新选择',
                          icon: 'loading',
                          duration: 2000
                        });
                        return;
                      }
                      console.log(supplement(data_idx).substr(5,2));
                      console.log(this.data.arr2[_index].substr(5,2))
                      if(Number(supplement(data_idx).substr(5,2))<Number(this.data.arr2[_index].substr(5,2))){
                        console.log(2222)
                        wx.showToast({
                          title: '档期不可有交叉，请重新选择',
                          icon: 'loading',
                          duration: 2000
                        });
                        return;
                      }
                      
                  }
                  //else{
                    if(Number(this.data.arr2[0].substr(5,2))>start_month){
                      if(Number(supplement(data_idx).substr(5,2))==Number(this.data.arr2[0].substr(5,2))&&Number(supplement(data_idx).substr(8,2))>Number(this.data.arr2[0].substr(8,2))){
                        console.log(3333)
                          wx.showToast({
                            title: '档期不可有交叉，请重新选择',
                            icon: 'loading',
                            duration: 2000
                          });
                          return;
                        };
                        if(Number(supplement(data_idx).substr(5,2))>Number(this.data.arr2[0].substr(5,2))){
                          console.log(4444)
                          wx.showToast({
                            title: '档期不可有交叉，请重新选择',
                            icon: 'loading',
                            duration: 2000
                          });
                          return;
                        }
                    }
                    
                  //}
                  
                }
                console.log(data_idx)
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
  },
  close_time:function(){
    var that = this;
    //保存现在的开工日期和完工日期
    var bg2 = that.data.bg;
    var end_bg2 = that.data.eng_bg;
    //开工和完工日期并存实现工程金额
    if(that.data.bg&&that.data.end_bg){
        function getTime2Time($time1, $time2){
            var time1 = arguments[0], time2 = arguments[1];
            time1 = Date.parse(time1)/1000;
            time2 = Date.parse(time2)/1000;
            var time_ = (time1 - time2);
            return (time_/(3600*24));
        };  
        that.setData({
          totalAmount_box:'show',
          danjia:wx.getStorageSync('totalAmount'),
          daynum:getTime2Time(that.data.end_bg.replace(/-/g, "/"),that.data.bg.replace(/-/g, "/"))+1,
          totalAmount:wx.getStorageSync('totalAmount')*(getTime2Time(that.data.end_bg.replace(/-/g, "/"),that.data.bg.replace(/-/g, "/"))+1),
         
        })
    }
    that.setData({
      shadow:'hide',
      time_box:'hide',
      dirs:'show',
      dirs_l:'hide',
      bg2:that.data.bg,
      end_bg2:that.data.end_bg
    })
  },
  textnum:function(e){
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
      xian:'hide',
      city:'hide',
      dirs:'show',
      dirs_l:'hide'
    })
  },
  get_icon:function(e){//失焦
    console.log(e);
    var that =this
    var index = e.target.dataset.index;
    if(index==1){
      if(e.detail.value==''||e.detail.value.length<5){
        wx.showToast({
          title: '工程名称需在5到25个字之间',
          icon: 'loading',
          duration: 500
        })
        that.setData({icon_1:'show'});
        return;
        }else{that.setData({icon_1:'hide'})};
    }
    if(index==2){
      if(wx.getStorageSync('worktypecode')==''){that.setData({icon_2:'show'})}else{that.setData({icon_2:'hide'})};
    }
    if(index==3){
      if(e.detail.value==''){that.setData({icon_3:'show'})}else{that.setData({icon_2:'hide'})};
    }
   if(index==4){
      if(e.detail.value==''){that.setData({icon_4:'show'})}else{that.setData({icon_4:'hide'})};
    }
    if(index==5){
      if(e.detail.value==''){that.setData({icon_5:'show'})}else{that.setData({icon_5:'hide'})};
    }
    if(index==6){
      if((wx.getStorageSync('shicode')||wx.getStorageSync('shengcode'))==''){that.setData({icon_6:'show'})}else{that.setData({icon_6:'hide'})};
    }
    // if(index==6){
    //   if(e.detail.value==''){that.setData({icon_6:'show'})}else{that.setData({icon_6:'hide'})};
    // }
    // if(index==7){
    //   if(e.detail.value==''||e.detail.value.length<10){
    //     wx.showToast({
    //       title: '工作描述需在15到150个字之间',
    //       icon: 'loading',
    //       duration: 500
    //     })
    //     that.setData({icon_7:'show'});
    //     return;
    //     }else{that.setData({icon_7:'hide'})};
    // }
  }
})