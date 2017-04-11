Page({
    ontap:function(){
        //wx.navigateTo({url:"../posts/post"}); //跳转到指定页面 但有返回键 是作为前一个页面的子页面
        //wx.redirectTo({url:"../posts/post" });//平行跳转 不存在子页面
        wx.switchTab({url:"../posts/post" });
        // wx.navigateTo 和 wx.redirectTo 不允许跳转到 tabbar 页面，只能用 wx.switchTab 跳转到 tabbar 页面  
    }
    
})