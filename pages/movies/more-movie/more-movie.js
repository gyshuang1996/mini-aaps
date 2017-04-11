// pages/movies/more-movie/more-movie.js
var app=getApp()
var util=require("../../../utils/util.js")
Page({
  data: {
    navigateTitle: "",
    movies:{},
    requestUrl:"",
    totalCount:0,
    isEmpty:true,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var category = options.category;//获取movies.js里面的URL
    this.data.navigateTitle = category;
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.g_doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.g_doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣top250":
        dataUrl = app.globalData.g_doubanBase + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl=dataUrl;
    //调用发送请求的函数 callback返回一个函数
    util.http(dataUrl,this.processDoubanData)
    /* //动态导航条 
     wx.setNavigationBarTitle({
       title:category
     }) 也可以在onready函数里加*/
  },
  //下拉刷新 在配制里面配制"enablePullDownRefresh": true
  //若要使用下拉刷新，请使用页面的滚动，而不是 scroll-view ，这样也能通过点击顶部状态栏回到页面顶部
  //上滑加载更多
  onScrollLower: function (event) {
    var nextUrl=this.data.requestUrl+"?start="+this.data.totalCount+"&count=20";
    util.http(nextUrl,this.processDoubanData)
    wx.showNavigationBarLoading()//lodding 图标 有个开始有个结束
  },
  processDoubanData:function(moviesDouban){
    var movies = [];
    for (var index in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[index];
      var title = subject.title;
      //判断题目的长度 如果太长了就用省略号代替
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      };
      //评分  把星星转化为数组 五颗星[1,1,1,1,1],三颗星[1,1,1,0,0]
      //把要用的数据放在temp里 然后在放在movies里 好调用数据 就像调用本地数据一样
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
      var totalMovies={}
      //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
      if(!this.data.isEmpty){
        totalMovies=this.data.movies.concat(movies);
      }else{
        totalMovies=movies;
        this.data.isEmpty=false;
      }
    this.setData({
      movies:totalMovies
      })
      this.data.totalCount+=20;
      wx.hideNavigationBarLoading()//隐藏加载图标loading
  },
  onReady:function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    })
  },
  onMovieTap:function(event){
    var movieId=event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id='+movieId,
    })
  },
})