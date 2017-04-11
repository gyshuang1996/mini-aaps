var util=require("../../utils/util.js")
var app = getApp();
Page({
  data:{
    inTheaters:{},
    comingSoon:{},
    top250:{},
    searchResult:{},
    containerShow:true,
    searchPanelShow:false,
  },
  //RESTful API 简介及调用
  onLoad: function (event) {
    //一共20条数据 我们从零开始 但我们只要三条数据
    var inTheatersUrl = app.globalData.g_doubanBase + "/v2/movie/in_theaters" + "?start=0&&count=3";
    var comingSoonUrl = app.globalData.g_doubanBase + "/v2/movie/coming_soon" + "?start=0&&count=3";
    var top250Url = app.globalData.g_doubanBase + "/v2/movie/top250" + "?start=0&&count=3";
    this.getMovieListData(inTheatersUrl,"inTheaters","正在热映");
    this.getMovieListData(comingSoonUrl,"comingSoon","即将上映");
    this.getMovieListData(top250Url,"top250","豆瓣top250");
  },
  onMoreTap:function(event){
    var category=event.currentTarget.dataset.category
    wx.navigateTo({
      url: 'more-movie/more-movie?category='+category,
    })
  },
  onMovieTap:function(event){
    var movieId=event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id='+movieId,
    })
  },
  getMovieListData: function (url,settedKey,currenttitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        console.log(res)
        that.processDoubanData(res.data,settedKey,currenttitle)
      },
      fail: function () {
        console.log(false)
      }
    });
  },
  onBindFocus:function(event){
      this.setData({
        containerShow:false,
        searchPanelShow:true,
      })
  },
  onCancelImgTap:function(event){
      this.setData({
        containerShow:true,
        searchPanelShow:false,
        //searchResult:{},第二次访问搜索页面时 清空页面情况
      })
  },
  onBindChange:function(event){
      var text=event.detail.value
      var searchUrl=app.globalData.g_doubanBase + "/v2/movie/search?q=" +text;
      this.getMovieListData(searchUrl,"searchResult","")
  },
  processDoubanData: function (moviesDouban,settedKey,currenttitle) {
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
    var readymovies={};
    readymovies[settedKey]={
      movies:movies,
      currenttitle:currenttitle
    }
    this.setData(readymovies);
  }
})
