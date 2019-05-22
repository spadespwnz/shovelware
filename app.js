var noBot = false;
process.argv.forEach(function (arg){
	if (arg.indexOf("=")<0){
		return;
	} else{
		toks = arg.split("=");
		if (toks.length==2){
			if (toks[0] == "bot"){
				if (toks[1] == "false"){
					noBot = true;
				}
			}
		}
	}
})



var express = require('express');
app = express();
require('dotenv').config();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var expressDirectory = require('serve-index');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoClient = require('mongodb').MongoClient
var uid = require('mongodb').ObjectID;
var url =  process.env.MONGODB_URI || 'mongodb://localhost:27017/app';
var data_base;
var jwt = require('jsonwebtoken');
var dbutils = require('./utils/dbutils');
var busboy = require('connect-busboy');
var cors = require('cors');

if (noBot == false){
	var bot = require('./bot.js');
}

MongoClient.connect(url, function(err,db){
	data_base = db;
	if (noBot == false){
		bot.start_bot(data_base);
	}
});
app.use(busboy());
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cookieParser())
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('jwt_secret', process.env.JWT_SECRET || 'randosecretkey');
app.use(cors({credentials: true, origin: true}));
if (noBot == false){
	app.set('bot', bot);
}
app.use(function(req,res,next){
    req.db = data_base;
    next();
});

var routes = require('./routes/index');

app.use('/', routes)

fs.readdirSync(__dirname+'/routes').forEach(function(file){
	if (file.substr(-3) == '.js'){
		name = file.slice(0,-3);
		if (name !== 'socket'){
			var temp = require('./routes/'+name)
			app.use('/'+name, temp)
		}
	}
});

var overlay_controller = require('./socket_controllers/overlay');
if (noBot == false){
	bot.socket_connect();
}


var overlay = io
	.of('/overlay')
	.on('connection', function(socket){

		overlay_controller.respond(overlay, socket, data_base, io);
	});

  var webServer = http.listen((process.env.PORT || 3000), function(){
    //console.log('listening on *:3000');

  });
