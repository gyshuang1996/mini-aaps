var postsData = require("../../../data/posts-data.js")
var app=getApp();//小程序里调用全局变量的方法
Page({
    data: {
        isplayingmusic:false
    },
    //option可以随便取个名字 用这个函数来接受id 
    onLoad: function (option) {
        //var globalData=app.globalData;
        var postId = option.id;
        this.data.currentPostId = postId;
        var postData = postsData.postList[postId];
        this.setData({ posts_data: postData });
        //设置缓存的指令wx.setStorage
        // wx.setStorageSync('key', "风暴英雄");
        //wx.setStorageSync('key', {name:"风暴英雄",age:"50"})
        //读取所有文章的缓存状态
        //wx.setStorageSync('post_collect', {postId:collected});
        var postscollected = wx.getStorageSync('post_collect');
        if (postscollected) {
            var postcollected = postscollected[postId];
            this.setData({
                collected: postcollected
            })
        } else {
            var postscollected = {};
            postscollected[postId] = false;
            wx.setStorageSync('post_collect', postscollected);
        }
        //页面返回 而音乐还在播放的话  再点击页面 音乐播放的图片自动会变为初始状态 也就是未播放状态
        //也就是页面又被重新加载了一次 默认音乐状态为false 所以得设置一个全局变量 在app.js里
        //判断全局变量
        if(app.globalData.g_isplayingmusic&&app.globalData.g_currentmusicpostId==this.data.currentPostId){
            this.setData({
                isplayingmusic:true
            });
            //this.data.isplayingmusic=true;
        }
        //在加载函数这里就直接开始监听音乐播放事件 
        var that=this;
        wx.onBackgroundAudioPlay(function() {
          that.setData({
              isplayingmusic:true
          });
          app.globalData.g_isplayingmusic=true;
          //当期播放页面的id
          app.globalData.g_currentmusicpostId=that.data.currentPostId;
        });
        wx.onBackgroundAudioPause(function() {
          that.setData({
              isplayingmusic:false
          });
          app.globalData.g_isplayingmusic=false;
          //没有播放时  清空
          app.globalData.g_currentmusicpostId=null;
        });
        //
        wx.onBackgroundAudioStop(function() {
          that.setData({
              isplayingmusic:false
          });
          app.globalData.g_isplayingmusic=false;
          //没有播放时  清空
          app.globalData.g_currentmusicpostId=null;
        })
    },
    ontap: function (event) {
     //this.getpostcollectedAsy();
         this.getpostscollectedSync();
    },
    //同步与异步的区别
    //异步
    getpostcollectedAsy: function () {
        var that = this;
        wx.getStorage({
            key: 'post_collect',
            success: function (res) {
                var postscollected = res.data;
                var postcollected = postscollected[that.data.currentpost];
                //取反 收藏变为未收藏 postcollected=!postcollected
                if (postcollected == true) {
                    postcollected = false;
                } else {
                    postcollected = true;
                }
                postscollected[that.data.currentpost] = postcollected;
                that.showToast(postscollected, postcollected);
            },
        })
    },
    //同步  
    getpostscollectedSync: function () {
        var postscollected = wx.getStorageSync('post_collect');
        var postcollected = postscollected[this.data.currentpost];
        //取反 收藏变为未收藏
        if (postcollected == true) {
            postcollected = false;
        } else {
            postcollected = true;
        }
        postscollected[this.data.currentpost] = postcollected;
        this.showToast(postscollected, postcollected);
    },
    showModal: function (postscollected, postcollected) {
        var that = this;
        wx.showModal({
            title: postcollected ? "收藏" : "取消",
            content: postcollected ? "是否收藏该文章?" : "取消收藏该文章?",
            showCancel: true,
            success: function (res) {
                if (res.confirm) {
                    //更新文章是否的缓存值
                    wx.setStorageSync('post_collect', postscollected);
                    //更新数据绑定变量 从而实现切换图片
                    that.setData({
                        collected: postcollected
                    })
                }
            }
        })
    },
    showToast: function (postscollected, postcollected) {
        //更新文章是否的缓存值
        wx.setStorageSync('post_collect', postscollected);
        //更新数据绑定变量 从而实现切换图片
        this.setData({
            collected: postcollected
        })
        wx.showToast({
            title: postcollected ? "收藏成功" : "取消收藏",
            duration: 200,
            icon: "success"
        })
    },
    //事件函数 最好里面加一个event
    onsharetap: function (event) {
        var itemList = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"
        ]
        //小程序目前不支持分享
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                //res.cancel  用户是否点击了取消按钮
                //res.tapIndex 点击的数组那个序号 从零开始 从上到下
                wx.showModal({
                    title: "用户" + itemList[res.tapIndex],
                    content: "是否取消" + res.cancel + "现在还无法实现分享功能 "
                })
            }

        })
    },
   
    onmusictap:function(event){
        var currentpostId=this.data.currentPostId 
        var isplayingmusic=this.data.isplayingmusic
        var postdata=postsData.postList[currentpostId]
        if(isplayingmusic){
            //实现音乐暂停
        wx.pauseBackgroundAudio();
        this.setData({
            isplayingmusic:false
        })
        }else{
            wx.playBackgroundAudio({
            //这里面的音乐路径不能是本地文件下的MP3 因为小程序不能超过1m
          dataUrl:postdata.music.url,
          title:postdata.music.title,
          //图片也是只能用网络路径 只有在真机上才能显示图片
         // coverImgUrl:""
        })
        this.setData({
            isplayingmusic:true
        })
        //改善问题  点击总播放器开始/暂停时  音乐图标按钮不会变 我们要让它一起改变
        //运用监听音乐播放事件
        }  
    }
    /*ontap:function(event){
        //获取缓存值
              var game=wx.getStorageSync("key")
           console.log(game);
     },
     onsharetap:function(event){
         //删除缓存值
         //缓存的上限最大不能超过10mb
         wx.removeStorageSync('key');
         //删除所有缓存
         wx.clearStorageSync();
     } */

})