var com = {
            /**
         * 设置CSS3
         * @param {[type]} obj    [要操作的对象]
         * @param {[type]} f      [transform]
         * @param {[type]} t      [transition]
         * @param {[type]} attach [其它的属性对象]
         */
        setCss3:function(obj,f,t,attach){
            var f = f || 'none',
                t = t || 'none';
            obj.css({'transform':f,'transition':t,'-webkit-transform':f,'-webkit-transition':t});
            if(attach)obj.css(attach);
        },
        /**
         * 设置动画持续时间
         * @param {[type]} o [操作对象]
         * @param {[type]} t [持续时间]
         */
        setDuration:function(o,t,ease){
            o.css({'animation-duration':t + 's','-webkit-animation-duration':t + 's',});
            if(ease)o.css({'animation-timing-function':ease,'-webkit-animation-timing-function':ease,});
        },
};
var game = {
    hideTips: localStorage["gameTips201705"]?true:false, //把是否显示游戏提示保存到本地存储
    gameWrapDom: $(".game-wrap"),
    userInfo:{
        x:0,
        y:0,
        r:0,//旋转角度
        index:0,//表情图索引
        score:0//游戏得分
    },
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
            });
            btnIKnew.tap(function () {
                if (checkbox.hasClass("checked")) {
                    me.hiedTips = true;
                   window.localStorage.setItem("gameTips201705","1");
                }
                me.gameWrapDom.find(".how-to-play").addClass('hide');
                me.gameWrapDom.find(".count-down").one("webkitAnimationEnd animationEnd",function () {
                    me.start();
                }).addClass('show');
            });
        }
    },
    start:function () {
        var me = this;

    },
    heroRun:function () {
        
        var hero = $('#hero'),
            ranNum = Math.floor(Math.random()*8),
            carW = 191,
            carH = 113,
            speedV = 15 + Math.round(Math.random()*10),
            speedR = 10 + Math.round(Math.random()*10),
            //分数
            score = 0,
            carObj = {
                x: window.innerWidth/2,
                y:-carH,
                r:0
            }


        var carImg = "images/game_scene/car_"+ranNum+".png";

        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 30);};
        hero.css({'background-image':'url('+carImg+')'});
        var state = false;
        function draw(){
            carObj.y += speedV;
            carObj.r += speedR;
            if(carObj.y < window.innerHeight+200){
                com.setCss3(hero,'translate('+carObj.x+'px,'+carObj.y+'px) rotate('+carObj.r+'deg)');
            }else{
                gameEnd();
                return false;
            }
            
            if(!state) window.requestAnimationFrame(draw);
        }
        
        draw();
        /**
         * 游戏结束
         * @return {[type]} [description]
         */
        function gameEnd(){
            state = true;
            // var centerPointY = conf.H/2 - 105,
            //     centerPointX = conf.W/2;
            // var offsetY = Math.abs(centerPointY - bayObj.y);

            // $('.step3').find('.aim').fadeOut();
            // $('.takePhotoBtn').hide();
            // $('.takePhotoBtn').find('shine').removeClass('shineRotateAm');

            // var $screenshot = $('.main .screenshot');
            // var $sBay = $screenshot.find('.sBay');
            // var ofX = bayObj.x - (conf.W/2 - 534/2);
            // var ofY = bayObj.y - (conf.H/2 - 477/2 -105);


            // //$sBay.css({,'margin-left':bayObj.x-ofX,'margin-top':bayObj.y-ofY});
            // com.setCss3($sBay,'translate('+(ofX)+'px,'+(ofY)+'px) rotate('+bayObj.r+'deg)','none',{'background-image':'url('+bayImg+')'})

            // $screenshot.show();
            // window.setTimeout(function(){
            //     var len = $screenshot.find('li').length;
            //     for(var i=0;i<len;i++){
            //         com.setCss3($screenshot.find('li').eq(i),'rotate('+(4*i)+'deg)','all 0.6s ease');
            //     }
            // },30)
            // $screenshot.find('li span').show().fadeOut();

            // $bayRole.hide();
            // var $gameEnd = $('.main .gameEnd');
            // $gameEnd.show();
            // $('.step3 .againBtn').show();
            // //游戏得分
            // var score = ((1 - offsetY/centerPointY)*100).toFixed(2);
            // if(score<0)score=0;
            // $gameEnd.find('.scoreNum').find('span').text(score);

            // //保存大白信息
            // conf.userInfo.x = ofX;
            // conf.userInfo.y = ofY;
            // conf.userInfo.r = bayObj.r;
            // conf.userInfo.index = ranNum;
            // //用户所得的分数
            // conf.userInfo.score = score;

            // /**
            //  * 保存用户信息
            //  */
            // com.saveUserInfo();

            // /**
            //  * 再来一次
            //  */
            // $('.step3 .againBtn').one(START_EV,function(){
            //     $(this).hide();
            //     $gameEnd.hide();
            //     com.setCss3($screenshot.find('li'));
            //     $screenshot.hide();
            //     gameBegin();
            //     $('.step3').find('.aim').show();
            // })

            // com.wxShare();
        }

        //拍照
        $('.takePhotoBtn').one(START_EV,function(){
            gameEnd();
        })
    }
};