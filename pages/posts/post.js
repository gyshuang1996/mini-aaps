//定义一个变量 用来接受前一个js文件输出的数据 用require 只能用相对路径
var postsData=require("../../data/posts-data.js")
Page({
  data:{
   //小程序总会读取data对象来做数据绑定 这个动作我们称做动作a
   //而这个动作a的执行 是在onload事件执行后发生的
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    
    this.setData({posts_key:postsData.postList});
    /*img:{
            post_img:"/images/post/crab.png",
             author_img:"/images/avatar/1.png"
        },*/
        //img_condition:true,
  },
  //event 当前事件对象 currenttarget当前鼠标对象 dataset所有数据的集合 
  onposttap:function(event){
    var postId=event.currentTarget.dataset.postid;
    //console.log("on post id is "+postId);
    wx.navigateTo({url:"post-detail/post-detail?id="+postId});
  },
  //如果我们在每个swiper-item下的image里面添加点击函数catchtap="onswipertap" 则调用下面这个函数 但是如果image太多了  我们就得每个image下面都加这个函数  太麻烦  所以我们看可以在swiper上面添加catchtap="onswiperTap"函数
  /*onswipertap:function(event){
    var postId=event.currentTarget.dataset.postid;
    wx.navigateTo({url:"post-detail/post-detail?id="+postId});
  },*/
  onswiperTap:function(event){
    //target和currentTarget的区别 
    //target值的是当前点击的组件 currentTarget指的是事件捕获的组件
    //此次事件是在swiper上面捕获的  但postid在image上 点击的组件也是image
    var postId=event.target.dataset.postid;
    wx.navigateTo({url:"post-detail/post-detail?id="+postId});
  }
})