var com = {
    /**
     * 设置CSS3
     * @param {[type]} obj    [要操作的对象]
     * @param {[type]} f      [transform]
     * @param {[type]} t      [transition]
     * @param {[type]} attach [其它的属性对象]
     */
    setCss3: function(obj, f, t, attach) {
        var f = f || 'none',
            t = t || 'none';
        obj.css({ 'transform': f, 'transition': t, '-webkit-transform': f, '-webkit-transition': t });
        if (attach) obj.css(attach);
    },
    /**
     * 设置动画持续时间
     * @param {[type]} o [操作对象]
     * @param {[type]} t [持续时间]
     */
    setDuration: function(o, t, ease) {
        o.css({ 'animation-duration': t + 's', '-webkit-animation-duration': t + 's', });
        if (ease) o.css({ 'animation-timing-function': ease, '-webkit-animation-timing-function': ease, });
    },
};
var game = {
    hideTips: localStorage["gameTips201705"] ? true : false, //把是否显示游戏提示保存到本地存储
    gameWrapDom: $(".game-wrap"),
    score:0,
    id:0,
    init: function() {
        var me = this;
        //判断是否要显示游戏提示
        if (me.hideTips) {
            me.gameWrapDom.find(".how-to-play").hide();
        } else {
            var checkbox = me.gameWrapDom.find('.checkbox');
            var btnIKnew = me.gameWrapDom.find('.i-knew-it');
            checkbox.tap(function() {
                checkbox.toggleClass('checked');
            });
        }
        $('.i-knew-it,#btn-start').tap(function(e) {
            e.stopPropagation();
            if (isEnd == 1) {
                showMsg("images/pop_up_info/out_date.png");
                return false;
            }
            $(".game-wrap").addClass('show');
            if (me.gameWrapDom.find('.checkbox').hasClass("checked")) {
                me.hiedTips = true;
                window.localStorage.setItem("gameTips201705", "1");
            }
            me.gameWrapDom.find(".how-to-play").addClass('hide');
            me.gameWrapDom.find(".count-down").one("webkitAnimationEnd animationEnd", function() {
                me.heroRun();
            }).addClass('show');
        });
        //获取用户信息
        $.ajax({
            type: "GET",
            url: apiUrl + "getUser.jsp",
            data: {
                accountId: userInfo.userId,
                app: 1,
                common_session_id: userInfo.sessionId
            },
            dataType: "jsonp",
            success: function(data) {
                if (data.code == 1) {
                    isEnd = data.isEnd;
                    todayCoins = todayCoins;
                }
            }
        })
    },
    start: function() {
        var me = this;
        $('.count-down').addClass('show');
    },
    heroRun: function() {
        var me = this;
        var hero = $('#hero'),
            $screenshot = $('.screenshot'),
            ranNum = Math.floor(Math.random() * 8) + 1,
            carW = 191,
            carH = 113,
            speedR = 10 + Math.round(Math.random() * 10),
            //分数
            score = 0,
            coins = 0,
            carInitPosition = [{ //车的初始位置
                x: window.innerWidth / 2 - carW / 2, //上
                y: -carH,
                r: 0
            }, {
                x: window.innerWidth / 2 - carW / 2, //下
                y: window.innerHeight + carH,
                r: 0
            }, {
                x: -carW, //左
                y: 311 - carH / 2,
                r: 0
            }, {
                x: window.innerWidth + carW, //左
                y: 311 - carH / 2,
                r: 0
            }],
            carInitPositionIndex = Math.floor(Math.random() * 4),
            carObj = carInitPosition[carInitPositionIndex],
            speedV = (15 + Math.round(Math.random() * 10)) * (carObj.y < 0 ? 1 : -1),
            speedH = (15 + Math.round(Math.random() * 10)) * (carObj.x < 0 ? 1 : -1),
            carImg = "images/game_scene/car_" + ranNum + ".png";
        console.log(carInitPositionIndex)

        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(callback) { window.setTimeout(callback, 1000 / 30); };
        window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || function(id) { window.clearTimeout(id); };
        hero.css({ 'background-image': 'url(' + carImg + ')' });
        $(".game-running").show();
        $(".gameEnd").hide();
        $("#cursor").show();
        $screenshot.find('li span').removeClass("fade-out");
        hero.show();
        var state = false;
        var myReq;

        function draw() {
            carObj.r += speedR;
            switch (carInitPositionIndex) {
                case 0:
                    carObj.y += speedV;
                    if (carObj.y > window.innerHeight + 200) {
                        gameEnd();
                        window.cancelAnimationFrame(myReq);
                        return false;
                    }
                    break;
                case 1:
                    carObj.y += speedV;
                    if (carObj.y < -200) {
                        gameEnd();
                        window.cancelAnimationFrame(myReq);
                        return false;
                    }
                    break;
                case 2:
                    carObj.x += speedH;
                    if (carObj.x > window.innerWidth + 200) {
                        gameEnd();
                        window.cancelAnimationFrame(myReq);
                        return false;
                    }
                    break;
                case 3:
                    carObj.x += speedH;
                    if (carObj.x < -200) {
                        gameEnd();
                        window.cancelAnimationFrame(myReq);
                        return false;
                    }
                    break;
                default:
                    break;
            }
            com.setCss3(hero, 'translate(' + carObj.x + 'px,' + carObj.y + 'px) rotate(' + carObj.r + 'deg)');

            if (!state) {
                myReq = window.requestAnimationFrame(draw);
            }
        }

        myReq = window.requestAnimationFrame(draw);
        /**
         * 游戏结束
         * @return {[type]} [description]
         */
        function gameEnd() {
            state = true;
            var centerPointY = 311,
                centerPointX = window.innerWidth / 2;
            var offset = Math.sqrt(Math.pow(Math.abs(centerPointY - (carObj.y + 113 / 2)), 2) + Math.pow(Math.abs(centerPointX - (carObj.x + 191 / 2)), 2));
            $("#cursor").hide();
            $('.game-running').hide();


            var $sCar = $screenshot.find('.sCar');
            var ofX = carObj.x - 211;
            var ofY = carObj.y - 90;


            com.setCss3($sCar, 'translate(' + (ofX) + 'px,' + (ofY) + 'px) rotate(' + carObj.r + 'deg)', 'none', { 'background-image': 'url(' + carImg + ')' })

            $screenshot.addClass('show');
            window.setTimeout(function() {
                var len = $screenshot.find('li').length;
                for (var i = 0; i < len; i++) {
                    com.setCss3($screenshot.find('li').eq(i), 'rotate(' + (4 * i) + 'deg)', 'all 0.6s ease');
                }
            }, 30)
            $screenshot.find('li span').addClass("fade-out");

            hero.hide();
            $('.gameEnd').show();
            // //游戏得分
            var score =me.score= ((1 - offset / centerPointY) * 100).toFixed(2);
            var scoreText = $('.scoreNum').find('span').eq(0);
            var gameEndTxt = $(".gameEnd>.txt");
            if (score < 0) score = 0;
            $('.scoreNum').find('span').eq(1).text(score);
            //处理成绩对应的文案
            if (score > 95) {
                scoreText.text('厉害了');
            } else if (score > 84) {
                scoreText.text('你真行');
            } else if (score > 74) {
                scoreText.text('棒棒的');
            } else if (score > 64) {
                scoreText.text('不错呢');
            } else {
                scoreText.text('加把劲');
            }
            //处理成绩对应的获得的幸福币数量
            if (score > 98) {
                coins = 20;
            } else if (score > 84) {
                coins = 12;
            } else if (score > 78) {
                coins = 7;
            } else if (score > 68) {
                coins = 2;
            } else {
                coins = 0;
                $(".win-coins").hide();
            }
            if (coins != 0) $(".win-coins").show();
            $(".win-coins").find("span").text(coins);
            switch (ranNum) {
                case 1:
                    gameEndTxt.html("“汽车人！变形！出发！”，小时候听到擎天柱下这个命令时，<br />总希望自己也变身汽车人加入战斗有木有？")
                    break;
                case 2:
                    gameEndTxt.html("看了《头文字D》就中毒了，无数日夜幻想自己是拓海，是凉介，<br />开神车AE86上秋名山来一次超燃的漂移赛！")
                    break;
                case 3:
                    gameEndTxt.html("还记得那个牛逼闪闪、傲视一切的“闪电”麦坤，<br />还有“66号州际公路”边上小镇的可爱小车不？")
                    break;
                case 4:
                    gameEndTxt.html("狂飙、飞越、激撞、爆破！《极品飞车》在车迷心中绝对有着重要地位，<br />小伙伴中我就是最速车手啦！")
                    break;
                case 5:
                    gameEndTxt.html("不知你是否有认出，这是阿笠博士的爱车——黄色古董甲壳虫，<br />经常和少年侦探团一起出门旅行的……")
                    break;
                case 6:
                    gameEndTxt.html("看过《霹雳游侠》都会惊叹智能汽车基塔，能跑能说还能杀坏人。<br />那时还不知道它的原型是庞蒂亚克火鸟！")
                    break;
                case 7:
                    gameEndTxt.html("当年的四驱车情结，只有2元早餐钱也要省出1块给四驱车，<br />但是国产双钻车型跟小帅富改装车比只能被虐！")
                    break;
                case 8:
                    gameEndTxt.html("当时以为未来的F1就该是《高智能方程式》里那样子的，<br />而现在，发现动画里许多智能汽车功能已实现！")
                    break;
                default:
                    break;
            }

            /**
             * 再来一次
             */
            //添加事件绑定
            $(".againBtn").one("touchstart", function(e) {
                e.stopPropagation();
                com.setCss3($screenshot.find('li'));
                $screenshot.removeClass('show');
                me.heroRun();
            })
        }
        //拍照
        $('.takePhotoBtn').one("touchstart", function(e) {
            e.stopPropagation();
            gameEnd();
        })
    },
    share: function() {
        var me = this;
        var shareTitle = "你还记得儿时汽车梦吗？看我眼明手获得" + me.score + "分！";
        var iconurl = "html-2545812/images/share.jpg";
        var link = "http://www1.pcauto.com.cn/zt/pcyidong/201408/pcauto/index.html";
        window.location.href = "appshare://?title=" + shareTitle + "&icon=" + iconurl + "&url=" + link + "&sinatail=@PCatuo汽车杂志&qqtail=@PCatuo汽车杂志";
    }
};
