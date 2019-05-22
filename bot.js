var tmi = require('tmi.js');
var dbutils = require('./utils/dbutils');
var utils = require('./utils/utils');
var http = require('http');
var https = require('https');
var uid = require('mongodb').ObjectID;
var overlay_client = require('socket.io/node_modules/socket.io-client');
require('dotenv').config();

var bot;
var bot_id = process.env.BOT_ID;
var bot_secret = process.env.BOT_SECRET;
var overlay_users = [];
var channels = [];
var db;
var tmi_options;
var current_polls = [];


(function() {
	var pingInterval = setInterval(function() {
		pingSite();
	},1000*60*20);
})();

function pingSite() {
		http.get({
		host: 'www.spades.cloud',
		path: '/',
	}, function(res) {
		var body = '';
		res.on('data', function(d) {
			body += d;
		});
		res.on('end', function() {
		});
	})
}
function setupBot(){
  bot.on("chat", function(channel, userstate, message, self){
    if (self) return;
    channel_cleaned = channel.slice(1);
    var user = userstate.username.toLowerCase();
    if (message.charAt(0) == '!'){
      var message_parts = message.split(' ');
      if (!overlay_users[channel_cleaned].commands[message_parts[0]]) return;
      if (overlay_users[channel_cleaned].commands[message_parts[0]].active == true){

        doCommand(message_parts[0], message, overlay_users[channel_cleaned].commands[message_parts[0]].options, channel, user)
      }
    }
  })
}
function doCommand(command,message,commandOptions, channel, user){
  var admin = false;
  var channel_cleaned = channel.slice(1);
  if (user.toLowerCase() == channel.slice(1).toLowerCase()){
    admin = true;
  }
  switch(command){
    case "!poll":
      if (!admin) return;
      var option_string = message.slice(6);
      var poll_options = option_string.split(',');
      var poll = [];
			for (var i = 0; i < poll_options.length; i++){
				poll[i] = {option: poll_options[i], votes: 0};
			}
			current_polls[channel_cleaned] = poll;
      if (overlay_users[channel_cleaned]){
				overlay_client.emit("msg", {code: overlay_users[channel_cleaned].url, msg: {command:"poll_start", options: poll_options}});
			}
      bot.say(channel, "Poll Has Started, !vote (1-"+(poll.length)+")");
      break;

    case "!endpoll":
      if (!admin) return;
      overlay_client.emit("msg", {code: overlay_users[channel_cleaned].url, msg: {command:"poll_end"}});
			var poll = current_polls[channel_cleaned]
      if (!poll) break;
			poll.id = new uid();
			dbutils.db_upsert(db,'overlay',{'user':channel_cleaned},{'polls':poll}, function(res){
				if (res.fail) {
					return null;
				}
				return;
			});
			delete current_polls[channel_cleaned];
      bot.say(channel, "Poll has Ended!");
      break;
    case "!vote":
    if (current_polls[channel_cleaned]){
      var args = message.split(' ');
      var vote = parseInt(args[1])

      if (vote < current_polls[channel_cleaned].length+1 && vote > 0){

        current_polls[channel_cleaned][vote-1].votes += 1;
        overlay_client.emit("msg", {code: overlay_users[channel_cleaned].url, msg:{command:"add_vote", value: vote}})

      }
    }
    break;
  }
}

module.exports = {
	start_bot: function(database) {
		db = database;
		db.collection('overlay').find({ 'user': {$exists: true} }).toArray(function (err,docs){
      if (err){
        console.log(err)
      }
      else{
          for (var doc in docs){
            overlay_users[docs[doc].user] = {};
            overlay_users[docs[doc].user].url = docs[doc].url;
            overlay_users[docs[doc].user].commands = docs[doc].commands;

          }
      }
      connectBot();
      //commands = [{!poll: {active: true, options: {max: 1}}, trivia: {active: false}}]

		})
    function connectBot(){


      for (var key in overlay_users){
        channels.push(""+key);
      }
			console.log(channels)
      tmi_options = {
      	options:{
      		debug: true
      	},
      	connection:{
      		reconnect: true
      	},
      	identity:{
      		username: "SPaDeSPwnzBot",
      		password: process.env.BOT_OAUTH
      	},
      	channels: channels
      };
      bot = new tmi.client(tmi_options);
      bot.connect();
      console.log("BOT ON");
      setupBot();
    }


	},
	socket_connect: function() {
		var uri = process.env.SOCKET_URI || "http://localhost:3000";
		var port = process.env.PORT || 3000;
		overlay_client = overlay_client.connect(uri +'/overlay')
		overlay_client.on('connect', function(){

		});
	},
  toggle_command: function(user, command, option){

    overlay_users[user].commands[command].active = (option == 'true');

  },
	add_new_user: function(user, url, commands){
		overlay_users[user] = {};
		overlay_users[user].url = url;
		overlay_users[user].commands = commands;
		bot.join(user)
	}
}
