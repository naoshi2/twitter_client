// TODO : Open user name on reply
// TODO : Multi window
// TODO : Load multiple images
// TODO : Show images with modal
// TODO : Add effect for new tweet

var $ = jQuery = require("./jquery-2.1.4.min.js");

const electron = require('electron');
var ipc = electron.ipcRenderer;

$(function(){
  ipc.on('tweet', (ev, msg) => {
    var tweet = JSON.parse(msg);

    // Insert an attached image
    var media = tweet.entities.media;
    if(tweet.entities.media !== undefined) {
        $('.twitter-tweet').prepend('<div id="attached_image"><img /></div>');

	console.log(tweet.entities);

        var image_url = media[0].media_url;
        var imgPreloader=new Image();
        imgPreloader.onload=function() { 
             $('#attached_image').children('img').attr({'src':image_url, 'height':256});
        }
    imgPreloader.src=image_url;
    }

    // Tweet
    $('.twitter-tweet').prepend('<p id="tw_text"></p>');
    var content = set_link(tweet);
    content = set_hashtag(content);
    $('#tw_text').prepend(content);

    // Date and Screen name
    $('.twitter-tweet').prepend('<p id="tw_user"></p>');
    var str = convert_time(tweet.created_at) + ' ' + set_username(tweet.user);
    convert_time(tweet.created_at);
    $('#tw_user').prepend(str);

    var profile_image_url = tweet.user.profile_image_url;

    // Insert a profile image
    var imgPreloader = new Image();
    $('.twitter-tweet').prepend('<div id="profile_image"><img /></div>');
    imgPreloader.onload = function() {
        $('#profile_image').children('img').attr({'src':profile_image_url, 'height':50, 'align':'left'});
    }
    imgPreloader.src = profile_image_url;
  });
});


function convert_time(str) {
	 var unixtime = Date.parse(str);
	 var date = new Date( unixtime );
	 return date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + add_zero(date.getMinutes()) + ':' + add_zero(date.getSeconds());
}

function add_zero(str) {
        if (str < 10) {
	       str = '0' + str;
	}
	return str;
}

function set_link(tweet) {
    var regexp_url = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g;
    var regexp_makeLink = function(all, url, h, href) {
        return '<a href="h' + href + '" target="_blank">' + url + '</a>';
    }
    var str = tweet.text;
    var content = str.replace(regexp_url, regexp_makeLink);
    return set_retweet(content, tweet);
}

function set_retweet(str, tweet) {
     var foo = str.match(/^RT (.*?):/);
     if(foo) {
         var user_with_at = RegExp.$1;             // @foo
	 var user = user_with_at.replace('@', ''); // foo

	 var link = "https://twitter.com/" + user + "/status/" + tweet.retweeted_status.id_str;
	 str = str.replace(user_with_at, '<a href="' + link + '" target="_blank">' + user_with_at + '</a>');
     }
     return str;
}

function set_username(user_obj) {
     var twitter_base = "https://twitter.com/";
     return '<a href="' + twitter_base + user_obj.screen_name + '" target="_blank">' + user_obj.name + '</a>' + '  @' + user_obj.screen_name;
}

function set_hashtag(str) {
	var pattern = /(#[a-zA-Z0-9‚Ÿ-‚ñƒ@-ƒ–ˆŸ-ê¤+.\-_@:/~?%&;=+#',()*!]+)/g;
	var list=str.match(pattern);

	if(!list)return str;

	for(var index in list) {
	      var tag = list[index];             // #hoge
	      var word = tag.replace('#','');    // hoge

              var base = "https://twitter.com/hashtag/";
	      var bottom = "?f=tweets&vertical=default&src=hash";
	      var link = base + word + bottom;

	      str = str.replace(tag, '<a href="' + link + '" target="_blank">' + tag + '</a>');
	}

	return str;
}
