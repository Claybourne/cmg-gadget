var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var prefs;
if(typeof gadgets != 'undefined') {
    prefs = new gadgets.Prefs();
}
if (prefs.getBool("displayDetail")) {
    $("#detail").show();
} else {
    $("#detail").hide();
}
var loadStatus = {};
loadStatus.youtube = false;
loadStatus.items = false;

var player, playlist, videos;

function onYouTubeIframeAPIReady() {
    loadStatus.youtube = true;
}

function initText(vid) {
    for (var i = 0; i < videos.length; i++) {
        var v = videos[i];
        if (v.id == vid) {
            $("#title").html(v.title);
            $("#description").html(v.description);
        }
    }
    adjustHeight();
}

function adjustHeight() {
    if (typeof gadgets.window != 'undefined') {
        gadgets.window.adjustHeight();
    }
}

if (!navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|IEMobile)/)) {
    $(window).bind('resize', adjustHeight);
}
if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
    $(window).bind("orientationchange", adjustHeight);
}

function onPlayerReady(event) {
    adjustHeight();
}
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        var list = player.getPlaylist();
        var currentVid = list[player.getPlaylistIndex()];
        initText(currentVid);
    }
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

function loadData() {
    if (loadStatus.youtube && loadStatus.items) {
        var tmp = prefs.getInt("theme");
        player = new YT.Player('player', {
            height: prefs.getString("frameHeight"),
            width: prefs.getString("frameWidth"),
            playerVars: {
                color: prefs.getString("color"),
                autohide: 1,
                modestbranding: 0,
                origin: prefs.getString("origin"),
                cc_load_policy: 0,
                theme: (tmp ==  1 ? 'light' : 'dark'),
                playlist : playlist.join(',')
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    } else {
        window.setTimeout(loadData, 30);
    }
}

function initGadget() {
    var params = {};
    params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.TEXT;
    gadgets.io.makeRequest(
        generateNoCacheUrl(prefs.getString("dataURL")),
        function(obj) {
            if (typeof obj.text != 'undefined') {
                videos =  $.parseJSON(obj.text);
                playlist = new Array();
                if (videos.length == 0) {

                } else {
                    initText(videos[0].id);
                    for(var i = 0; i < videos.length; i++) {
                        playlist.push(videos[i].id);
                    }
                }
                loadStatus.items = true;
            }
        }
    );
    loadData();
}
gadgets.util.registerOnLoadHandler(initGadget);