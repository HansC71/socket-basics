var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
app.use(express.static(__dirname+'/public'));
var clientInfo = {};
io.on('connection',function(socket){
	console.log('User connected via socket.io');

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
	//
	
	socket.on('message', function(message){
		console.log('message recived ' + message.text);
			//socket.broadcast.emit('message', message)    SENDET an alle aAU?ER dem Absender
			message.timestamp = moment().valueOf();
			//sendet an alle User:
				//io.emit('message', message);

			// sendet ann alle user im gleichen raum
			io.to(clientInfo[socket.id].room).emit('message', message)
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
