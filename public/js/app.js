//queryParams
var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');

console.log(name + 'wants to join ' + room)
var socket = io();

socket.on('connect',function(){
	console.log('Connected to Server')
});

socket.on('message',function(message){
var momentTimestamp = moment.utc(message.timestamp);
var $message = jQuery('.messages');
console.log('new message');
console.log(message.text);
$message.append('<p><strong>' + message.name + '  hier  ' + momentTimestamp.local().format('H:mm') + '</strong></p>');

$message.append('<p>' + message.text +'</p>');

})

// handle submit 
var $form = jQuery('#message-form');

$form.on('submit',function(){
	event.preventDefault();
	var $message = $form.find('input[name=message]')
	socket.emit('message',{
		name: name,
		text: $message.val()
	});
	$message.val('') ;
});