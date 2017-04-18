var apiUrl = "http://play10.pcauto.com.cn/auto170401/action/",
    isEnd = 0,
    todayCoins = 0,
    canGet = 0;
var vipRule = [{
    rank: [0, 99],
    icon: "6",
    text: "入门粉丝"
}, {
    rank: [100, 499],
    icon: "6",
    text: "初级粉丝"
}, {
    rank: [500, 999],
    icon: "6",
    text: "中级粉丝"
}, {
    rank: [1000, 2499],
    icon: "6",
    text: "高级粉丝"
}, {
    rank: [2500, 4499],
    icon: "6",
    text: "铁杆粉丝"
}, {
    rank: [4500, 7499],
    icon: 5,
    text: "铜牌粉丝"
}, {
    rank: [7500, 12499],
    icon: 4,
    text: "银牌粉丝"
}, {
    rank: [12500, 19999],
    icon: 3,
    text: "金牌粉丝"
}, {
    rank: [20000, 29999],
    icon: 2,
    text: "骨干粉丝"
}, {
    rank: [30000, 49999],
    icon: 2,
    text: "资深粉丝"
}, {
    rank: [50000, 69999],
    icon: 2,
    text: "意见领袖"
}, {
    rank: [70000, 119999],
    icon: 1,
    text: "元老成员"
}, {
    rank: [120000, 999999999],
    icon: 1,
    text: "至尊成员"
}];

$(document).ready(function() {
    if (!window.location.href.match("machine")) {
        $("body").addClass("debug");
        setTimeout(function() {
            Magazine.trigger(1);
        }, 1000);
    }


    Magazine.addEvent(1, function() {
        $(".tree").addClass('show');
        setTimeout(function() {
            $("#title").addClass('show');
            setTimeout(function() {
                $(".car").addClass('show');
                setTimeout(function() {
                    $("#plate").addClass('show');
                }, 1500);
            }, 400);
        }, 300);
    });
    Magazine.addEvent(6, function(data) {
        console.log(data)
        if (data.isSuccess == "1") {
            $.ajax({
                type: "GET",
                url: apiUrl + "addCoins.jsp",
                data: {
                    accountId: userInfo.userId,
                    app: 1,
                    common_session_id: userInfo.sessionId,
                    id: game.id
                },
                dataType: "jsonp",
                success: function(data) {
                    if (data.code == 1) {
                        showMsg('images/pop_up_info/get_coins_done.png', '<div id="get-coins-done-close" class="abs get-coins-done-close"></div>');
                        $("#get-coins-done-close").one("touchstart", function() {
                            window.location.reload(1);
                        })
                    }
                }
            })
        }

    })
    game.init();
});
//事件绑定
$(".btn-msg").tap(function(e) {
    e.stopPropagation();
    showMsg(e.target.getAttribute('data-pic'));
});
$("#close").tap(function(e) {
    e.stopPropagation();
    $('#showDiv').removeClass("show").find(".content").html("");
});
$(".shareBtn").tap(function(e) {
    e.stopPropagation();
    $.ajax({
        type: "GET",
        url: apiUrl + "submit.jsp",
        data: {
            accountId: userInfo.userId,
            app: 1,
            common_session_id: userInfo.sessionId,
            score: parseInt(game.score)
        },
        dataType: "jsonp",
        success: function(data) {
            if (data.code == 1) {
                console.log(data);
                game.id = data.id;
                if (data.canGet == 0) {
                    $(".shareBtn").css("background-image", "url(images/game_scene/button_share2.png)")
                }

            }
        }
    })
    game.share();
})
$("#view").tap(function(e) {
    var id = e.target.id;
    switch (id) {
        case 'rankClose':
            e.stopPropagation();
            $("#rank").removeClass('show');
            break;
        case 'btn-rank':
            e.stopPropagation();
            rank();
            break;
        case 'vipClubClose':
            e.stopPropagation();
            $("#vipClub").removeClass('show');
            break;
        case 'vipTips':
            e.stopPropagation();
            $("#vipClub").addClass('show');
            break;
        case 'appStoreBtn':
            e.stopPropagation();
            window.location.href = "https://itunes.apple.com/cn/app/id575782252?mt=8";
            break;
        case 'get-coins-done-close':
            e.stopPropagation();
            $('#showDiv').removeClass("show").find(".content").html("");
            break;
        default:
            // statements_def
            break;
    }
})

function showMsg(url) {
    var _img = new Image();
    var showDiv = $("#showDiv");
    var showImg = $("#showDiv>#showImg");
    _img.onload = function() {
        var w = this.width / window.devicePixelRatio,
            h = this.height / window.devicePixelRatio;
        showImg.css({
            "background-image": 'url(' + url + ')',
            "background-size": w + 'px ' + h + "px",
            "width": w + "px",
            "height": h + "px"
        });
        showDiv.addClass("show");
    };
    if (arguments[1]) {
        showImg.find('.content').html(arguments[1])
    }
    _img.src = url;
}

function rank() {
    // appInfo.appVer = 3;
    // appInfo.appMinVer = 2;
    if (!navigator.onLine) {
        showMsg('images/pop_up_info/offline_rank.png');
    } else if (appInfo.appVer < appInfo.appMinVer) {
        showMsg('images/pop_up_info/update_app.png', '<div id="appStoreBtn" class="abs appStoreBtn"></div>');
    } else if (!userInfo.userId) {
        // alert("请登录");
        Magazine.callApp("login:");
        // location.href = 'login:';
    } else {
        $("#rank").addClass("show");
        // if (rankNum == 1) {
        $("#rankCoinTable").html("loading...");
        $("#rankTableHead").html("<tr><td>头衔</td><td>车友</td><td>积分</td></tr>");
        $("#rankCoin").show();
        $("#rankTest").hide();
        // _getRankCoin();
        (function() {
            $.ajax({
                type: "GET",
                url: "https://coin.pchouse.com.cn/user/getCoinTop.do",
                data: {
                    accountId: userInfo.userId,
                    mag: "pcauto",
                    pageNo: 1,
                    pageSize: 50,
                    common_session_id: userInfo.sessionId,
                },
                dataType: "jsonp",
                success: function(data) {
                    console.log(data);
                    if (data.MyName) {
                        var list = "";
                        for (var i = 0; i < data.list.length; i += 1) {
                            list += "<tr><td class='honor'>" + data.list[i].rank + _getHonor(data.list[i].coins) + "</td><td><span>" + data.list[i].nickName + "</span></td><td>" + data.list[i].coins + "分</td></tr>";
                        }
                        if (data.list.length > 10) {
                            $("#rankCoin>.upTips").show();
                        } else {
                            $("#rankCoin>.upTips").hide();
                        }
                        // data.myCoins = 150000;
                        $("#rankCoinTable").html(list);
                        $("#myRankCoins>.myRankTable").html("<tr><td class='honor'>" + data.myRank + _getHonor(data.myCoins) + "</td><td><span>" + data.MyName + "</span></td><td>" + data.myCoins + "分</td></tr>");
                    } else {
                        console.log("wrong!");
                    }
                },
                error: function(xhr, type) {
                    showMsg('images/pop_up_info/offline_rank.png');
                }
            })
        })()
        // }
        function _getHonor(a_num) {
            var img = "";
            vipRule.map(function(item) {
                if (item.rank[0] <= a_num && item.rank[1] >= a_num) {
                    img = item.icon ? "<img src='images/pop_up_info/g" + item.icon + ".png'" + " width='22'>" : "";
                    img += " " + item.text;
                }
            })
            return img;
        }
    }
}
