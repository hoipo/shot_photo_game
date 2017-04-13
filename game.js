var game = {
    hideTips: localStorage["gameTips201705"]?true:false, //把是否显示游戏提示保存到本地存储
    gameWrapDom: $(".game-wrap"),
    init: function () {
        var me = this;
        //判断是否要显示游戏提示
        if (me.hideTips) {
            me.gameWrapDom.find(".how-to-play").hide();
        }else{
            var checkbox =  me.gameWrapDom.find('.checkbox');
            var btnIKnew = me.gameWrapDom.find('.i-knew-it');
            checkbox.tap(function () {
                checkbox.toggleClass('checked');
            })
            btnIKnew.tap(function () {
                if (checkbox.hasClass("checked")) {
                    me.hiedTips = true;
                   window.localStorage.setItem("gameTips201705","1")
                }
                me.gameWrapDom.find(".how-to-play").addClass('hide');
            })

        }

    }
}