var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
app.use(express.static(__dirname+'/public'));
var clientInfo = {};


// sends current user to provided socket function
function sendCurrentUser(socket){
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === 'undefined'){
		return;
	}
	Object.keys(clientInfo).forEach(function(sockedId){
		var userInfo = clientInfo[sockedId];

		if (info.room === userInfo.room){
			users.push(userInfo.name);
		}
	});
	socket.emit('message',{
		name: 'System',
		text: 'Current users: ' + users.join(', '),
		timestamp: moment().valueOf()
	});
}



io.on('connection',function(socket){
	console.log('User connected via socket.io');
	// handle disconnect
	socket.on('disconnect',function(){
		var userData = clientInfo[socket.id]
		if (typeof userData != 'undefined'){
			socket.leave(userData.room);
			io.to(userData.room).emit('message',{
				name: 'System',
				text: userData.name  + ' has left',
				timestamp: moment.valueOf()
			});
			delete clientInfo[socket.id];
		}

	});
	// für eigenen Raum Socket
	socket.on('joinRoom',function(req){
		clientInfo[socket.id]  = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + 'has join',
			timestamp: moment().valueOf()
		});

	});
	// nachrichten versenden
	
	socket.on('message', function(message){
		console.log('message recived ' + message.text);
			//socket.broadcast.emit('message', message)    SENDET an alle aAU?ER dem Absender
			if (message.text === '@currentUsers'){
				sendCurrentUser(socket);

			}else{


				message.timestamp = moment().valueOf();
			//sendet an alle User:
				//io.emit('message', message);

			// sendet ann alle user im gleichen raum
			io.to(clientInfo[socket.id].room).emit('message', message)
		}
	});

	// timestamp 

	socket.emit('message',{ 
		text:"Welcome to the chat application",
		name: 'Server',
		timestamp: moment().valueOf()
	});
});


http.listen(PORT,function(){
	console.log('Server started');
})
