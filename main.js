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
                $("#title").addClass('show')
                setTimeout(function() {
                    $(".car").addClass('show');
                    setTimeout(function() {
                        $("#plate").addClass('show')
                    }, 1500)
                }, 400)
            }, 300)
        });
    })
    //事件绑定
$(".btn-msg").tap(function(e) {
    showMsg(e.target.getAttribute('data-pic'));
});
$("#showDiv").tap(function() {
    $('#showDiv').removeClass("show");
});

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
    }
    _img.src = url;
}
