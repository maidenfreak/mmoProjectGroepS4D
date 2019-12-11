var socket = io();

socket.on('startGame', function() {
    location.assign('index');
});