// ==UserScript==
// @name        TwitchSync
// @namespace   http://www.twitch.tv
// @description A network synced play button for Twitch.
// @include     http://*.twitch.tv/*
// @version     1
// ==/UserScript==

function javascriptIsTragicSometimes() {



    function twitchsync_main()
    {
        var socket = io.connect('http://twitchsync.gotdoofed.com');
        socket.on('count', function(data) {
            console.log("there are now " + data.count + "people syncing this video");
            if(data.count < 2)
            {
                QQ("#twitchsync_count").html("Play Foreveralone");
            }
            else
            {
                QQ("#twitchsync_count").html("Play (for " + String(data.count) + " People)");
            }
        });
        socket.on('play', function(data) {
            console.log("resuming GD synced twitch video!");
            try {
                QQ("#archive_site_player_flash").play_video();
            } catch (dontcare) {}
            try {
                QQ("#archive_site_player_flash")[0].play_video();
            } catch (dontcare) {}
        });
        socket.on('connect', function() {
            console.log("clueing in server that we're watching " + String(window.location));
            socket.emit('which', { url: String(window.location) });
        });
        socket.on('disconnect', function() {
                QQ("#twitchsync_count").html("Connecting...");
        });

        //if(QQ("#archive_site_player_flash"))
        console.log("Found an archive player on " + window.location);

        window.derp = function() {
            console.log("requesting net sync'd playback!");
            socket.emit('play', { url: String(window.location) });
        };

        var html = "<a class=\"primary_button action\" onclick=\"window.derp()\"><span id=\"twitchsync_count\">Connecting...</span></a>";
        QQ("#channel_actions").append(html);
    };










    console.log("jQuery enabled for " + window.location + ", getting socket.io");
    var script = document.createElement("script");
    script.setAttribute("src", "http://twitchsync.gotdoofed.com/socket.io/socket.io.js");
    script.addEventListener('load', function() {
            var script = document.createElement("script");
            script.textContent = "window.QQ=jQuery.noConflict(true);(" + twitchsync_main.toString() + ")();";
            document.body.appendChild(script);
            }, false);
    document.body.appendChild(script);
}

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.QQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

(function() {
    var loc = String(window.location);
    if(loc.search("http://www.twitch.tv") == 0)
    {
        addJQuery(javascriptIsTragicSometimes);
    }
})();
