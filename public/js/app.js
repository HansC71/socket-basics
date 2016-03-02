
var socket = io();

socket.on('connect',function(){
	console.log('Connected to Server')
});

socket.on('message',function(message){
var momentTimestamp = moment.utc(message.timestamp);
console.log('new message');
console.log(message.text);

jQuery('.messages').append('<p><strong>' + momentTimestamp.local().format('H:mm') + ' </strong>'+ message.text +'</p>');

})

// handle submit 
var $form = jQuery('#message-form');

$form.on('submit',function(){
	event.preventDefault();
	var $message = $form.find('input[name=message]')
	socket.emit('message',{
		text: $message.val()
	});
	$message.val('') ;
});