var _tmplCache = {}
this.parseTemplate = function(str, data) {
    var err = "";
    try {
        var func = _tmplCache[str];
        if (!func) {
            var strFunc =
                "var p=[],print=function(){p.push.apply(p,arguments);};" +
                    "with(obj){p.push('" +
                    str.replace(/[\r\t\n]/g, " ")
                        .replace(/'(?=[^#]*#>)/g, "\t")
                        .split("'").join("\\'")
                        .split("\t").join("'")
                        .replace(/<#=(.+?)#>/g, "',$1,'")
                        .split("<#").join("');")
                        .split("#>").join("p.push('")
                    + "');}return p.join('');";
            func = new Function("obj", strFunc);
            _tmplCache[str] = func;
        }
        return func(data);
    } catch (e) { err = e.message; }
    return "< # ERROR: " + err.htmlEncode() + " # >";
}
var self = this;
var debug = 1;
var render = false;
var slideWidth = 0;
var prefs, jssor_slider, options;
if(typeof gadgets != 'undefined') {
    prefs = new gadgets.Prefs();
    debug = 0;
}

function initMainContainer() {
    var parentWidth;
    var pieces = options.$DisplayPieces;
    var itemWidth = options.$SlideWidth;
    var spacing = options.$SlideSpacing;
    if (pieces > 1) {
        parentWidth = pieces * (itemWidth + spacing / 2) + spacing;
    } else {
        parentWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }
    var parentHeight = document.body.clientHeight;
    var slideHeight;
    if (debug == 0 ) {
        slideWidth = prefs.getInt("SlideWidth");
        slideHeight = prefs.getInt("SlideHeight");
        if (slideWidth <= 0) {
            slideWidth = parentWidth;
        }
        if (slideHeight <= 0) {
            slideHeight = parentHeight;
        }
    } else {
        slideWidth = parentWidth;
        slideHeight = defaultConfig.slideHeight;
    }


    $("#main-container").html(
        [
            "<div id=\"slider_container\" style=\"top:0;left:0;width:" + slideWidth + "px;height:" + slideHeight + "px;\">",
            "<div class=\"slide-container\" u=\"slides\" style=\"top:0;left:0;width:" + slideWidth + "px;height:" + slideHeight + "px;\">",
            "</div>",
            "<div id=\"arrow-container\" style=\"display: none\"></div>",
            "<div id=\"bullet-container\" style=\"display: none\"></div>",
            "<div id=\"thumbnail-container\" style=\"display: none\"></div>",
            "</div>"
        ].join("")
    );
}



function init(items, template) {
    var slideItems;
    slideItems = new Array(items.length);
    if (debug == 0) {
        var mainCss = prefs.getString("MainContainerCss");
        if (mainCss && mainCss.length > 0 ) {
            $("#main-container").css($.parseJSON(decodeURIComponent(mainCss)));

        }

    }

    for (var i = 0; i < items.length; i++) {
        slideItems.push(self.parseTemplate(template, items[i]));
    }
    if (slideItems.length == 0) {
        $(".slide-container").html("<h1>No slide item found!</h1>");
    } else {
        render = true;
        $(".slide-container").html(slideItems.join(""));
    }

}

if (debug == 0) {
    options = {
        $AutoPlay: prefs.getBool("AutoPlay"),
        $AutoPlayInterval: prefs.getInt("AutoPlayInterval"),
        $PauseOnHover: prefs.getInt("PauseOnHover"),
        $ArrowKeyNavigation: prefs.getBool("ArrowKeyNavigation"),
        $SlideDuration: prefs.getInt("SlideDuration"),
        $MinDragOffsetToSlide: prefs.getInt("MinDragOffsetToSlide"),
        //$SlideWidth: 600,
        //$SlideHeight: 300,
        $SlideSpacing: prefs.getInt("SlideSpacing"),
        $DisplayPieces: prefs.getInt("DisplayPieces"),
        $ParkingPosition: prefs.getInt("ParkingPosition"),
        $UISearchMode: prefs.getInt("UISearchMode"),
        $PlayOrientation: prefs.getInt("PlayOrientation"),
        $DragOrientation: prefs.getInt("DragOrientation")
    };
    var itemWidth = prefs.getInt("ItemWidth");
    if (typeof itemWidth != "undefined" && itemWidth > 0) {
        options.$SlideWidth = itemWidth;
    }
    if (prefs.getBool("EnableBulletNavigator")) {
        options.$BulletNavigatorOptions = {
            $Class: $JssorBulletNavigator$,
            $ChanceToShow: prefs.getInt("BulletNavigatorOptions.ChanceToShow"),
            $AutoCenter: prefs.getInt("BulletNavigatorOptions.AutoCenter"),
            $Steps: prefs.getInt("BulletNavigatorOptions.Steps"),
            $Lanes: prefs.getInt("BulletNavigatorOptions.Lanes"),
            $SpacingX: prefs.getInt("BulletNavigatorOptions.SpacingX"),
            $SpacingY: prefs.getInt("BulletNavigatorOptions.SpacingY"),
            $Orientation: prefs.getInt("BulletNavigatorOptions.Orientation")
        }
    }
    if (prefs.getBool("EnableArrowNavigator")) {
        options.$ArrowNavigatorOptions = {
            $Class: $JssorArrowNavigator$,
            $ChanceToShow: prefs.getInt("ArrowNavigatorOptions.ChanceToShow"),
            $AutoCenter: prefs.getInt("ArrowNavigatorOptions.AutoCenter"),
            $Steps: prefs.getInt("ArrowNavigatorOptions.Steps")
        }
    }
    if (prefs.getBool("EnableThumbnailNavigator")) {
        options.$ThumbnailNavigatorOptions = {
            $Class: $JssorThumbnailNavigator$,
            $ChanceToShow: prefs.getInt("ThumbnailNavigatorOptions.ChanceToShow"),
            $ActionMode: prefs.getInt("ThumbnailNavigatorOptions.ActionMode"),
            $AutoCenter: prefs.getInt("ThumbnailNavigatorOptions.AutoCenter"),
            $Lanes: prefs.getInt("ThumbnailNavigatorOptions.Lanes"),
            $SpacingX: prefs.getInt("ThumbnailNavigatorOptions.SpacingX"),
            $SpacingY: prefs.getInt("ThumbnailNavigatorOptions.SpacingY"),
            $DisplayPieces: prefs.getInt("ThumbnailNavigatorOptions.DisplayPieces"),
            $ParkingPosition: prefs.getInt("ThumbnailNavigatorOptions.ParkingPosition"),
            $Orientation: prefs.getInt("ThumbnailNavigatorOptions.Orientation"),
            $DisableDrag: prefs.getBool("ThumbnailNavigatorOptions.DisableDrag")
        }
    }
} else {
    options = defaultOptions();
}

function ScaleSlider() {

    if ((debug == 0 && !prefs.getBool("AutoResize")) || (debug == 1 && !defaultConfig.autoResize)) {
        return;
    }
    var  parentWidth = document.body.clientWidth;
    var pieces =  options.$DisplayPieces;
    if (pieces > 1) {
        parentWidth = Math.min(980, parentWidth);
    } else {
        parentWidth = document.body.clientWidth;
    }
    parentWidth = Math.max(400, parentWidth);
    var parentHeight = document.body.clientHeight;
    if (typeof jssor_slider == 'undefined') {
        return;
    }

    if (parentWidth) {
        jssor_slider.$SetScaleWidth(parentWidth);
        if (debug == 0) {
            if (typeof gadgets.window != 'undefined') {
                gadgets.window.adjustHeight();
            }
        }
    }
    else
        window.setTimeout(ScaleSlider, 30);
}

if (!navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|IEMobile)/)) {
    $(window).bind('resize', ScaleSlider);
}
if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
    $(window).bind("orientationchange", ScaleSlider);
}

var itemsData = {
    template: null,
    items: null
}

var loadStatus = {
    template: false,
    items: false,
    arrow: false,
    bullet: false,
    thumbnail: false
}

function getParams(type, value) {
    var params = {};
    return params[type] = value;
}

function generateNoCacheUrl(url) {
    var refreshInterval = 0;
    var sep = "?";
    if (url.indexOf("?") > -1) {
        sep = "&";
    }
    return [ url, sep, "nocache=",
        refreshInterval ].join("");
}

function initData() {
    var params = {};
    var url;
    var type;
    var baseUrl = "https://cmg-gadget.googlecode.com/git/slideshows/";
    params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.TEXT;
    gadgets.io.makeRequest(
        generateNoCacheUrl(prefs.getString("DataURL")),
        function(obj) {
            if (typeof obj.text != 'undefined') {
                itemsData.items = $.parseJSON(obj.text);
                loadStatus.items = true;
            }
        }
    );

    gadgets.io.makeRequest(
        generateNoCacheUrl(prefs.getString("TemplateURL")),
        function(obj) {
            if (typeof obj.text != 'undefined') {
                itemsData.template = obj.text;
                loadStatus.template = true;
            }
        }
    );
    type = prefs.getInt("ArrowNavigatorType");
    url = baseUrl + "skin/arrow-" + (type > 9 ? type : ("0" + type)) + ".source.html";

    gadgets.io.makeRequest(
        url,
        function(obj) {
            if (typeof obj.text != 'undefined') {
                if (prefs.getBool("EnableArrowNavigator")) {
                    $("#arrow-container").replaceWith(obj.text);
                }
                loadStatus.arrow = true;
            }
        }
    )

    type = prefs.getInt("BulletNavigatorType");
    url = baseUrl + "skin/bullet-" + (type > 9 ? type : ("0" + type)) + ".source.html";

    gadgets.io.makeRequest(
        url,
        function(obj) {
            if (typeof obj.text != 'undefined') {
                if (prefs.getBool("EnableBulletNavigator")) {
                    $("#bullet-container").replaceWith(obj.text);
                }
                loadStatus.bullet = true;
            }
        }
    );

    type = prefs.getInt("ThumbnailNavigatorType");
    url = baseUrl + "skin/thumbnail-" + (type > 9 ? type : ("0" + type)) + ".source.html";

    gadgets.io.makeRequest(
        url,
        function(obj) {
            if (typeof obj.text != 'undefined') {
                if (prefs.getBool("EnableThumbnailNavigator")) {
                    $("#thumbnail-container").replaceWith(obj.text);
                }
                loadStatus.thumbnail = true;
            }
        }
    );

}

function loadData() {
    if (loadStatus.template && loadStatus.items && loadStatus.arrow && loadStatus.bullet && loadStatus.thumbnail) {
        init (itemsData.items, itemsData.template);
        $(".zoomable").hover(
            function() {
                $(this).css("width", ($(this).width() * 1.1) + "px");
            }, function() {
                $(this).css("width", "");
            }
        );
        jssor_slider = new $JssorSlider$("slider_container", options);
        ScaleSlider();
    } else {
        window.setTimeout(loadData, 30);
    }
}

function initGadget() {
    initMainContainer();
    initData();
    loadData();
}

if (debug == 1) {
    $( document ).ready(function() {
        initMainContainer();
        init (self.items, $("#default-template").html());
        jssor_slider = new $JssorSlider$("slider_container", options);
        ScaleSlider();
    });
} else {
    gadgets.util.registerOnLoadHandler(initGadget);
}

$(document).click(function(event) {
    var target = event.target;
    var tagName = $(target).prop("tagName");
    var href;
    if (tagName == 'a' || tagName == 'A') {
        href = $(target).attr("href");
        window.parent.location.href = href;
        return false;
    } else {
        var $aTag = $(target).parents("a");
        if ($aTag.length > 0) {
            href = $aTag.attr("href");
            window.parent.location.href = href;
            return false;
        }
    }
});

